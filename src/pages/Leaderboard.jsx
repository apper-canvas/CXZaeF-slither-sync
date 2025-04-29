import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Calendar, Medal } from "lucide-react";
import { format } from "date-fns";
import { getHighScores } from "../services/scoreService";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchScores();
  }, [selectedDifficulty, page]);

  const fetchScores = async () => {
    setIsLoading(true);
    try {
      const options = {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      };

      // Only add difficulty filter if not showing all difficulties
      if (selectedDifficulty !== "all") {
        options.difficulty = selectedDifficulty;
      }

      const data = await getHighScores(options);
      setScores(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get medal color based on position
  const getMedalColor = (index) => {
    const position = index + 1 + (page - 1) * pageSize;
    if (position === 1) return "text-yellow-500";
    if (position === 2) return "text-gray-400";
    if (position === 3) return "text-amber-700";
    return "text-surface-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-surface-100 dark:bg-surface-800 rounded-2xl p-6 shadow-card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Trophy size={24} className="mr-2 text-yellow-500" />
              Leaderboard
            </h1>
            <p className="text-surface-600 dark:text-surface-400">
              See who's leading in SlitherSync
            </p>
          </div>

          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 bg-surface-200 dark:bg-surface-700 rounded-lg"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-16 text-center">
            <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-surface-600 dark:text-surface-400">Loading leaderboard...</p>
          </div>
        ) : scores.length === 0 ? (
          <div className="text-center py-16 bg-surface-50 dark:bg-surface-700 rounded-xl">
            <Trophy size={48} className="mx-auto mb-4 text-surface-400" />
            <p className="text-surface-600 dark:text-surface-400 mb-2">No scores yet</p>
            <p className="text-sm text-surface-500 dark:text-surface-500">
              Be the first to make it to the leaderboard!
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-200 dark:bg-surface-700">
                    <th className="text-left p-3 rounded-tl-lg">Rank</th>
                    <th className="text-left p-3">Player</th>
                    <th className="text-right p-3">Score</th>
                    <th className="p-3">Difficulty</th>
                    <th className="p-3">Grid Size</th>
                    <th className="text-right p-3 rounded-tr-lg">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <motion.tr
                      key={score.Id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`${
                        index % 2 === 0
                          ? "bg-surface-50 dark:bg-surface-800"
                          : "bg-surface-100 dark:bg-surface-750"
                      }`}
                    >
                      <td className="p-3">
                        <div className="flex items-center">
                          <Medal size={18} className={`mr-2 ${getMedalColor(index)}`} />
                          <span>{(page - 1) * pageSize + index + 1}</span>
                        </div>
                      </td>
                      <td className="p-3 font-medium">{score.player_name}</td>
                      <td className="p-3 text-right font-bold text-accent">{score.score}</td>
                      <td className="p-3 capitalize text-center">{score.difficulty}</td>
                      <td className="p-3 capitalize text-center">{score.grid_size}</td>
                      <td className="p-3 text-right">
                        {format(new Date(score.game_date), "MMM d, yyyy")}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${
                  page === 1
                    ? "bg-surface-200 dark:bg-surface-700 text-surface-400 cursor-not-allowed"
                    : "bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
                }`}
              >
                Previous
              </button>
              <span className="text-surface-600 dark:text-surface-400">
                Page {page}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={scores.length < pageSize}
                className={`px-4 py-2 rounded-lg ${
                  scores.length < pageSize
                    ? "bg-surface-200 dark:bg-surface-700 text-surface-400 cursor-not-allowed"
                    : "bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 bg-surface-100 dark:bg-surface-800 rounded-2xl p-6 shadow-card">
        <h2 className="text-xl font-bold mb-4">How Scoring Works</h2>
        <div className="text-surface-600 dark:text-surface-400">
          <p className="mb-2">
            Each food item is worth 10 points. The game gets progressively faster as your snake grows longer.
          </p>
          <p className="mb-2">
            <span className="font-medium">Difficulty levels:</span>
          </p>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-1">
            <li><span className="font-medium">Easy:</span> Slower snake speed, ideal for beginners</li>
            <li><span className="font-medium">Medium:</span> Balanced speed, good for regular players</li>
            <li><span className="font-medium">Hard:</span> Fastest snake, greatest challenge</li>
          </ul>
          <p>
            <span className="font-medium">Grid sizes:</span> Larger grids provide more space but require more precision to collect food items.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;