"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader({ progress, isLoaded }: { progress: number, isLoaded: boolean }) {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (isLoaded && progress === 160) {
      setTimeout(() => setComplete(true), 800);
    }
  }, [isLoaded, progress]);

  // Map 160 frames to 100%
  const percentage = Math.round((progress / 160) * 100);

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div
          exit={{ 
            clipPath: "polygon(0 0, 100% 0, 100% 0%, 0% 0%)", 
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col items-center justify-center text-white select-none"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
        >
          {/* Creative Masked Progress Text */}
          <div className="relative overflow-hidden flex items-center justify-center w-full h-full pointer-events-none">
            
            {/* Background watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <span className="text-[30vw] font-black tracking-tighter">PORTFOLIO</span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="text-[15vw] font-black tracking-tighter mix-blend-difference z-10 leading-none"
            >
              {percentage}
              <span className="text-[6vw] font-light text-white/30 ml-2">%</span>
            </motion.h1>
          </div>

          {/* Loading bar wrapper */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 h-[2px] bg-white/10 overflow-hidden">
             <motion.div 
               className="h-full bg-white origin-left"
               animate={{ width: `${percentage}%` }}
               transition={{ ease: "circOut", duration: 0.2 }}
             />
          </div>
          
          <motion.p 
            animate={{ opacity: [0.2, 1, 0.2] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-white/40"
          >
            Compiling WebGL Vectors
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
