-- Allow employers to delete a job and its dependent applications.
ALTER TABLE "Application" DROP CONSTRAINT "Application_jobId_fkey";

ALTER TABLE "Application"
  ADD CONSTRAINT "Application_jobId_fkey"
  FOREIGN KEY ("jobId") REFERENCES "Job"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
