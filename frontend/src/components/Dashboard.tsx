'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Phone,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
  BarChart3,
} from 'lucide-react';
import { DashboardStats } from '@/types';
import api from '@/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#a855f7', '#6366f1'];

interface DashboardProps {
  stats?: DashboardStats;
}

// Mock weekly trend data
const weeklyTrend = [
  { day: 'Mon', calls: 45, scams: 12 },
  { day: 'Tue', calls: 52, scams: 18 },
  { day: 'Wed', calls: 38, scams: 8 },
  { day: 'Thu', calls: 65, scams: 24 },
  { day: 'Fri', calls: 48, scams: 15 },
  { day: 'Sat', calls: 30, scams: 6 },
  { day: 'Sun', calls: 22, scams: 4 },
];

export function Dashboard({ stats: initialStats }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(initialStats || null);
  const [loading, setLoading] = useState(!initialStats);

  useEffect(() => {
    if (!initialStats) {
      api.getDashboardStats().then(setStats).catch(console.error).finally(() => setLoading(false));
    }
  }, [initialStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const pieData = stats.top_scams.map((s) => ({
    name: s.type.replace('_', ' '),
    value: s.count,
  }));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { y: 16, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  const statCards = [
    {
      label: 'Total Calls',
      value: stats.total_calls.toLocaleString(),
      icon: Phone,
      gradient: 'from-blue-500/10 to-cyan-500/10',
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/10',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      label: 'Scams Detected',
      value: stats.scams_detected.toLocaleString(),
      icon: Shield,
      gradient: 'from-red-500/10 to-orange-500/10',
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/10 border-red-500/10',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      label: 'False Positives',
      value: stats.false_positives.toString(),
      icon: AlertTriangle,
      gradient: 'from-yellow-500/10 to-amber-500/10',
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/10 border-yellow-500/10',
      trend: '-3.1%',
      trendUp: false,
    },
    {
      label: 'Avg Risk Score',
      value: stats.avg_risk_score.toFixed(1),
      icon: TrendingUp,
      gradient: 'from-emerald-500/10 to-green-500/10',
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/10',
      trend: '-1.8%',
      trendUp: false,
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <motion.div
            key={card.label}
            variants={item}
            className="group relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 overflow-hidden"
          >
            {/* Subtle gradient bg */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl ${card.iconBg} border`}>
                  <card.icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${card.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {card.trend}
                </div>
              </div>
              <p className="text-3xl font-black text-white tracking-tight">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Area Chart - Weekly Trend (2 cols) */}
        <motion.div
          variants={item}
          className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/10">
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">Weekly Activity</h3>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-gray-500">Calls</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-gray-500">Scams</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorScams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 11, fill: '#55556a' }} />
                <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 11, fill: '#55556a' }} />
                <Tooltip
                  contentStyle={{
                    background: '#16162a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  }}
                  labelStyle={{ color: '#f0f0f5', fontWeight: 600 }}
                  itemStyle={{ color: '#8b8b9e' }}
                />
                <Area type="monotone" dataKey="calls" stroke="#6366f1" strokeWidth={2} fill="url(#colorCalls)" />
                <Area type="monotone" dataKey="scams" stroke="#ef4444" strokeWidth={2} fill="url(#colorScams)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut Chart - Scam Distribution */}
        <motion.div
          variants={item}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/10">
              <BarChart3 className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">Scam Types</h3>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#16162a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  }}
                  labelStyle={{ color: '#f0f0f5' }}
                  itemStyle={{ color: '#8b8b9e' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-gray-500 capitalize">{entry.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-300 tabular-nums">{entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Bar Chart + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart */}
        <motion.div
          variants={item}
          className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/10">
              <BarChart3 className="w-4 h-4 text-orange-400" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">Top Scam Categories</h3>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.top_scams} barSize={32}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis
                  dataKey="type"
                  tick={{ fontSize: 10, fill: '#55556a' }}
                  stroke="rgba(255,255,255,0.1)"
                  tickFormatter={(v: string) => v.replace('_', '\n')}
                />
                <YAxis stroke="rgba(255,255,255,0.1)" tick={{ fontSize: 11, fill: '#55556a' }} />
                <Tooltip
                  contentStyle={{
                    background: '#16162a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                  }}
                  labelStyle={{ color: '#f0f0f5', fontWeight: 600 }}
                  itemStyle={{ color: '#8b8b9e' }}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={item}
          className="space-y-4"
        >
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/10">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">Performance</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Avg Latency', value: '142ms', pct: 85, color: '#22c55e' },
                { label: 'Detection Rate', value: '96.8%', pct: 97, color: '#6366f1' },
                { label: 'False Positive', value: '1.8%', pct: 2, color: '#eab308' },
              ].map((metric) => (
                <div key={metric.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{metric.label}</span>
                    <span className="text-xs font-bold text-gray-300">{metric.value}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: metric.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 p-5">
            <div className="text-center">
              <div className="text-4xl font-black gradient-text mb-1">27.4%</div>
              <p className="text-xs text-gray-500">of calls this week were potential scams</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-emerald-400">
                <ArrowDownRight className="w-3 h-3" />
                <span className="font-semibold">4.2% fewer</span>
                <span className="text-gray-600">than last week</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Dashboard;