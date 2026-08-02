import { ApplicationStatus } from "@/types/application";
import { z } from "zod";
import { ApplicationModel } from "@/models/application.model";
import { JobModel } from "@/models/job.model";
import { ControllerResult } from "@/types/controller";

const statusSchema = z.object({
  status: z.enum(["Accepted", "Rejected"]),
});

/** Controller — handles application business logic. */
export const ApplicationController = {
  getDashboardData(userId: string) {
    return Promise.all([
      ApplicationModel.findByUser(userId),
      JobModel.findByPoster(userId),
    ]);
  },

  async apply(
    jobId: string,
    userId: string,
  ): Promise<ControllerResult<Awaited<ReturnType<typeof ApplicationModel.create>>>> {
    const job = await JobModel.findById(jobId);
    if (!job) {
      return { ok: false, status: 404, message: "Job Not Found" };
    }

    const existing = await ApplicationModel.findExisting(jobId, userId);
    if (existing) {
      return { ok: false, status: 400, message: "You have already applied for this job" };
    }

    const application = await ApplicationModel.create(jobId, userId);
    return { ok: true, status: 200, data: application };
  },

  async updateStatus(
    applicationId: string,
    body: unknown,
    employerId: string,
  ): Promise<ControllerResult<Awaited<ReturnType<typeof ApplicationModel.updateStatus>>>> {
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return { ok: false, status: 400, error: "Status must be Accepted or Rejected." };
    }

    const application = await ApplicationModel.findById(applicationId);
    if (!application) {
      return { ok: false, status: 404, message: "Application not found." };
    }

    if (application.job.postedById !== employerId) {
      return { ok: false, status: 403, message: "You can only manage applicants for your own jobs." };
    }

    const updated = await ApplicationModel.updateStatus(
      applicationId,
      ApplicationStatus[parsed.data.status],
    );

    return { ok: true, status: 200, data: updated };
  },

  hasApplied(jobId: string, userId: string) {
    return ApplicationModel.findExisting(jobId, userId);
  },
};
