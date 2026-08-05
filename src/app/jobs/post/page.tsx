import { requireUserId } from "@/config/session";
import PostJobView from "@/views/jobs/PostJobView";

export const dynamic = "force-dynamic";

export default async function PostJobPage() {
  await requireUserId();
  return <PostJobView />;
}
