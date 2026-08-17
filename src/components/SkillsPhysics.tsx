"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

const SKILLS = [
  "React", "Next.js", "TypeScript", "Tailwind CSS",
  "Framer Motion", "WebGL", "Three.js", "Node.js", 
  "GraphQL", "Figma", "UI/UX", "Vercel", "GSAP", "GLSL",
  "Awwwards"
];

export default function SkillsPhysics() {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    const width = sceneRef.current.clientWidth;
    const height = 400;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      },
    });

    const ground = Bodies.rectangle(width / 2, height + 30, width * 2, 60, { isStatic: true });
    const wallLeft = Bodies.rectangle(-30, height / 2, 60, height * 2, { isStatic: true });
    const wallRight = Bodies.rectangle(width + 30, height / 2, 60, height * 2, { isStatic: true });

    Composite.add(engine.world, [ground, wallLeft, wallRight]);

    const pills = SKILLS.map((skill, index) => {
      const textWidth = Math.max(100, Math.round(skill.length * 14));
      
      const pill = Bodies.rectangle(
        Math.random() * (width - 150) + 75,
        -100 - (index * 80), 
        textWidth + 40,
        50, 
        {
          chamfer: { radius: 25 },
          restitution: 0.8,
          friction: 0.1,
          frictionAir: 0.01,
          render: {
            fillStyle: "#ffffff",
            strokeStyle: "transparent",
            lineWidth: 0,
          },
          label: skill,
        }
      );
      
      // Random initial rotation for chaotic entry
      Matter.Body.setAngle(pill, Math.random() * Math.PI * 2);
      
      return pill;
    });

    Composite.add(engine.world, pills);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Render custom text over the pills
    Matter.Events.on(render, 'afterRender', () => {
        const context = render.context;
        context.font = '600 16px "Inter", sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        
        pills.forEach((pill) => {
            const { x, y } = pill.position;
            const angle = pill.angle;
            
            context.save();
            context.translate(x, y);
            context.rotate(angle);
            context.fillStyle = '#121212';
            context.fillText(pill.label, 0, 0);
            context.restore();
        });
    });

    // Remote Gyroscope Listener Binding
    const handleGyro = (e: Event) => {
      const customEvent = e as CustomEvent<{ tiltX: number, tiltY: number }>;
      const { tiltX, tiltY } = customEvent.detail;
      
      // tiltX (gamma) goes from -90 to 90
      // tiltY (beta) goes from -180 to 180
      // We map these physical angles to the Matter.js internal vector gravity (normally x:0, y:1)
      engine.world.gravity.x = Math.max(-1.5, Math.min(1.5, tiltX / 30)); 
      
      // Normal gravity is 1 down. We offset by 45 deg resting angle so holding phone normally feels "down"
      const adjustedTiltY = tiltY - 45;
      engine.world.gravity.y = Math.max(-1.5, Math.min(1.5, adjustedTiltY / 30));
    };

    window.addEventListener("gyro-update", handleGyro);

    const handleResize = () => {
      if (!sceneRef.current) return;
      const newWidth = sceneRef.current.clientWidth;
      
      render.canvas.width = newWidth * (typeof window !== 'undefined' ? window.devicePixelRatio : 1);
      render.canvas.height = height * (typeof window !== 'undefined' ? window.devicePixelRatio : 1);
      render.options.width = newWidth;
      
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: height + 30 });
      Matter.Body.setPosition(wallRight, { x: newWidth + 30, y: height / 2 });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("gyro-update", handleGyro);
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, []);

  return (
    <section className="relative w-full bg-[#121212] flex flex-col items-center py-20 px-6 z-20">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">Tech Stack</h2>
      <p className="text-white/40 font-mono text-sm mb-12 uppercase tracking-[0.2em]">(Drag to reorganize)</p>
      
      <div 
        ref={sceneRef} 
        className="w-full max-w-5xl h-[400px] border border-white/10 rounded-3xl overflow-hidden bg-[#1a1a1a] shadow-2xl relative cursor-grab active:cursor-grabbing hover-target group" 
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10 opacity-50 transition-opacity group-hover:opacity-100" />
      </div>
    </section>
  );
}
