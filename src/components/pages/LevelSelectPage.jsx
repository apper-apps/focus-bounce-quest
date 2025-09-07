import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import LevelCard from "@/components/molecules/LevelCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { levelService } from "@/services/api/levelService";
import { progressService } from "@/services/api/progressService";

const LevelSelectPage = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [levelsData, progressData] = await Promise.all([
        levelService.getAll(),
        progressService.getAll()
      ]);
      
      setLevels(levelsData);
      setProgress(progressData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getProgressForLevel = (levelId) => {
    return progress.find(p => p.levelId === levelId);
  };

  const isLevelUnlocked = (levelId) => {
    if (levelId === 1) return true;
    const prevProgress = getProgressForLevel(levelId - 1);
    return prevProgress?.stars > 0;
  };

  const handleLevelClick = (levelId) => {
    if (isLevelUnlocked(levelId)) {
      navigate(`/game/${levelId}`);
    }
  };

  if (loading) {
    return <Loading message="Loading levels..." />;
  }

  if (error) {
    return (
      <Error
        message={error}
        onRetry={loadData}
        retryLabel="Reload Levels"
      />
    );
  }

  const totalStars = progress.reduce((sum, p) => sum + (p.stars || 0), 0);
  const maxStars = levels.length * 3;

  return (
    <div className="h-full w-full overflow-y-auto text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ApperIcon name="ArrowLeft" size={20} />
            Back to Menu
          </Button>

          <div className="text-center">
            <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Level Select
            </h1>
            <p className="text-slate-400 mt-2">
              Stars: {totalStars} / {maxStars}
            </p>
          </div>

          <div className="w-24" /> {/* Spacer for balance */}
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="bg-surface/50 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${(totalStars / maxStars) * 100}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-400">
            <span>Progress</span>
            <span>{Math.round((totalStars / maxStars) * 100)}%</span>
          </div>
        </div>

        {/* Level Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {levels.map((level, index) => (
            <motion.div
              key={level.Id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                type: "spring",
                stiffness: 200 
              }}
            >
              <LevelCard
                level={level}
                progress={getProgressForLevel(level.Id)}
                onClick={() => handleLevelClick(level.Id)}
                locked={!isLevelUnlocked(level.Id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Tips */}
        <motion.div
          className="mt-16 bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ApperIcon name="Lightbulb" size={24} className="text-yellow-400" />
            Pro Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300">
            <div>
              <p className="flex items-start gap-2">
                <ApperIcon name="Zap" size={16} className="text-primary mt-1" />
                Time your jumps perfectly to avoid obstacles
              </p>
            </div>
            <div>
              <p className="flex items-start gap-2">
                <ApperIcon name="Moon" size={16} className="text-purple-400 mt-1" />
                Use sleep ability strategically - you only get one per level
              </p>
            </div>
            <div>
              <p className="flex items-start gap-2">
                <ApperIcon name="Star" size={16} className="text-yellow-400 mt-1" />
                Complete levels quickly for more stars
              </p>
            </div>
            <div>
              <p className="flex items-start gap-2">
                <ApperIcon name="Target" size={16} className="text-secondary mt-1" />
                Reach the glowing portal to complete each level
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LevelSelectPage;