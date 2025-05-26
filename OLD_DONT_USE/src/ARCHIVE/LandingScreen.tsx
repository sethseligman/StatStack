import React from 'react';

/** @jsxImportSource react */
interface GameOption {
  title: string;
  description: string;
  path: string;
  color: string;
}

const GAME_OPTIONS: GameOption[] = [
  {
    title: "NFL QB Challenge",
    description: "Test your NFL knowledge by naming quarterbacks for each team. Each QB can only be used once, and you'll get points based on their career wins.",
    path: "/game",
    color: "blue"
  },
  {
    title: "NBA Scorer Challenge",
    description: "Name the highest scoring players for each NBA team. Each player can only be used once, and you'll get points based on their career points.",
    path: "/nba",
    color: "orange"
  },
  {
    title: "MLB Pitcher Challenge",
    description: "Name the best pitchers for each MLB team. Each pitcher can only be used once, and you'll get points based on their career wins.",
    path: "/mlb",
    color: "green"
  }
];

const LandingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-blue-500 mb-12">StatStack</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAME_OPTIONS.map((option, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => window.location.href = option.path}
            >
              <h2 className={`text-2xl font-bold text-${option.color}-500 mb-4`}>
                {option.title}
              </h2>
              <p className="text-gray-300 mb-6">
                {option.description}
              </p>
              <button
                className={`w-full bg-${option.color}-600 hover:bg-${option.color}-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium`}
              >
                Play Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingScreen; 