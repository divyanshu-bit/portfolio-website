"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full p-6 md:p-10 z-[100] flex justify-between items-center pointer-events-none mix-blend-difference text-white">
        <a href="/" className="pointer-events-auto text-xl font-bold tracking-tight uppercase hover-target">
          Portfolio
        </a>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="pointer-events-auto hover-target flex flex-col justify-center items-end gap-[6px] w-12 h-10 p-2 z-[101]"
        >
          <motion.div
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? 8 : 0 }}
            className="h-[2px] w-full bg-white origin-center"
          />
          <motion.div
            animate={{ width: menuOpen ? "100%" : "60%", rotate: menuOpen ? 45 : 0, y: menuOpen ? -2 : 0 }}
            className="h-[2px] bg-white origin-center"
          />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)", opacity: 0 }}
            animate={{ clipPath: "circle(150% at 100% 0%)", opacity: 1 }}
            exit={{ clipPath: "circle(0% at 100% 0%)", opacity: 0, transition: { delay: 0.2, duration: 0.6 } }}
            transition={{ type: "tween", ease: [0.76, 0, 0.24, 1], duration: 0.8 }}
            className="fixed inset-0 bg-[#0a0a0a] z-[90] flex flex-col justify-center items-center text-white px-6 md:px-20"
          >
            <div className="absolute top-0 w-full h-full pointer-events-none overflow-hidden opacity-5 select-none">
              <span className="text-[25vw] font-black leading-none absolute -bottom-10 right-0 tracking-tighter">STUDIO</span>
            </div>
            
            <nav className="flex flex-col gap-4 md:gap-8 text-left w-full h-full justify-center relative z-10 md:pl-[10vw]">
              {['Home', 'Work', 'About', 'Contact'].map((item, i) => (
                <div key={item} className="overflow-hidden py-2" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}>
                  <motion.div
                    initial={{ y: "150%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-150%" }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <a
                      href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className="text-5xl md:text-8xl font-black uppercase tracking-tighter hover:text-white/40 transition-colors hover-target inline-block hover:italic origin-left"
                    >
                      {item}
                    </a>
                  </motion.div>
                </div>
              ))}
            </nav>

            {/* Footer hints inside menu */}
            <motion.div 
              className="absolute bottom-10 left-6 md:left-20 right-6 md:right-20 flex justify-between font-mono text-[10px] md:text-sm text-white/40 uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div>Connect: LinkedIn / Twitter</div>
              <div>Available for Work</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
