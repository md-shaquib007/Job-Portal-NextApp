import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const job = await prisma?.job.create({
      data: {
        ...data,
        postedById: session?.user.id,
      },
    });
    return NextResponse.json(job);
  } catch (error) {
    console.log("Error in src/app/api/jobs/ in POST : ", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(request: Request) {
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
