"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/lib/store";

export default function ActiveQuizPage() {
  const router = useRouter();
  const { questions, config } = useQuizStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!questions || questions.length === 0) {
      router.replace("/quiz/setup");
      return;
    }
    
    setTimeLeft(config.timeLimit * 60);
  }, [questions, config, router]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (questions && questions.length > 0 && !isSubmitting) {
        handleSubmitQuiz();
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSelectOption = (option: string) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    let score = 0;
    
    questions.forEach((q: any, idx: number) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          totalQuestions: questions.length,
          timeTaken: (config.timeLimit * 60) - timeLeft,
          configDetails: config,
        }),
      });
      
      const data = await res.json();
      router.push(`/quiz/results/${data.attemptId}`);
    } catch (err) {
      console.error("Error submitting quiz", err);
      alert("Error submitting quiz. Check console.");
      setIsSubmitting(false);
    }
  };

  if (!questions || questions.length === 0) return null;

  const currentQ = questions[currentIndex];
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8 bg-white shadow rounded-lg p-4">
        <div className="text-lg font-medium text-gray-900">
          Question {currentIndex + 1} of {questions.length}
        </div>
        <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-indigo-600'}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-8">
        <div className="mb-6 flex justify-between items-start">
          <h2 className="text-xl font-medium text-gray-900">{currentQ.text}</h2>
          <span className={`ml-4 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
            currentQ.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            currentQ.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {currentQ.difficulty}
          </span>
        </div>

        <div className="space-y-4 mb-8">
          {currentQ.options.map((option: string, idx: number) => (
            <div 
              key={idx}
              onClick={() => handleSelectOption(option)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswers[currentIndex] === option 
                  ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {option}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
