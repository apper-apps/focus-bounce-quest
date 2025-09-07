import React from "react";
import { motion } from "framer-motion";

const Ball = ({ 
  position, 
  isSleeping = false, 
  isJumping = false, 
  size = 24,
  className = "" 
}) => {
  const eyeSize = Math.max(size * 0.1, 2);
  const eyeOffset = size * 0.15;

  return (
    <motion.div
      className={`ball absolute ${className} ${isSleeping ? "sleep-effect" : ""}`}
      style={{
        width: size,
        height: size,
        left: position?.x || 0,
        top: position?.y || 0,
      }}
      animate={{
        scaleY: isJumping ? 0.8 : 1,
        scaleX: isJumping ? 1.2 : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Eyes */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`bg-white rounded-full absolute transition-all duration-300 ${
            isSleeping ? "opacity-30 h-0.5" : "opacity-90"
          }`}
          style={{
            width: eyeSize,
            height: isSleeping ? 1 : eyeSize,
            left: `calc(50% - ${eyeOffset}px)`,
            top: "45%",
          }}
        />
        <div 
          className={`bg-white rounded-full absolute transition-all duration-300 ${
            isSleeping ? "opacity-30 h-0.5" : "opacity-90"
          }`}
          style={{
            width: eyeSize,
            height: isSleeping ? 1 : eyeSize,
            right: `calc(50% - ${eyeOffset}px)`,
            top: "45%",
          }}
        />
      </div>

      {/* Particle trail effect */}
      {!isSleeping && (
        <motion.div
          className="absolute w-2 h-2 bg-primary/30 rounded-full -z-10"
          style={{ left: -8, top: "50%" }}
          animate={{
            opacity: [0.3, 0],
            scale: [0.5, 0],
            x: [-10, -20],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </motion.div>
  );
};

export default Ball;