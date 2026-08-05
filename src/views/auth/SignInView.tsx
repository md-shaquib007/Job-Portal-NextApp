"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInForm({ githubEnabled = false }: { githubEnabled?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const registered = searchParams.get("registered") === "true";
  const authError = searchParams.get("error");
  const requestedCallbackUrl = searchParams.get("callbackUrl");
  const callbackUrl = requestedCallbackUrl?.startsWith("/") && !requestedCallbackUrl.startsWith("//")
    ? requestedCallbackUrl
    : "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!res?.ok || res.error) {
        throw new Error("Invalid email or password.");
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = () => {
    if (error) return error;
    if (authError === "CredentialsSignin") {
      return "Invalid email or password.";
    }
    if (authError === "OAuthSignin") {
      return "OAuth2 sign-in failed. Check the provider credentials and NEXTAUTH_URL configuration.";
    }
    if (authError === "OAuthCallback") {
      return "OAuth2 callback failed. Ensure the provider callback URL matches: {YOUR_URL}/api/auth/callback/github";
    }
    if (authError === "OAuthAccountNotLinked") {
      return "This email is already registered. Sign in with email/password, or use the same GitHub account email.";
    }
    if (authError === "Configuration") {
      return "Auth is misconfigured. Set NEXTAUTH_SECRET and NEXTAUTH_URL in your environment variables.";
    }
    if (authError === "AccessDenied") {
      return "Access was denied. Please try again.";
    }
    if (authError) {
      return "An error occurred during authentication. Please try again.";
    }
    return null;
  };

  const displayError = getErrorMessage();

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 mx-4">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome to JobList
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to post jobs and apply for opportunities
        </p>
      </div>

      {registered && !displayError && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-md">
          <p className="text-sm text-emerald-800 font-medium">
            Registration successful! Please sign in with your email and password.
          </p>
        </div>
      )}

      {displayError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <p className="text-sm text-red-700 font-medium">{displayError}</p>
        </div>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium transition-all duration-200"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2.5 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-medium transition-all duration-200"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {githubEnabled && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            disabled={oauthLoading || loading}
            onClick={async () => {
              setError(null);
              setOauthLoading(true);
              try {
                await signIn("github", { callbackUrl });
              } catch {
                setError("OAuth2 sign-in could not be started. Please try again.");
                setOauthLoading(false);
              }
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C17.137 18.193 20 14.437 20 10.017 20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span>{oauthLoading ? "Connecting to GitHub..." : "Continue with GitHub (OAuth 2.0)"}</span>
          </button>
        </>
      )}

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
