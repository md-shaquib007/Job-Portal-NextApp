import { notFound, redirect } from "next/navigation";
import { requireUserId } from "@/config/session";
import { JobController } from "@/controllers/job.controller";
import EditJobView from "@/views/jobs/EditJobView";

export const dynamic = "force-dynamic";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUserId(`/jobs/${id}/edit`);
  const job = await JobController.getById(id);

  if (!job) notFound();
  if (job.postedById !== userId) redirect(`/jobs/${id}`);

  return <EditJobView job={job} />;
}
