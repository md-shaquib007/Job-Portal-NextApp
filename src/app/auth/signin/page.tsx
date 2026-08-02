import { Suspense } from "react";
import SignInView from "@/views/auth/SignInView";
import { isGitHubAuthEnabled } from "@/config/env";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center py-4 font-semibold text-gray-500">Loading form...</div>}>
        <SignInView githubEnabled={isGitHubAuthEnabled()} />
      </Suspense>
    </div>
  );
}
