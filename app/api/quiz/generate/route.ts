import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Question } from "@/models/Question";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { techIds, numQuestions, complexityMode } = await req.json();

    if (!techIds || !Array.isArray(techIds) || techIds.length === 0) {
      return NextResponse.json({ message: "No technologies selected" }, { status: 400 });
    }

    await dbConnect();

    // Query questions based on selected tech
    const matchStage: any = { techId: { $in: techIds } };

    if (complexityMode === "Beginner") {
      // Prioritize Easy/Medium
      matchStage.difficulty = { $in: ["Easy", "Medium"] };
    } else if (complexityMode === "Advanced") {
      // Prioritize Medium/Hard
      matchStage.difficulty = { $in: ["Medium", "Hard"] };
    }

    const questions = await Question.aggregate([
      { $match: matchStage },
      { $sample: { size: Number(numQuestions) || 10 } }
    ]);

    // If there aren't enough questions matching the strict criteria, we might fallback
    // For MVP, we'll just return what we have
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
