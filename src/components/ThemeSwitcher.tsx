"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [transitioning, setTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const toggleTheme = (e: React.MouseEvent) => {
    if (transitioning) return;
    
    setMousePos({ x: e.clientX, y: e.clientY });
    setTransitioning(true);

    const newTheme = theme === "dark" ? "light" : "dark";
    
    // Halfway through the animation, flip the root CSS flags
    setTimeout(() => {
      setTheme(newTheme);
      const root = document.documentElement;
      
      if (newTheme === "light") {
         root.style.setProperty("--background", "#e0e0e0");
         root.style.setProperty("--foreground", "#121212");
         // Since many elements are hardcoded for the cinematic dark aesthetic, 
         // we apply a targeted invert on the main canvases to preserve the webgl visual style
         root.classList.add("invert-theme");
      } else {
         root.style.setProperty("--background", "#121212");
         root.style.setProperty("--foreground", "#ffffff");
         root.classList.remove("invert-theme");
      }
    }, 400);

    setTimeout(() => {
      setTransitioning(false);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[150] w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover-target border border-white/20 transition-all hover:scale-110 mix-blend-difference"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ clipPath: `circle(0px at ${mousePos.x}px ${mousePos.y}px)`, opacity: 1 }}
            animate={{ clipPath: `circle(150vw at ${mousePos.x}px ${mousePos.y}px)`, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className={`fixed inset-0 z-[120] pointer-events-none ${theme === "dark" ? "bg-[#e0e0e0]" : "bg-[#121212]"}`}
          />
        )}
      </AnimatePresence>
    </>
  );
}
