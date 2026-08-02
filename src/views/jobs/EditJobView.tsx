"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { jobSchema } from "@/utils/validations/job";

type JobData = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  salary: string | null;
};

export default function EditJobView({ job }: { job: JobData }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      company: formData.get("company") as string,
      location: formData.get("location") as string,
      type: formData.get("type") as string,
      description: formData.get("description") as string,
      salary: (formData.get("salary") as string) || "",
    };

    const result = jobSchema.safeParse(data);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors as Record<string, string[]>);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const errData = await response.json();
        if (errData.errors) {
          setErrors(errData.errors);
          return;
        }
        throw new Error(errData.error || "Failed to update job.");
      }

      router.push(`/jobs/${job.id}`);
      router.refresh();
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Job</h1>
        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {generalError}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {(["title", "company", "location"] as const).map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                {field}
              </label>
              <input
                id={field}
                name={field}
                type="text"
                required
                defaultValue={job[field]}
                className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2"
              />
              {errors[field]?.[0] && <p className="mt-1 text-xs text-red-600">{errors[field][0]}</p>}
            </div>
          ))}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Job Type</label>
            <select id="type" name="type" required defaultValue={job.type} className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            {errors.type?.[0] && <p className="mt-1 text-xs text-red-600">{errors.type[0]}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" name="description" rows={6} required defaultValue={job.description} className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2" />
            {errors.description?.[0] && <p className="mt-1 text-xs text-red-600">{errors.description[0]}</p>}
          </div>
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary (Optional)</label>
            <input id="salary" name="salary" type="text" defaultValue={job.salary ?? ""} className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2" />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
