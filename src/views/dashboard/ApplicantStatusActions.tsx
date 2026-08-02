"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplicantStatusActions({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (currentStatus !== "Pending") {
    return (
      <span className="text-sm text-gray-500 capitalize">{currentStatus}</span>
    );
  }

  const updateStatus = async (status: "Accepted" | "Rejected") => {
    setLoading(status);
    setError("");
    try {
      const res = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!!loading}
          onClick={() => updateStatus("Accepted")}
          className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200 disabled:opacity-50"
        >
          {loading === "Accepted" ? "..." : "Accept"}
        </button>
        <button
          type="button"
          disabled={!!loading}
          onClick={() => updateStatus("Rejected")}
          className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
        >
          {loading === "Rejected" ? "..." : "Reject"}
        </button>
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
