"use client";

import { Copy, Plus } from "lucide-react";

export default function Footer() {
  const handleCopy = () => {
    navigator.clipboard.writeText("hello@divya.com");
    alert("Email copied to clipboard!");
  };

  return (
    <footer className="relative w-full min-h-[80vh] bg-[#0a0a0a] text-white flex flex-col justify-end overflow-hidden pb-10 pt-32 px-6 md:px-12 z-10" id="contact">
      {/* Top Divider */}
      <div className="absolute top-0 left-0 w-full h-px bg-white/10" />

      {/* Main Call to action Content */}
      <div className="flex-1 flex flex-col md:flex-row justify-between items-start md:items-end w-full max-w-[1400px] mx-auto z-10 gap-16 md:gap-0">
        <div className="max-w-xl">
          <p className="text-white/50 text-sm md:text-base font-mono uppercase tracking-[0.2em] mb-8">Got a project?</p>
          <button 
            onClick={handleCopy}
            className="group flex flex-col items-start text-left hover-target"
          >
            <span className="text-3xl md:text-5xl font-light mb-2 transition-colors group-hover:text-white/70">Let's talk</span>
            <span className="text-xl md:text-2xl font-bold flex items-center gap-4 transition-transform group-hover:translate-x-2 duration-300">
              hello@divya.com
              <div className="bg-white/10 p-2 rounded-full group-hover:bg-white group-hover:text-black transition-colors duration-300">
                <Copy size={16} />
              </div>
            </span>
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-4 text-sm font-mono uppercase tracking-widest text-white/50 w-full md:w-auto text-left md:text-right">
          <a href="#" className="hover:text-white transition-colors hover-target flex items-center gap-2 justify-start md:justify-end group">
            <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" /> GitHub
          </a>
          <a href="#" className="hover:text-white transition-colors hover-target flex items-center gap-2 justify-start md:justify-end group">
            <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" /> LinkedIn
          </a>
          <a href="#" className="hover:text-white transition-colors hover-target flex items-center gap-2 justify-start md:justify-end group">
            <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" /> Twitter
          </a>
          <a href="#" className="hover:text-white transition-colors hover-target flex items-center gap-2 justify-start md:justify-end group">
            <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" /> Instagram
          </a>
        </div>
      </div>

      {/* Giant Typography */}
      <div className="w-full mt-24 md:mt-0 flex justify-center items-end opacity-20 pointer-events-none z-0">
        <h1 className="text-[16vw] font-black tracking-tighter leading-none m-0 p-0 text-center uppercase select-none transition-opacity duration-1000 hover:opacity-100 mix-blend-overlay">
          Portfolio
        </h1>
      </div>

      {/* Copyright Line */}
      <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center text-[10px] md:text-xs font-mono text-white/30 uppercase tracking-widest mt-12 z-10">
        <span>© {new Date().getFullYear()} By Divyanshu Sharma</span>
        <span>Local Time: EST</span>
      </div>
    </footer>
  );
}
