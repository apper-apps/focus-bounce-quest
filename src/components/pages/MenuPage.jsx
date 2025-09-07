import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Ball from "@/components/atoms/Ball";
import ApperIcon from "@/components/ApperIcon";

const MenuPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.6, 0.1],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl px-8">
        {/* Animated Title Ball */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            duration: 1 
          }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            }}
          >
            <Ball position={{ x: 0, y: 0 }} size={80} className="relative" />
          </motion.div>
        </motion.div>

        {/* Game Title */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-4"
        >
          <h1 className="font-display text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            BOUNCEQUEST
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium">
            The Rolling Odyssey
          </p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Guide your sentient ball through 20 challenging levels. Jump over obstacles, 
          use your sleep power wisely, and reach the glowing portal to victory!
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Button
            onClick={() => navigate("/game/1")}
            size="large"
            className="flex items-center gap-3"
          >
            <ApperIcon name="Play" size={20} />
            Start Adventure
          </Button>

          <Button
            variant="secondary"
            onClick={() => navigate("/levels")}
            size="large"
            className="flex items-center gap-3"
          >
            <ApperIcon name="Grid" size={20} />
            Level Select
          </Button>
        </motion.div>

        {/* Game Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Zap" size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Simple Controls</h3>
            <p className="text-slate-400 text-sm">
              One-touch gameplay with jump and sleep mechanics
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Target" size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">20 Levels</h3>
            <p className="text-slate-400 text-sm">
              Progressive difficulty with unique obstacles
            </p>
          </div>

          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Award" size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Star Rating</h3>
            <p className="text-slate-400 text-sm">
              Earn up to 3 stars based on your performance
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MenuPage;