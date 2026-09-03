import { getSession, requireUserId } from "@/config/session";
import { ApplicationController } from "@/controllers/application.controller";
import DashboardView from "@/views/dashboard/DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userId = await requireUserId("/dashboard");
  const session = await getSession();
  const userRole = session?.user?.role || "JOB_SEEKER";

  try {
    const [applications, postedJobs] = await ApplicationController.getDashboardData(userId);
    return (
      <DashboardView
        applications={applications ?? []}
        postedJobs={postedJobs ?? []}
        userRole={userRole}
      />
    );
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return <DashboardView applications={[]} postedJobs={[]} userRole={userRole} />;
  }
}
