import { notFound } from "next/navigation";

import { getSession } from "@/config/session";

import { JobController } from "@/controllers/job.controller";

import { ApplicationController } from "@/controllers/application.controller";

import JobDetailView from "@/views/jobs/JobDetailView";



export const dynamic = "force-dynamic";



export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let job = null;
  let session = null;
  try {
    [job, session] = await Promise.all([
      JobController.getById(id).catch(() => null),
      getSession().catch(() => null),
    ]);
  } catch {
    notFound();
  }

  if (!job) notFound();

  const userId = session?.user?.id;
  let hasApplied = false;
  if (userId) {
    try {
      hasApplied = !!(await ApplicationController.hasApplied(id, userId));
    } catch {
      hasApplied = false;
    }
  }

  const isOwner = userId === job.postedById;

  return <JobDetailView job={job} hasApplied={hasApplied} isOwner={isOwner} />;
}

