import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { User, Trophy, Settings, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { getSettings, saveSettings } from "../services/settingsService";
import { getUserScores, deleteScore } from "../services/scoreService";

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [userScores, setUserScores] = useState([]);
  const [userSettings, setUserSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newSettings, setNewSettings] = useState({
    difficulty: "medium",
    gridSize: "medium",
    snakeColor: "primary",
    isDefault: false
  });

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Get player name based on user info
        const playerName = user?.firstName 
          ? `${user.firstName} ${user.lastName}`
          : user?.emailAddress?.split('@')[0] || 'Anonymous';
        
        // Fetch user's scores
        const scores = await getUserScores(playerName, { limit: 10 });
        setUserScores(scores);

        // Fetch user's settings
        const settings = await getSettings();
        setUserSettings(settings);
        setNewSettings(settings); // Initialize edit form with current settings
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleDeleteScore = async (scoreId) => {
    if (window.confirm("Are you sure you want to delete this score?")) {
      try {
        await deleteScore(scoreId);
        // Update the displayed scores after deletion
        setUserScores(userScores.filter(score => score.Id !== scoreId));
      } catch (error) {
        console.error("Error deleting score:", error);
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      await saveSettings(newSettings, newSettings.isDefault);
      setUserSettings(newSettings);
      setShowSettingsModal(false);
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-surface-100 dark:bg-surface-800 rounded-2xl p-6 shadow-card mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user?.firstName ? user.firstName[0] : user?.emailAddress?.[0] || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.emailAddress?.split('@')[0] || 'User'}
            </h1>
            <p className="text-surface-600 dark:text-surface-400">{user?.emailAddress || ''}</p>
          </div>
        </div>

        <div className="border-b border-surface-200 dark:border-surface-700 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-3 px-1 font-medium ${
                activeTab === "profile"
                  ? "border-b-2 border-primary text-primary"
                  : "text-surface-600 dark:text-surface-400"
              }`}
            >
              <User size={18} className="inline mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("scores")}
              className={`pb-3 px-1 font-medium ${
                activeTab === "scores"
                  ? "border-b-2 border-primary text-primary"
                  : "text-surface-600 dark:text-surface-400"
              }`}
            >
              <Trophy size={18} className="inline mr-2" />
              Your Scores
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`pb-3 px-1 font-medium ${
                activeTab === "settings"
                  ? "border-b-2 border-primary text-primary"
                  : "text-surface-600 dark:text-surface-400"
              }`}
            >
              <Settings size={18} className="inline mr-2" />
              Game Settings
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-surface-600 dark:text-surface-400">Loading...</p>
          </div>
        ) : (
          <>
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-xl">
                    <h3 className="font-medium mb-3">Account Information</h3>
                    <div className="space-y-2 text-surface-600 dark:text-surface-300">
                      <p><span className="font-medium">Name:</span> {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Not provided'}</p>
                      <p><span className="font-medium">Email:</span> {user?.emailAddress || 'Not provided'}</p>
                      <p><span className="font-medium">Email Verified:</span> {user?.isEmailVerified ? 'Yes' : 'No'}</p>
                      <p><span className="font-medium">Phone:</span> {user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="bg-surface-50 dark:bg-surface-700 p-4 rounded-xl">
                    <h3 className="font-medium mb-3">Game Stats</h3>
                    <div className="space-y-2 text-surface-600 dark:text-surface-300">
                      <p><span className="font-medium">Total Games:</span> {userScores.length}</p>
                      <p><span className="font-medium">Highest Score:</span> {userScores.length > 0 ? Math.max(...userScores.map(s => s.score)) : 0}</p>
                      <p><span className="font-medium">Average Score:</span> {userScores.length > 0 ? Math.round(userScores.reduce((sum, s) => sum + s.score, 0) / userScores.length) : 0}</p>
                      <p><span className="font-medium">Preferred Difficulty:</span> {userSettings?.difficulty || 'Medium'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scores Tab */}
            {activeTab === "scores" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Game History</h2>
                {userScores.length === 0 ? (
                  <div className="text-center py-8 bg-surface-50 dark:bg-surface-700 rounded-xl">
                    <Trophy size={40} className="mx-auto mb-4 text-surface-400" />
                    <p className="text-surface-600 dark:text-surface-400 mb-2">No game scores yet</p>
                    <p className="text-sm text-surface-500 dark:text-surface-500">Play some games to see your scores here!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-surface-200 dark:bg-surface-700">
                          <th className="text-left p-3 rounded-tl-lg">Score</th>
                          <th className="text-left p-3">Difficulty</th>
                          <th className="text-left p-3">Grid Size</th>
                          <th className="text-left p-3">Date</th>
                          <th className="text-right p-3 rounded-tr-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userScores.map((score, index) => (
                          <tr 
                            key={score.Id}
                            className={`${
                              index % 2 === 0 
                                ? 'bg-surface-50 dark:bg-surface-800' 
                                : 'bg-surface-100 dark:bg-surface-750'
                            } hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors`}
                          >
                            <td className="p-3 font-medium">{score.score}</td>
                            <td className="p-3 capitalize">{score.difficulty}</td>
                            <td className="p-3 capitalize">{score.grid_size}</td>
                            <td className="p-3">{format(new Date(score.game_date), 'MMM d, yyyy')}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => handleDeleteScore(score.Id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Game Preferences</h2>
                  <button
                    onClick={() => setShowSettingsModal(true)}
                    className="btn btn-primary btn-sm"
                  >
                    Edit Settings
                  </button>
                </div>

                <div className="bg-surface-50 dark:bg-surface-700 p-5 rounded-xl">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-surface-200 dark:bg-surface-600">
                        <Settings size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-surface-500 dark:text-surface-400">Difficulty</p>
                        <p className="font-medium capitalize">{userSettings?.difficulty || 'Medium'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-surface-200 dark:bg-surface-600">
                        <div className="grid grid-cols-2 gap-1 w-6 h-6">
                          <div className="bg-surface-400 rounded-sm"></div>
                          <div className="bg-surface-400 rounded-sm"></div>
                          <div className="bg-surface-400 rounded-sm"></div>
                          <div className="bg-surface-400 rounded-sm"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500 dark:text-surface-400">Grid Size</p>
                        <p className="font-medium capitalize">{userSettings?.gridSize || 'Medium'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${SNAKE_COLORS[userSettings?.snakeColor || 'primary']}`}>
                        <div className="w-6 h-6"></div>
                      </div>
                      <div>
                        <p className="text-sm text-surface-500 dark:text-surface-400">Snake Color</p>
                        <p className="font-medium capitalize">{userSettings?.snakeColor || 'Primary'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-surface-500 dark:text-surface-400">
                  <p>These settings will be applied when you start a new game.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div 
            className="bg-surface-100 dark:bg-surface-800 p-6 rounded-2xl max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4">Edit Game Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {["easy", "medium", "hard"].map((level) => (
                    <button
                      key={level}
                      className={`py-2 px-3 rounded-lg capitalize ${
                        newSettings.difficulty === level
                          ? "bg-primary text-white"
                          : "bg-surface-200 dark:bg-surface-700"
                      }`}
                      onClick={() => setNewSettings({...newSettings, difficulty: level})}
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
                        newSettings.gridSize === size
                          ? "bg-primary text-white"
                          : "bg-surface-200 dark:bg-surface-700"
                      }`}
                      onClick={() => setNewSettings({...newSettings, gridSize: size})}
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
                        newSettings.snakeColor === colorOption.name
                          ? "ring-2 ring-offset-2 ring-surface-500"
                          : ""
                      }`}
                      onClick={() => setNewSettings({...newSettings, snakeColor: colorOption.name})}
                      aria-label={`Select ${colorOption.name} color`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="default-setting"
                  checked={newSettings.isDefault}
                  onChange={() => setNewSettings({...newSettings, isDefault: !newSettings.isDefault})}
                  className="mr-2"
                />
                <label htmlFor="default-setting">Make these my default settings</label>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="flex-1 btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 btn btn-primary"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Snake colors constant for reference
const SNAKE_COLORS = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  purple: "bg-purple-500"
};

export default Profile;