import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import GameCanvas from "@/components/molecules/GameCanvas";
import GameHUD from "@/components/molecules/GameHUD";
import Button from "@/components/atoms/Button";
import Star from "@/components/atoms/Star";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { levelService } from "@/services/api/levelService";
import { progressService } from "@/services/api/progressService";

const GamePage = () => {
  const navigate = useNavigate();
  const { levelId } = useParams();
  const [level, setLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controlsRef = useRef({});
  const [startTime] = useState(Date.now());
  const [timer, setTimer] = useState(0);

  const [gameState, setGameState] = useState({
    status: "playing", // playing, paused, completed, failed
    sleepUsed: false,
    deaths: 0,
    score: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null); // pause, complete, failed

  // Load level data
  const loadLevel = async () => {
    try {
      setLoading(true);
      setError(null);
      const levelData = await levelService.getById(parseInt(levelId));
      setLevel(levelData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLevel();
  }, [levelId]);

  // Game timer
  useEffect(() => {
    let interval;
    if (gameState.status === "playing") {
      interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.status, startTime]);

  // Input handling
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameState.status !== "playing") return;
      
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        controlsRef.current.jump?.();
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        controlsRef.current.sleep?.();
      } else if (e.key === "Escape") {
        handlePause();
      }
    };

    const handleTouchStart = (e) => {
      if (gameState.status !== "playing") return;
      e.preventDefault();
      
      // Touch anywhere to jump
      controlsRef.current.jump?.();
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("touchstart", handleTouchStart);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [gameState.status]);

  const handlePause = () => {
    if (gameState.status === "playing") {
      setGameState(prev => ({ ...prev, status: "paused" }));
      setModalType("pause");
      setShowModal(true);
    }
  };

  const handleResume = () => {
    setGameState(prev => ({ ...prev, status: "playing" }));
    setShowModal(false);
  };

  const handleSleep = () => {
    if (!gameState.sleepUsed) {
      setGameState(prev => ({ ...prev, sleepUsed: true }));
      controlsRef.current.sleep?.();
      toast.info("💤 Sleep activated! Temporary invulnerability");
    }
  };

  const handleJump = () => {
    // Just for sound effect or particle feedback
    controlsRef.current.jump?.();
  };

  const handleLevelComplete = () => {
    const completionTime = timer;
    const stars = calculateStars(completionTime);
    
    setGameState(prev => ({ ...prev, status: "completed", score: stars }));
    setModalType("complete");
    setShowModal(true);

    // Save progress
    progressService.updateProgress(parseInt(levelId), {
      stars,
      bestTime: completionTime,
      unlocked: true,
      attempts: 1,
    });

    toast.success(`🎉 Level Complete! ${stars} stars earned!`);
  };

  const handleGameOver = () => {
    setGameState(prev => ({ 
      ...prev, 
      status: "failed", 
      deaths: prev.deaths + 1 
    }));
    setModalType("failed");
    setShowModal(true);
    toast.error("💥 Game Over! Try again!");
  };

  const calculateStars = (time) => {
    if (!level?.parTime) return 1;
    
    if (time <= level.parTime) return 3;
    if (time <= level.parTime * 1.5) return 2;
    return 1;
  };

  const handleRestart = () => {
    setGameState({
      status: "playing",
      sleepUsed: false,
      deaths: 0,
      score: 0,
    });
    setShowModal(false);
    // Game canvas will reset automatically
  };

  const handleNextLevel = () => {
    const nextLevel = parseInt(levelId) + 1;
    if (nextLevel <= 20) {
      navigate(`/game/${nextLevel}`);
    } else {
      navigate("/levels");
    }
  };

  const handleBackToMenu = () => {
    navigate("/");
  };

  if (loading) {
    return <Loading message="Loading level..." />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadLevel}
        retryLabel="Retry Level"
      />
    );
  }

  if (!level) {
    return (
      <Error
        message="Level not found"
        onRetry={() => navigate("/levels")}
        retryLabel="Back to Levels"
      />
    );
  }

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Game HUD */}
      <GameHUD
        level={parseInt(levelId)}
        timer={timer}
        canSleep={!gameState.sleepUsed}
        sleepUsed={gameState.sleepUsed}
        onPause={handlePause}
        onSleep={handleSleep}
      />

      {/* Game Canvas */}
      <GameCanvas
        level={level}
        gameState={gameState}
        onLevelComplete={handleLevelComplete}
        onGameOver={handleGameOver}
        onSleepUsed={() => setGameState(prev => ({ ...prev, sleepUsed: true }))}
        onJump={handleJump}
        controls={controlsRef.current}
      />

      {/* Mobile Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 md:hidden">
        <motion.button
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSleep();
          }}
          disabled={gameState.sleepUsed || gameState.status !== "playing"}
          className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            gameState.sleepUsed || gameState.status !== "playing"
              ? "bg-gray-600/50 border-gray-500 cursor-not-allowed"
              : "bg-purple-600/70 border-purple-400 active:scale-95"
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <ApperIcon 
            name="Moon" 
            size={24} 
            className={gameState.sleepUsed ? "text-gray-400" : "text-white"} 
          />
        </motion.button>
      </div>

      {/* Game Modals */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-br from-surface to-slate-700 rounded-xl p-8 max-w-md w-full border border-white/20 text-white text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
            >
              {modalType === "pause" && (
                <>
                  <h2 className="text-2xl font-display font-bold mb-6">Game Paused</h2>
                  <div className="space-y-4">
                    <Button onClick={handleResume} className="w-full">
                      Resume Game
                    </Button>
                    <Button variant="secondary" onClick={handleRestart} className="w-full">
                      Restart Level
                    </Button>
                    <Button variant="ghost" onClick={handleBackToMenu} className="w-full">
                      Back to Menu
                    </Button>
                  </div>
                </>
              )}

              {modalType === "complete" && (
                <>
                  <motion.div
                    className="mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="Trophy" size={32} className="text-white" />
                    </div>
                  </motion.div>

                  <h2 className="text-2xl font-display font-bold mb-4">Level Complete!</h2>
                  
                  <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3].map((star) => (
                      <Star 
                        key={star} 
                        filled={star <= gameState.score} 
                        index={star - 1} 
                      />
                    ))}
                  </div>

                  <p className="text-slate-300 mb-6">
                    Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
                  </p>

                  <div className="space-y-4">
                    {parseInt(levelId) < 20 && (
                      <Button onClick={handleNextLevel} className="w-full">
                        <ApperIcon name="ChevronRight" size={16} className="mr-2" />
                        Next Level
                      </Button>
                    )}
                    <Button variant="secondary" onClick={() => navigate("/levels")} className="w-full">
                      Level Select
                    </Button>
                    <Button variant="ghost" onClick={handleBackToMenu} className="w-full">
                      Main Menu
                    </Button>
                  </div>
                </>
              )}

              {modalType === "failed" && (
                <>
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-accent to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="RotateCcw" size={32} className="text-white" />
                    </div>
                  </div>

                  <h2 className="text-2xl font-display font-bold mb-4">Try Again</h2>
                  <p className="text-slate-300 mb-6">Don't give up! Every great adventurer faces challenges.</p>

                  <div className="space-y-4">
                    <Button onClick={handleRestart} className="w-full">
                      <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                      Restart Level
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/levels")} className="w-full">
                      Level Select
                    </Button>
                    <Button variant="ghost" onClick={handleBackToMenu} className="w-full">
                      Main Menu
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions Overlay (for first few seconds) */}
      <AnimatePresence>
        {timer < 3 && gameState.status === "playing" && (
          <motion.div
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center text-white z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
              <p className="font-medium mb-1">TAP or SPACE to Jump</p>
              <p className="text-sm text-slate-300">Reach the glowing portal!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GamePage;