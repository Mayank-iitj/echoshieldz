'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ScrollRevealTextProps {
  text: string;
}

export default function ScrollRevealText({ text }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.75', 'end 0.45'],
  });

  const words = text.split(' ');

  return (
    <div 
      ref={containerRef} 
      className="w-full min-h-[50vh] flex items-center justify-center bg-black border-y border-neutral-900 py-24"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-2xl md:text-4xl lg:text-5xl font-medium leading-relaxed tracking-tight text-neutral-600 flex flex-wrap justify-center">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = Math.min(1, (i + 1.5) / words.length);
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
}

interface WordProps {
  children: string;
  progress: any;
  range: [number, number];
}

function Word({ children, progress, range }: WordProps) {
  const color = useTransform(progress, range, ['#404040', '#ffffff']);

  return (
    <motion.span 
      style={{ color }} 
      className="mr-3 md:mr-4 mb-2 inline-block transition-colors duration-75"
    >
      {children}
    </motion.span>
  );
}
