import { getSession } from "@/config/session";
import { JobController } from "@/controllers/job.controller";
import { apiError, apiSuccess, handleApiError } from "@/utils/api-response";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized", 401);
    }

    const { jobId } = await params;
    const body = await request.json();
    const result = await JobController.update(jobId, body, session.user.id, session.user.role);

    if (!result.ok) {
      return apiError(result.message ?? "Request failed", result.status, {
        errors: result.errors,
      });
    }

    return apiSuccess(result.data);
  } catch (error) {
    return handleApiError("Error updating job", error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized", 401);
    }

    const { jobId } = await params;
    const result = await JobController.delete(jobId, session.user.id, session.user.role);

    if (!result.ok) {
      return apiError(result.message ?? "Request failed", result.status);
    }

    return apiSuccess(result.data);
  } catch (error) {
    return handleApiError("Error deleting job", error);
  }
}
