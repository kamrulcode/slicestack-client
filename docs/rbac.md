# Roles, signup and vendor activation

This document describes the RBAC and vendor system in `slicestack-client`. It
reuses the existing Better Auth + MongoDB setup and the `user`,
`vendorApplications` and `shops` collections.

## Roles

| Role       | How it is assigned                                                       | Access                                |
| ---------- | ------------------------------------------------------------------------ | ------------------------------------- |
| `customer` | Automatically by Better Auth (`defaultValue: "customer"`)                | Storefront, customer dashboard        |
| `vendor`   | Server-side activation action after a vendor signup, inside a transaction | Vendor workspace while the shop is active |
| `admin`    | Only by the trusted `npm run promote-admin` script                       | Admin dashboard + vendor management   |

`role` is a Better Auth additional field with `input: false`. Better Auth
ignores any `role` sent by the browser during signup or profile updates, and no
UI or server action accepts a role from the client.

## Signup flows

`/sign-up` has a single form with two modes:

- **Customer (default)** — name, email, password, optional profile image. Better
  Auth creates the account with the default `customer` role and redirects to
  `/dashboard`.
- **Vendor** — the same account fields plus restaurant/shop name, phone,
  address, description and an optional logo. Switching modes happens in the
  browser without a reload.

Vendor signup is intentionally a two-step server flow:

1. The browser calls `authClient.signUp.email()`. The account is created with
   the default `customer` role and the browser receives a session cookie.
   Nothing role-related is sent from the browser.
2. The browser calls the `activateVendorAccountAction` server action. It reads
   the user id from the verified session, re-validates the shop fields, and runs
   one MongoDB transaction that:
   - creates or updates the vendor profile (`vendorApplications`, `APPROVED`),
   - upserts the storefront (`shops`, `active`),
   - sets the user's `role` to `vendor`.

If step 2 fails after the account exists, the form keeps the account and shows a
**Retry shop setup** button. The retry only repeats activation; it never creates
a second account. Existing customers can use the same action from
`/register-as-a-vendor`.

### Why two steps?

Better Auth must create the account and session before the server can know the
new user id. The role is therefore raised immediately after signup by a
server-only action, never by the browser. The intermediate customer role grants
no vendor or admin privileges, and the final role + shop write is atomic.

## Data model

### `user`

Better Auth's collection. `role` is `"customer" | "vendor" | "admin"`. Server
code reads it from the database, never from a cookie payload.

### `vendorApplications`

```ts
{
  _id: ObjectId,
  userId: string,            // Better Auth user id (24-char string)
  shopName: string,
  ownerName: string,         // resolved from the account name on the server
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

Indexes: unique `userId` (one profile per user), `{ status, createdAt }`.
New vendor signups are written directly as `APPROVED`; the other statuses are
kept so admins can suspend/reactivate and so legacy applications still render.

### `shops`

The storefront record. Created/activated during vendor activation. Unique
`ownerId` keeps one shop per vendor. Status is `active` or `suspended`.

The application profile and the shop intentionally serve different purposes
(account/audit data vs. the public storefront), and both share the same owner.
User identity data (name, email, password) lives only in Better Auth's `user`
collection; shop fields are not duplicated into the auth model.

## Security boundaries

- `src/lib/authorization.ts` reads the Better Auth session on the server:
  - `requireAuth()` — any signed-in user.
  - `requireRole([...])` — role check, redirects to the caller's own dashboard
    when the role does not match.
  - `requireVendorWorkspace()` — vendor role **plus** an `APPROVED` profile
    **plus** an `active` shop. Suspended vendors land on `/dashboard/vendor`,
    where the restriction is explained.
- The signup form never sends a role. The activation action derives the user id
  from the session and hard-codes the role to `vendor`.
- Admins cannot be converted into vendors by activation.
- Activation refuses to reactivate a `SUSPENDED` profile or `suspended` shop;
  only the admin review action can lift a suspension.
- Every admin mutation (`reviewVendorApplicationAction`) re-checks
  `requireRole(["admin"])`; a customer or vendor cannot execute it.
- Vendor sub-pages use `requireVendorWorkspace()`, and every query is scoped to
  the session user's own shop.

## Admin vendor management

`/dashboard/admin/vendors` (and the `/admin/vendors` redirect) lists vendor
profiles. Because new vendors are already approved:

- **Suspend** an approved vendor: the profile and shop become `SUSPENDED` /
  `suspended`; vendor tools lock immediately.
- **Reactivate** a suspended vendor: the vendor role and active shop are
  restored in one transaction.
- Legacy `PENDING` / `REJECTED` rows can still be approved or rejected.

No approval is required for a new vendor registration.

## Login redirects

`/dashboard` is a server-side dispatcher:

- `admin` → `/dashboard/admin`
- `vendor` → `/dashboard/vendor`
- `customer` → `/dashboard/customer`

The sign-in form sends users to `/dashboard` (or a safe `?next=` path), and the
dispatcher reads the current role from the database. Because Better Auth's
cookie cache is disabled, a role change applies on the next request; no forced
logout is required.

## How to test

Create accounts and verify:

1. **Customer signup**
   - `/sign-up` opens on the Customer tab.
   - Create an account → land on `/dashboard/customer`; `user.role` is
     `customer`; no shop document exists.
2. **Vendor signup**
   - Switch to the Vendor tab (no reload) and complete the shop fields.
   - The user is created, the profile is `APPROVED`, the shop is `active`, and
     the user's role is `vendor`.
   - The vendor dashboard and sub-pages work immediately.
3. **Role tampering**
   - Send a signup request with `role: "admin"` or `role: "vendor"` in the body —
     Better Auth ignores it.
   - Call the activation action from a customer session — it succeeds only as a
     normal vendor activation; it can never set `admin`.
   - Call `reviewVendorApplicationAction` from a non-admin session — rejected by
     `requireRole`.
4. **Suspension**
   - Suspend the vendor as admin.
   - Vendor sub-pages redirect to `/dashboard/vendor` and show the suspension
     notice; activation refuses to lift it.
5. **Recovery**
   - Temporarily make activation fail after signup (for example invalid shop
     data on the server); the form shows **Retry shop setup**, and retrying
     finishes activation without creating a duplicate account.

## Manual verification commands

```bash
npx tsc --noEmit
npm run lint
npm run build
```

## Cleanup after manual testing

Delete test accounts from the `user`, `session` and `account` collections along
with their `vendorApplications` and `shops` documents. Do not leave test users
with the `admin` role in production.
