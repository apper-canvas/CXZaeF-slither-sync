import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setUser, setError } from "../store/userSlice";
import { setupAuthUI, showLogin } from "../services/apperService";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector(state => state.user);

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/");
      return;
    }

    // Setup authentication UI
    const handleLoginSuccess = (user) => {
      dispatch(setUser(user));
      navigate("/");
    };

    const handleLoginError = (error) => {
      console.error("Authentication error:", error);
      dispatch(setError("Failed to authenticate. Please try again."));
    };

    setupAuthUI(handleLoginSuccess, handleLoginError);
    showLogin();

    // Clean up
    return () => {
      dispatch(setError(null));
    };
  }, [dispatch, navigate, isAuthenticated]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto mt-8 mb-16"
    >
      <div className="bg-surface-100 dark:bg-surface-800 rounded-2xl p-8 shadow-card">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome Back
        </h1>
        <p className="text-surface-600 dark:text-surface-400 text-center mb-8">
          Sign in to track your scores and customize your game experience.
        </p>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div id="authentication" className="min-h-[420px] flex items-center justify-center">
          <div className="animate-pulse text-center text-surface-500 dark:text-surface-400">
            Loading authentication...
          </div>
        </div>

        <div className="mt-6 text-center text-surface-500 dark:text-surface-400 text-sm">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-primary hover:underline"
          >
            Sign up
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;