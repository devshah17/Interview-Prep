import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { QuizAttempt } from "@/models/QuizAttempt";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { score, totalQuestions, timeTaken, configDetails } = await req.json();

    await dbConnect();

    const attempt = await QuizAttempt.create({
      userId: session.user.id,
      score,
      totalQuestions,
      timeTaken,
      configDetails,
    });

    return NextResponse.json({ attemptId: attempt._id });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
