import { ControllerResult } from "@/types/controller";
import { UserModel } from "@/models/user.model";
import { signUpSchema } from "@/utils/validations/user";
import {
  getAuthBaseUrl,
  isAuthConfigured,
  isGitHubAuthEnabled,
} from "@/config/env";

/** Controller — handles auth business logic. */
export const AuthController = {
  async register(
    body: unknown,
  ): Promise<ControllerResult<{ message: string; userId: string }>> {
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return {
        ok: false,
        status: 400,
        error: parsed.error.issues[0]?.message ?? "Invalid registration data.",
      };
    }

    const existing = await UserModel.findByEmail(parsed.data.email);
    if (existing) {
      return { ok: false, status: 400, error: "A user with this email already exists." };
    }

    try {
      const user = await UserModel.create(parsed.data);
      return {
        ok: true,
        status: 201,
        data: { message: "Registration successful.", userId: user.id },
      };
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return { ok: false, status: 400, error: "A user with this email already exists." };
      }
      throw error;
    }
  },

  getProviderStatus() {
    const baseUrl = getAuthBaseUrl();
    return {
      credentials: true,
      github: isGitHubAuthEnabled(),
      hasSecret: isAuthConfigured(),
      callbackUrl: baseUrl ? `${baseUrl}/api/auth/callback/github` : null,
    };
  },
};
