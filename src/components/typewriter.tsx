"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";

export interface ITypewriter {
  text: string;
  delay?: number;
  className?: string;
}

export default function Typewriter({ text, delay = 0, className }: ITypewriter) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest));

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: "tween",
      delay: delay,
      duration: text.length * 0.08,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [count, text.length, delay, text]);

  return (
    <motion.span className={className}>
      {displayText}
    </motion.span>
  );
}
