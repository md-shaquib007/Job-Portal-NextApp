import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import ApplyButtonView from "@/views/jobs/ApplyButtonView";
import JobOwnerActions from "@/views/jobs/JobOwnerActions";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary: string | null;
  postedAt: Date;
  postedBy: { name: string | null };
};

export default function JobDetailView({
  job,
  hasApplied,
  isOwner,
}: {
  job: Job;
  hasApplied: boolean;
  isOwner: boolean;
}) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-8">
            <Link href="/jobs" className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 inline-block">
              Back to jobs
            </Link>
            {isOwner && <JobOwnerActions jobId={job.id} />}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{job.company}</p>
            <div className="flex items-center gap-4 text-gray-500 mb-6">
              <span>{job.location}</span>
              <span>•</span>
              <span>{job.type}</span>
              {job.salary && (
                <>
                  <span>•</span>
                  <span className="text-gray-900 font-medium">{job.salary}</span>
                </>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>Posted by {job.postedBy.name}</span>
              <span className="mx-2">•</span>
              <span>{formatDistanceToNow(new Date(job.postedAt), { addSuffix: true })}</span>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="text-gray-600 whitespace-pre-wrap">{job.description}</div>
          </div>

          {!isOwner && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <ApplyButtonView jobId={job.id} hasApplied={hasApplied} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
