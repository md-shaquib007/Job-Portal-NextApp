import Link from "next/link";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary: string | null;
  postedBy: { name: string | null };
};

type Filters = {
  q?: string;
  type?: string;
  location?: string;
};

export default function JobListView({
  jobs,
  total,
  page,
  totalPages,
  filters,
  error,
}: {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
  filters: Filters;
  error?: string;
}) {
  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.type) params.set("type", filters.type);
    if (filters.location) params.set("location", filters.location);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/jobs?${qs}` : "/jobs";
  };

  return (
    <div className="space-y-8 bg-white min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Jobs</h1>
        <form className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Search jobs..."
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
          <select
            name="type"
            defaultValue={filters.type ?? ""}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
          <input
            type="text"
            name="location"
            defaultValue={filters.location ?? ""}
            placeholder="Location"
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
          />
          <button type="submit" className="md:col-span-3 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Search
          </button>
        </form>
      </div>

      {error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-amber-900">Unable to load jobs</h2>
          <p className="mt-2 text-amber-800">{error}</p>
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No jobs found. Try different filters or post a job.</p>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h2>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-4">{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                </div>
                {job.salary && <span className="text-lg font-semibold text-gray-900">{job.salary}</span>}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Posted by {job.postedBy.name}</span>
                <Link href={`/jobs/${job.id}`} className="text-indigo-600 hover:text-indigo-800">View details</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pb-8">
          <p className="text-sm text-gray-500">
            Showing page {page} of {totalPages} ({total} jobs)
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={buildPageUrl(page - 1)} className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50">
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link href={buildPageUrl(page + 1)} className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
