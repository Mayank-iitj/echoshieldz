'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertLevel } from '@/types';
import { Shield, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

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
    color: 'bg-green-600',
    icon: CheckCircle,
    label: 'Safe',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  SUSPICIOUS: {
    color: 'bg-yellow-500',
    icon: AlertTriangle,
    label: 'Suspicious',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  HIGH_RISK: {
    color: 'bg-orange-600',
    icon: AlertCircle,
    label: 'High Risk',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  CRITICAL: {
    color: 'bg-red-600',
    icon: AlertTriangle,
    label: 'Critical',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
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
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.color} text-white`}
      >
        <Shield className="w-4 h-4" />
        <span className="font-bold">{Math.round(riskScore)}%</span>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className={`rounded-2xl p-4 ${config.bgColor} border ${config.borderColor} shadow-lg max-w-md`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${config.color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">{Math.round(riskScore)}%</span>
                <span className="text-sm font-medium text-gray-600">{config.label}</span>
              </div>
              {scamType && scamType !== 'SAFE' && (
                <p className="text-sm font-semibold text-gray-700">
                  {scamType.replace('_', ' ')}
                </p>
              )}
            </div>
          </div>
          <Shield className={`w-8 h-8 ${config.color.replace('bg-', 'text-')}`} />
        </div>

        {explanation && (
          <p className="mt-3 text-sm text-gray-600">{explanation}</p>
        )}

        {isHighRisk && (onReportScam || onDismiss) && (
          <div className="mt-4 flex gap-2">
            {onReportScam && (
              <button
                onClick={onReportScam}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Report Scam
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default RiskBadge;