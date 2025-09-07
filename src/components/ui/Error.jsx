import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  retryLabel = "Try Again" 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full min-h-[400px] text-white p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-accent to-red-600 rounded-full flex items-center justify-center mb-6"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
<ApperIcon name="AlertCircle" size={32} className="text-white" />
      </motion.div>
      
      <h3 className="text-xl font-semibold mb-2">Oops!</h3>
      <p className="text-slate-300 text-center mb-6 max-w-sm">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="game-button flex items-center gap-2"
        >
          <ApperIcon name="RotateCcw" size={16} />
          {retryLabel}
        </button>
      )}
    </motion.div>
  );
};

export default Error;