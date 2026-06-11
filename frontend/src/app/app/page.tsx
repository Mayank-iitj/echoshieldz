'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  Phone,
  Settings,
  Bell,
  Activity,
  Menu,
  X,
  Radio,
  ChevronRight,
  LogOut,
  User,
  Zap,
  Upload,
} from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import CallHistory from '@/components/CallHistory';
import RiskBadge from '@/components/RiskBadge';
import ScamSimulator from '@/components/ScamSimulator';

type Page = 'dashboard' | 'history' | 'analyze' | 'simulate' | 'settings';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'dashboard' as Page, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'history' as Page, icon: Phone, label: 'Call History' },
    { id: 'simulate' as Page, icon: Radio, label: 'Simulate' },
    { id: 'analyze' as Page, icon: Activity, label: 'Analyze' },
    { id: 'settings' as Page, icon: Settings, label: 'Settings' },
  ];

  const pageTitle: Record<Page, string> = {
    dashboard: 'Dashboard',
    history: 'Call History',
    simulate: 'Scam Simulator',
    analyze: 'Live Analysis',
    settings: 'Settings',
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#06060b]">
      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col border-r border-white/[0.04] bg-[#0a0a12] transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a12]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">EchoShield</h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">v2.0 · AI Engine</p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="mx-4 mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">Mayank</p>
              <p className="text-[11px] text-gray-500">Admin · Online</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          <p className="px-3 pt-2 pb-2 text-[10px] font-bold text-gray-600 tracking-[0.15em] uppercase">Navigation</p>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/15 to-purple-500/10 text-white border border-indigo-500/20 shadow-lg shadow-indigo-500/5'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'text-gray-600 group-hover:text-gray-400'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="nav-indicator">
                    <ChevronRight className="w-4 h-4 text-indigo-400" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom: System Status */}
        <div className="p-4 space-y-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/10">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-40" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-green-400">System Online</p>
                <p className="text-[10px] text-gray-600">All models loaded</p>
              </div>
              <Zap className="w-3.5 h-3.5 text-green-500" />
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-white/[0.04] bg-[#06060b]/80 backdrop-blur-xl px-6 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5 text-gray-400" /> : <Menu className="w-5 h-5 text-gray-400" />}
              </button>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-white">{pageTitle[currentPage]}</h2>
                <span className="text-[10px] font-bold text-gray-600 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/[0.06] tracking-wider uppercase">
                  Live
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/[0.05] rounded-xl relative transition-colors group">
                <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-300 transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#06060b]" />
              </button>
              <div className="w-px h-6 bg-white/[0.06] mx-1" />
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-white/[0.05] transition-colors group">
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm text-gray-400 group-hover:text-gray-300 hidden sm:block">Mayank</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {currentPage === 'dashboard' && <Dashboard />}
                {currentPage === 'history' && <CallHistory />}
                {currentPage === 'simulate' && <ScamSimulator />}
                {currentPage === 'analyze' && <LiveAnalysis />}
                {currentPage === 'settings' && <SettingsPage />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

/* ── Live Analysis Page ── */
function LiveAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ riskScore: number; alertLevel: string; scamType: string; explanation: string } | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      setResult({
        riskScore: Math.random() * 40 + 50,
        alertLevel: 'HIGH_RISK',
        scamType: 'KYC_FRAUD',
        explanation: 'Transcript matches KYC fraud pattern with high confidence. Caller requests OTP and personal information.',
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-10 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/10">
          <Activity className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Live Call Analysis</h3>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
          Upload an audio file to analyze it for scam patterns using our AI engine.
        </p>

        <label className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-500 hover:to-purple-500 cursor-pointer transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]">
          <Upload className="w-5 h-5" />
          <input type="file" accept="audio/*" onChange={handleFileSelect} className="hidden" />
          {isAnalyzing ? 'Analyzing...' : 'Upload Audio File'}
        </label>

        {isAnalyzing && (
          <div className="mt-8">
            <div className="w-8 h-8 mx-auto border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-500 text-sm">Processing audio through AI pipeline...</p>
          </div>
        )}
      </div>

      {result && (
        <RiskBadge
          riskScore={result.riskScore}
          alertLevel={result.alertLevel as 'SAFE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL'}
          scamType={result.scamType}
          explanation={result.explanation}
          onReportScam={() => {}}
          onDismiss={() => setResult(null)}
        />
      )}
    </div>
  );
}

/* ── Settings Page ── */
function SettingsPage() {
  const ToggleSwitch = ({ defaultChecked = false }: { defaultChecked?: boolean }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-11 h-6 bg-white/[0.06] border border-white/[0.08] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-500 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:border-indigo-500 peer-checked:after:bg-white" />
    </label>
  );

  const settingSections = [
    {
      title: 'Protection',
      icon: Shield,
      items: [
        { label: 'Real-time Protection', desc: 'Analyze calls as they happen', checked: true },
        { label: 'Haptic Alerts', desc: 'Vibrate on high-risk calls', checked: true },
        { label: 'Auto-Block Critical', desc: 'Automatically block 90%+ risk calls', checked: false },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { label: 'Push Notifications', desc: 'Receive alerts on your device', checked: true },
        { label: 'Daily Summary', desc: 'Receive daily call statistics', checked: false },
        { label: 'Community Alerts', desc: 'Get notified about trending scams', checked: true },
      ],
    },
  ];

  return (
    <div className="max-w-2xl space-y-5">
      {settingSections.map((section) => (
        <div
          key={section.title}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-indigo-500/10">
              <section.icon className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-white tracking-wide">{section.title}</h3>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {section.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.01] transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-200">{item.label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                </div>
                <ToggleSwitch defaultChecked={item.checked} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Danger Zone */}
      <div className="rounded-2xl bg-red-500/[0.03] border border-red-500/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-500/[0.06] flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-red-500/10">
            <Activity className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="text-sm font-bold text-red-400 tracking-wide">Danger Zone</h3>
        </div>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-200">Clear All Data</p>
              <p className="text-xs text-gray-600 mt-0.5">Delete all call history and analysis data</p>
            </div>
            <button className="px-4 py-2 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors">
              Clear Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}