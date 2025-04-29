import { useNavigate } from "react-router-dom";
import { LogIn, User, Trophy, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { clearUser } from "../store/userSlice";
import { logout } from "../services/apperService";

const Navbar = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/leaderboard")}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-200 dark:bg-surface-800 hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors"
      >
        <Trophy size={16} />
        <span className="hidden sm:inline">Leaderboard</span>
      </motion.button>

      {isAuthenticated ? (
        <>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/profile")}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-200 dark:bg-surface-800 hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors"
          >
            <User size={16} />
            <span className="hidden sm:inline">Profile</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-200 dark:bg-surface-800 hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </motion.button>
        </>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/login")}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-200 dark:bg-surface-800 hover:bg-surface-300 dark:hover:bg-surface-700 transition-colors"
        >
          <LogIn size={16} />
          <span className="hidden sm:inline">Login</span>
        </motion.button>
      )}
    </nav>
  );
};

export default Navbar;