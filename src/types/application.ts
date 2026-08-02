/** Application status values — mirrors `ApplicationStatus` in prisma/schema.prisma */
export const ApplicationStatus = {
  Pending: "Pending",
  Accepted: "Accepted",
  Rejected: "Rejected",
} as const;

export type ApplicationStatusValue =
  (typeof ApplicationStatus)[keyof typeof ApplicationStatus];
