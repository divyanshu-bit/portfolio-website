import { Link } from 'next-view-transitions';
import { ArrowLeft } from 'lucide-react';

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Mock lookup
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white pt-32 px-6 md:px-12 selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto">
        <Link href="/#work" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 hover-target group uppercase tracking-widest text-xs font-mono">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to projects
        </Link>
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start mb-32">
        
        {/* Left side text info */}
        <div className="md:w-1/3 pt-4 sticky top-32 z-10">
          <p className="text-white/40 text-[10px] md:text-xs mb-4 font-mono uppercase tracking-widest">Case Study — 2024</p>
          <h1 
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 drop-shadow-xl"
            style={{ viewTransitionName: `project-title-${slug}` }}
          >
            {title}
          </h1>
          <p className="text-white/60 text-lg font-light leading-relaxed mb-12 mix-blend-difference">
            A comprehensive dive into creating highly interactive, immersive digital experiences utilizing cutting-edge WebGL, advanced mathematically driven physics, and Next.js routing paradigms.
          </p>

          <div className="flex flex-col gap-6 text-sm font-mono border-t border-white/10 pt-8 uppercase tracking-widest text-xs">
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-white/40">Role</span>
              <span className="text-right">Creative Eng.</span>
            </div>
            <div className="flex justify-between items-end border-b border-white/5 pb-4">
              <span className="text-white/40">Stack</span>
              <span className="text-right max-w-[150px]">Next.js, Three.js, Lenis</span>
            </div>
          </div>
        </div>

        {/* Right side expanding image */}
        <div 
          className="md:w-2/3 h-[50vh] md:h-[80vh] bg-gradient-to-tr from-black/80 via-[#2a2a2a] to-[#1a1a1a] rounded-[2rem] overflow-hidden w-full relative -z-0"
          style={{ viewTransitionName: `project-image-${slug}` }}
        >
          {/* Simulated WebGL Canvas Content */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-overlay opacity-30">
            <span className="text-[12vw] font-black tracking-tighter text-white">WEBGL</span>
          </div>
        </div>

      </div>
    </main>
  );
}
