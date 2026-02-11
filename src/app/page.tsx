import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Find Your Next Job Faster
        </h1>

        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Search thousands of jobs from top companies and apply in one click.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/jobs"
            className="px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Browse Jobs
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid gap-8 sm:grid-cols-2 md:grid-cols-3 text-center">
          <div className="p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Verified Companies
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              Apply only to trusted and verified employers.
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Easy Applications
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              Apply to jobs in seconds with your profile.
            </p>
          </div>

          <div className="p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Track Status
            </h3>
            <p className="mt-2 text-gray-600 text-sm">
              Track all your applications in one dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
