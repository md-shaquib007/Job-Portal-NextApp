import { prisma } from "@/config/database";
import { JobInput } from "@/utils/validations/job";

export type JobFilters = {
  q?: string;
  type?: string;
  category?: string;
  experienceLevel?: string;
  location?: string;
  page?: number;
  pageSize?: number;
};

const DEFAULT_PAGE_SIZE = 10;

function buildWhere(filters: JobFilters) {
  const { q, type, category, experienceLevel, location } = filters;
  return {
    AND: [
      { isActive: true },
      q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" as const } },
              { company: { contains: q, mode: "insensitive" as const } },
              { description: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {},
      type ? { type } : {},
      category ? { category: { contains: category, mode: "insensitive" as const } } : {},
      experienceLevel ? { experienceLevel } : {},
      location
        ? { location: { contains: location, mode: "insensitive" as const } }
        : {},
    ],
  };
}

/** Model — database access for Job table only. */
export const JobModel = {
  async search(filters: JobFilters = {}) {
    const page = Math.max(1, filters.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? DEFAULT_PAGE_SIZE));
    const where = buildWhere(filters);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { postedAt: "desc" },
        include: { postedBy: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.job.count({ where }),
    ]);

    return { jobs, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
  },

  findById(id: string) {
    return prisma.job.findUnique({
      where: { id },
      include: { postedBy: true },
    });
  },

  findAll() {
    return prisma.job.findMany({ orderBy: { postedAt: "desc" } });
  },

  create(data: JobInput, postedById: string) {
    return prisma.job.create({
      data: { ...data, postedById },
    });
  },

  update(id: string, data: JobInput) {
    return prisma.job.update({
      where: { id },
      data,
    });
  },

  toggleActive(id: string, isActive: boolean) {
    return prisma.job.update({
      where: { id },
      data: { isActive },
    });
  },

  delete(id: string) {
    return prisma.job.delete({ where: { id } });
  },

  findByPoster(userId: string) {
    return prisma.job.findMany({
      where: { postedById: userId },
      include: {
        applications: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { appliedAt: "desc" },
        },
        _count: { select: { applications: true } },
      },
      orderBy: { postedAt: "desc" },
    });
  },
};
