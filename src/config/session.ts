import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/config/auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireSession(callbackUrl = "/") {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session;
}

export async function requireUserId(callbackUrl = "/") {
  const session = await requireSession(callbackUrl);
  return session.user.id;
}
