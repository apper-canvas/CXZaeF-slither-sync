import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Info, Settings } from "lucide-react";
import MainFeature from "../components/MainFeature";

const Home = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [highScores, setHighScores] = useState([
    { name: "Player1", score: 120 },
    { name: "Player2", score: 95 },
    { name: "Player3", score: 87 },
  ]);
  
  const [gameSettings, setGameSettings] = useState({
    difficulty: "medium",
    gridSize: "medium",
    snakeColor: "primary",
  });

  const handleScoreUpdate = (newScore) => {
    // Only update high scores if the new score is higher than existing ones
    if (newScore > 0) {
      const playerName = prompt("New high score! Enter your name:", "Player");
      if (playerName) {
        const updatedScores = [...highScores, { name: playerName, score: newScore }]
          .sort((a, b) => b.score - a.score)
          .slice(0, 5); // Keep only top 5
        
        setHighScores(updatedScores);
      }
    }
  };

  const updateSettings = (newSettings) => {
    setGameSettings({ ...gameSettings, ...newSettings });
    setShowSettings(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          SlitherSync
        </h1>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          A modern take on the classic snake game. Navigate your snake, collect food, and avoid collisions!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MainFeature 
            settings={gameSettings} 
            onScoreUpdate={handleScoreUpdate} 
          />
        </div>

        <div className="space-y-6">
          {/* Game Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-surface-100 dark:bg-surface-800 p-4 rounded-2xl shadow-card"
          >
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <Settings size={20} className="mr-2 text-primary" />
              Game Controls
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-surface-600 dark:text-surface-400">Arrow Keys</span>
                <span>Move Snake</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600 dark:text-surface-400">Space</span>
                <span>Pause/Resume</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-600 dark:text-surface-400">R</span>
                <span>Restart Game</span>
              </div>
            </div>
            
            <button
              onClick={() => setShowSettings(true)}
              className="mt-4 w-full btn btn-outline"
            >
              Game Settings
            </button>
          </motion.div>

          {/* High Scores */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-surface-100 dark:bg-surface-800 p-4 rounded-2xl shadow-card"
          >
            <h2 className="text-xl font-bold mb-3 flex items-center">
              <Trophy size={20} className="mr-2 text-accent" />
              High Scores
            </h2>
            <div className="space-y-2">
              {highScores.map((score, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2 rounded-lg bg-surface-200 dark:bg-surface-700"
                >
                  <span className="font-medium">{score.name}</span>
                  <span className="text-accent font-bold">{score.score}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Game Info Button */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => setShowInfo(true)}
            className="w-full btn btn-outline flex items-center justify-center"
          >
            <Info size={18} className="mr-2" />
            How to Play
          </motion.button>
        </div>
      </div>

      {/* Game Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInfo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface-100 dark:bg-surface-800 p-6 rounded-2xl max-w-md w-full shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">How to Play SlitherSync</h2>
              <div className="space-y-3 text-surface-700 dark:text-surface-300">
                <p>1. Use arrow keys to control your snake's direction.</p>
                <p>2. Eat the food to grow longer and increase your score.</p>
                <p>3. Avoid hitting the walls or your own body.</p>
                <p>4. The game gets faster as your snake grows longer.</p>
                <p>5. Press Space to pause/resume the game.</p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="mt-6 w-full btn btn-primary"
              >
                Got it!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface-100 dark:bg-surface-800 p-6 rounded-2xl max-w-md w-full shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Game Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium">Difficulty</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["easy", "medium", "hard"].map((level) => (
                      <button
                        key={level}
                        className={`py-2 px-3 rounded-lg capitalize ${
                          gameSettings.difficulty === level
                            ? "bg-primary text-white"
                            : "bg-surface-200 dark:bg-surface-700"
                        }`}
                        onClick={() => updateSettings({ difficulty: level })}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Grid Size</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["small", "medium", "large"].map((size) => (
                      <button
                        key={size}
                        className={`py-2 px-3 rounded-lg capitalize ${
                          gameSettings.gridSize === size
                            ? "bg-primary text-white"
                            : "bg-surface-200 dark:bg-surface-700"
                        }`}
                        onClick={() => updateSettings({ gridSize: size })}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium">Snake Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: "primary", color: "bg-primary" },
                      { name: "secondary", color: "bg-secondary" },
                      { name: "accent", color: "bg-accent" },
                      { name: "purple", color: "bg-purple-500" }
                    ].map((colorOption) => (
                      <button
                        key={colorOption.name}
                        className={`h-10 rounded-lg ${colorOption.color} ${
                          gameSettings.snakeColor === colorOption.name
                            ? "ring-2 ring-offset-2 ring-surface-500"
                            : ""
                        }`}
                        onClick={() => updateSettings({ snakeColor: colorOption.name })}
                        aria-label={`Select ${colorOption.name} color`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateSettings(gameSettings)}
                  className="flex-1 btn btn-primary"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;