import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { 
  ChevronRight, 
  Layers, 
  Activity, 
  Cpu, 
  Database,
  ArrowDown,
  Maximize2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Global Assets
const VIDEO_URL = "https://dyk5ztixs0dw0nk6.public.blob.vercel-storage.com/Video%20Project%203.mp4";
const ENGINEERING_VIDEO_URL = "https://dyk5ztixs0dw0nk6.public.blob.vercel-storage.com/Sneaker_transformation_exploded_%E2%80%A6_202605081659.mp4";
const SCAN_IMAGE = "https://dyk5ztixs0dw0nk6.public.blob.vercel-storage.com/Shoe%201.png";
const SYNTHESIS_IMAGE = "https://dyk5ztixs0dw0nk6.public.blob.vercel-storage.com/Gemini_Generated_Image_2fk2kn2fk2kn2fk2.png";
const DECONSTRUCT_IMAGE = "https://dyk5ztixs0dw0nk6.public.blob.vercel-storage.com/Shoe%201.png";
const ENGINEERING_SUPPORT_IMAGE = "https://dyk5ztixs0dw0nk6.public.blob.vercel-storage.com/Shoe4.png";

interface TechNode {
  id: string;
  x: string;
  y: string;
  title: string;
  description: string;
  stat: string;
}

const techNodes: TechNode[] = [
  {
    id: "upper",
    x: "45%",
    y: "35%",
    title: "PREMIUM KNIT",
    description: "Multi-layered luxury textile with integrated compression zones for adaptive stability.",
    stat: "High-Density Weave"
  },
  {
    id: "carbon",
    x: "55%",
    y: "65%",
    title: "STRUCTURED MIDSOLE",
    description: "Matte carbon-fiber composite chassis engineered for elite kinetic energy absorption.",
    stat: "Composite Matrix"
  },
  {
    id: "kinetic",
    x: "85%",
    y: "75%",
    title: "RED HEEL LUMINANCE",
    description: "Subtle integrated luminance module signifying active damping and reactive state.",
    stat: "Active Glow Tech"
  }
];

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<TechNode | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const synthesisRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: synthesisProgress } = useScroll({ target: synthesisRef, offset: ["start end", "end start"] });
  
  const heroShoeY = useTransform(heroProgress, [0, 1], [0, -150]);
  const ghostShoeY = useTransform(synthesisProgress, [0, 1], [-50, 50]);
  const sOpacityRaw = useTransform(synthesisProgress, [0, 0.6], [0, 1]);
  const sOpacity = useSpring(sOpacityRaw, { stiffness: 20, damping: 50 });
  const sYRaw = useTransform(synthesisProgress, [0, 0.6], [60, 0]);
  const sY = useSpring(sYRaw, { stiffness: 20, damping: 50 });

  const deploymentRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: deploymentProgress } = useScroll({ target: deploymentRef, offset: ["start end", "end start"] });
  const dOpacityRaw = useTransform(deploymentProgress, [0, 0.6], [0, 1]);
  const dOpacity = useSpring(dOpacityRaw, { stiffness: 20, damping: 50 });
  const dXRaw = useTransform(deploymentProgress, [0, 0.6], [60, 0]);
  const dX = useSpring(dXRaw, { stiffness: 20, damping: 50 });

  const cinematicTransition = { duration: 2.2, ease: [0.25, 0.1, 0.25, 1.0] };

  const heroOpacityTransform = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const heroOpacity = useSpring(heroOpacityTransform, { stiffness: 70, damping: 25 });
  
  const heroScaleTransform = useTransform(heroProgress, [0, 1], [1, 1.02]); 
  const heroScale = useSpring(heroScaleTransform, { stiffness: 70, damping: 25 });
  const ambientLight = useTransform(heroProgress, [0, 1], ["rgba(0,0,0,1)", "rgba(10,10,10,1)"]);
  const titleParallax = useTransform(heroProgress, [0, 1], [0, -100]);
  const titleScale = useTransform(heroProgress, [0, 0.5], [1, 0.95]);

  useEffect(() => {
    // 0. Smooth Scroll Initialization (Lenis)
    const lenis = new Lenis({
      duration: 2.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0, 
      touchMultiplier: 2,
      lerp: 0.04,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 1. Magnetic Physics Logic
    const handleMouseMove = (e: MouseEvent) => {
      const magnetics = document.querySelectorAll('.magnetic');
      magnetics.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const threshold = 180; // Tighter range for luxury feel
        
        if (distance < threshold) {
          const power = Math.pow((threshold - distance) / threshold, 1.8);
          gsap.to(el, {
            x: distanceX * 0.4 * power,
            y: distanceY * 0.4 * power,
            rotateY: distanceX * 0.3 * power,
            rotateX: -distanceY * 0.3 * power,
            boxShadow: `0 0 40px rgba(255, 255, 255, ${0.1 * power})`,
            scale: 1 + 0.05 * power,
            duration: 0.3, 
            ease: "power2.out",
            transformPerspective: 2500,
            overwrite: true
          });

          // Glare Effect
          const glare = el.querySelector('.magnetic-glare');
          if (glare) {
            gsap.to(glare, {
              x: -distanceX * 0.6 * power,
              y: -distanceY * 0.6 * power,
              opacity: 0.5 * power,
              duration: 0.2,
              overwrite: true
            });
          }

          // Pulse Ring Effect
          const ring = el.querySelector('.magnetic-ring');
          if (ring) {
            gsap.to(ring, {
              scale: 1 + 0.9 * power,
              opacity: 0.6 * power,
              borderWidth: `${1 + 5 * power}px`,
              duration: 0.2,
              overwrite: true
            });
          }

          const innerItems = el.querySelectorAll('.magnetic-inner');
          innerItems.forEach(inner => {
            gsap.to(inner, {
              x: distanceX * 0.4 * power,
              y: distanceY * 0.4 * power,
              duration: 0.2,
              ease: "power2.out",
              overwrite: true
            });
          });
        } else {
          gsap.to(el, { 
            x: 0, 
            y: 0, 
            rotateX: 0, 
            rotateY: 0, 
            scale: 1, 
            boxShadow: "0 0 0px rgba(0,0,0,0)",
            duration: 1.8, // Heavy release
            ease: "elastic.out(1.6, 0.5)",
            overwrite: true 
          });

          const ring = el.querySelector('.magnetic-ring');
          if (ring) {
            gsap.to(ring, { scale: 1, opacity: 0, duration: 1.2, overwrite: true });
          }

          const glare = el.querySelector('.magnetic-glare');
          if (glare) {
            gsap.to(glare, { x: 0, y: 0, opacity: 0, duration: 0.5, overwrite: true });
          }

          const innerItems = el.querySelectorAll('.magnetic-inner');
          innerItems.forEach(inner => {
            gsap.to(inner, {
              x: 0,
              y: 0,
              duration: 2.2,
              ease: "elastic.out(1.4, 0.45)",
              overwrite: true
            });
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      lenis.destroy();
      gsap.ticker.remove(raf);
    };
  }, []);

  // 3. Mouse Tracking for Dynamic Lighting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      // Calculate distance from center for subtle intensity/spread changes
      const dx = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Higher quality subtle values
      // Intensity is higher in center, lower at edges
      const intensity = Math.max(0.02, 0.08 - distance * 0.04);
      // Spread is wider at center, tighter at edges
      const spread = 45 + (1 - distance) * 20;

      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
      document.documentElement.style.setProperty('--mouse-intensity', intensity.toString());
      document.documentElement.style.setProperty('--mouse-spread', `${spread}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // 2. Cinema-Scrub Video Logic
    const video = videoRef.current;
    if (video) {
      video.pause();
      // Refined ScrollTrigger for Hero Animation
      ScrollTrigger.create({
        trigger: ".hero-section",
        start: "top top",
        end: "bottom bottom",
        scrub: 2.5, // Heavier luxury scrub
        pin: ".hero-content",
        onUpdate: (self) => {
          if (video.duration) {
            video.currentTime = self.progress * video.duration;
          }
          // Dramatic luxury scale and subtle rotation
          gsap.set(video, { 
            scale: 1.1 + self.progress * 0.2, // Subtler scale
            opacity: Math.max(0.4, 1 - self.progress * 0.8),
            filter: `brightness(${100 - self.progress * 30}%) contrast(${110 + self.progress * 25}%) saturate(${0.9 + self.progress * 0.2})`
          });
        }
      });
    }

    // 4. Parallax Hero Typography & Depth
    gsap.to(".hero-title-1", {
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "40% top",
        scrub: 2.5,
      },
      y: -120,
      scale: 0.8,
      opacity: 0,
      filter: "blur(40px)",
    });

    gsap.to(".hero-title-2", {
      scrollTrigger: {
        trigger: ".hero-section",
        start: "5% top",
        end: "45% top",
        scrub: 3.0,
      },
      y: -180,
      scale: 0.75,
      opacity: 0,
      filter: "blur(50px)",
    });

    // Floating Particles Parallax
    gsap.to(".debris-field", {
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 2.5,
      },
      y: -400,
      rotate: 20,
    });

    // 4. Deconstruction Animation
    const ids = ["upper", "mid", "tread"];
    ids.forEach((id, i) => {
      gsap.to(`.deconstruct-${id}`, {
        scrollTrigger: {
          trigger: "#architecture",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
        x: (i - 1) * 120,
        y: (i - 1) * 40,
        rotation: (i - 1) * 3,
        scale: 1.05,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-black">
      {/* GLOBAL CINEMATIC OVERLAYS DISABLED */}
      {/* 
      <div className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden">
        <div className="absolute inset-[-200%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-grain opacity-[0.35] mix-blend-overlay" />
        <div className="absolute inset-0 bg-radial-gradient opacity-[0.2] mix-blend-screen" />
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(0,0,0,0.8)]" />
      </div>
      */}

      {/* Header */}
      {/* CINEMATIC DEPTH OVERLAYS DISABLED */}
      {/* 
      <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
        <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] bg-black/60 blur-[120px] rounded-full animate-float-fog" />
        <div className="absolute bottom-[-10%] right-[-15%] w-[45%] h-[45%] bg-black/60 blur-[100px] rounded-full animate-float-fog" style={{ animationDelay: '-12s' }} />
        <div className="absolute top-1/4 right-[-5%] w-[30%] h-[30%] bg-accent/[0.03] blur-[150px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 left-[-5%] w-[25%] h-[25%] bg-white/[0.015] blur-[180px] mix-blend-screen" />
      </div>
      */}

      <nav className="sticky top-0 w-full z-[100] bg-black/60 backdrop-blur-xl flex justify-between items-center px-10 py-6">
        <div className="flex items-center space-x-6">
          <div className="w-1 h-1 bg-white opacity-20" />
          <span className="text-[10px] font-medium tracking-[0.3em] text-white/40 uppercase">Archive Series 01</span>
        </div>
        
        <div className="hidden lg:flex space-x-20 text-[9px] uppercase tracking-[0.5em] font-medium text-white/20">
          <a href="#synthesis" className="hover:text-white transition-all duration-500">I. Synthesis</a>
          <a href="#architecture" className="hover:text-white transition-all duration-500">II. Geometry</a>
          <a href="#deployment" className="hover:text-white transition-all duration-500">III. Archive</a>
        </div>

        <div className="flex items-center space-x-4">
              <button className="magnetic group relative text-[10px] uppercase tracking-[0.3em] font-bold px-5 py-2 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] bg-white/5 backdrop-blur-md rounded-sm overflow-hidden hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
             <div className="magnetic-glare absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 pointer-events-none" />
             <span className="magnetic-inner block relative z-10 transition-colors duration-500">REMIX</span>
          </button>
          <button className="magnetic group relative text-[10px] uppercase tracking-[0.3em] font-bold px-5 py-2 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] bg-white/[0.03] backdrop-blur-md rounded-sm overflow-hidden text-white/40 hover:text-white hover:bg-white/5 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
             onClick={() => {
               if (audioRef.current) {
                 if (audioPlaying) audioRef.current.pause();
                 else audioRef.current.play();
                 setAudioPlaying(!audioPlaying);
               }
             }}
          >
             <div className="magnetic-glare absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 pointer-events-none" />
             <span className="magnetic-inner block relative z-10 transition-colors duration-500 flex items-center gap-2">
               {audioPlaying ? <Volume2 size={10} /> : <VolumeX size={10} />}
               AUDIO
             </span>
          </button>
        </div>
      </nav>

      {/* Hero Experience */}
      <section ref={heroRef} className="hero-section relative h-[250vh]">
        <div className="hero-content sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Cinematic Atmosphere */}
        <motion.div 
          style={{ backgroundColor: ambientLight }}
          className="absolute inset-0 z-0" 
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.06, y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ y: heroShoeY }}
          className="absolute inset-0 z-1 flex items-center justify-center pointer-events-none"
        >
          <img src={ENGINEERING_SUPPORT_IMAGE} className="w-[60vw] max-w-4xl grayscale brightness-[0.05] contrast-[1.2]" alt="Silhouette" />
        </motion.div>
        
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 w-full h-full"
        >
          <video
            ref={videoRef}
            src={VIDEO_URL}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            style={{ filter: "contrast(1.3) brightness(0.85) saturate(0.8) drop-shadow(0 0 120px rgba(0,0,0,1))" }}
            muted
            playsInline
            preload="auto"
            loop
          />
        </motion.div>

          {/* Minimal Content Overlay */}
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: titleParallax, scale: titleScale, opacity: heroOpacity }}
              className="text-center space-y-12 flex flex-col items-center"
            >
              <div className="flex flex-col items-center">
                <h1 className="font-serif italic leading-[0.7] tracking-tighter text-white/95 flex flex-col items-center">
                  <span className="text-[18vw] md:text-[14vw] transform -translate-x-[2vw]">Absolute</span>
                  <span className="text-[18vw] md:text-[14vw] transform translate-x-[4vw]">Refinement</span>
                </h1>
              </div>

              <div className="pt-12 pointer-events-auto">
                <motion.button 
                  className="magnetic group flex items-center space-x-6 px-10 py-5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:bg-white hover:text-black"
                  whileHover={{ scale: 1.05, boxShadow: "0px 0px 40px rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  onClick={() => {
                    const architectureSection = document.getElementById('architecture');
                    if (architectureSection) architectureSection.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-black/10 transition-all duration-700" />
                    <motion.div
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
                    >
                      <ChevronRight size={14} className="text-white group-hover:text-black transition-all duration-500" />
                    </motion.div>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.6em] font-bold">Start Experience</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Repositioned Metadata */}
            <div className="absolute bottom-20 left-12 md:left-24 flex flex-col space-y-2 opacity-20">
              <span className="text-[9px] tracking-[0.5em] uppercase font-mono italic">Arch_Series_01</span>
              <div className="w-12 h-px bg-white/40" />
            </div>

            <div className="absolute bottom-20 right-12 md:right-24 flex flex-col items-end space-y-2 opacity-20">
              <span className="text-[9px] tracking-[0.5em] uppercase font-mono italic">S_44_Prototype</span>
              <div className="w-12 h-px bg-white/40" />
            </div>
          </div>

          {/* Depth Overlays */}
          <div className="absolute inset-0 pointer-events-none z-[5] bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-40" />
        </div>
      </section>

      {/* Tech-Scan Section */}
      <section id="architecture" className="relative h-[200vh] bg-black">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Main Cinematic Visual */}
          <div className="absolute inset-0 bg-radial-gradient opacity-[0.1] mix-blend-screen pointer-events-none" />
          
          <div className="relative w-full h-full flex flex-col lg:flex-row">
            {/* Cinematic Background Fog */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-white/[0.02] blur-[120px] rounded-full animate-float-fog" />
              <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-accent/[0.015] blur-[150px] rounded-full animate-float-fog" style={{ animationDelay: '-4s' }} />
            </div>

            {/* Content Overlays */}
            <div className="relative z-20 w-full lg:w-1/3 h-full flex flex-col justify-between p-12 md:p-24 pointer-events-none">
              <div className="space-y-12 pointer-events-auto">
                <div className="opacity-40">
                  <div className="text-white text-[9px] font-bold tracking-[0.4em] mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-accent/60 rounded-full animate-pulse" />
                    LEGACY_MODULE_PR1
                  </div>
                  <h2 className="font-serif text-5xl md:text-7xl italic font-light leading-tight text-white mb-8">Structural<br/>Analysis</h2>
                  <p className="text-sm text-white/40 leading-relaxed font-light font-mono italic max-w-sm">
                    A study in material depth and kinematic fluidity. Engineered for precision, refined for the absolute.
                  </p>
                </div>

                <div className="space-y-10">
                  {[
                    { label: "Material", val: "CF_MATRIX_V2", code: "MAT-01" },
                    { label: "Elasticity", val: "98.4% RECOVERY", code: "ELAS-Q" },
                    { label: "Weight", val: "240G_REFERENCE", code: "WGHT-LVL" }
                  ].map(spec => (
                    <div key={spec.label} className="space-y-4 group">
                      <div className="flex justify-between items-center text-[10px] tracking-widest uppercase font-bold">
                        <span className="text-white/20 group-hover:text-white/60 transition-colors">{spec.label}</span>
                        <span className="text-[8px] font-mono text-white/10">{spec.code}</span>
                      </div>
                      <div className="text-lg font-mono tracking-tight text-white/40 group-hover:text-white transition-colors">{spec.val}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="opacity-20 pointer-events-auto">
                <p className="text-[9px] font-mono text-white uppercase tracking-[0.3em] leading-relaxed">
                  Ref. 01A // ARCHIVE SERIES <br/> Verified Authentic Prototype
                </p>
              </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center p-4 lg:p-12 overflow-hidden">
              <div className="relative w-full max-w-7xl aspect-[16/10] group">
                <div className="absolute inset-0 bg-black/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute inset-0 overflow-hidden">
                  <motion.img 
                    src={SCAN_IMAGE} 
                    className="w-full h-full object-contain grayscale brightness-[0.45] contrast-[1.65] opacity-60 group-hover:opacity-100 group-hover:brightness-[0.8] transition-all duration-[3000ms]"
                    style={{ 
                      filter: "drop-shadow(0 20px 80px rgba(0,0,0,1))", 
                      scale: 1.3
                    }}
                  />
                </div>

                {/* Scan Nodes */}
                {techNodes.map(node => (
                  <motion.div 
                    key={node.id}
                    className="pulse-node"
                    style={{ 
                      top: node.y, 
                      left: node.x,
                      backgroundColor: "rgba(255,255,255,0.4)",
                      boxShadow: "0 0 15px rgba(255,255,255,0.2)"
                    }}
                    onMouseEnter={() => setActiveNode(node)}
                    onMouseLeave={() => setActiveNode(null)}
                    whileHover={{ scale: 2.2, zIndex: 50 }}
                  />
                ))}

                <AnimatePresence>
                  {activeNode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className={cn(
                        "absolute p-6 rounded-xl glass-panel w-80 z-50",
                        activeNode.id === "upper" && "top-10 left-10",
                        activeNode.id === "carbon" && "bottom-10 left-1/2 -translate-x-1/2",
                        activeNode.id === "kinetic" && "top-10 right-10"
                      )}
                    >
                      <div className="text-[11px] items-center uppercase tracking-[0.4em] text-white font-bold mb-4 flex gap-3">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
                        {activeNode.title}
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed font-mono italic mb-6">{activeNode.description}</p>
                      <div className="flex justify-between items-center pt-5 text-[9px] font-mono tracking-widest">
                        <span className="text-white/20">SPECIFICATION:</span>
                        <span className="text-white/80 font-bold">{activeNode.stat}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Reveal Section */}
      <section ref={synthesisRef} id="synthesis" className="py-48 px-12 md:px-24 bg-[#020202] overflow-hidden relative">
        <motion.div style={{ opacity: sOpacity, y: sY }} className="max-w-7xl mx-auto flex flex-col items-center justify-center relative z-10">
          {/* Cinematic Video Player - Premium Frame */}
          <div className="relative w-full max-w-5xl aspect-video bg-white/[0.01] border border-white/5 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden group">
            
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover scale-[1.05] opacity-70 contrast-125 brightness-105 mix-blend-screen transition-transform duration-[5s] group-hover:scale-110"
              style={{ filter: "drop-shadow(0 0 40px rgba(0,0,0,0.5))" }}
            >
              <source src={ENGINEERING_VIDEO_URL} type="video/mp4" />
            </video>

            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20" />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-20 md:gap-40 mt-24 max-w-5xl w-full">
            <motion.div style={{ y: ghostShoeY }} className="w-full md:w-1/2">
              <motion.img 
                src={ENGINEERING_SUPPORT_IMAGE} 
                className="w-full opacity-80 brightness-150 contrast-150 drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                alt="Engineering Detail"
                animate={{ y: [0, -15, 0] }}
                transition={{ 
                  duration: 8, 
                  ease: "easeInOut", 
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              />
            </motion.div>

            {/* Editorial Content */}
            <div className="text-left md:w-1/2 w-full">
              <div className="text-white/50 font-mono text-[10px] uppercase tracking-[0.4em] mb-4 text-center md:text-left">
                Sequence EX.04
              </div>
              <h3 className="text-white text-4xl font-light uppercase tracking-widest mb-6 text-center md:text-left">Structural Purity</h3>
              <p className="text-white/40 font-light text-sm leading-relaxed max-w-sm mx-auto md:mx-0 text-center md:text-left">
                The intersection of form and mechanical engineering. Where raw computational precision meets refined cinematic craftsmanship.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Deployment Section */}
      <section ref={deploymentRef} id="deployment" className="py-48 bg-black px-12 md:px-24 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row-reverse gap-32 items-center">
          <motion.div style={{ opacity: dOpacity, x: dX }} className="lg:w-1/2 space-y-12">
            <div className="inline-block px-3 py-1 bg-white/5">
              <span className="text-[9px] font-mono font-bold tracking-[0.5em] text-white/40 uppercase">Phase_04: Final Deployment</span>
            </div>
            <h2 className="font-serif text-6xl md:text-8xl italic leading-[0.85] tracking-tighter text-white">The New<br/>Standard</h2>
            <p className="text-white/30 text-lg leading-relaxed font-light font-mono italic">
              A culmination of design and engineering. The silhouette redefined for the modern elite. Experience unprecedented kinetic fluidity.
            </p>
            
            <div className="pt-8">
              <motion.button 
                className="magnetic group relative px-16 py-6 bg-white text-black text-[11px] font-bold uppercase tracking-[0.5em] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] hover:bg-white overflow-hidden rounded-full"
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 60px rgba(255,255,255,0.3)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="magnetic-glare absolute inset-0 bg-gradient-to-tr from-black/5 to-transparent opacity-0 pointer-events-none" />
                <span className="magnetic-inner block relative z-10">BEGIN JOURNEY</span>
              </motion.button>
            </div>
          </motion.div>

          <div className="lg:w-1/2 relative group">
            <div className="absolute -inset-4 pointer-events-none" />
            <div className="relative p-1 bg-transparent shadow-[0_0_120px_rgba(0,0,0,1)] overflow-hidden">
              {/* Material Detail Shine */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
                <div className="absolute top-0 left-0 w-full h-[300%] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-specular" style={{ animationDuration: '15s', animationDelay: '2s' }} />
              </div>

              <img 
                src={SYNTHESIS_IMAGE} 
                className="w-full grayscale brightness-[0.6] hover:grayscale-0 hover:brightness-100 transition-all duration-[2000ms] object-contain p-12 aspect-square" 
                alt="Luxury Sneaker Synthesis"
              />
              <div className="absolute top-10 right-10 flex items-center space-x-4 glass-panel px-6 py-3">
                <motion.div
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                >
                  <Activity size={16} className="text-white/40" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/60 uppercase">System Active</span>
                  <span className="text-[8px] font-mono text-white/20">Ref: LUXURY_CORE_V1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-60 py-12 bg-black text-white/10 text-center uppercase tracking-[0.5em] text-[9px] font-bold font-mono">
          © 2026 ARCHIVE SERIES // Unauthorized Usage Strictly Prohibited
        </footer>
      </section>

      {/* Status Bar Removed for pure cinematic view */}
      <audio ref={audioRef} loop preload="auto" onLoadedMetadata={(e) => { e.currentTarget.volume = 0.3; }}>
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-atmospheric-dark-ambient-drone-567.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

