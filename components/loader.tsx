"use client";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Geist_Mono as GeistMono } from "next/font/google";
import waitingAI from "../public/waitingAI.json";

const geistMono = GeistMono({ 
  subsets: ["latin"],
  weight: "600",
  display: "swap"
});

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
        className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-2xl"
      >
        {/* Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.1, 
            duration: 0.5,
            ease: "easeOut"
          }}
          className="h-48 w-48"
        >
          <Lottie
            animationData={waitingAI}
            loop={true}
            style={{ height: "100%", width: "100%" }}
          />
        </motion.div>
        
        {/* Animated Text with Geist Mono */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.3, 
            duration: 0.5,
            ease: "easeOut"
          }}
          className="mt-6"
        >
          <motion.div
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className={`${geistMono.className} relative text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-[length:300%_300%]`}
          >
            Processing your document
            {/* Animated Dots */}
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "easeInOut"
                }}
              >
                .
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Subtle Background Pulse */}
        <motion.div
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [0.98, 1.02, 0.98]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50"
        />
      </motion.div>
    </motion.div>
  );
}