import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { Technology } from "@/models/Technology";
import { Topic } from "@/models/Topic";
import Link from "next/link";
import { Types } from "mongoose";

export default async function TechOverviewPage({ params }: { params: Promise<{ "tech-id": string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  
  const techId = (await params)["tech-id"];

  if (!Types.ObjectId.isValid(techId)) {
    return <div>Invalid Technology ID</div>;
  }

  await dbConnect();

  const technology = await Technology.findById(techId).lean();
  
  if (!technology) {
    return <div>Technology not found</div>;
  }

  const topics = await Topic.find({ techId }).sort({ order: 1 }).lean();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          {technology.name}
        </h1>
        {technology.description && (
          <p className="text-lg text-gray-500">{technology.description}</p>
        )}
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Topics</h2>
      
      {topics.length > 0 ? (
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {topics.map((topic: any, index: number) => (
            <Link key={topic._id.toString()} href={`/tech/${techId}/${topic._id.toString()}`} className="block hover:bg-gray-50">
              <div className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-indigo-600">
                    {index + 1}. {topic.title}
                  </h3>
                </div>
                <div>
                   {/* We could show a checkmark here if the topic is completed based on UserProgress */}
                  <span className="text-gray-400">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center bg-white shadow rounded-lg p-10">
          <p className="text-gray-500">No topics available for this technology yet.</p>
        </div>
      )}
    </div>
  );
}
