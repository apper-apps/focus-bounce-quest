import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Ball from "@/components/atoms/Ball";
import Star from "@/components/atoms/Star";
import Button from "@/components/atoms/Button";
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
{/* Hero Ball Animation */}
        <motion.div
          className="mb-8 flex justify-center relative"
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
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            }}
          >
            <Ball position={{ x: 0, y: 0 }} size={100} className="relative shadow-2xl" />
          </motion.div>
          
          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-display text-6xl md:text-8xl font-bold text-center mb-4"
          style={{
            background: "linear-gradient(135deg, #4A90E2 0%, #7CB342 50%, #FF6B6B 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          BOUNCE QUEST
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-white text-xl md:text-2xl text-center mb-8 opacity-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Master the art of bouncing through challenging worlds
        </motion.p>

        {/* Game Instructions */}
        <motion.div
          className="mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white text-lg font-semibold mb-4 text-center">How to Play</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <ApperIcon name="MousePointer" size={16} className="text-primary" />
                </div>
                <span>Click or press SPACE to jump</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <ApperIcon name="Moon" size={16} className="text-purple-400" />
                </div>
                <span>Press S for sleep ability (one per level)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                  <ApperIcon name="Target" size={16} className="text-secondary" />
                </div>
                <span>Reach the glowing portal to win</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                  <ApperIcon name="Zap" size={16} className="text-accent" />
                </div>
                <span>Avoid red obstacles and spikes</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Button
            onClick={() => navigate("/game/20")}
            size="large"
            className="flex items-center gap-3 transform hover:scale-105 transition-all duration-300"
          >
            <ApperIcon name="Play" size={24} />
            Start Reverse Challenge
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