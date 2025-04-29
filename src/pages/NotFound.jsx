import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 15 
        }}
        className="w-24 h-24 mb-6 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center"
      >
        <AlertTriangle size={40} className="text-accent" />
      </motion.div>
      
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        Oops! It seems like the page you're looking for has slithered away.
        Let's get you back to the game.
      </p>
      
      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary flex items-center"
        >
          <Home size={18} className="mr-2" />
          Back to Home
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default NotFound;