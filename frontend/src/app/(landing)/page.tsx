'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  ArrowRight, 
  ChevronDown, 
  Check, 
  Menu, 
  X, 
  Lock, 
  AlertTriangle, 
  ShieldCheck,
  Brain, 
  ExternalLink,
  Calendar,
  User,
  HelpCircle,
  Radio,
  FileText
} from 'lucide-react';
import Link from 'next/link';

// Component imports
import Operators from '@/components/Operators';
import ScrollRevealText from '@/components/ScrollRevealText';
import InteractiveMockup from '@/components/InteractiveMockup';
import InteractiveTestimonials from '@/components/InteractiveTestimonials';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const featuresList = [
    {
      title: 'All your calls in one place',
      desc: 'View your call history, threat classifications, and real-time risk scores across all incoming callers.',
      badge: 'Aggregated Threat Log',
      mockup: (
        <div className="w-full h-full bg-neutral-950 border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
            <span className="text-xs font-semibold text-neutral-500 uppercase">Incoming Call Log</span>
            <span className="text-xs text-neutral-500 font-mono">Today</span>
          </div>
          <div className="space-y-3 my-4">
            <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-bold text-xs">!</div>
                <div>
                  <p className="text-xs font-bold text-white">+91 90123 45678</p>
                  <p className="text-[10px] text-neutral-500">Lottery Fraud Scam</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[9px] font-bold rounded">94% Risk</span>
            </div>
            <div className="p-3 bg-neutral-900 border border-neutral-850 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">✓</div>
                <div>
                  <p className="text-xs font-bold text-white">+91 98765 12345</p>
                  <p className="text-[10px] text-neutral-500">Courier Delivery</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold rounded">5% Risk</span>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-neutral-500 pt-4 border-t border-neutral-900">
            <span>Database Sync: Live</span>
            <span>Total Blocked: 24</span>
          </div>
        </div>
      )
    },
    {
      title: 'Track where your threat goes',
      desc: 'Break down call parameters into detailed semantic analyses, stress indices, and caller behavior reports.',
      badge: 'Caller Profiles',
      mockup: (
        <div className="w-full h-full bg-neutral-950 border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between">
          <div className="text-xs font-semibold text-neutral-500 uppercase mb-4">Caller Risk Assessment</div>
          
          <div className="bg-neutral-900/60 border border-neutral-850 p-4 rounded-xl space-y-4">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Prosody (Voice Stress)</span>
              <span className="text-white font-mono">High Stress (82/100)</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full w-[82%]" />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Deepfake Probability</span>
              <span className="text-white font-mono">None (Synthetic Score &lt; 0.05)</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[5%]" />
            </div>
            
            <div className="flex justify-between text-xs">
              <span className="text-neutral-400">Scam BERT Semantic Match</span>
              <span className="text-white font-mono">Critical (91/100)</span>
            </div>
            <div className="w-full bg-neutral-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full w-[91%]" />
            </div>
          </div>

          <div className="text-[10px] text-neutral-500 pt-4 border-t border-neutral-900 text-center">
            Verdict: Automated Shield Triggered
          </div>
        </div>
      )
    },
    {
      title: 'Stay on top of call protection',
      desc: 'Configure alert triggers, customized haptic feedbacks, and immediate auto-blocks on dangerous scores.',
      badge: 'Smart Configuration',
      mockup: (
        <div className="w-full h-full bg-neutral-950 border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between">
          <div className="text-xs font-semibold text-neutral-500 uppercase mb-4">Security Rules</div>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Auto-Block Critical</p>
                <p className="text-[10px] text-neutral-500">Block calls over 90% risk score</p>
              </div>
              <div className="w-9 h-5 bg-blue-600 rounded-full p-0.5 flex items-center justify-end cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Haptic Vibration Warn</p>
                <p className="text-[10px] text-neutral-500">Alert on suspicious classifications</p>
              </div>
              <div className="w-9 h-5 bg-blue-600 rounded-full p-0.5 flex items-center justify-end cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">On-Device Inference</p>
                <p className="text-[10px] text-neutral-500">Disable network transcripts</p>
              </div>
              <div className="w-9 h-5 bg-neutral-800 rounded-full p-0.5 flex items-center justify-start cursor-pointer">
                <div className="w-4 h-4 bg-neutral-600 rounded-full" />
              </div>
            </div>
          </div>
          <div className="text-[10px] text-neutral-500 text-center pt-4 border-t border-neutral-900">
            Rules updated globally
          </div>
        </div>
      )
    },
    {
      title: 'Get smart tips to protect',
      desc: 'EchoShield AI synthesizes weekly call reports, highlights popular scam categories in your area, and drafts tips.',
      badge: 'Secured AI Tips',
      mockup: (
        <div className="w-full h-full bg-neutral-950 border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between">
          <div className="text-xs font-semibold text-neutral-500 uppercase mb-4">AI Security Insights</div>
          
          <div className="space-y-3 bg-neutral-900 p-4 rounded-xl border border-neutral-850">
            <p className="text-[11px] text-neutral-300 italic">
              "We've detected an 18% increase in courier-related phishing calls in Bangalore this week. Never share credit card details or OTPs to verify packages."
            </p>
            <div className="flex items-center gap-1.5 text-[9px] font-semibold text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Recommended rule: Block unknown business caller streams</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] text-neutral-500 pt-4 border-t border-neutral-900">
            <span>Read full advisory</span>
            <ArrowRight className="w-3 h-3 text-neutral-500" />
          </div>
        </div>
      )
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Grant Protection permissions',
      desc: 'Securely link the EchoShield module to your device caller log and phone settings to allow real-time analysis.',
      visual: (
        <div className="w-full max-w-[280px] mx-auto bg-neutral-950 border border-neutral-900 rounded-2xl p-5 shadow-xl">
          <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h5 className="text-xs font-bold text-white mb-2">Request Permission</h5>
          <p className="text-[10px] text-neutral-400 mb-4 leading-relaxed">
            Allow EchoShield to intercept phone caller IDs to overlay risk diagnostics.
          </p>
          <div className="space-y-2">
            <button className="w-full py-1.5 bg-white text-black font-bold text-[10px] rounded-lg">Allow Overlay</button>
            <button className="w-full py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 font-bold text-[10px] rounded-lg">Deny</button>
          </div>
        </div>
      )
    },
    {
      number: '02',
      title: 'Analyze in real-time',
      desc: 'EchoShield automatically transcribes raw caller streams on-device and matches them to scam registries.',
      visual: (
        <div className="w-full max-w-[280px] mx-auto bg-neutral-950 border border-neutral-900 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[9px] uppercase font-bold text-neutral-500 tracking-wider">Analysis Active</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-850 font-mono text-[10px] space-y-2 mb-3">
            <p className="text-neutral-500"><span className="text-neutral-400">Transcribe:</span> "Aapka card block ho..."</p>
            <p className="text-red-400 bg-red-950/20 px-1 border-l border-red-500"><span className="font-bold">BERT:</span> "Verification OTP..."</p>
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-white pt-2 border-t border-neutral-900">
            <span>KYC Fraud Risk</span>
            <span className="text-red-400">91% Probability</span>
          </div>
        </div>
      )
    },
    {
      number: '03',
      title: 'Instant alerts & shielding',
      desc: 'Get immediate alerts before answering, and let EchoShield automatically disconnect calls with &gt;90% risk score.',
      visual: (
        <div className="w-full max-w-[280px] mx-auto bg-neutral-950 border border-neutral-900 rounded-2xl p-5 shadow-xl text-center">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 animate-bounce" />
          </div>
          <h5 className="text-xs font-bold text-white mb-1">Scam Call Blocked</h5>
          <p className="text-[10px] text-neutral-400 mb-4 leading-relaxed">
            Auto-blocked caller +91 90123 45678 (KYC fraud match).
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full text-[9px] font-bold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Device Protected</span>
          </div>
        </div>
      )
    }
  ];

  const blogPosts = [
    {
      title: 'Why elderly and young adults fall victim to KYC scams',
      subtitle: 'Understanding the psychology of urgent compliance and social engineering attacks.',
      author: 'Clara Roy',
      date: 'Jun 10, 2026',
      category: 'Psychology',
      isFeatured: true
    },
    {
      title: 'EchoShield raises Pre-Series A funding to boost local AI model pipelines',
      author: 'Aditya Sen',
      date: 'Feb 14, 2026',
      category: 'Company News'
    },
    {
      title: 'How deepfake voice clones are transforming identity fraud',
      author: 'Michelle Fernandes',
      date: 'Jan 22, 2026',
      category: 'AI Security'
    },
    {
      title: 'Optimizing on-device Whisper model to run at under 180ms latency',
      author: 'Clara Roy',
      date: 'Dec 05, 2025',
      category: 'Engineering'
    }
  ];

  const faqs = [
    {
      q: 'How does EchoShield detect scams in real time?',
      a: 'EchoShield uses a localized multi-signal AI pipeline. When an unknown call is answered, our on-device model transcribes speech, evaluates it against semantic scam indicators using our proprietary ScamBERT, analyzes prosodic cues (voice stress patterns), and calculates an aggregated risk score in less than 180ms.'
    },
    {
      q: 'Is my privacy protected? Does EchoShield upload call recordings?',
      a: 'Absolutely. Privacy is our core foundation. EchoShield processes transcription and audio classifications locally on-device. Audio files and exact transcripts are never uploaded or stored on our servers unless you manually choose to report and submit a scam call to the community registry.'
    },
    {
      q: 'Which mobile networks and operators are supported?',
      a: 'EchoShield is fully compatible with Trai security regulations and works seamlessly across all Indian telecommunication operators, including Reliance Jio, Bharti Airtel, Vodafone Idea (Vi), and BSNL.'
    },
    {
      q: 'Can I set custom blocking rules based on risk levels?',
      a: 'Yes. In the application settings dashboard, you can define risk thresholds. For example, you can set the app to show haptic alerts for suspicious calls (50%-85% risk score) and automatically disconnect or block critical calls (over 90% risk score).'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-black text-white text-base">
              E
            </div>
            <span className="font-extrabold text-lg tracking-tight">EchoShield</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors">Company</a>
            <a href="#faq" className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors">Support</a>
            <div className="relative group cursor-pointer">
              <span className="text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors flex items-center gap-1">
                Resources <ChevronDown className="w-3.5 h-3.5" />
              </span>
              <div className="absolute top-full left-0 mt-2 w-48 bg-neutral-950 border border-neutral-900 rounded-xl p-2 hidden group-hover:block shadow-2xl">
                <a href="#blog" className="block px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900">Security Blog</a>
                <a href="#how-it-works" className="block px-3 py-2 text-xs font-medium text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900">How It Works</a>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/app" className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors">Launch Dashboard</Link>
            <Link href="/app" className="px-5 py-2.5 bg-white hover:bg-neutral-100 text-black rounded-full text-xs font-bold transition-all shadow-md">
              Download for free
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-black border-b border-neutral-900 px-6 py-6 space-y-4"
            >
              <a href="#features" className="block text-sm font-semibold text-neutral-400" onClick={() => setMobileMenuOpen(false)}>Company</a>
              <a href="#faq" className="block text-sm font-semibold text-neutral-400" onClick={() => setMobileMenuOpen(false)}>Support</a>
              <a href="#blog" className="block text-sm font-semibold text-neutral-400" onClick={() => setMobileMenuOpen(false)}>Security Blog</a>
              <Link href="/app" className="block text-sm font-semibold text-neutral-400" onClick={() => setMobileMenuOpen(false)}>Launch Dashboard</Link>
              <Link href="/app" className="block px-5 py-3 bg-white text-black font-bold text-sm text-center rounded-full" onClick={() => setMobileMenuOpen(false)}>
                Download for free
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-36 pb-20 px-6 bg-grid-pattern overflow-hidden">
        
        {/* Subtle top borders simulating framer-style divider */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-neutral-900" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Funding Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 transition-colors mb-8 cursor-pointer"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-semibold text-neutral-400 tracking-wide">
              EchoShield secures Pre-Series A funding
            </span>
            <ArrowRight className="w-3 h-3 text-neutral-500" />
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6"
          >
            Track every threat<br />instantly in one place
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm md:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed mb-10"
          >
            EchoShield helps you budget safety, analyze transcripts, block scam calls, and protect your savings — all in one place.
          </motion.p>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/app" className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-800 hover:border-neutral-700 bg-neutral-950 rounded-full text-xs font-bold text-white transition-all shadow-md group">
              Start protection for free 
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>

        {/* Dynamic Graphic Stack Mockups */}
        <InteractiveMockup />

      </section>

      {/* 3. OPERATOR LOGOS & SCROLL REVEAL TEXT */}
      <section className="bg-black relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-neutral-950" />
        <Operators />
        
        {/* Scroll reveal copy */}
        <ScrollRevealText 
          text="EchoShield helps you make sense of your calls. It connects to your mobile device and tracks incoming threats automatically. It gives you smart, simple, and actionable alerts to block fraud and grow your security without the stress." 
        />
      </section>

      {/* 4. FEATURES GRID SECTION */}
      <section id="features" className="py-24 px-6 bg-black relative">
        
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Features</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-none">
              EchoShield helps you…
            </h2>
          </div>

          {/* Alternating left-text / right-visual layout */}
          <div className="space-y-32">
            {featuresList.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={index}
                  className="flex flex-col md:grid md:grid-cols-12 gap-12 items-center"
                >
                  {/* Text panel */}
                  <div className={`md:col-span-5 space-y-6 ${!isEven ? 'md:order-2' : ''}`}>
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">{item.badge}</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{item.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                    <Link href="/app" className="inline-flex items-center gap-1 text-xs font-bold text-white hover:text-blue-400 transition-colors">
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Mockup panel */}
                  <div className={`md:col-span-7 w-full h-[320px] md:h-[360px] ${!isEven ? 'md:order-1' : ''}`}>
                    {item.mockup}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features Grid Header */}
          <div className="text-center mt-40 mb-16">
            <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              Track everything you need in your pocket
            </h3>
            <p className="text-sm text-neutral-400 mt-3 max-w-lg mx-auto">
              Sleek local models tailored specifically for cellular call interceptions.
            </p>
          </div>

          {/* 3-Column Features Block */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-neutral-900 space-y-4 hover:border-neutral-800 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Radio className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Telecom accounts</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Safely interface with your operator caller ID stream locally.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-neutral-900 space-y-4 hover:border-neutral-800 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Auto-categorised</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                All suspicious transactions or OTP requests sorted instantly in log reports.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-neutral-900 space-y-4 hover:border-neutral-800 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Smart tips by AI</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Receive live advice and haptic alerts computed by locally executed engines.
              </p>
            </div>
          </div>

          {/* Partners & Link footer grid */}
          <div className="mt-16 text-center border-t border-neutral-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500">
            <span>Partners of all leading telecommunications globally</span>
            <Link href="#faq" className="hover:text-white underline transition-colors mt-2 md:mt-0">
              Reach out if your operator can't be found
            </Link>
          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS STEPS SECTION */}
      <section id="how-it-works" className="py-24 px-6 bg-black relative border-t border-neutral-900">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Steps</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
              Get protected in 3 simple steps
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 mt-3 max-w-md mx-auto">
              Setting up EchoShield takes less than 2 minutes. Protect your device starting today.
            </p>
          </div>

          {/* Steps Horizontal / Vertical List */}
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((item, i) => (
              <div key={i} className="flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-5xl md:text-6xl font-black text-neutral-800 tracking-tighter mb-4">{item.number}</div>
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
                <div className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl py-8 flex items-center justify-center min-h-[200px]">
                  {item.visual}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <InteractiveTestimonials />

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 bg-black relative border-b border-neutral-900">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Pricing Preview</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-2">
              Get started for free.
            </h2>
            <p className="text-sm text-neutral-400 mt-2">Upgrade when you are ready.</p>
            
            {/* Toggle switch */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-xs font-semibold ${!isYearly ? 'text-white' : 'text-neutral-500'}`}>Monthly</span>
              <button 
                onClick={() => setIsYearly(!isYearly)}
                className="w-10 h-6 bg-neutral-900 border border-neutral-800 rounded-full p-0.5 flex items-center transition-colors duration-300"
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isYearly ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <span className={`text-xs font-semibold ${isYearly ? 'text-white' : 'text-neutral-500'}`}>Yearly (Save 15%)</span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* Plan 1: Basic */}
            <div className="glass-card p-8 rounded-2xl border border-neutral-900 flex flex-col justify-between min-h-[480px]">
              <div>
                <h4 className="text-lg font-bold text-white">Basic Plan</h4>
                <p className="text-xs text-neutral-500 mt-1">Core local caller ID diagnostics.</p>
                
                <div className="my-8">
                  <span className="text-4xl font-extrabold text-white">$0.00</span>
                  <span className="text-xs text-neutral-500 ml-1">/ month</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Live caller risk scores</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Spam database matching</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Limited AI transcript alerts (50/mo)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Smart caller rules config</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/app" className="block w-full py-3 bg-neutral-900 hover:bg-neutral-850 text-white font-bold text-xs text-center rounded-xl border border-neutral-800 transition-colors">
                  Start for free
                </Link>
              </div>
            </div>

            {/* Plan 2: Pro */}
            <div className="glass-card p-8 rounded-2xl border border-neutral-800 flex flex-col justify-between min-h-[480px] relative">
              <div className="absolute -top-3 right-6 px-3 py-1 bg-blue-600 rounded-full text-[9px] font-bold text-white uppercase tracking-wider">
                Recommended
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">Pro Plan</h4>
                <p className="text-xs text-neutral-500 mt-1">Full-spectrum live voice analysis shield.</p>
                
                <div className="my-8">
                  <span className="text-4xl font-extrabold text-white">
                    {isYearly ? '$65.99' : '$5.99'}
                  </span>
                  <span className="text-xs text-neutral-500 ml-1">
                    / {isYearly ? 'year' : 'month'}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited caller screening</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Complete ScamBERT voice analysis</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited real-time transcript tips</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Automated disconnect blocking engine</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Priority community updates</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link href="/app" className="block w-full py-3 bg-white hover:bg-neutral-100 text-black font-bold text-xs text-center rounded-xl transition-colors">
                  Get full access
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. SECURITY BLOG / NEWS SECTION */}
      <section id="blog" className="py-24 px-6 bg-black relative border-b border-neutral-900">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between mb-16">
            <div>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Newsroom</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mt-1">From the blog</h2>
            </div>
            <Link href="#blog" className="text-xs font-bold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors">
              View all <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-12 gap-8">
            
            {/* Featured Post Card (Left Column) */}
            <div className="md:col-span-6 glass-card p-8 rounded-2xl border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="px-2.5 py-0.5 bg-neutral-900 text-neutral-400 text-[10px] font-bold rounded-full">
                    {blogPosts[0].category}
                  </span>
                  <span className="text-[10px] text-neutral-500">{blogPosts[0].date}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                  {blogPosts[0].title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {blogPosts[0].subtitle}
                </p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-neutral-900 text-[10px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-neutral-500" />
                  {blogPosts[0].author}
                </span>
                <span>5 min read</span>
              </div>
            </div>

            {/* List Posts (Right Column) */}
            <div className="md:col-span-6 space-y-4">
              {blogPosts.slice(1).map((post, i) => (
                <div 
                  key={i} 
                  className="glass-card p-6 rounded-2xl border border-neutral-900 hover:border-neutral-800 transition-all cursor-pointer flex justify-between items-center"
                >
                  <div className="space-y-2 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase text-blue-400">{post.category}</span>
                      <span className="text-[9px] text-neutral-500">• {post.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white tracking-tight truncate leading-snug">
                      {post.title}
                    </h4>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="py-24 px-6 bg-black relative border-b border-neutral-900">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-16">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Faq</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mt-1">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div 
                  key={i} 
                  className="bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-neutral-900/30 transition-colors"
                  >
                    <span className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-neutral-500" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-5 pt-1 text-[11px] md:text-xs text-neutral-400 leading-relaxed pl-12 border-t border-neutral-900">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. CALL TO ACTION (CTA) SECTION */}
      <section className="py-24 px-6 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 p-12 bg-neutral-950/80 border border-neutral-900 rounded-3xl">
          <h2 className="text-2xl md:text-5xl font-black text-white tracking-tight leading-none mb-4">
            Ready to shield your device?
          </h2>
          <p className="text-xs md:text-sm text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed">
            Use EchoShield to block scammers, save better, and make every conversation secure.
          </p>
          <Link href="/app" className="inline-flex items-center gap-1.5 px-6 py-3 bg-white text-black font-bold text-xs rounded-full hover:bg-neutral-100 transition-all shadow-md">
            Start tracking for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="py-16 px-6 bg-black border-t border-neutral-900 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          
          {/* Logo & Copyright */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-black text-white text-sm">
                E
              </div>
              <span className="font-extrabold text-sm text-white tracking-tight">EchoShield</span>
            </Link>
            <p className="text-[11px]">© 2026 EchoShield. All rights reserved.</p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Company</h5>
              <Link href="#features" className="block hover:text-white transition-colors">Features</Link>
              <Link href="#how-it-works" className="block hover:text-white transition-colors">How It Works</Link>
            </div>
            <div className="space-y-3">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Support</h5>
              <Link href="#faq" className="block hover:text-white transition-colors">FAQs</Link>
              <Link href="#blog" className="block hover:text-white transition-colors">Newsroom</Link>
            </div>
            <div className="space-y-3">
              <h5 className="font-bold text-white uppercase text-[10px] tracking-wider">Resources</h5>
              <Link href="#" className="block hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="block hover:text-white transition-colors">Terms of Use</Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}