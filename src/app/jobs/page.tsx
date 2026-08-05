import { JobController } from "@/controllers/job.controller";

import JobListView from "@/views/jobs/JobListView";



export default async function JobsPage({

  searchParams,

}: {

  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;

}) {

  const params = await searchParams;

  const q = params.q as string | undefined;

  const type = params.type as string | undefined;

  const location = params.location as string | undefined;

  const parsedPage = params.page ? Number.parseInt(params.page as string, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;



  const result = await JobController.search({ q, type, location, page });



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

