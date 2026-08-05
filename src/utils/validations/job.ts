import { z } from "zod";

export const jobSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Job title must be at least 3 characters long." })
    .max(100, { message: "Job title cannot exceed 100 characters." }),
  company: z
    .string()
    .trim()
    .min(2, { message: "Company name must be at least 2 characters long." })
    .max(100, { message: "Company name cannot exceed 100 characters." }),
  location: z
    .string()
    .trim()
    .min(2, { message: "Location must be at least 2 characters long." })
    .max(100, { message: "Location cannot exceed 100 characters." }),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship"], {
    message: "Please select a valid job type.",
  }),
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters long." }),
  salary: z.string().trim().optional().or(z.literal("")),
});

export type JobInput = z.infer<typeof jobSchema>;
