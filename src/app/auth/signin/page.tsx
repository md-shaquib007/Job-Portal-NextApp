"use client";

import { signIn } from "next-auth/react";

export default function Signin() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg mx-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to JobList
          </h2>
          <p className="text-gray-600">
            Sign in to post jobs and apply for opportunities
          </p>
        </div>

        <button
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          <span className="text-base font-medium">Continue with GitHub</span>
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <a className="text-indigo-600 hover:text-indigo-400" href="#">
            Terms of Service
          </a>{" "}
          &{" "}
          <a className="text-indigo-600 hover:text-indigo-400" href="#">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
