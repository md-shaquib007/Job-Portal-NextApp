import { getSession, requireUserId } from "@/config/session";
import { ApplicationController } from "@/controllers/application.controller";
import DashboardView from "@/views/dashboard/DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userId = await requireUserId("/dashboard");
  const session = await getSession();
  const userRole = session?.user?.role || "JOB_SEEKER";

  let applications: Awaited<ReturnType<typeof ApplicationController.getDashboardData>>[0] = [];
  let postedJobs: Awaited<ReturnType<typeof ApplicationController.getDashboardData>>[1] = [];

  try {
    const data = await ApplicationController.getDashboardData(userId);
    applications = data[0] ?? [];
    postedJobs = data[1] ?? [];
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      String(error.digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
  }

  return (
    <DashboardView
      applications={applications}
      postedJobs={postedJobs}
      userRole={userRole}
    />
  );
}
