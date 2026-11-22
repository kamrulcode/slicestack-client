import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import nodemailer from "nodemailer";
import { db, mongoClient } from "@/lib/mongodb";

const emailTransport =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

async function sendAccountEmail(to: string, subject: string, url: string) {
  if (!emailTransport) {
    throw new Error(
      "Email verification is unavailable because SMTP is not configured.",
    );
  }

  await emailTransport.sendMail({
    from: process.env.MAIL_FROM || "SliceStack <no-reply@slicestack.app>",
    to,
    subject,
    text: `Use this link to continue: ${url}`,
  });
}

export const auth = betterAuth({
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await sendAccountEmail(
          user.email,
          "Confirm your SliceStack email change",
          `${url}\n\nNew email: ${newEmail}`,
        );
      },
    },
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
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendAccountEmail(
        user.email,
        "Verify your SliceStack email address",
        url,
      );
    },
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
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },
});
