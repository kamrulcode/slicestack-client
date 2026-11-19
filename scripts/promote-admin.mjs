#!/usr/bin/env node
/**
 * Promote an existing account to admin.
 *
 * Admin role changes are intentionally not exposed in the UI or through an API
 * route. Run this on a trusted machine with access to the production .env:
 *
 *   npm run promote-admin -- owner@example.com
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { MongoClient } from "mongodb";

const email = process.argv[2];

if (!email || email.startsWith("--")) {
  console.error("Usage: npm run promote-admin -- <account-email>");
  process.exit(1);
}

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;

  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator < 0) continue;
    env[trimmed.slice(0, separator).trim()] = trimmed
      .slice(separator + 1)
      .trim();
  }

  return env;
}

const env = { ...loadEnv(path.join(process.cwd(), ".env")), ...process.env };

if (!env.MONGODB_URL) {
  console.error("MONGODB_URL is missing. Add it to .env first.");
  process.exit(1);
}

const client = new MongoClient(env.MONGODB_URL, {
  serverSelectionTimeoutMS: 10000,
});

try {
  await client.connect();
  const users = client.db("slicestack").collection("user");
  const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const user = await users.findOne({
    email: { $regex: `^${escaped}$`, $options: "i" },
  });

  if (!user) {
    console.error(`No account found for ${email}.`);
    process.exitCode = 1;
  } else if (user.role === "admin") {
    console.log(`${user.email} is already an admin.`);
  } else {
    await users.updateOne(
      { _id: user._id },
      { $set: { role: "admin", updatedAt: new Date() } },
    );
    console.log(
      `Promoted ${user.email} from "${user.role ?? "customer"}" to "admin".`,
    );
  }
} catch (error) {
  console.error("Promotion failed:", error.message);
  process.exitCode = 1;
} finally {
  await client.close().catch(() => {});
}
