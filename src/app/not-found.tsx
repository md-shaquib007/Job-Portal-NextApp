import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-gray-600 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/jobs"
        className="px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
      >
        Browse Jobs
      </Link>
    </div>
  );
}
