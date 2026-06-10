'use client';

import React from 'react';

export default function Operators() {
  const operators = [
    {
      name: 'Reliance Jio',
      logo: (
        <svg viewBox="0 0 100 30" fill="currentColor" className="h-6 w-auto text-neutral-400 hover:text-white transition-colors">
          <circle cx="15" cy="15" r="12" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M11 10 H13 V18 H11 Z M17 10 H19 V18 H17 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <text x="36" y="21" fontFamily="sans-serif" fontSize="16" fontWeight="bold" letterSpacing="1">JIO</text>
        </svg>
      )
    },
    {
      name: 'Airtel',
      logo: (
        <svg viewBox="0 0 100 30" fill="currentColor" className="h-6 w-auto text-neutral-400 hover:text-white transition-colors">
          <path d="M12 25 C12 10, 22 5, 22 15 C22 25, 32 25, 32 15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <text x="38" y="21" fontFamily="sans-serif" fontSize="15" fontWeight="bold" letterSpacing="0.5">airtel</text>
        </svg>
      )
    },
    {
      name: 'Vodafone Idea',
      logo: (
        <svg viewBox="0 0 100 30" fill="currentColor" className="h-6 w-auto text-neutral-400 hover:text-white transition-colors">
          <path d="M8 8 L18 22 L28 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="8" r="2.5" />
          <text x="42" y="21" fontFamily="sans-serif" fontSize="18" fontWeight="bold">Vi</text>
        </svg>
      )
    },
    {
      name: 'BSNL',
      logo: (
        <svg viewBox="0 0 100 30" fill="currentColor" className="h-6 w-auto text-neutral-400 hover:text-white transition-colors">
          <path d="M10 6 C25 6, 25 24, 40 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M10 24 C25 24, 25 6, 40 6" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          <text x="48" y="21" fontFamily="sans-serif" fontSize="16" fontWeight="bold">BSNL</text>
        </svg>
      )
    },
    {
      name: 'TRAI',
      logo: (
        <svg viewBox="0 0 100 30" fill="currentColor" className="h-6 w-auto text-neutral-400 hover:text-white transition-colors">
          <rect x="5" y="5" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path d="M10 15 H20 M15 10 V20" stroke="currentColor" strokeWidth="2" />
          <text x="32" y="20" fontFamily="sans-serif" fontSize="14" fontWeight="bold">TRAI SEC</text>
        </svg>
      )
    }
  ];

  return (
    <div className="w-full py-8 border-y border-neutral-900 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-6">
          Real-time threat feeds synced with major telecom networks
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-60 hover:opacity-100 transition-opacity duration-300">
          {operators.map((op, i) => (
            <div key={i} className="flex items-center justify-center" title={op.name}>
              {op.logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
