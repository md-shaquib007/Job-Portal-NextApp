-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- Normalize existing status values before type change
UPDATE "Application" SET "status" = 'Pending' WHERE UPPER("status") = 'PENDING' OR "status" = 'pending';
UPDATE "Application" SET "status" = 'Accepted' WHERE UPPER("status") = 'ACCEPTED';
UPDATE "Application" SET "status" = 'Rejected' WHERE UPPER("status") = 'REJECTED';

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus" USING ("status"::"ApplicationStatus");
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'Pending';

-- CreateIndex
CREATE INDEX "Job_postedAt_idx" ON "Job"("postedAt");
CREATE INDEX "Job_postedById_idx" ON "Job"("postedById");
CREATE INDEX "Application_userId_idx" ON "Application"("userId");
CREATE INDEX "Application_jobId_idx" ON "Application"("jobId");
