import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { Topic } from "@/models/Topic";
import { Question } from "@/models/Question";
import Link from "next/link";
import { Types } from "mongoose";
import QuizComponent from "./QuizComponent";

export default async function TopicDetailPage({ params }: { params: Promise<{ "tech-id": string, "topic-id": string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const resolvedParams = await params;
  const techId = resolvedParams["tech-id"];
  const topicId = resolvedParams["topic-id"];

  if (!Types.ObjectId.isValid(techId) || !Types.ObjectId.isValid(topicId)) {
    return <div>Invalid ID</div>;
  }

  await dbConnect();

  const topic = await Topic.findById(topicId).lean();
  
  if (!topic) {
    return <div>Topic not found</div>;
  }

  // Fetch questions associated with this topic for the mini-quiz
  const questions = await Question.find({ topicId }).lean();
  // Serialize ObjectId for client component
  const serializedQuestions = questions.map((q: any) => ({
    ...q,
    _id: q._id.toString(),
    topicId: q.topicId?.toString(),
    techId: q.techId.toString(),
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href={`/tech/${techId}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Back to Topics
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
          {topic.title}
        </h1>
        <div 
          className="prose max-w-none text-gray-700" 
          dangerouslySetInnerHTML={{ __html: topic.content }} 
        />
      </div>

      {serializedQuestions.length > 0 && (
        <div className="bg-white shadow rounded-lg p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">End of Topic Quiz</h2>
          <QuizComponent questions={serializedQuestions} />
        </div>
      )}
    </div>
  );
}
