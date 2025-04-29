/**
 * Service for Apper SDK initialization and common operations
 */

// Canvas ID for the application
const CANVAS_ID = "ab97052d563047538843e4893391422b";

/**
 * Initialize the ApperClient with the Canvas ID
 * @returns {Object} ApperClient instance
 */
export const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient(CANVAS_ID);
};

/**
 * Get the ApperUI for authentication
 * @returns {Object} ApperUI instance
 */
export const getApperUI = () => {
  const { ApperUI } = window.ApperSDK;
  return ApperUI;
};

/**
 * Set up ApperUI for authentication
 * @param {Function} onSuccess Callback for successful authentication
 * @param {Function} onError Callback for authentication error
 * @param {String} elementId DOM element ID to render the auth UI
 * @param {String} view Authentication view (login, signup, or both)
 */
export const setupAuthUI = (onSuccess, onError, elementId = "authentication", view = "both") => {
  const { ApperUI } = window.ApperSDK;
  const apperClient = getApperClient();
  
  ApperUI.setup(apperClient, {
    target: `#${elementId}`,
    clientId: CANVAS_ID,
    view,
    onSuccess: onSuccess,
    onError: onError
  });
};

/**
 * Show login UI
 * @param {String} elementId DOM element ID to render the login UI
 */
export const showLogin = (elementId = "authentication") => {
  const { ApperUI } = window.ApperSDK;
  ApperUI.showLogin(`#${elementId}`);
};

/**
 * Show signup UI
 * @param {String} elementId DOM element ID to render the signup UI
 */
export const showSignup = (elementId = "authentication") => {
  const { ApperUI } = window.ApperSDK;
  ApperUI.showSignup(`#${elementId}`);
};

/**
 * Logout user and clear session
 */
export const logout = () => {
  const apperClient = getApperClient();
  return apperClient.logout();
};