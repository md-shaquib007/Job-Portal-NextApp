import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import ApplicantStatusActions from "@/views/dashboard/ApplicantStatusActions";

type Applicant = {
  id: string;
  status: string;
  appliedAt: Date;
  user: { id: string; name: string | null; email: string | null };
};

type PostedJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedAt: Date;
  _count: { applications: number };
  applications: Applicant[];
};

type Application = {
  id: string;
  status: string;
  appliedAt: Date;
  job: { id: string; title: string; company: string; location: string; type: string };
};

function statusStyles(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "pending") return "bg-yellow-100 text-yellow-800";
  if (normalized === "accepted") return "bg-green-100 text-green-800";
  return "bg-red-100 text-red-800";
}

export default function DashboardView({
  applications,
  postedJobs,
}: {
  applications: Application[];
  postedJobs: PostedJob[];
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Posted Jobs & Applicants</h2>
              <Link href="/jobs/post" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                Post New Job
              </Link>
            </div>
            <div className="space-y-4">
              {postedJobs.length === 0 ? (
                <p className="p-6 bg-white rounded-lg text-gray-500 text-center">You haven&apos;t posted any jobs yet.</p>
              ) : (
                postedJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {job.location} • {job.type} • {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                        </p>
                      </div>
                      <span className="text-sm font-medium bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full">
                        {job._count.applications} applicants
                      </span>
                    </div>

                    {job.applications.length === 0 ? (
                      <p className="text-sm text-gray-500">No applications yet.</p>
                    ) : (
                      <ul className="divide-y divide-gray-100 border rounded-md">
                        {job.applications.map((app) => (
                          <li key={app.id} className="flex justify-between items-center px-4 py-3 gap-4">
                            <div>
                              <p className="font-medium text-gray-900">{app.user.name ?? "Unknown"}</p>
                              <p className="text-sm text-gray-500">{app.user.email}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                              </p>
                            </div>
                            <ApplicantStatusActions applicationId={app.id} currentStatus={app.status} />
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 flex gap-4 text-sm">
                      <Link href={`/jobs/${job.id}`} className="text-indigo-600 hover:text-indigo-800">View job</Link>
                      <Link href={`/jobs/${job.id}/edit`} className="text-indigo-600 hover:text-indigo-800">Edit job</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">My Applications</h2>
            <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
              {applications.length === 0 ? (
                <p className="p-6 text-gray-500 text-center">You haven&apos;t applied to any jobs yet.</p>
              ) : (
                applications.map((application) => (
                  <div key={application.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{application.job.title}</h3>
                        <p className="text-gray-600">{application.job.company}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                        </p>
                      </div>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-sm font-medium ${statusStyles(application.status)}`}>
                        {application.status}
                      </span>
                    </div>
                    <div className="mt-4 text-right">
                      <Link href={`/jobs/${application.job.id}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        View job
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
