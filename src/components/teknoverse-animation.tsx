"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Typewriter from '@/components/typewriter';
import { ArrowRight, Zap } from 'lucide-react';

const sections = [
  { name: 'Home', hint: 'abstract digital' },
  { name: 'Features', hint: 'tech interface' },
  { name: 'Products', hint: 'futuristic product' },
  { name: 'About', hint: 'team collaboration' },
  { name: 'Blog', hint: 'hologram article' },
  { name: 'Contact', hint: 'communication network' },
];

function ParallaxCard({ section }: { section: { name: string; hint: string }}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-150, 150], [10, -10]);
  const rotateY = useTransform(x, [-150, 150], [-10, 10]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }
  
  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY,
      }}
      className="relative w-full h-full rounded-lg will-change-transform"
    >
        <div className="absolute inset-0 bg-black/40 rounded-lg z-10 flex items-end p-4">
            <h3 className="text-xl font-bold text-white">{section.name}</h3>
        </div>
        <Image
            src={`https://placehold.co/400x300/1A237E/30D5C8.png`}
            alt={`Screenshot of ${section.name} page`}
            width={400}
            height={300}
            data-ai-hint={section.hint}
            className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 rounded-lg border border-primary/50 pointer-events-none" style={{boxShadow: "0 0 2px hsl(var(--primary)), 0 0 5px hsl(var(--primary))"}}/>
    </motion.div>
  );
}


export default function TeknoverseAnimation() {
  const [animationState, setAnimationState] = useState<'idle' | 'unfolding' | 'revealed'>('idle');

  const panels = [
      [sections[0], sections[1]],
      [sections[2], sections[3]],
      [sections[4], sections[5]],
  ]

  const containerVariants = {
    idle: {},
    unfolding: {
        transition: {
            staggerChildren: 0.3,
        }
    },
    revealed: {
        scale: 0.8,
        y: -50,
        transition: {
            duration: 1,
            delay: 1,
        }
    }
  }

  const panelVariants = {
    idle: { rotateY: 120, x: '50%', opacity: 0, scale: 0.8 },
    unfolding: (i: number) => ({
        rotateY: 0,
        x: `${(i - 1) * 105}%`,
        opacity: 1,
        scale: 1,
        transition: { 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1],
        }
    }),
    revealed: (i: number) => ({
        x: `${(i - 1) * 105}%`,
        scale: 1,
        transition: {
            duration: 1,
        }
    }),
  }

  const cardContainerVariants = {
    idle: {},
    unfolding: {
        transition: { staggerChildren: 0.4, delayChildren: 0.8 }
    },
    revealed: {}
  }
  
  const cardVariants = {
      idle: { opacity: 0, y: 30, scale: 0.95 },
      unfolding: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { duration: 0.6, ease: 'easeOut' }
      },
      revealed: {}
  };


  useEffect(() => {
    if (animationState === 'unfolding') {
        const timer = setTimeout(() => setAnimationState('revealed'), panels.length * 300 + 1200);
        return () => clearTimeout(timer);
    }
  }, [animationState, panels.length]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[600px] perspective-[2000px]">
        <AnimatePresence>
            {animationState === 'idle' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    className="z-20 text-center"
                >
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-5xl md:text-7xl font-bold text-glow-accent mb-4"
                    >
                        Teknoverse
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="text-lg md:text-xl text-primary-foreground/80 mb-8"
                    >
                        Experience the future of web, unfolded.
                    </motion.p>
                    <Button onClick={() => setAnimationState('unfolding')} size="lg" className="neon-glow-primary">
                        <Zap className="mr-2 h-5 w-5" />
                        Begin Unfolding
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>

        <motion.div
            className="absolute w-[300px] md:w-[400px] h-[650px] md:h-[650px]"
            style={{ transformStyle: 'preserve-3d' }}
            variants={containerVariants}
            initial="idle"
            animate={animationState}
        >
            {animationState !== 'idle' && panels.map((panelSections, i) => (
                <motion.div
                    key={i}
                    custom={i}
                    variants={panelVariants}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        transformOrigin: 'center',
                    }}
                >
                    <motion.div
                        className="w-full h-full flex flex-col gap-8 bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl p-6"
                        variants={cardContainerVariants}
                    >
                        {panelSections.map((section) => (
                            <motion.div key={section.name} variants={cardVariants} className="w-full h-1/2">
                                <ParallaxCard section={section} />
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            ))}
        </motion.div>

        <AnimatePresence>
            {animationState === 'revealed' && (
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="z-20 text-center mt-16 absolute bottom-0"
                >
                    <Button size="lg" className="neon-glow-accent text-accent-foreground font-bold text-lg">
                        Explore Teknoverse Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <div className="mt-4 font-mono text-glow-accent">
                        <Typewriter text="https://teknoverse.dev" delay={2} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
}
