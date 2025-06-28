
"use client";

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

type Section = { 
  id: string | number; 
  name: string; 
  imageUrl: string 
};

const Card = ({ i, section, total, scrollYProgress, onClick }: { i: number; section: Section; total: number; scrollYProgress: MotionValue<number>; onClick: () => void }) => {
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
      className="flex h-[90vh] w-[95vw] max-w-7xl items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <div className="relative h-full w-full rounded-2xl border border-border/20 bg-card/60 p-4 soft-shadow backdrop-blur-lg">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <Image
              src={section.imageUrl}
              alt={`Screenshot of ${section.name} page`}
              fill
              className="object-cover"
              sizes="100vw"
              quality={100}
              priority={i < 2}
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

interface TeknoverseAnimationProps {
    sections: Section[];
    ctaHeading: string;
    ctaParagraph: string;
    ctaButtonText: string;
    ctaButtonLink: string;
}

export default function TeknoverseAnimation({ 
    sections = [],
    ctaHeading,
    ctaParagraph,
    ctaButtonText,
    ctaButtonLink,
}: TeknoverseAnimationProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <>
      <div ref={scrollRef} style={{ height: `${sections.length * 100}vh` }}>
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 bg-background" />
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_left,_hsl(var(--primary)/0.03),_transparent_40%),radial-gradient(circle_at_bottom_right,_hsl(var(--accent)/0.03),_transparent_40%)]" />

          {sections.map((section, i) => (
            <Card key={section.id} i={i} section={section} total={sections.length} scrollYProgress={scrollYProgress} onClick={() => handleImageClick(section.imageUrl)} />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-6xl">{ctaHeading}</h2>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
            {ctaParagraph}
          </p>
          <Link href={ctaButtonLink} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-accent text-accent-foreground text-lg font-bold button-glow-accent hover:bg-black hover:text-white hover:shadow-none transition-all duration-300">
                {ctaButtonText} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="absolute bottom-8 text-sm text-muted-foreground">
            © {new Date().getFullYear()} Designed by <a href="https://teknoverse.com.au/" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">Teknoverse</a>
          </p>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-black/80 backdrop-blur-sm border-0 flex items-center justify-center">
            <DialogClose className="absolute right-4 top-4 z-10 text-white bg-black/50 hover:bg-black/75 p-2 rounded-full transition-colors">
                <X className="h-6 w-6" />
            </DialogClose>
            {selectedImage && (
              <div className="relative w-[95vw] h-[95vh]">
                <Image
                    src={selectedImage}
                    alt="Full screen view"
                    layout="fill"
                    objectFit="contain"
                    quality={100}
                />
              </div>
            )}
        </DialogContent>
      </Dialog>
    </>
  );
}
