import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Trophy } from "lucide-react";

const CELL_SIZE = 20;
const GRID_SIZES = {
  small: { cols: 15, rows: 15 },
  medium: { cols: 20, rows: 20 },
  large: { cols: 25, rows: 25 }
};

const SPEEDS = {
  easy: 200,
  medium: 150,
  hard: 100
};

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

const SNAKE_COLORS = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  purple: "bg-purple-500"
};

const MainFeature = ({ settings, onScoreUpdate }) => {
  const [gameState, setGameState] = useState({
    snake: [{ x: 5, y: 5 }],
    food: { x: 10, y: 10 },
    direction: DIRECTIONS.RIGHT,
    nextDirection: DIRECTIONS.RIGHT,
    isRunning: false,
    gameOver: false,
    score: 0,
    speed: SPEEDS[settings.difficulty]
  });
  
  const [gridSize, setGridSize] = useState(GRID_SIZES[settings.gridSize]);
  const gameLoopRef = useRef(null);
  const canvasRef = useRef(null);
  const touchStartRef = useRef(null);

  // Update settings when they change
  useEffect(() => {
    setGridSize(GRID_SIZES[settings.gridSize]);
    setGameState(prev => ({
      ...prev,
      speed: SPEEDS[settings.difficulty]
    }));
  }, [settings]);

  // Generate random food position
  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * gridSize.cols);
    const y = Math.floor(Math.random() * gridSize.rows);
    
    // Make sure food doesn't appear on snake
    const isOnSnake = gameState.snake.some(segment => segment.x === x && segment.y === y);
    if (isOnSnake) {
      return generateFood();
    }
    
    return { x, y };
  }, [gameState.snake, gridSize]);

  // Initialize game
  const initGame = useCallback(() => {
    // Place snake in the middle of the grid
    const startX = Math.floor(gridSize.cols / 3);
    const startY = Math.floor(gridSize.rows / 2);
    
    setGameState({
      snake: [{ x: startX, y: startY }],
      food: generateFood(),
      direction: DIRECTIONS.RIGHT,
      nextDirection: DIRECTIONS.RIGHT,
      isRunning: false,
      gameOver: false,
      score: 0,
      speed: SPEEDS[settings.difficulty]
    });
  }, [generateFood, gridSize, settings.difficulty]);

  // Initialize game on mount and when grid size changes
  useEffect(() => {
    initGame();
  }, [initGame, gridSize]);

  // Game loop
  useEffect(() => {
    if (!gameState.isRunning || gameState.gameOver) return;

    const moveSnake = () => {
      setGameState(prev => {
        // Update direction
        const direction = prev.nextDirection;
        
        // Calculate new head position
        const head = prev.snake[0];
        const newHead = {
          x: (head.x + direction.x + gridSize.cols) % gridSize.cols,
          y: (head.y + direction.y + gridSize.rows) % gridSize.rows
        };
        
        // Check for collision with self
        const selfCollision = prev.snake.some(segment => 
          segment.x === newHead.x && segment.y === newHead.y
        );
        
        if (selfCollision) {
          return { ...prev, gameOver: true, isRunning: false };
        }
        
        // Create new snake array
        const newSnake = [newHead, ...prev.snake];
        
        // Check if snake ate food
        let newFood = prev.food;
        let newScore = prev.score;
        let newSpeed = prev.speed;
        
        if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
          // Snake ate food, generate new food
          newFood = generateFood();
          newScore += 10;
          
          // Increase speed slightly as score increases
          if (newScore % 50 === 0) {
            newSpeed = Math.max(prev.speed - 10, 50);
          }
        } else {
          // Snake didn't eat food, remove tail
          newSnake.pop();
        }
        
        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          direction,
          score: newScore,
          speed: newSpeed
        };
      });
    };

    gameLoopRef.current = setTimeout(moveSnake, gameState.speed);
    
    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, [gameState.isRunning, gameState.gameOver, gameState.speed, gridSize, generateFood]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState.gameOver) return;
      
      switch (e.key) {
        case "ArrowUp":
          if (gameState.direction !== DIRECTIONS.DOWN) {
            setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.UP }));
          }
          break;
        case "ArrowDown":
          if (gameState.direction !== DIRECTIONS.UP) {
            setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.DOWN }));
          }
          break;
        case "ArrowLeft":
          if (gameState.direction !== DIRECTIONS.RIGHT) {
            setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.LEFT }));
          }
          break;
        case "ArrowRight":
          if (gameState.direction !== DIRECTIONS.LEFT) {
            setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.RIGHT }));
          }
          break;
        case " ":
          // Space bar to pause/resume
          setGameState(prev => ({ ...prev, isRunning: !prev.isRunning }));
          break;
        case "r":
        case "R":
          // R to restart
          initGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState.direction, gameState.gameOver, initGame]);

  // Handle touch controls
  const handleTouchStart = (e) => {
    if (gameState.gameOver) return;
    
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    if (gameState.gameOver || !touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 30 && gameState.direction !== DIRECTIONS.LEFT) {
        setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.RIGHT }));
      } else if (deltaX < -30 && gameState.direction !== DIRECTIONS.RIGHT) {
        setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.LEFT }));
      }
    } else {
      // Vertical swipe
      if (deltaY > 30 && gameState.direction !== DIRECTIONS.UP) {
        setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.DOWN }));
      } else if (deltaY < -30 && gameState.direction !== DIRECTIONS.DOWN) {
        setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.UP }));
      }
    }
    
    touchStartRef.current = null;
  };

  // Handle game over
  useEffect(() => {
    if (gameState.gameOver) {
      onScoreUpdate(gameState.score);
    }
  }, [gameState.gameOver, gameState.score, onScoreUpdate]);

  // Toggle game state
  const toggleGameState = () => {
    if (gameState.gameOver) {
      initGame();
      setGameState(prev => ({ ...prev, isRunning: true }));
    } else {
      setGameState(prev => ({ ...prev, isRunning: !prev.isRunning }));
    }
  };

  // Restart game
  const restartGame = () => {
    initGame();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface-100 dark:bg-surface-800 rounded-2xl p-6 shadow-card"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">Snake Game</h2>
          <p className="text-surface-600 dark:text-surface-400">
            Score: <span className="font-bold text-accent">{gameState.score}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleGameState}
            className="p-2 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
            aria-label={gameState.isRunning ? "Pause game" : "Play game"}
          >
            {gameState.isRunning ? <Pause size={20} /> : <Play size={20} />}
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={restartGame}
            className="p-2 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600"
            aria-label="Restart game"
          >
            <RotateCcw size={20} />
          </motion.button>
        </div>
      </div>
      
      <div 
        ref={canvasRef}
        className="relative overflow-hidden rounded-xl border-2 border-surface-300 dark:border-surface-700"
        style={{
          width: gridSize.cols * CELL_SIZE,
          height: gridSize.rows * CELL_SIZE,
          maxWidth: "100%",
          aspectRatio: `${gridSize.cols} / ${gridSize.rows}`,
          touchAction: "none"
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Game board */}
        <div 
          className="absolute inset-0 grid bg-surface-200 dark:bg-surface-800"
          style={{
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`
          }}
        >
          {/* Render grid cells for visual reference */}
          {Array.from({ length: gridSize.cols * gridSize.rows }).map((_, index) => (
            <div 
              key={index}
              className="border border-surface-300/20 dark:border-surface-700/20"
            />
          ))}
        </div>
        
        {/* Snake */}
        {gameState.snake.map((segment, index) => (
          <motion.div
            key={`snake-${index}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.1 }}
            className={`absolute rounded-sm ${SNAKE_COLORS[settings.snakeColor]} ${index === 0 ? "rounded-md" : ""}`}
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE + 1,
              top: segment.y * CELL_SIZE + 1,
              zIndex: gameState.snake.length - index
            }}
          />
        ))}
        
        {/* Food */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ 
            scale: [0.8, 1, 0.8],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute bg-accent rounded-full"
          style={{
            width: CELL_SIZE - 6,
            height: CELL_SIZE - 6,
            left: gameState.food.x * CELL_SIZE + 3,
            top: gameState.food.y * CELL_SIZE + 3,
            zIndex: 1
          }}
        />
        
        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameState.gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface-900/80 flex flex-col items-center justify-center z-10"
            >
              <motion.div
                initial={{ scale: 0.8, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                className="text-center p-4"
              >
                <Trophy size={40} className="mx-auto mb-2 text-accent" />
                <h3 className="text-xl font-bold text-white mb-1">Game Over!</h3>
                <p className="text-surface-300 mb-4">Your score: <span className="text-accent font-bold">{gameState.score}</span></p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    initGame();
                    setGameState(prev => ({ ...prev, isRunning: true }));
                  }}
                  className="btn btn-primary"
                >
                  Play Again
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Start Game Overlay */}
        <AnimatePresence>
          {!gameState.isRunning && !gameState.gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-surface-900/70 flex items-center justify-center z-10"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setGameState(prev => ({ ...prev, isRunning: true }))}
                className="bg-primary hover:bg-primary-dark text-white rounded-full p-6 shadow-lg"
              >
                <Play size={40} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Mobile Controls */}
      <div className="mt-6 md:hidden">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-start-2">
            <button
              className="w-full p-4 rounded-lg bg-surface-200 dark:bg-surface-700 active:bg-surface-300 dark:active:bg-surface-600"
              onTouchStart={() => {
                if (gameState.direction !== DIRECTIONS.DOWN) {
                  setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.UP }));
                }
              }}
            >
              ↑
            </button>
          </div>
          <div className="col-start-1 row-start-2">
            <button
              className="w-full p-4 rounded-lg bg-surface-200 dark:bg-surface-700 active:bg-surface-300 dark:active:bg-surface-600"
              onTouchStart={() => {
                if (gameState.direction !== DIRECTIONS.RIGHT) {
                  setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.LEFT }));
                }
              }}
            >
              ←
            </button>
          </div>
          <div className="col-start-3 row-start-2">
            <button
              className="w-full p-4 rounded-lg bg-surface-200 dark:bg-surface-700 active:bg-surface-300 dark:active:bg-surface-600"
              onTouchStart={() => {
                if (gameState.direction !== DIRECTIONS.LEFT) {
                  setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.RIGHT }));
                }
              }}
            >
              →
            </button>
          </div>
          <div className="col-start-2 row-start-3">
            <button
              className="w-full p-4 rounded-lg bg-surface-200 dark:bg-surface-700 active:bg-surface-300 dark:active:bg-surface-600"
              onTouchStart={() => {
                if (gameState.direction !== DIRECTIONS.UP) {
                  setGameState(prev => ({ ...prev, nextDirection: DIRECTIONS.DOWN }));
                }
              }}
            >
              ↓
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-surface-500 dark:text-surface-400">
        <p>Use arrow keys to control the snake. Press space to pause/resume.</p>
        <p>Difficulty: <span className="capitalize">{settings.difficulty}</span> | Grid: <span className="capitalize">{settings.gridSize}</span></p>
      </div>
    </motion.div>
  );
};

export default MainFeature;