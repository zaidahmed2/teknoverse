
"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import Image from 'next/image';

type Section = { 
  id: string | number; 
  name?: string; 
  imageUrl?: string 
};

const Card = ({ i, section, total, scrollYProgress }: { i: number; section: Section; total: number; scrollYProgress: MotionValue<number> }) => {
  const inputRange = [ (i - 1) / total, i / total, (i + 1) / total ];
  
  const sharpFocusInputRange = [
    (i - 0.7) / total, 
    (i - 0.5) / total, 
    (i + 0.5) / total, 
    (i + 0.7) / total
  ];

  const scale = useTransform(scrollYProgress, inputRange, [1, 1.05, 1]);
  const x = useTransform(scrollYProgress, inputRange, ["25%", "0%", "-25%"]);
  const filter = useTransform(scrollYProgress, sharpFocusInputRange, ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);
  const opacity = useTransform(scrollYProgress, inputRange, [0.3, 1, 0.3]);
  const zIndex = useTransform(opacity, (val) => Math.round(val * 20));

  return (
    <motion.div
      style={{
        position: 'absolute',
        x,
        scale,
        filter,
        opacity,
        zIndex,
      }}
      className="flex h-[80vh] w-[80vw] max-w-7xl items-center justify-center"
    >
      <div className="relative h-full w-full rounded-2xl border border-border/20 bg-card/60 p-4 soft-shadow backdrop-blur-lg">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          {section.imageUrl && (
            <Image
                src={section.imageUrl}
                alt={`Screenshot of ${section.name || 'section'}`}
                fill
                className="object-contain"
                sizes="100vw"
                quality={100}
                priority={i < 2}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          {section.name && (
            <h2 className="absolute bottom-6 left-6 text-4xl font-bold text-white">
              {section.name}
            </h2>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface TeknoverseAnimationProps {
    sections: Section[];
}

export default function TeknoverseAnimation({ sections = [] }: TeknoverseAnimationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  const scrollHeight = sections.length > 0 ? `${sections.length * 100}vh` : '0';

  return (
    <div ref={scrollRef} style={{ height: scrollHeight }}>
      {sections.length > 0 && (
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-background" />
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.03),_transparent_40%),radial-gradient(circle_at_bottom_right,_hsl(var(--accent)/0.03),_transparent_40%)]" />

          {sections.map((section, i) => (
            <Card key={section.id} i={i} section={section} total={sections.length} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      )}
    </div>
  );
}
