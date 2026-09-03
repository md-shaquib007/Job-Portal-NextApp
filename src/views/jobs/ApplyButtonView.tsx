"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApplyButton({
  jobId,
  hasApplied = false,
}: {
  jobId: string;
  hasApplied?: boolean;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const isEmployer = session?.user?.role === "EMPLOYER";

  const handleOpenModal = () => {
    if (!session) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(`/jobs/${jobId}`)}`);
      return;
    }
    setShowModal(true);
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setApplicationStatus("idle");
    setIsApplying(true);

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter, resumeUrl }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const message =
          response.status === 401
            ? "Your session has expired. Please sign in again."
            : response.status === 403
              ? "Employers cannot apply for jobs."
              : response.status === 400
                ? "You have already applied for this job."
                : data?.error || "Failed to apply for the job.";
        throw new Error(message);
      }

      setApplicationStatus("success");
      setShowModal(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to apply for the job",
      );
      setApplicationStatus("error");
    } finally {
      setIsApplying(false);
    }
  };

  if (status === "loading") {
    return (
      <button
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg opacity-50 cursor-not-allowed font-semibold"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (isEmployer) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
        <p className="text-sm font-semibold text-amber-900">
          Employer Account Notice
        </p>
        <p className="text-xs text-amber-700 mt-1">
          You are signed in as an Employer. Applications are restricted to Job Seeker accounts.
        </p>
      </div>
    );
  }

  if (hasApplied || applicationStatus === "success") {
    return (
      <div className="text-center bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <p className="text-emerald-800 font-bold mb-2">
          {applicationStatus === "success"
            ? "✓ Application Submitted Successfully"
            : "✓ Application Already Received"}
        </p>
        <Link className="text-indigo-600 hover:underline text-sm font-semibold" href="/dashboard">
          Track in Dashboard &rarr;
        </Link>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        disabled={isApplying}
        className="w-full bg-indigo-600 text-white px-6 py-3.5 rounded-xl hover:bg-indigo-700 font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Apply for this Position
      </button>

      {applicationStatus === "error" && !showModal && (
        <p className="mt-2 text-sm text-red-600 text-center">{errorMessage}</p>
      )}

      {/* Application Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Submit Application</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label htmlFor="coverLetter" className="block text-xs font-semibold text-gray-700 mb-1">
                  Cover Letter / Introduction (Optional)
                </label>
                <textarea
                  id="coverLetter"
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Briefly describe why you are a great fit for this role..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="resumeUrl" className="block text-xs font-semibold text-gray-700 mb-1">
                  Resume / Portfolio Link (Optional)
                </label>
                <input
                  id="resumeUrl"
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/your-resume.pdf"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isApplying}
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-sm disabled:opacity-50"
                >
                  {isApplying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
