import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Star = ({ filled = false, index = 0 }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        delay: index * 0.1, 
        type: "spring", 
        stiffness: 200, 
        damping: 10 
      }}
    >
      <ApperIcon 
        name={filled ? "Star" : "Star"} 
        size={24} 
        className={filled ? "star-filled fill-current" : "star-empty"}
      />
    </motion.div>
  );
};

export default Star;