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
  sleepUsed 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="flex justify-between items-center">
        {/* Level Info */}
        <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <span className="text-white font-display text-lg">LEVEL {level}</span>
        </div>

        {/* Timer */}
        <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
          <span className="text-white font-mono text-lg">{formatTime(timer)}</span>
        </div>

        {/* Controls */}
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
      </div>
    </div>
  );
};

export default GameHUD;