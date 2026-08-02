"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ApplyButton({ jobId, hasApplied = false }: { jobId: string; hasApplied?: boolean }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleApply = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setErrorMessage("");
    setApplicationStatus("idle");
    setIsApplying(true);

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
      });

      if (!response.ok) {
        const message =
          response.status === 400
            ? "You have already applied for this job."
            : "Failed to apply for the job.";
        throw new Error(message);
      }

      setApplicationStatus("success");
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
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md opacity-50 cursor-not-allowed"
        disabled
      >
        Apply for this position
      </button>
    );
  }

  if (hasApplied || applicationStatus === "success") {
    return (
      <div className="text-center">
        <p className="text-green-600 font-medium mb-4">
          {applicationStatus === "success" ? "Application submitted successfully" : "You have already applied for this job"}
        </p>
        <Link className="text-indigo-600 hover:text-indigo-800 font-medium" href="/dashboard">
          View your applications
        </Link>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleApply}
        disabled={isApplying}
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isApplying ? "Applying..." : "Apply for this position"}
      </button>
      {applicationStatus === "error" && (
        <p className="mt-2 text-red-600 text-center">{errorMessage}</p>
      )}
    </>
  );
}
