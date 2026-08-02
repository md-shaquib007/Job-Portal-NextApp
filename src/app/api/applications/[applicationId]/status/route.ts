import { getSession } from "@/config/session";
import { ApplicationController } from "@/controllers/application.controller";
import { apiError, apiSuccess, handleApiError } from "@/utils/api-response";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ applicationId: string }> },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return apiError("Unauthorized", 401);
  }

  try {
    const { applicationId } = await params;
    const body = await request.json();
    const result = await ApplicationController.updateStatus(
      applicationId,
      body,
      session.user.id,
    );

    if (!result.ok) {
      return apiError(
        result.error ?? result.message ?? "Request failed",
        result.status,
      );
    }

    return apiSuccess(result.data);
  } catch (error) {
    return handleApiError("Error updating application status", error);
  }
}
