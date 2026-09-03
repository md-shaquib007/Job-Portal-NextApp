import { getSession } from "@/config/session";
import { ApplicationController } from "@/controllers/application.controller";
import { apiError, apiSuccess, handleApiError } from "@/utils/api-response";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ applicationId: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized", 401);
    }

    const { applicationId } = await params;
    const result = await ApplicationController.withdraw(applicationId, session.user.id);

    if (!result.ok) {
      return apiError(result.message ?? "Request failed", result.status);
    }

    return apiSuccess(result.data);
  } catch (error) {
    return handleApiError("Error withdrawing application", error);
  }
}