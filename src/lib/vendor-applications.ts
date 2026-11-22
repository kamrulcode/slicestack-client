import { ObjectId } from "mongodb";
import { db, mongoClient, objectIdFromString } from "@/lib/mongodb";
import type {
  Shop,
  VendorApplication,
  VendorApplicationStatus,
} from "@/types/vendor";

const APPLICATIONS_COLLECTION = "vendorApplications";
const SHOPS_COLLECTION = "shops";
const USERS_COLLECTION = "user";

type VendorApplicationDoc = {
  _id: ObjectId;
  userId: string;
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
  description: string;
  logoUrl: string | null;
  status: VendorApplicationStatus;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type ShopDoc = {
  _id: ObjectId;
  ownerId: string;
  applicationId: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  logoUrl: string | null;
  status: "active" | "suspended";
  createdAt: Date;
  updatedAt: Date;
};

export type VendorApplicationInput = {
  userId: string;
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
  description: string;
  logoUrl?: string | null;
};

export type ReviewAction = "approve" | "reject" | "suspend";

export class VendorApplicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "VendorApplicationError";
  }
}

const applications = () =>
  db.collection<VendorApplicationDoc>(APPLICATIONS_COLLECTION);
const shops = () => db.collection<ShopDoc>(SHOPS_COLLECTION);

let indexesPromise: Promise<void> | undefined;

function ensureIndexes() {
  indexesPromise ??= Promise.all([
    // One application document per user. Rejected applications are edited and
    // resubmitted instead of creating duplicates.
    applications().createIndex({ userId: 1 }, { unique: true }),
    applications().createIndex({ status: 1, createdAt: -1 }),
    shops().createIndex({ ownerId: 1 }, { unique: true }),
  ])
    .then(() => undefined)
    .catch((error) => {
      indexesPromise = undefined;
      throw error;
    });

  return indexesPromise;
}

function toVendorApplication(doc: VendorApplicationDoc): VendorApplication {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    shopName: doc.shopName,
    ownerName: doc.ownerName,
    phone: doc.phone,
    address: doc.address,
    description: doc.description,
    logoUrl: doc.logoUrl ?? null,
    status: doc.status,
    rejectionReason: doc.rejectionReason ?? null,
    reviewedBy: doc.reviewedBy ?? null,
    reviewedAt: doc.reviewedAt?.toISOString() ?? null,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function toShop(doc: ShopDoc): Shop {
  return {
    id: doc._id.toString(),
    ownerId: doc.ownerId,
    applicationId: doc.applicationId,
    name: doc.name,
    description: doc.description,
    address: doc.address,
    phone: doc.phone,
    logoUrl: doc.logoUrl ?? null,
    status: doc.status,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function getVendorApplicationForUser(userId: string) {
  await ensureIndexes();
  const doc = await applications().findOne({ userId });
  return doc ? toVendorApplication(doc) : null;
}

export async function listVendorApplications(status?: VendorApplicationStatus) {
  await ensureIndexes();
  const docs = await applications()
    .find(status ? { status } : {})
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();
  return docs.map(toVendorApplication);
}

/**
 * Direct vendor activation used by the self-service vendor signup flow.
 *
 * There is no admin review step anymore, but the security boundary is the same:
 * the caller passes the verified session user id, never a role. Inside one
 * transaction we:
 *   1. create/update the vendor profile (`vendorApplications`, auto-APPROVED),
 *   2. upsert the storefront (`shops`, active),
 *   3. set the user role to `vendor`.
 *
 * Suspended applications/shops are never silently reactivated — only an admin
 * can lift a suspension.
 */
export async function activateVendorAccount(
  input: VendorApplicationInput,
): Promise<void> {
  await ensureIndexes();

  const session = mongoClient.startSession();

  try {
    await session.withTransaction(async () => {
      const userObjectId = objectIdFromString(input.userId);
      if (!userObjectId) {
        throw new VendorApplicationError("Account is invalid.");
      }

      const account = await db
        .collection(USERS_COLLECTION)
        .findOne({ _id: userObjectId }, { session });

      if (!account) {
        throw new VendorApplicationError("Account no longer exists.");
      }

      if ((account as { role?: unknown }).role === "admin") {
        throw new VendorApplicationError(
          "Admin accounts cannot be converted into vendors.",
        );
      }

      const [existingApplication, existingShop] = await Promise.all([
        applications().findOne({ userId: input.userId }, { session }),
        shops().findOne({ ownerId: input.userId }, { session }),
      ]);

      if (
        existingApplication?.status === "SUSPENDED" ||
        existingShop?.status === "suspended"
      ) {
        throw new VendorApplicationError(
          "This vendor account is suspended. Contact the SliceStack team for help.",
        );
      }

      const now = new Date();
      const profile = {
        shopName: input.shopName,
        ownerName: input.ownerName,
        phone: input.phone,
        address: input.address,
        description: input.description,
        logoUrl: input.logoUrl ?? null,
      };

      const application = await applications().findOneAndUpdate(
        { userId: input.userId },
        {
          $set: {
            ...profile,
            status: "APPROVED",
            rejectionReason: null,
            reviewedBy: null,
            reviewedAt: null,
            updatedAt: now,
          },
          $setOnInsert: {
            userId: input.userId,
            createdAt: now,
          },
        },
        { upsert: true, returnDocument: "after", session },
      );

      if (!application) {
        throw new VendorApplicationError(
          "The vendor profile could not be created.",
        );
      }

      await shops().updateOne(
        { ownerId: input.userId },
        {
          $set: {
            applicationId: application._id.toString(),
            name: input.shopName,
            description: input.description,
            address: input.address,
            phone: input.phone,
            logoUrl: input.logoUrl ?? null,
            status: "active",
            updatedAt: now,
          },
          $setOnInsert: {
            ownerId: input.userId,
            createdAt: now,
          },
        },
        { upsert: true, session },
      );

      // Server-only role assignment. Better Auth keeps `role` as `input: false`,
      // so no client payload can reach this value.
      await db
        .collection(USERS_COLLECTION)
        .updateOne(
          { _id: userObjectId },
          { $set: { role: "vendor", updatedAt: now } },
          { session },
        );
    });
  } finally {
    await session.endSession();
  }
}

export async function getShopForOwner(ownerId: string) {
  await ensureIndexes();
  const doc = await shops().findOne({ ownerId });
  return doc ? toShop(doc) : null;
}

/**
 * Approve / reject / suspend an application. Approval assigns the vendor role
 * and activates the shop inside one MongoDB transaction.
 */
export async function reviewVendorApplication({
  applicationId,
  adminId,
  action,
  reason,
}: {
  applicationId: string;
  adminId: string;
  action: ReviewAction;
  reason?: string | null;
}) {
  await ensureIndexes();

  const id = objectIdFromString(applicationId);
  if (!id) throw new VendorApplicationError("Invalid application id.");

  const allowedFrom: Record<ReviewAction, VendorApplicationStatus[]> = {
    approve: ["PENDING", "REJECTED", "SUSPENDED"],
    reject: ["PENDING"],
    suspend: ["APPROVED"],
  };
  const nextStatus: Record<ReviewAction, VendorApplicationStatus> = {
    approve: "APPROVED",
    reject: "REJECTED",
    suspend: "SUSPENDED",
  };

  const session = mongoClient.startSession();

  try {
    await session.withTransaction(async () => {
      const application = await applications().findOne(
        { _id: id },
        { session },
      );

      if (!application) {
        throw new VendorApplicationError("Application not found.");
      }
      if (application.userId === adminId) {
        throw new VendorApplicationError(
          "You cannot review your own vendor application.",
        );
      }
      if (!allowedFrom[action].includes(application.status)) {
        throw new VendorApplicationError(
          `This application cannot be ${action}d from its current status.`,
        );
      }

      const now = new Date();

      await applications().updateOne(
        { _id: id },
        {
          $set: {
            status: nextStatus[action],
            rejectionReason:
              action === "reject" ? reason?.trim() || null : null,
            reviewedBy: adminId,
            reviewedAt: now,
            updatedAt: now,
          },
        },
        { session },
      );

      if (action === "approve") {
        const userObjectId = objectIdFromString(application.userId);
        if (!userObjectId) {
          throw new VendorApplicationError("Applicant account is invalid.");
        }

        const applicant = await db
          .collection(USERS_COLLECTION)
          .findOne({ _id: userObjectId }, { session });

        if (!applicant) {
          throw new VendorApplicationError(
            "Applicant account no longer exists.",
          );
        }

        if ((applicant as { role?: unknown }).role === "admin") {
          throw new VendorApplicationError(
            "Admin accounts cannot be converted into vendors.",
          );
        }

        // Trusted, server-only role assignment. `role` is `input: false` in
        // Better Auth, so it cannot be set from the browser.
        await db
          .collection(USERS_COLLECTION)
          .updateOne(
            { _id: userObjectId },
            { $set: { role: "vendor", updatedAt: now } },
            { session },
          );

        await shops().updateOne(
          { ownerId: application.userId },
          {
            $set: {
              applicationId: id.toString(),
              name: application.shopName,
              description: application.description,
              address: application.address,
              phone: application.phone,
              logoUrl: application.logoUrl ?? null,
              status: "active",
              updatedAt: now,
            },
            $setOnInsert: {
              ownerId: application.userId,
              createdAt: now,
            },
          },
          { upsert: true, session },
        );
      }

      if (action === "suspend") {
        await shops().updateOne(
          { ownerId: application.userId },
          { $set: { status: "suspended", updatedAt: now } },
          { session },
        );
      }
    });
  } finally {
    await session.endSession();
  }
}
