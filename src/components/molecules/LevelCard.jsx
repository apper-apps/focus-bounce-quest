import React from "react";
import { motion } from "framer-motion";
import Star from "@/components/atoms/Star";

const LevelCard = ({ level, progress, onClick, locked = false }) => {
  const stars = progress?.stars || 0;
  const bestTime = progress?.bestTime;

  return (
    <motion.button
      onClick={locked ? undefined : onClick}
      className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
        locked
          ? "bg-surface/30 border-slate-600 cursor-not-allowed opacity-50"
          : "bg-gradient-to-br from-surface to-slate-700 border-slate-500 hover:border-primary hover:scale-105 hover:shadow-lg"
      }`}
      whileHover={!locked ? { y: -2 } : {}}
      whileTap={!locked ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Level Number */}
      <div className="text-center mb-3">
        <h3 className={`font-display text-2xl ${locked ? "text-gray-400" : "text-white"}`}>
          {level.id}
        </h3>
      </div>

      {/* Stars */}
      {!locked && (
        <div className="flex justify-center gap-1 mb-2">
          {[1, 2, 3].map((star) => (
            <Star key={star} filled={star <= stars} index={star - 1} />
          ))}
        </div>
      )}

      {/* Best Time */}
      {bestTime && !locked && (
        <div className="text-xs text-slate-300 text-center">
          Best: {Math.floor(bestTime / 60)}:{(bestTime % 60).toString().padStart(2, "0")}
        </div>
      )}

      {/* Lock Icon */}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-lg">🔒</span>
          </div>
        </div>
      )}
    </motion.button>
  );
};

export default LevelCard;