import { getSession } from "@/config/session";
import { JobController } from "@/controllers/job.controller";
import { apiError, apiSuccess, handleApiError } from "@/utils/api-response";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized", 401);
    }

    const body = await request.json();
    const result = await JobController.create(body, session.user.id);

    if (!result.ok) {
      return apiError("Validation failed", 400, { errors: result.errors });
    }

    return apiSuccess(result.data);
  } catch (error) {
    return handleApiError("Error creating job", error);
  }
}

export async function GET() {
  try {
    const jobs = await JobController.listAll();
    return apiSuccess(jobs);
  } catch (error) {
    return handleApiError("Error fetching jobs", error);
  }
}
