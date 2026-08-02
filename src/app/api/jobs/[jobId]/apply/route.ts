import { getSession } from "@/config/session";
import { ApplicationController } from "@/controllers/application.controller";
import { apiError, apiSuccess, handleApiError } from "@/utils/api-response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { jobId } = await params;
    const result = await ApplicationController.apply(jobId, session.user.id);

    if (!result.ok) {
      return apiError(result.message ?? "Request failed", result.status);
    }

    return apiSuccess(result.data);
  } catch (error) {
    return handleApiError("Error applying to job", error);
  }
}
