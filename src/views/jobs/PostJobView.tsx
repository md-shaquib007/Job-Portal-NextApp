"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { jobSchema } from "@/utils/validations/job";

export default function PostJobView() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
      salary: formData.get("salary") as string,
    };

    // Client-side validation
    const result = jobSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors as Record<string, string[]>);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (errData.errors) {
          setErrors(errData.errors);
          return;
        }
        if (response.status === 401) {
          router.push(`/auth/signin?callbackUrl=${encodeURIComponent("/jobs/post")}`);
          return;
        }
        throw new Error(errData.error || "Failed to post job. Please try again.");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setGeneralError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a Job</h1>
        
        {generalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {generalError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Job Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className={`mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:ring-indigo-50"
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600" id="title-error">
                {errors.title[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700"
            >
              Company
            </label>
            <input
              type="text"
              name="company"
              id="company"
              required
              className={`mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.company
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:ring-indigo-50"
              }`}
            />
            {errors.company && (
              <p className="mt-1 text-xs text-red-600" id="company-error">
                {errors.company[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              className={`mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.location
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:ring-indigo-50"
              }`}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-600" id="location-error">
                {errors.location[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Job Type
            </label>
            <select
              name="type"
              id="type"
              required
              className={`mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.type
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:ring-indigo-50"
              }`}
            >
              <option value="">Select a type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-xs text-red-600" id="type-error">
                {errors.type[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={6}
              required
              className={`mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.description
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:ring-indigo-50"
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600" id="description-error">
                {errors.description[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="salary"
              className="block text-sm font-medium text-gray-700"
            >
              Salary (Optional)
            </label>
            <input
              type="text"
              name="salary"
              id="salary"
              placeholder="e.g., $80,000 - $100,000"
              className={`mt-1 block w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.salary
                  ? "border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:ring-indigo-50"
              }`}
            />
            {errors.salary && (
              <p className="mt-1 text-xs text-red-600" id="salary-error">
                {errors.salary[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {isSubmitting ? "Posting..." : "Post a Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
