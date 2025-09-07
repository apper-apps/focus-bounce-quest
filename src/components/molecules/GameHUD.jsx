import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const GameHUD = ({ 
  level, 
  timer, 
  canSleep, 
  onPause, 
  onSleep, 
  sleepUsed,
  deaths = 0,
  score = 0 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
<div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="flex justify-between items-start">
        {/* Left Side - Level & Stats */}
<div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            <ApperIcon name="Target" size={16} className="text-primary" />
            <span className="text-white font-display text-lg">LEVEL {level}</span>
          </div>
          
          {(score > 0 || deaths > 0) && (
            <div className="bg-black/40 backdrop-blur-sm rounded-xl px-3 py-1 border border-white/20 text-sm">
              {score > 0 && <span className="text-yellow-400">Score: {score}</span>}
              {deaths > 0 && score > 0 && <span className="text-white mx-2">•</span>}
              {deaths > 0 && <span className="text-red-400">Deaths: {deaths}</span>}
            </div>
          )}
        </div>

        {/* Center - Timer */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/20">
          <div className="text-center">
            <div className="text-white font-mono text-2xl font-bold">{formatTime(timer)}</div>
            <div className="text-slate-300 text-xs uppercase tracking-wide">Time</div>
          </div>
        </div>
{/* Right Side - Controls */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
          {/* Sleep Button */}
          <motion.button
            onClick={onSleep}
            disabled={sleepUsed || !canSleep}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              sleepUsed || !canSleep
                ? "bg-gray-600/50 border-gray-500 cursor-not-allowed"
                : "bg-purple-600/70 border-purple-400 hover:bg-purple-500/80 hover:scale-105 active:scale-95"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon 
              name="Moon" 
              size={20} 
              className={sleepUsed ? "text-gray-400" : "text-white"} 
            />
          </motion.button>

          {/* Pause Button */}
          <Button
            variant="ghost"
            size="small"
            onClick={onPause}
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20"
          >
            <ApperIcon name="Pause" size={20} />
</Button>
          </div>
          
          {/* Help Text */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 text-xs text-slate-300 max-w-48">
            <div className="flex items-center gap-2 mb-1">
              <ApperIcon name="MousePointer" size={12} />
              <span>Click/SPACE to jump</span>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Moon" size={12} />
              <span>S for sleep ability</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;