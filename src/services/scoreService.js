import { getApperClient } from './apperService';

// Table name for game scores
const SCORE_TABLE = "game_score";

/**
 * Save a new game score to the database
 * @param {Object} scoreData Score data including player name, score, difficulty, grid size, and color
 * @returns {Promise} Promise that resolves to the created score record
 */
export const saveScore = async (scoreData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      record: {
        player_name: scoreData.playerName,
        score: scoreData.score,
        difficulty: scoreData.difficulty,
        grid_size: scoreData.gridSize,
        snake_color: scoreData.snakeColor,
        game_date: new Date().toISOString(),
        Name: `${scoreData.playerName}'s score: ${scoreData.score}`
      }
    };
    
    const response = await apperClient.createRecord(SCORE_TABLE, params);
    return response.data;
  } catch (error) {
    console.error("Error saving score:", error);
    throw error;
  }
};

/**
 * Get high scores with optional filtering and sorting
 * @param {Object} options Options for fetching scores (limit, offset, filters)
 * @returns {Promise} Promise that resolves to an array of score records
 */
export const getHighScores = async (options = {}) => {
  try {
    const apperClient = getApperClient();
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    const difficulty = options.difficulty || null;
    
    const params = {
      fields: ["Id", "Name", "player_name", "score", "difficulty", "grid_size", "snake_color", "game_date"],
      pagingInfo: { limit, offset },
      orderBy: [{ field: "score", direction: "desc" }],
    };
    
    // Add difficulty filter if specified
    if (difficulty) {
      params.filter = {
        logic: "and",
        filters: [
          { field: "difficulty", operator: "eq", value: difficulty }
        ]
      };
    }
    
    const response = await apperClient.fetchRecords(SCORE_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching high scores:", error);
    return [];
  }
};

/**
 * Get user's personal scores
 * @param {String} playerName Player's name to filter scores by
 * @param {Object} options Options for fetching scores (limit, offset)
 * @returns {Promise} Promise that resolves to an array of score records
 */
export const getUserScores = async (playerName, options = {}) => {
  try {
    const apperClient = getApperClient();
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    
    const params = {
      fields: ["Id", "Name", "player_name", "score", "difficulty", "grid_size", "snake_color", "game_date"],
      pagingInfo: { limit, offset },
      orderBy: [{ field: "score", direction: "desc" }],
      filter: {
        logic: "and",
        filters: [
          { field: "player_name", operator: "eq", value: playerName }
        ]
      }
    };
    
    const response = await apperClient.fetchRecords(SCORE_TABLE, params);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user scores:", error);
    return [];
  }
};

/**
 * Delete a game score record
 * @param {Number} scoreId ID of the score to delete
 * @returns {Promise} Promise that resolves when the score is deleted
 */
export const deleteScore = async (scoreId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord(SCORE_TABLE, scoreId);
    return response.data;
  } catch (error) {
    console.error("Error deleting score:", error);
    throw error;
  }
};