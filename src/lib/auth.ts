import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { db, mongoClient } from "@/lib/mongodb";

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        // Clients can never send a role during signup or profile updates.
        input: false,
      },
      blocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        // Only the Express admin API may block an account.
        input: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client: mongoClient,
  }),
  // The Express API verifies these JWTs through /api/auth/jwks. The token's
  // `sub` is the Better Auth user id.
  plugins: [jwt()],
});
