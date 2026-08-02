"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JobOwnerActions({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!confirm("Delete this job posting? This cannot be undone.")) return;

    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete job.");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <Link
        href={`/jobs/${jobId}/edit`}
        className="px-4 py-2 text-sm font-medium rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
      >
        Edit Job
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="px-4 py-2 text-sm font-medium rounded-md border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {deleting ? "Deleting..." : "Delete Job"}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
