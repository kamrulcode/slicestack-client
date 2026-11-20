import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const getSessionServer = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
};

export default getSessionServer;
