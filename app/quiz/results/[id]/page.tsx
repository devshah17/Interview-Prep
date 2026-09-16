import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { QuizAttempt } from "@/models/QuizAttempt";
import Link from "next/link";
import { Types } from "mongoose";

export default async function QuizResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const attemptId = resolvedParams.id;

  if (!Types.ObjectId.isValid(attemptId)) {
    return <div>Invalid Attempt ID</div>;
  }

  await dbConnect();

  const attempt = await QuizAttempt.findById(attemptId).lean();

  if (!attempt) {
    return <div>Quiz attempt not found</div>;
  }

  // Ensure user owns this attempt
  if (attempt.userId.toString() !== session.user.id) {
    return <div>Unauthorized access to this result</div>;
  }

  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white shadow rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
          Quiz Results
        </h1>
        
        <div className="flex justify-center items-center mb-8">
          <div className="relative h-48 w-48 rounded-full border-8 border-gray-100 flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border-8 border-indigo-600" 
                  style={{ clipPath: `polygon(0 0, 100% 0, 100% ${percentage}%, 0 ${percentage}%)` }}></div>
             <div className="text-4xl font-bold text-gray-900 z-10">{percentage}%</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8 text-left max-w-sm mx-auto">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Score</div>
            <div className="text-xl font-semibold text-gray-900">{attempt.score} / {attempt.totalQuestions}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Time Taken</div>
            <div className="text-xl font-semibold text-gray-900">
              {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
            </div>
          </div>
        </div>

        <div className="space-x-4">
          <Link href="/quiz/setup" className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500">
            Take Another Quiz
          </Link>
          <Link href="/dashboard" className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
