import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "Nothing Here Yet", 
  message = "Start your adventure!", 
  actionLabel = "Get Started", 
  onAction 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full min-h-[400px] text-white p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-20 h-20 ball mb-6 flex items-center justify-center"
        animate={{
          y: [0, -10, 0],
          rotate: [0, 360],
        }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
        }}
      >
        <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
        <div className="w-3 h-3 bg-white rounded-full ml-2 opacity-80"></div>
      </motion.div>
      
      <h3 className="text-2xl font-display font-bold mb-2">{title}</h3>
      <p className="text-slate-300 text-center mb-8 max-w-md">{message}</p>
      
      {onAction && (
        <motion.button
          onClick={onAction}
          className="game-button flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Play" size={16} />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
};

export default Empty;