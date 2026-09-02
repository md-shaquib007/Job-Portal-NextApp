import { notFound, redirect } from "next/navigation";
import { requireUserId } from "@/config/session";
import { JobController } from "@/controllers/job.controller";
import EditJobView from "@/views/jobs/EditJobView";

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let userId = "";
  try {
    userId = await requireUserId(`/jobs/${id}/edit`);
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(`/jobs/${id}/edit`)}`);
  }

  let job = null;
  try {
    job = await JobController.getById(id);
  } catch {
    notFound();
  }

  if (!job) notFound();
  if (job.postedById !== userId) redirect(`/jobs/${id}`);

  return <EditJobView job={job} />;
}
