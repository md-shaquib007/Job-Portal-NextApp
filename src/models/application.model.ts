import { prisma } from "@/config/database";
import { ApplicationStatus, ApplicationStatusValue } from "@/types/application";

/** Model — database access for Application table only. */
export const ApplicationModel = {
  findByUser(userId: string) {
    return prisma.application.findMany({
      where: { userId },
      include: { job: { include: { postedBy: true } } },
      orderBy: { appliedAt: "desc" },
    });
  },

  findExisting(jobId: string, userId: string) {
    return prisma.application.findFirst({ where: { jobId, userId } });
  },

  findById(id: string) {
    return prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });
  },

  create(jobId: string, userId: string) {
    return prisma.application.create({
      data: { jobId, userId, status: ApplicationStatus.Pending },
    });
  },

  updateStatus(id: string, status: ApplicationStatusValue) {
    return prisma.application.update({
      where: { id },
      data: { status },
    });
  },
};
