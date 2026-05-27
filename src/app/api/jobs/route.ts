import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { jobSchema } from "@/lib/validations/job";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const result = jobSchema.safeParse(data);
    if (!result.success) {
      return NextResponse.json(
        { errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        ...result.data,
        postedById: session.user.id,
      },
    });
    return NextResponse.json(job);
  } catch (error) {
    console.log("Error in src/app/api/jobs/ in POST : ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: {
        postedAt: "desc",
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.log("Error in src/app/api/jobs/ in GET: ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
