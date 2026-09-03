import { JobModel, JobFilters } from "@/models/job.model";
import { jobSchema } from "@/utils/validations/job";
import { ControllerResult } from "@/types/controller";

/** Controller — handles job business logic. */
export const JobController = {
  search(filters: JobFilters) {
    return JobModel.search(filters);
  },

  getById(id: string) {
    return JobModel.findById(id);
  },

  listAll() {
    return JobModel.findAll();
  },

  async create(
    body: unknown,
    userId: string,
  ): Promise<ControllerResult<Awaited<ReturnType<typeof JobModel.create>>>> {
    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return {
        ok: false,
        status: 400,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const job = await JobModel.create(parsed.data, userId);
    return { ok: true, status: 200, data: job };
  },

  async update(
    jobId: string,
    body: unknown,
    userId: string,
    userRole?: string | null,
  ): Promise<ControllerResult<Awaited<ReturnType<typeof JobModel.update>>>> {
    const job = await JobModel.findById(jobId);
    if (!job) return { ok: false, status: 404, message: "Job not found." };

    const isOwner = job.postedById === userId;
    const isAdmin = userRole === "ADMIN";
    if (!isOwner && !isAdmin) {
      return { ok: false, status: 403, message: "You can only edit your own jobs." };
    }

    const parsed = jobSchema.safeParse(body);
    if (!parsed.success) {
      return {
        ok: false,
        status: 400,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const updated = await JobModel.update(jobId, parsed.data);
    return { ok: true, status: 200, data: updated };
  },

  async delete(
    jobId: string,
    userId: string,
    userRole?: string | null,
  ): Promise<ControllerResult<{ id: string }>> {
    const job = await JobModel.findById(jobId);
    if (!job) return { ok: false, status: 404, message: "Job not found." };

    const isOwner = job.postedById === userId;
    const isAdmin = userRole === "ADMIN";
    if (!isOwner && !isAdmin) {
      return { ok: false, status: 403, message: "You can only delete your own jobs." };
    }

    await JobModel.delete(jobId);
    return { ok: true, status: 200, data: { id: jobId } };
  },
};

export type { JobFilters };
