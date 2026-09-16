import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { Technology } from "@/models/Technology";
import { UserProgress } from "@/models/UserProgress";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();

  // Fetch technologies
  const technologies = await Technology.find({}).lean();
  
  // Fetch user progress
  const progress = await UserProgress.find({ userId: session.user.id }).populate('topicId').lean();
  
  // Calculate stats (mocked logic based on what's available)
  const completedTopics = progress.filter(p => p.status === 'Completed').length;
  const inProgressTopics = progress.filter(p => p.status === 'InProgress').length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Welcome back, {session.user?.name || "Learner"}!
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Completed Topics</dt>
                  <dd className="text-3xl font-semibold tracking-tight text-gray-900">{completedTopics}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">In Progress</dt>
                  <dd className="text-3xl font-semibold tracking-tight text-gray-900">{inProgressTopics}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Available Technologies</h2>
      {technologies.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {technologies.map((tech: any) => (
            <Link key={tech._id.toString()} href={`/tech/${tech._id.toString()}`}>
              <div className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg bg-white p-6 shadow hover:shadow-md transition-shadow">
                <div className="mb-4 h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                   {/* Placeholder for icon */}
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">{tech.name}</h3>
                {tech.description && (
                  <p className="mt-2 text-sm text-gray-500 text-center">{tech.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center bg-white shadow rounded-lg p-10">
          <p className="text-gray-500 mb-4">No technologies have been added yet.</p>
        </div>
      )}
    </div>
  );
}
