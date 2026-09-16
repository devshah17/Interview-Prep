"use client";

import { useState } from "react";

export default function QuizComponent({ questions }: { questions: any[] }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (!isAnswered) {
      setSelectedOption(option);
    }
  };

  const handleCheck = () => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-bold mb-4">Quiz Completed!</h3>
        <p className="text-lg">You scored {score} out of {questions.length}</p>
        <button 
          onClick={() => {
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedOption(null);
            setIsAnswered(false);
            setShowResult(false);
          }}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center text-sm text-gray-500">
        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
          currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {currentQuestion.difficulty}
        </span>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-4">{currentQuestion.text}</h3>
      
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option: string, index: number) => {
          let optionClass = "p-4 border rounded-lg transition-colors ";
          
          if (isAnswered) {
            if (option === currentQuestion.correctAnswer) {
              optionClass += "border-green-500 bg-green-50 text-green-900 font-medium";
            } else if (option === selectedOption) {
              optionClass += "border-red-500 bg-red-50 text-red-900";
            } else {
              optionClass += "border-gray-200 opacity-50";
            }
          } else {
            optionClass += "cursor-pointer hover:border-gray-300 ";
            if (selectedOption === option) {
              optionClass += "border-indigo-600 bg-indigo-50";
            } else {
              optionClass += "border-gray-200";
            }
          }

          return (
            <div 
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={optionClass}
            >
              {option}
            </div>
          );
        })}
      </div>

      {isAnswered && currentQuestion.explanation && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-900 rounded-lg text-sm">
          <strong>Explanation:</strong> {currentQuestion.explanation}
        </div>
      )}

      {!isAnswered ? (
        <button
          onClick={handleCheck}
          disabled={!selectedOption}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Answer
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="w-full px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
        </button>
      )}
    </div>
  );
}
