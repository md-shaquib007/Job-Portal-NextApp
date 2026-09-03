import { getSession } from "@/config/session";
import { prisma } from "@/config/database";
import { apiError, apiSuccess, handleApiError } from "@/utils/api-response";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return apiError("Unauthorized", 401);
    }

    const { jobId } = await params;
    const bookmark = await prisma.savedJob.upsert({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
      create: {
        userId: session.user.id,
        jobId,
      },
      update: {},
    });

    return apiSuccess(bookmark);
  } catch (error) {
    return handleApiError("Error bookmarking job", error);
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
    await prisma.savedJob.deleteMany({
      where: {
        userId: session.user.id,
        jobId,
      },
    });

    return apiSuccess({ success: true });
  } catch (error) {
    return handleApiError("Error removing bookmark", error);
  }
}