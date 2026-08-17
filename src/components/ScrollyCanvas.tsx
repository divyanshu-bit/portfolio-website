"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useMotionValueEvent, motion } from "framer-motion";
import Preloader from "@/components/Preloader";

const FRAME_COUNT = 160;

export default function ScrollyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // Preload images
  useEffect(() => {
    let isMounted = true;
    const preloadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      let countTracker = 0;

      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        const frameIndex = i.toString().padStart(3, "0");
        img.src = `/sequence/frame_${frameIndex}_delay-0.05s.png`;
        img.onload = () => {
          countTracker++;
          if (isMounted) setLoadProgress(countTracker);
          if (isMounted && countTracker === FRAME_COUNT) {
            setImagesLoaded(true);
          }
        };
        // Load fallback mechanism in case of error
        img.onerror = () => {
          countTracker++;
          if (isMounted) setLoadProgress(countTracker);
          if (isMounted && countTracker === FRAME_COUNT) {
            setImagesLoaded(true);
          }
        };
        loadedImages.push(img);
      }
      if (isMounted) setImages(loadedImages);
    };

    preloadImages();
    return () => { isMounted = false; };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const currentIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  const renderFrame = (index: number) => {
    if (!images[index] || !canvasRef.current || !imagesLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = images[index];
    
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;

    const imgRatio = img.width / img.height;
    const canvasRatio = canvas.width / canvas.height;
    
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (imgRatio > canvasRatio) {
      drawHeight = canvas.height;
      drawWidth = img.width * (canvas.height / img.height);
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = img.height * (canvas.width / img.width);
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Use high quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useMotionValueEvent(currentIndex, "change", (latest) => {
    if (imagesLoaded) {
      requestAnimationFrame(() => renderFrame(Math.round(latest)));
    }
  });

  useEffect(() => {
    if (imagesLoaded) {
      requestAnimationFrame(() => renderFrame(Math.round(currentIndex.get())));
    }
  }, [imagesLoaded]);

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(() => renderFrame(Math.round(currentIndex.get())));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded]);

  // Overlay Opacity Transforms
  const text1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const text2Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.45], [0, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.25, 0.45], [50, -50]);

  const text3Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.75], [0, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.55, 0.75], [50, -50]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#121212]" style={{ height: "500vh" }}>
      <Preloader progress={loadProgress} isLoaded={imagesLoaded} />
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden text-white/90">
        
        {/* Removed old text loader */}

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-0"
        />

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#121212] z-10 pointer-events-none" />

        {/* Overlays */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-6">
          <motion.div style={{ opacity: text1Opacity, y: text1Y }} className="absolute text-center drop-shadow-2xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">Divyanshu Sharma.</h1>
            <p className="text-xl md:text-3xl text-white/80 font-light">Creative Developer.</p>
          </motion.div>

          <motion.div style={{ opacity: text2Opacity, y: text2Y }} className="absolute text-left drop-shadow-2xl md:left-[15%]">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-tight">
              I build <br/> digital <br/> experiences.
            </h2>
          </motion.div>

          <motion.div style={{ opacity: text3Opacity, y: text3Y }} className="absolute text-right drop-shadow-2xl md:right-[15%]">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
              Bridging <br/> design and <span className="text-white/60 italic">engineering</span>.
            </h2>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
