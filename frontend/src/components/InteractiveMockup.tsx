'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Terminal, Eye, Brain, Settings } from 'lucide-react';

export default function InteractiveMockup() {
  // Float animations for floating card aesthetics
  const floatAnimation = (delay: number) => ({
    y: [0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      repeatType: 'reverse' as const,
      ease: 'easeInOut',
      delay
    }
  });

  return (
    <div className="relative w-full max-w-5xl mx-auto min-h-[550px] mt-12 mb-20 px-4 flex flex-col md:grid md:grid-cols-12 gap-6 items-center justify-center">
      
      {/* Background Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-purple-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Card 1: Active Shield Status (Left/Top) */}
      <motion.div 
        animate={floatAnimation(0)}
        whileHover={{ scale: 1.02 }}
        className="w-full md:col-span-4 surface-elevated p-6 rounded-2xl border border-[var(--border-strong)] shadow-2xl relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500 opacity-50" />
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Shield Status</div>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Active Protection</h4>
            <p className="text-xs text-[var(--text-secondary)]">ScamBERT 3.0 Live Screening</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--border-default)] flex justify-between text-xs text-[var(--text-tertiary)]">
          <span>Latency: &lt;180ms</span>
          <span>Region: India (Optimized)</span>
        </div>
      </motion.div>

      {/* Card 2: AI Live Risk Meter & Classification (Center/Large) */}
      <motion.div 
        animate={floatAnimation(0.5)}
        whileHover={{ scale: 1.02 }}
        className="w-full md:col-span-5 surface-elevated p-6 rounded-2xl border border-[var(--border-strong)] shadow-2xl relative overflow-hidden cursor-pointer"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 to-orange-500 opacity-75" />
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
            <Brain className="w-3.5 h-3.5 text-red-400" />
            AI Threat Classifier
          </div>
          <span className="px-2 py-0.5 bg-red-950/50 border border-red-500/30 rounded text-[10px] font-semibold text-red-400 uppercase tracking-wider">
            Critical Risk
          </span>
        </div>
        
        <div className="text-center my-6">
          <div className="text-4xl md:text-5xl font-black text-white tracking-tight">87%</div>
          <p className="text-xs text-red-400 font-semibold tracking-wider uppercase mt-1">KYC FRAUD DETECTED</p>
        </div>

        {/* Custom Progress Bar */}
        <div className="w-full bg-[var(--bg-elevated)] rounded-full h-2.5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '87%' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="bg-gradient-to-r from-orange-500 to-red-600 h-full rounded-full"
          />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>Prosody: High stress indicators found</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>NLP: Core scam triggers detected ("Verify OTP")</span>
          </div>
        </div>
      </motion.div>

      {/* Card 3: Recent Threat Log (Right/Top) */}
      <motion.div 
        animate={floatAnimation(1)}
        whileHover={{ scale: 1.02 }}
        className="w-full md:col-span-3 surface-elevated p-6 rounded-2xl border border-[var(--border-strong)] shadow-2xl relative overflow-hidden cursor-pointer"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-50" />
        <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Live Threat Feed</div>
        
        <div className="space-y-3">
          <div className="p-2.5 bg-[var(--bg-elevated)]/50 rounded-lg border border-[var(--border-strong)]/50 flex justify-between items-center text-xs">
            <div>
              <p className="text-white font-medium">+91 98765 43210</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">KYC Scam • 2m ago</p>
            </div>
            <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded text-[10px]">Blocked</span>
          </div>

          <div className="p-2.5 bg-[var(--bg-elevated)]/50 rounded-lg border border-[var(--border-strong)]/50 flex justify-between items-center text-xs">
            <div>
              <p className="text-white font-medium">+91 99123 45678</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">Lottery Fraud • 15m ago</p>
            </div>
            <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded text-[10px]">Blocked</span>
          </div>

          <div className="p-2.5 bg-[var(--bg-elevated)]/50 rounded-lg border border-[var(--border-strong)]/50 flex justify-between items-center text-xs">
            <div>
              <p className="text-white font-medium">+91 94110 88231</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">Spam Telemarketer • 1h ago</p>
            </div>
            <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-semibold rounded text-[10px]">Flagged</span>
          </div>
        </div>
      </motion.div>

      {/* Card 4: Audio Transcript Snippet (Left/Bottom) */}
      <motion.div 
        animate={floatAnimation(0.3)}
        whileHover={{ scale: 1.02 }}
        className="w-full md:col-span-5 surface-elevated p-6 rounded-2xl border border-[var(--border-strong)] shadow-2xl md:mt-2 relative overflow-hidden cursor-pointer"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 opacity-50" />
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            Live Audio Transcript
          </div>
          <span className="text-[10px] text-[var(--text-tertiary)]">ASR Stream</span>
        </div>
        <div className="font-mono text-xs text-neutral-300 space-y-2 leading-relaxed bg-[var(--bg-surface)] p-3 rounded-lg border border-[var(--border-default)]">
          <p className="text-[var(--text-tertiary)]"><span className="text-purple-400">Caller [0:04]:</span> "Aapka card block ho gaya hai..."</p>
          <p className="text-[var(--text-tertiary)]"><span className="text-purple-400">Caller [0:08]:</span> "Kuch hi der mein SIM band ho jayegi..."</p>
          <p className="text-white bg-red-950/20 px-1 border-l-2 border-red-500"><span className="text-red-400 font-bold">Caller [0:12]:</span> "Verification ke liye phone par aaya OTP share karein..."</p>
        </div>
        <div className="flex items-center gap-2 mt-4 text-[10px] text-red-400 font-medium bg-red-950/10 border border-red-500/10 rounded-lg p-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>ScamBERT Flagged: Requesting credentials via high-urgency call pattern.</span>
        </div>
      </motion.div>

      {/* Card 5: Safe Metrics / Verification (Right/Bottom) */}
      <motion.div 
        animate={floatAnimation(0.8)}
        whileHover={{ scale: 1.02 }}
        className="w-full md:col-span-7 surface-elevated p-6 rounded-2xl border border-[var(--border-strong)] shadow-2xl md:mt-2 relative overflow-hidden cursor-pointer"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500 opacity-50" />
        <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">EchoShield Stats</div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-[var(--bg-elevated)]/50 rounded-xl border border-neutral-850">
            <div className="text-2xl font-bold text-white">1,402</div>
            <div className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase mt-1">Calls Filtered</div>
          </div>
          <div className="p-3 bg-[var(--bg-elevated)]/50 rounded-xl border border-neutral-850">
            <div className="text-2xl font-bold text-emerald-400">100%</div>
            <div className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase mt-1">Device Safety</div>
          </div>
          <div className="p-3 bg-[var(--bg-elevated)]/50 rounded-xl border border-neutral-850">
            <div className="text-2xl font-bold text-red-400">92</div>
            <div className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase mt-1">Scams Blocked</div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-secondary)] bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-default)]">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Database matchingTRAI Scam registries</span>
          </div>
          <span className="text-[var(--text-tertiary)]">Updated 10m ago</span>
        </div>
      </motion.div>

    </div>
  );
}
