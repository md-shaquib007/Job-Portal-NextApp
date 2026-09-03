"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import ApplicantStatusActions from "@/views/dashboard/ApplicantStatusActions";

type Applicant = {
  id: string;
  status: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
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
  if (normalized === "pending") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (normalized === "accepted") return "bg-emerald-100 text-emerald-800 border-emerald-200";
  return "bg-red-100 text-red-800 border-red-200";
}

export default function DashboardView({
  applications: initialApplications,
  postedJobs,
  userRole = "JOB_SEEKER",
}: {
  applications: Application[];
  postedJobs: PostedJob[];
  userRole?: string;
}) {
  const [applications, setApplications] = useState(initialApplications);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const handleWithdraw = async (applicationId: string) => {
    if (!confirm("Are you sure you want to withdraw this application?")) return;
    setWithdrawingId(applicationId);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== applicationId));
      }
    } catch {
      alert("Failed to withdraw application.");
    } finally {
      setWithdrawingId(null);
    }
  };

  const isEmployer = userRole === "EMPLOYER" || userRole === "ADMIN";

  // Employer Stats
  const totalPosted = postedJobs.length;
  const totalApplicantsReceived = postedJobs.reduce(
    (sum, j) => sum + j._count.applications,
    0,
  );
  const pendingApplicants = postedJobs.reduce(
    (sum, j) =>
      sum + j.applications.filter((a) => a.status === "Pending").length,
    0,
  );
  const acceptedHires = postedJobs.reduce(
    (sum, j) =>
      sum + j.applications.filter((a) => a.status === "Accepted").length,
    0,
  );

  // Job Seeker Stats
  const totalSubmitted = applications.length;
  const pendingReview = applications.filter((a) => a.status === "Pending").length;
  const acceptedApps = applications.filter((a) => a.status === "Accepted").length;
  const rejectedApps = applications.filter((a) => a.status === "Rejected").length;

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back! Overview of your {isEmployer ? "recruiting activity" : "job applications"}.
            </p>
          </div>
          {isEmployer && (
            <Link
              href="/jobs/post"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
            >
              + Post New Job
            </Link>
          )}
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isEmployer ? (
            <>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Posted Openings</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalPosted}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Candidates</p>
                <p className="text-2xl font-bold text-indigo-600 mt-2">{totalApplicantsReceived}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Review</p>
                <p className="text-2xl font-bold text-amber-600 mt-2">{pendingApplicants}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Accepted Hires</p>
                <p className="text-2xl font-bold text-emerald-600 mt-2">{acceptedHires}</p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Applied Jobs</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{totalSubmitted}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Under Review</p>
                <p className="text-2xl font-bold text-amber-600 mt-2">{pendingReview}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Accepted / Invites</p>
                <p className="text-2xl font-bold text-emerald-600 mt-2">{acceptedApps}</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Not Selected</p>
                <p className="text-2xl font-bold text-red-500 mt-2">{rejectedApps}</p>
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Posted Jobs Panel */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">My Posted Jobs</h2>
              {isEmployer && (
                <Link href="/jobs/post" className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm">
                  + New Opening
                </Link>
              )}
            </div>
            <div className="space-y-4">
              {postedJobs.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-gray-500 font-medium">You haven&apos;t posted any job openings yet.</p>
                  <Link href="/jobs/post" className="mt-3 inline-block text-indigo-600 font-semibold text-sm hover:underline">
                    Create your first job listing &rarr;
                  </Link>
                </div>
              ) : (
                postedJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600 font-medium">{job.company}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {job.location} • {job.type} • {formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}
                        </p>
                      </div>
                      <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                        {job._count.applications} candidate{job._count.applications === 1 ? "" : "s"}
                      </span>
                    </div>

                    {job.applications.length === 0 ? (
                      <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg">No candidate applications received yet.</p>
                    ) : (
                      <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
                        {job.applications.map((app) => (
                          <li key={app.id} className="p-4 bg-white hover:bg-gray-50/50 transition-colors">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{app.user.name ?? "Anonymous Applicant"}</p>
                                <p className="text-xs text-gray-500">{app.user.email}</p>
                                {app.coverLetter && (
                                  <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded border border-gray-200 italic line-clamp-2">
                                    &quot;{app.coverLetter}&quot;
                                  </p>
                                )}
                                {app.resumeUrl && (
                                  <a
                                    href={app.resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block mt-2 text-xs text-indigo-600 hover:underline font-medium"
                                  >
                                    View Resume Link &rarr;
                                  </a>
                                )}
                                <p className="text-[11px] text-gray-400 mt-1">
                                  Applied {formatDistanceToNow(new Date(app.appliedAt), { addSuffix: true })}
                                </p>
                              </div>
                              <ApplicantStatusActions applicationId={app.id} currentStatus={app.status} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-4 text-xs font-semibold">
                      <Link href={`/jobs/${job.id}`} className="text-indigo-600 hover:text-indigo-800">
                        View Details &rarr;
                      </Link>
                      <Link href={`/jobs/${job.id}/edit`} className="text-gray-600 hover:text-gray-900">
                        Edit Listing
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Candidate Applications Panel */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Submitted Applications</h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100 overflow-hidden">
              {applications.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 font-medium">You haven&apos;t submitted any job applications yet.</p>
                  <Link href="/jobs" className="mt-3 inline-block text-indigo-600 font-semibold text-sm hover:underline">
                    Browse open roles &rarr;
                  </Link>
                </div>
              ) : (
                applications.map((application) => (
                  <div key={application.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{application.job.title}</h3>
                        <p className="text-sm font-medium text-gray-600">{application.job.company}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {application.job.location} • {application.job.type}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Applied {formatDistanceToNow(new Date(application.appliedAt), { addSuffix: true })}
                        </p>
                      </div>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles(application.status)}`}>
                        {application.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                      {application.status === "Pending" ? (
                        <button
                          type="button"
                          disabled={withdrawingId === application.id}
                          onClick={() => handleWithdraw(application.id)}
                          className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                        >
                          {withdrawingId === application.id ? "Withdrawing..." : "Withdraw Application"}
                        </button>
                      ) : (
                        <span className="text-gray-400 font-medium">Status Finalized</span>
                      )}

                      <Link href={`/jobs/${application.job.id}`} className="text-indigo-600 hover:text-indigo-800 font-semibold">
                        View Role &rarr;
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
