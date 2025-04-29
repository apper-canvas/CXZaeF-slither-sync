import { getApperClient } from './apperService';

// Table name for game settings
const SETTINGS_TABLE = "game_settings";

/**
 * Save user game settings to the database
 * @param {Object} settingsData Settings data including difficulty, grid size, and snake color
 * @param {Boolean} isDefault Whether these settings should be marked as default
 * @returns {Promise} Promise that resolves to the created settings record
 */
export const saveSettings = async (settingsData, isDefault = false) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      record: {
        difficulty: settingsData.difficulty,
        grid_size: settingsData.gridSize,
        snake_color: settingsData.snakeColor,
        default_setting: isDefault,
        Name: `${settingsData.difficulty}-${settingsData.gridSize}-${settingsData.snakeColor}`
      }
    };
    
    const response = await apperClient.createRecord(SETTINGS_TABLE, params);
    return response.data;
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
};

/**
 * Get user's saved game settings
 * @param {Boolean} defaultOnly Whether to fetch only default settings
 * @returns {Promise} Promise that resolves to the settings record or default settings if not found
 */
export const getSettings = async (defaultOnly = false) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: ["Id", "Name", "difficulty", "grid_size", "snake_color", "default_setting"],
      pagingInfo: { limit: 1, offset: 0 },
      orderBy: [{ field: "ModifiedOn", direction: "desc" }],
    };
    
    if (defaultOnly) {
      params.filter = {
        logic: "and",
        filters: [
          { field: "default_setting", operator: "eq", value: true }
        ]
      };
    }
    
    const response = await apperClient.fetchRecords(SETTINGS_TABLE, params);
    
    if (response.data && response.data.length > 0) {
      return {
        difficulty: response.data[0].difficulty,
        gridSize: response.data[0].grid_size,
        snakeColor: response.data[0].snake_color,
        isDefault: response.data[0].default_setting
      };
    }
    
    // Return default settings if no saved settings found
    return {
      difficulty: "medium",
      gridSize: "medium",
      snakeColor: "primary",
      isDefault: false
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    
    // Return default settings on error
    return {
      difficulty: "medium",
      gridSize: "medium",
      snakeColor: "primary",
      isDefault: false
    };
  }
};

/**
 * Update existing game settings
 * @param {Number} settingsId ID of the settings record to update
 * @param {Object} settingsData New settings data
 * @returns {Promise} Promise that resolves to the updated settings record
 */
export const updateSettings = async (settingsId, settingsData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      record: {
        difficulty: settingsData.difficulty,
        grid_size: settingsData.gridSize,
        snake_color: settingsData.snakeColor,
        default_setting: settingsData.isDefault || false,
        Name: `${settingsData.difficulty}-${settingsData.gridSize}-${settingsData.snakeColor}`
      }
    };
    
    const response = await apperClient.updateRecord(SETTINGS_TABLE, settingsId, params);
    return response.data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

/**
 * Delete game settings record
 * @param {Number} settingsId ID of the settings to delete
 * @returns {Promise} Promise that resolves when the settings are deleted
 */
export const deleteSettings = async (settingsId) => {
  try {
    const apperClient = getApperClient();
    const response = await apperClient.deleteRecord(SETTINGS_TABLE, settingsId);
    return response.data;
  } catch (error) {
    console.error("Error deleting settings:", error);
    throw error;
  }
};