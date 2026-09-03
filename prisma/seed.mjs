import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

const ApplicationStatus = { Pending: "Pending" };

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: { role: "ADMIN" },
    create: {
      name: "Platform Admin",
      email: "admin@demo.com",
      password: hashPassword("demoPass1"),
      role: "ADMIN",
    },
  });

  const employer = await prisma.user.upsert({
    where: { email: "employer@demo.com" },
    update: { role: "EMPLOYER" },
    create: {
      name: "Demo Employer",
      email: "employer@demo.com",
      password: hashPassword("demoPass1"),
      role: "EMPLOYER",
    },
  });

  const seeker = await prisma.user.upsert({
    where: { email: "seeker@demo.com" },
    update: { role: "JOB_SEEKER" },
    create: {
      name: "Demo Seeker",
      email: "seeker@demo.com",
      password: hashPassword("demoPass1"),
      role: "JOB_SEEKER",
    },
  });

  const job = await prisma.job.upsert({
    where: { id: "seed-job-1" },
    update: {},
    create: {
      id: "seed-job-1",
      title: "Frontend Developer",
      company: "Demo Corp",
      location: "Remote",
      type: "Full-time",
      description: "Build modern web apps with React and Next.js. 2+ years experience preferred.",
      salary: "$70,000 - $90,000",
      postedById: employer.id,
    },
  });

  await prisma.application.upsert({
    where: { jobId_userId: { jobId: job.id, userId: seeker.id } },
    update: {},
    create: {
      jobId: job.id,
      userId: seeker.id,
      status: ApplicationStatus.Pending,
    },
  });

  console.log("Seed complete:");
  console.log("  Admin:    admin@demo.com / demoPass1");
  console.log("  Employer: employer@demo.com / demoPass1");
  console.log("  Seeker:   seeker@demo.com / demoPass1");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
