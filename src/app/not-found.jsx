"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCircleExclamation, FaHouse } from "react-icons/fa6";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-base-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] bg-error/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md mx-auto flex flex-col items-center z-10"
      >
        {/* Animated Error Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-error mb-6"
        >
          <FaCircleExclamation className="w-20 h-20 drop-shadow-[0_4px_12px_rgba(239,68,68,0.2)]" />
        </motion.div>

        {/* Big 404 Heading */}
        <h1 className="text-7xl font-black text-base-content mb-2 tracking-tight">
          404
        </h1>
        
        {/* Figma Style Subtitle */}
        <h2 className="text-xl font-bold bg-gradient-to-r from-error to-primary bg-clip-text text-transparent mb-4">
          Page Not Found
        </h2>

        <p className="text-base-content/60 font-medium mb-8 leading-relaxed">
          Oops! The recipe or page you are looking for doesn't exist or has been moved to another kitchen.
        </p>

        {/* Back to Home Button */}
        <Link 
          href="/" 
          className="btn btn-primary px-6 h-12 rounded-xl font-bold text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all normal-case flex items-center gap-2"
        >
          <FaHouse className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;