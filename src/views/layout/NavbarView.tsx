"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <>
      {!session && status !== "loading" && (
        <div className="bg-indigo-950 text-white text-xs py-2 px-4 text-center font-medium overflow-x-auto">
          <span>⚡ <strong className="font-bold">Live Recruiter Demo Tour</strong>: </span>
          <span className="ml-2">👑 Admin: <code className="bg-indigo-800 px-1 py-0.5 rounded text-indigo-100 font-mono">admin@demo.com</code></span>
          <span className="mx-2">|</span>
          <span>👔 Employer: <code className="bg-indigo-800 px-1 py-0.5 rounded text-indigo-100 font-mono">employer@demo.com</code></span>
          <span className="mx-2">|</span>
          <span>👤 Candidate: <code className="bg-indigo-800 px-1 py-0.5 rounded text-indigo-100 font-mono">seeker@demo.com</code></span>
          <span className="ml-2">(Pass: <code className="bg-indigo-800 px-1 py-0.5 rounded text-indigo-100 font-mono">demoPass1</code>)</span>
          <Link href="/auth/signin" className="ml-3 underline font-bold text-indigo-200 hover:text-white">
            1-Click Sign In &rarr;
          </Link>
        </div>
      )}
      <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Image
                src="/favicon.ico"
                alt="Job Board logo"
                height={30}
                width={30}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Job Board
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Browse Jobs
            </Link>

            {status === "loading" ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-gray-100" aria-label="Loading account" />
            ) : session ? (
              <>
                {session.user.role === "EMPLOYER" && (
                  <Link
                    href="/jobs/post"
                    className="text-indigo-600 font-semibold hover:text-indigo-800 px-3 py-2 rounded-md text-sm"
                  >
                    + Post a Job
                  </Link>
                )}

                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>

                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium capitalize">
                  {session.user.role === "EMPLOYER" ? "Employer" : "Job Seeker"}
                </span>

                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-sm text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  </>
  );
}
