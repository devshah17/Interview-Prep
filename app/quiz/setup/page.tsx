import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import { Technology } from "@/models/Technology";
import QuizSetupForm from "./QuizSetupForm";

export default async function QuizSetupPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  
  const technologies = await Technology.find({}).lean();
  
  const serializedTech = technologies.map((t: any) => ({
    id: t._id.toString(),
    name: t.name,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Custom Quiz Setup
      </h1>
      <QuizSetupForm technologies={serializedTech} />
    </div>
  );
}
