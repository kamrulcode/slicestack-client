# Roles, vendor onboarding and dashboard access

This document describes the RBAC/vendor system added to `slicestack-client`. It
reuses the existing Better Auth + MongoDB setup and adds only two collections:
`vendorApplications` and `shops`.

## Roles

| Role       | How it is assigned                                             | Access                                   |
| ---------- | -------------------------------------------------------------- | ---------------------------------------- |
| `customer` | Automatically by Better Auth (`defaultValue: "customer"`)      | Storefront, customer dashboard           |
| `vendor`   | Only by an admin approval transaction inside the data layer     | Vendor workspace after shop is active    |
| `admin`    | Only by the trusted `npm run promote-admin` script              | Admin dashboard + vendor review          |

`role` is a Better Auth additional field with `input: false`, so Better Auth
ignores any role sent by the browser during signup or profile updates.

## Data model

### `vendorApplications`

```ts
{
  _id: ObjectId,
  userId: string,            // Better Auth user id (24-char string)
  shopName: string,
  ownerName: string,
  phone: string,
  address: string,
  description: string,
  logoUrl: string | null,
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED",
  rejectionReason: string | null,
  reviewedBy: string | null,
  reviewedAt: Date | null,
  createdAt: Date,
  updatedAt: Date,
}
```

Indexes: unique `userId` (one application per user), `{ status, createdAt }`.
Rejected applications are edited and resubmitted in place — no duplicates.

### `shops`

Created/activated inside the approval transaction. Unique `ownerId` keeps one
shop per vendor. Status is `active` or `suspended`.

The user's `role` and the application `status` stay independent: an application
can be `PENDING` while the user is still a `customer`.

## Security boundaries

- `src/lib/authorization.ts` reads the Better Auth session on the server:
  - `requireAuth()` — any signed-in user.
  - `requireRole(["admin" | "vendor" | "customer"])` — role check, redirects to
    the caller's own dashboard when the role does not match.
  - `requireVendorWorkspace()` — vendor role **plus** an `APPROVED` application
    **plus** an `active` shop. Suspended vendors are sent to `/dashboard/vendor`
    where the restriction is explained.
- Every protected page calls one of these helpers. The dashboard layout also
  requires a session, but it is not the authorization boundary.
- Server actions re-check authorization:
  - `submitVendorApplicationAction` derives the user id from the session and
    never accepts a role.
  - `reviewVendorApplicationAction` calls `requireRole(["admin"])` again.
- Approval is one MongoDB transaction: set application `APPROVED`, set user role
  `vendor`, upsert `shops` with `status: "active"`.
- Suspension sets the shop to `suspended` but keeps the vendor role so the vendor
  can see the explanatory notice.
- Vendor sub-pages are all guarded with `requireVendorWorkspace()`, so a vendor
  can only reach their own shop data (shop lookup is by session user id).

## Workflow

1. Customer signs up → role `customer`.
2. Customer visits `/register-as-a-vendor`, fills the form (logo is uploaded to
   imgbb from the browser; only the URL is stored).
3. Server action validates fields, checks for an existing application, stores
   `PENDING`, and leaves the role untouched.
4. Customer dashboard shows the pending message and application status.
5. Admin opens `/dashboard/admin/vendors` (or `/admin/vendors`, which redirects),
   filters by status, and approves/rejects/suspends.
6. Approval grants vendor access; sign-in now routes the user to
   `/dashboard/vendor`. A rejected customer can edit and resubmit.
7. Admin bootstrap: `npm run promote-admin -- you@example.com`.

## Login redirects

`/dashboard` is a server-side dispatcher:

- `admin` → `/dashboard/admin`
- `vendor` → `/dashboard/vendor`
- `customer` → `/dashboard/customer` (including pending applicants)

The sign-in form sends users to `/dashboard` (or a safe `?next=` path), and the
dispatcher reads the current role from the database. Because Better Auth's cookie
cache is disabled, a role change applies on the next request; no forced logout is
required.

## How to test permissions

Create three accounts (or promote an existing one) and verify:

1. **Customer**
   - `/dashboard/customer` renders; `/dashboard/vendor` and `/dashboard/admin`
     redirect back to the customer dashboard.
   - Submitting the vendor form creates a `PENDING` application; the account
     stays `customer`.
   - Visiting `/dashboard/admin/vendors` redirects away.
2. **Vendor**
   - Approve the application as admin. The user record role becomes `vendor` and
     a `shops` document is created in the same transaction.
   - `/dashboard/vendor` shows the shop overview; vendor sub-pages work.
   - `/dashboard/admin` redirects back to the vendor dashboard.
   - Suspend the vendor: vendor sub-pages redirect to `/dashboard/vendor` and show
     the suspension notice.
3. **Admin**
   - `/dashboard/admin` and `/dashboard/admin/vendors` work.
   - Approving a second account works; rejecting requires no reason and shows the
     reason to the applicant when provided.
   - `/admin/vendors` redirects into the dashboard review page.
4. **Bypass attempts**
   - Send a signup request with `role: "admin"` in the body — Better Auth ignores
     it (`input: false`).
   - Call `reviewVendorApplicationAction` from a customer session — it redirects
     or refuses via `requireRole`.
   - A vendor opening another vendor's route only ever queries by their own
     session id.

## Manual verification commands

```bash
npx tsc --noEmit
npm run lint
npm run dev
```

## Cleanup after manual testing

Delete test accounts from the `user`, `session`, `account` collections along with
their `vendorApplications` and `shops` documents. Do not leave test users with the
`admin` role in production.
