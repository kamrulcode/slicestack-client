import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth uses the MongoDB Node.js driver and must run in the Node runtime.
export const runtime = "nodejs";

export const { POST, GET } = toNextJsHandler(auth);
