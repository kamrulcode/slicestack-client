import { ObjectId } from "mongodb";
import { db, objectIdFromString } from "@/lib/mongodb";
import { normalizeRole, type Role } from "@/types/auth";

type UserDoc = {
  _id: ObjectId;
  name: string;
  email: string;
  image?: string | null;
  role?: string;
  createdAt?: Date;
};

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  createdAt: Date | null;
};

export type RoleCounts = {
  total: number;
  customers: number;
  vendors: number;
  admins: number;
};

const users = () => db.collection<UserDoc>("user");

export async function getRoleCounts(): Promise<RoleCounts> {
  const [total, vendors, admins] = await Promise.all([
    users().countDocuments({}),
    users().countDocuments({ role: "vendor" }),
    users().countDocuments({ role: "admin" }),
  ]);

  return {
    total,
    vendors,
    admins,
    customers: Math.max(0, total - vendors - admins),
  };
}

export async function listUsers(limit = 200): Promise<PlatformUser[]> {
  const docs = await users()
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    image: doc.image ?? null,
    role: normalizeRole(doc.role),
    createdAt: doc.createdAt ?? null,
  }));
}

/** Used by the admin applications page to show applicant contact details. */
export async function getUsersByIds(userIds: string[]) {
  const ids = userIds
    .map(objectIdFromString)
    .filter((value): value is ObjectId => value !== null);

  if (ids.length === 0) return new Map<string, PlatformUser>();

  const docs = await users().find({ _id: { $in: ids } }).toArray();

  return new Map(
    docs.map((doc) => [
      doc._id.toString(),
      {
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        image: doc.image ?? null,
        role: normalizeRole(doc.role),
        createdAt: doc.createdAt ?? null,
      } satisfies PlatformUser,
    ]),
  );
}
