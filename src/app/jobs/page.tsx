import { JobController } from "@/controllers/job.controller";
import JobListView from "@/views/jobs/JobListView";

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const type = typeof params.type === "string" ? params.type : undefined;
  const location = typeof params.location === "string" ? params.location : undefined;
  const parsedPage = typeof params.page === "string"
    ? Number.parseInt(params.page, 10)
    : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  let result: Awaited<ReturnType<typeof JobController.search>> | null = null;
  try {
    result = await JobController.search({ q, type, location, page });
  } catch {
    // Render a recoverable state below when the database is unavailable.
  }

  if (!result) {
    return (
      <JobListView
        jobs={[]}
        total={0}
        page={1}
        totalPages={1}
        filters={{ q, type, location }}
        error="Jobs are temporarily unavailable. Please check the database connection and try again."
      />
    );
  }

  return (
    <JobListView
      jobs={result.jobs}
      total={result.total}
      page={result.page}
      totalPages={result.totalPages}
      filters={{ q, type, location }}
    />
  );
}
