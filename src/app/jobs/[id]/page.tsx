import { notFound } from "next/navigation";
import { getSession } from "@/config/session";
import { JobController } from "@/controllers/job.controller";
import { ApplicationController } from "@/controllers/application.controller";
import JobDetailView from "@/views/jobs/JobDetailView";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await JobController.getById(id).catch(() => null);

  if (!job) {
    return { title: "Job Not Found" };
  }

  return {
    title: `${job.title} at ${job.company}`,
    description: `${job.company} is hiring a ${job.title} in ${job.location} (${job.type}). ${job.description.slice(0, 140)}...`,
    openGraph: {
      title: `${job.title} — ${job.company}`,
      description: `${job.location} • ${job.type} • ${job.salary || "Competitive Salary"}`,
    },
  };
}



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

