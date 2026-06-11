'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  AlertTriangle,
  CheckCircle,
  Flag,
  Search,
  Shield,
  PhoneOff,
  ExternalLink,
} from 'lucide-react';
import { CallHistoryItem, AlertLevel } from '@/types';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface CallHistoryProps {
  items?: CallHistoryItem[];
}

const levelConfig: Record<AlertLevel, { bg: string; text: string; dot: string; border: string }> = {
  SAFE: {
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    dot: 'bg-green-500',
    border: 'border-green-500/20',
  },
  SUSPICIOUS: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    dot: 'bg-yellow-500',
    border: 'border-yellow-500/20',
  },
  HIGH_RISK: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    dot: 'bg-orange-500',
    border: 'border-orange-500/20',
  },
  CRITICAL: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    dot: 'bg-red-500',
    border: 'border-red-500/20',
  },
};

export function CallHistory({ items: initialItems }: CallHistoryProps) {
  const [items, setItems] = useState<CallHistoryItem[]>(initialItems || []);
  const [loading, setLoading] = useState(!initialItems);
  const [filter, setFilter] = useState<'all' | 'scams' | 'safe'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!initialItems) {
      api.getCallHistory().then(setItems).catch(console.error).finally(() => setLoading(false));
    }
  }, [initialItems]);

  const filteredItems = items.filter((item) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'scams' && item.alert_level !== 'SAFE') ||
      (filter === 'safe' && item.alert_level === 'SAFE');
    const matchesSearch =
      !search || item.phone_number.includes(search);
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input
            type="text"
            placeholder="Search phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-gray-200 placeholder:text-gray-600 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-indigo-500/10 transition-all"
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          {(['all', 'scams', 'safe'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20'
                  : 'text-gray-500 hover:text-gray-300 border border-transparent'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Call Cards */}
      <div className="space-y-2">
        {filteredItems.map((item, index) => {
          const config = levelConfig[item.alert_level];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="group rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`p-2.5 rounded-xl ${config.bg} border ${config.border}`}>
                  {item.alert_level === 'SAFE' ? (
                    <CheckCircle className={`w-5 h-5 ${config.text}`} />
                  ) : item.alert_level === 'CRITICAL' ? (
                    <PhoneOff className={`w-5 h-5 ${config.text}`} />
                  ) : (
                    <AlertTriangle className={`w-5 h-5 ${config.text}`} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-white font-mono">{item.phone_number}</span>
                    {item.was_reported && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/10">
                        <Flag className="w-2.5 h-2.5" />
                        Reported
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-600">
                      {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                    </span>
                    {item.scam_type !== 'SAFE' && (
                      <>
                        <span className="text-gray-700">·</span>
                        <span className="text-xs text-gray-500 font-medium">
                          {item.scam_type.replace('_', ' ')}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Risk Score */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-lg font-black tabular-nums ${config.text}`}>
                      {item.risk_score.toFixed(0)}%
                    </div>
                    <div className={`text-[10px] font-bold tracking-wider ${config.text} opacity-60`}>
                      {item.alert_level.replace('_', ' ')}
                    </div>
                  </div>

                  {/* Mini gauge */}
                  <div className="w-10 h-10 relative">
                    <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18" cy="18" r="14"
                        fill="none"
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18" cy="18" r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${(item.risk_score / 100) * 88} 88`}
                        strokeLinecap="round"
                        className={config.text}
                      />
                    </svg>
                  </div>
                </div>

                {/* Arrow */}
                <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <Phone className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No calls found</p>
          <p className="text-xs text-gray-700 mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default CallHistory;