import { requireUserId } from "@/config/session";
import { ApplicationController } from "@/controllers/application.controller";
import DashboardView from "@/views/dashboard/DashboardView";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userId = await requireUserId();
  const [applications, postedJobs] = await ApplicationController.getDashboardData(userId);

  return <DashboardView applications={applications} postedJobs={postedJobs} />;
}
