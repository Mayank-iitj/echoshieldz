'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertLevel } from '@/types';
import { Shield, AlertTriangle, AlertCircle, CheckCircle, Flag, X } from 'lucide-react';

interface RiskBadgeProps {
  riskScore: number;
  alertLevel: AlertLevel;
  scamType?: string;
  explanation?: string;
  compact?: boolean;
  onDismiss?: () => void;
  onReportScam?: () => void;
}

const levelConfig = {
  SAFE: {
    gradient: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/15',
    icon: CheckCircle,
    label: 'Safe',
    color: 'text-green-400',
    dotColor: 'bg-green-500',
    badgeBg: 'bg-green-500/15',
    btnBg: 'bg-green-600 hover:bg-green-500',
  },
  SUSPICIOUS: {
    gradient: 'from-yellow-500/10 to-amber-500/10',
    border: 'border-yellow-500/15',
    icon: AlertTriangle,
    label: 'Suspicious',
    color: 'text-yellow-400',
    dotColor: 'bg-yellow-500',
    badgeBg: 'bg-yellow-500/15',
    btnBg: 'bg-yellow-600 hover:bg-yellow-500',
  },
  HIGH_RISK: {
    gradient: 'from-orange-500/10 to-red-500/10',
    border: 'border-orange-500/15',
    icon: AlertCircle,
    label: 'High Risk',
    color: 'text-orange-400',
    dotColor: 'bg-orange-500',
    badgeBg: 'bg-orange-500/15',
    btnBg: 'bg-orange-600 hover:bg-orange-500',
  },
  CRITICAL: {
    gradient: 'from-red-500/10 to-rose-500/10',
    border: 'border-red-500/15',
    icon: AlertTriangle,
    label: 'Critical',
    color: 'text-red-400',
    dotColor: 'bg-red-500',
    badgeBg: 'bg-red-500/15',
    btnBg: 'bg-red-600 hover:bg-red-500',
  },
};

export function RiskBadge({
  riskScore,
  alertLevel,
  scamType,
  explanation,
  compact = false,
  onDismiss,
  onReportScam,
}: RiskBadgeProps) {
  const config = levelConfig[alertLevel] || levelConfig.SAFE;
  const Icon = config.icon;

  const isHighRisk = alertLevel === 'HIGH_RISK' || alertLevel === 'CRITICAL';

  if (compact) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.badgeBg} ${config.color} border ${config.border}`}
      >
        <Shield className="w-3.5 h-3.5" />
        <span className="font-bold text-sm tabular-nums">{Math.round(riskScore)}%</span>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -20, opacity: 0, scale: 0.95 }}
        className={`relative rounded-2xl bg-gradient-to-br ${config.gradient} border ${config.border} overflow-hidden max-w-md`}
      >
        {/* Top glow line */}
        <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20 ${config.color}`} />

        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${config.badgeBg} border ${config.border}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-3xl font-black tabular-nums ${config.color}`}>
                    {Math.round(riskScore)}%
                  </span>
                  <span className={`text-xs font-bold tracking-wider uppercase ${config.color} opacity-60`}>
                    {config.label}
                  </span>
                </div>
                {scamType && scamType !== 'SAFE' && (
                  <p className="text-sm font-semibold text-gray-300 mt-0.5">
                    {scamType.replace('_', ' ')}
                  </p>
                )}
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {explanation && (
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">{explanation}</p>
          )}

          {isHighRisk && onReportScam && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={onReportScam}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 ${config.btnBg} text-white rounded-xl font-semibold text-sm transition-colors shadow-lg`}
              >
                <Flag className="w-4 h-4" />
                Report Scam
              </button>
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="flex-1 px-4 py-2.5 border border-white/[0.1] text-gray-400 rounded-xl font-semibold text-sm hover:bg-white/[0.05] transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default RiskBadge;