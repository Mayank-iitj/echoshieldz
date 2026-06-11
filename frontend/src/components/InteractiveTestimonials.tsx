'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  date: string;
  quote: string;
  avatarBg: string;
}

const testimonialsData: Testimonial[] = [
  {
    name: 'Priya Sharma',
    role: 'Product Manager, Bangalore',
    date: 'May 16, 2025',
    quote: 'EchoShield completely changed how I handle unknown calls. I never realized how many sophisticated scam attempts were targeting my number until EchoShield started blocking them. Now I pick up calls with absolute peace of mind.',
    avatarBg: 'from-pink-500 to-rose-600'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Retired SBI Bank Manager',
    date: 'May 12, 2025',
    quote: 'It is so simple to see call risk scores in real-time. I used to dread OTP or KYC verification calls, but EchoShield has made screening stress-free. The real-time ScamBERT transcript flags are incredibly accurate.',
    avatarBg: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Anjali Desai',
    role: 'Software Engineer, Pune',
    date: 'April 28, 2025',
    quote: "I've tried typical spam blockers before, but EchoShield is on another level with real-time AI audio analysis. The 180ms latency is completely unnoticeable, and it caught three KYC scams in the first week.",
    avatarBg: 'from-amber-400 to-orange-500'
  },
  {
    name: 'Arjun Patel',
    role: 'Small Business Owner',
    date: 'April 20, 2025',
    quote: 'This app gave me absolute control over my incoming calls. I love the haptic alerts and automated blocking for 90%+ risk score numbers. It is like having a private security guard screening my calls in the background.',
    avatarBg: 'from-purple-500 to-violet-600'
  }
];

export default function InteractiveTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full py-24 bg-[var(--bg-primary)] border-b border-[var(--border-default)]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)]/50 mb-4">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">User Reviews</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Trusted by thousands of phone users
          </h2>
          <p className="text-sm md:text-base text-[var(--text-secondary)] mt-4 max-w-xl mx-auto">
            See how EchoShield is protecting everyday users from financial fraud and scam calls.
          </p>
        </div>

        {/* Big Testimonial Display Area */}
        <div className="relative min-h-[200px] mb-12 flex flex-col items-center justify-center text-center">
          <Quote className="w-12 h-12 text-neutral-800 mb-6 shrink-0" />
          
          <div className="relative w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <blockquote className="text-lg md:text-2xl font-medium text-white leading-relaxed tracking-tight max-w-3xl mx-auto">
                  "{testimonialsData[activeIndex].quote}"
                </blockquote>
                
                <div className="flex items-center justify-center gap-1.5 mt-6 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Selection Tabs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {testimonialsData.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 relative ${
                  isActive 
                    ? 'bg-[var(--bg-elevated)]/50 border-neutral-700 shadow-xl' 
                    : 'bg-[var(--bg-primary)] border-[var(--border-default)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface)]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${item.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">{item.name}</h4>
                    <p className="text-[10px] text-[var(--text-tertiary)] leading-tight mt-0.5">{item.role}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-[var(--text-tertiary)]">
                  <span>Verified User</span>
                  <span>{item.date}</span>
                </div>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeTabOutline"
                    className="absolute inset-0 border border-blue-500/40 rounded-xl pointer-events-none" 
                  />
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
