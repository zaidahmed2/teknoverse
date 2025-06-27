"use client";

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Typewriter from '@/components/typewriter';
import { ArrowRight } from 'lucide-react';

const sections = [
  { id: 1, name: 'Home', imageUrl: 'https://i.ibb.co/9gPscgC/Home.png' },
  { id: 2, name: 'About', imageUrl: 'https://i.ibb.co/X22N3yY/About.png' },
  { id: 3, name: 'Products', imageUrl: 'https://i.ibb.co/4Z5gYj5/Product.png' },
  { id: 4, name: 'Blog', imageUrl: 'https://i.ibb.co/b3sS9xR/Blog.png' },
  { id: 5, name: 'Contact', imageUrl: 'https://i.ibb.co/6y1820W/Contact.png' },
];

const Card = ({ i, section, scrollYProgress }: { i: number; section: (typeof sections)[0]; scrollYProgress: MotionValue<number> }) => {
  const total = sections.length;
  const inputRange = [ (i - 1) / total, i / total, (i + 1) / total ];
  
  const scale = useTransform(scrollYProgress, inputRange, [1, 1.05, 1]);
  const x = useTransform(scrollYProgress, inputRange, ["25%", "0%", "-25%"]);
  const filter = useTransform(scrollYProgress, inputRange, ["blur(16px)", "blur(0px)", "blur(16px)"]);
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
      className="flex h-[70vh] w-[90vw] max-w-5xl items-center justify-center"
    >
      <div className="relative h-full w-full rounded-2xl border border-border/20 bg-card/60 p-4 soft-shadow backdrop-blur-lg">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <Image
              src={section.imageUrl}
              alt={`Screenshot of ${section.name} page`}
              fill
              className="object-cover"
              priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h2 className="absolute bottom-6 left-6 text-4xl font-bold text-white">
            {section.name}
          </h2>
        </div>
      </div>
    </motion.div>
  );
};

export default function TeknoverseAnimation() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  return (
    <>
      <div ref={scrollRef} style={{ height: `${sections.length * 100}vh` }}>
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-background" />
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.03),_transparent_40%),radial-gradient(circle_at_bottom_right,_hsl(var(--accent)/0.03),_transparent_40%)]" />

          {sections.map((section, i) => (
            <Card key={section.id} i={i} section={section} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-6xl">Ready to Explore Teknoverse?</h2>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            You've seen the glimpses, now experience the full vision. Click below to enter a new digital dimension.
          </p>
          <Button size="lg" className="button-glow-accent bg-accent text-accent-foreground text-lg font-bold">
              Visit Teknoverse Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="mt-6 font-mono text-lg text-glow-accent">
              <Typewriter text="https://teknoverse.dev" />
          </div>
      </div>
    </>
  );
}
