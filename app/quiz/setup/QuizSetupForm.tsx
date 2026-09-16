"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/lib/store";

export default function QuizSetupForm({ technologies }: { technologies: any[] }) {
  const router = useRouter();
  const setQuiz = useQuizStore((state) => state.setQuiz);
  
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(15);
  const [complexity, setComplexity] = useState("Mixed");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTechChange = (id: string) => {
    if (selectedTech.includes(id)) {
      setSelectedTech(selectedTech.filter((t) => t !== id));
    } else {
      setSelectedTech([...selectedTech, id]);
    }
  };

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTech.length === 0) {
      setError("Please select at least one technology.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const config = { techIds: selectedTech, numQuestions, timeLimit, complexityMode: complexity };
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data = await res.json();
      
      if (data.questions.length === 0) {
        setError("No questions found for the selected criteria.");
        setLoading(false);
        return;
      }

      setQuiz(data.questions, config);
      router.push("/quiz/active");
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form className="bg-white shadow rounded-lg p-8" onSubmit={handleStartQuiz}>
      {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
      
      <div className="mb-6">
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
          Select Technologies
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {technologies.map((tech) => (
            <label key={tech.id} className="flex items-center space-x-3 border p-3 rounded cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={selectedTech.includes(tech.id)}
                onChange={() => handleTechChange(tech.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <span className="text-sm text-gray-900">{tech.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">Number of Questions</label>
          <select
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">Time Limit (minutes)</label>
          <select
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value={5}>5 min</option>
            <option value={10}>10 min</option>
            <option value={15}>15 min</option>
            <option value={30}>30 min</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">Complexity Mode</label>
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
          >
            <option value="Mixed">Mixed</option>
            <option value="Beginner">Beginner (Mostly Easy/Med)</option>
            <option value="Advanced">Advanced (Mostly Med/Hard)</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={loading || technologies.length === 0}
          className="rounded-md bg-indigo-600 px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Generating Quiz..." : "Start Quiz"}
        </button>
      </div>
    </form>
  );
}
