"use client";

import { Link } from 'next-view-transitions';
import ProjectShader from '@/components/ProjectShader';
import { useState } from 'react';

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const projects = [
    { id: 1, title: "Nano Banana", type: "E-Commerce", year: "2024", slug: "nano-banana" },
    { id: 2, title: "Awwwards Entry", type: "Portfolio", year: "2023", slug: "awwwards-entry" },
    { id: 3, title: "Immersive Web", type: "WebGL Experience", year: "2025", slug: "immersive-web" },
  ];

  return (
    <section className="relative z-10 w-full bg-[#121212] px-6 py-32 rounded-t-[3rem] -mt-[3rem] overflow-hidden" id="work">
      {/* Subtle top shadow connecting canvas flow */}
      <div className="absolute top-0 left-0 w-full h-[3rem] shadow-[0_-20px_40px_rgba(18,18,18,1)] bg-[#121212] rounded-t-[3rem] -z-10 blur-xl" />

      <div className="max-w-6xl mx-auto mt-12">
        <h3 className="text-3xl md:text-5xl font-bold mb-16 text-white tracking-tight">Selected Work</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj) => (
            <Link
              href={`/work/${proj.slug}`}
              key={proj.id}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 backdrop-blur-xl transition-all duration-500 hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] p-0 flex flex-col justify-end hover-target cursor-none block"
              onMouseEnter={() => setHoveredIndex(proj.id)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image Base Placeholder */}
              <div 
                className="absolute inset-0 bg-gradient-to-tr from-[#121212] to-[#222222] transition-transform duration-700 group-hover:scale-105 z-0"
                style={{ viewTransitionName: `project-image-${proj.slug}` }}
              ></div>

              {/* WebGL Overlay */}
              <div className="absolute inset-0 z-10 transition-transform duration-700 group-hover:scale-105 pointer-events-none">
                 <ProjectShader isHovered={hoveredIndex === proj.id} />
              </div>

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20 pointer-events-none opacity-50 transition-opacity duration-500 group-hover:opacity-80"></div>
              
              <div className="relative z-30 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out p-8">
                <p className="text-white/40 text-[10px] md:text-xs mb-3 font-mono uppercase tracking-widest">{proj.type} — {proj.year}</p>
                <h4 
                  className="text-2xl font-bold text-white mb-6 tracking-wide drop-shadow-md w-max"
                  style={{ viewTransitionName: `project-title-${proj.slug}` }}
                >
                  {proj.title}
                </h4>
                <div className="inline-block text-xs font-semibold text-white/80 border-b border-white/20 pb-1 group-hover:text-white group-hover:border-white transition-all">
                  View Case Study
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
