import { AuthController } from "@/controllers/auth.controller";
import { apiError, apiSuccess, handleApiError } from "@/utils/api-response";
import { getClientIp, rateLimit } from "@/utils/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`signup:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return apiError("Too many signup attempts. Please try again later.", 429, {
      retryAfterSec: limit.retryAfterSec,
    });
  }

  try {
    const body = await request.json();
    const result = await AuthController.register(body);

    if (!result.ok) {
      return apiError(result.error ?? "Request failed", result.status);
    }

    return apiSuccess(result.data, result.status);
  } catch (error) {
    return handleApiError("User registration error", error);
  }
}
