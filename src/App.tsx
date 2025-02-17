import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

const questions = [
  {
    question: "what does resources refer to in the cloud",
    choices: ["compute,networking,storage", "servers,cables,people", "applications and web products"],
    correct: 1
  },
  {
    question: "Which planet is known as the Red Planet?",
    choices: ["Venus", "Mars", "Jupiter"],
    correct: 1
  }
];

interface Score {
  name: string;
  score: number;
  timestamp: string;
}

function App() {
  const [name, setName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(-1);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const response = await fetch('/api/scores');
    const data = await response.json();
    setLeaderboard(data);
  };

  const startQuiz = () => {
    if (name.trim()) {
      setCurrentQuestion(0);
    }
  };

  const handleAnswer = (choiceIndex: number) => {
    if (questions[currentQuestion].correct === choiceIndex) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const submitScore = async () => {
    await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, score }),
    });
    setSubmitted(true);
    fetchLeaderboard();
  };

  if (currentQuestion === -1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="image.png" 
              alt="Quiz Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome to the Cloud Computing Quiz!</h1>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={startQuiz}
            disabled={!name.trim()}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-200 disabled:opacity-50"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Quiz Complete!</h2>
          <p className="text-xl text-center mb-6">
            {name}, you scored {score} out of {questions.length}!
          </p>
          {!submitted ? (
            <button
              onClick={submitScore}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-200"
            >
              Submit Score
            </button>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center">Leaderboard</h3>
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{entry.name}</span>
                    <span className="text-purple-600 font-semibold">{entry.score}/{questions.length}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Question {currentQuestion + 1}</h2>
          <p className="text-lg text-gray-600">{questions[currentQuestion].question}</p>
        </div>
        <div className="space-y-3">
          {questions[currentQuestion].choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full p-4 text-left bg-gray-50 hover:bg-purple-50 rounded-lg transition duration-200"
            >
              {choice}
            </button>
          ))}
        </div>
        <div className="mt-6 text-center text-gray-600">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
}

export default App;