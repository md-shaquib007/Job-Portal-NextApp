import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/config/auth";

export async function getSession() {
  return getServerSession(authOptions);
}

export async function requireSession() {
  const session = await getSession();
  if (!session?.user?.id) redirect("/auth/signin");
  return session;
}

export async function requireUserId() {
  const session = await requireSession();
  return session.user.id;
}
