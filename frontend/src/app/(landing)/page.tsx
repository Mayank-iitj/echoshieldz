'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Phone,
  Mic,
  Brain,
  AlertTriangle,
  Users,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
  Zap,
  Lock,
  Globe,
  Activity,
  BarChart3,
  Star
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Detection',
    description: 'Multi-signal AI pipeline analyzes voice patterns, transcript, and caller behavior in real-time.'
  },
  {
    icon: Mic,
    title: 'Live Audio Analysis',
    description: 'Whisper ASR + ScamBERT process every word as it happens with <200ms latency.'
  },
  {
    icon: AlertTriangle,
    title: 'Risk Score 0-100',
    description: 'Proprietary risk aggregation engine fuses NLP, voice stress, and deepfake detection.'
  },
  {
    icon: Shield,
    title: 'Caller Reputation',
    description: 'National database of reported scammers with community-driven reputation scoring.'
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'On-device inference with optional cloud fallback. Your calls stay yours.'
  },
  {
    icon: Globe,
    title: 'Bilingual Support',
    description: 'Hindi, English, and code-mixed text. Built for India, expandable globally.'
  }
];

const stats = [
  { value: '₹10,000+ Cr', label: 'Annual Scam Losses in India' },
  { value: '94%', label: 'Detection Accuracy' },
  { value: '<200ms', label: 'Real-Time Latency' },
  { value: '50K+', label: 'Scam Numbers Tracked' }
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'SBI Customer',
    text: 'EchoShield saved me from a KYC fraud call. The real-time alert was immediate!',
    rating: 5
  },
  {
    name: 'Priya Sharma',
    role: 'Tech Blogger',
    text: 'Finally, an AI product that actually works. The voice stress detection is impressive.',
    rating: 5
  },
  {
    name: 'Ankit Patel',
    role: 'Startup Founder',
    text: 'We integrated EchoShield API for our call center. False positive rate is under 5%.',
    rating: 5
  }
];

const faqs = [
  {
    q: 'How does EchoShield detect scams?',
    a: 'EchoShield uses a multi-signal AI pipeline: Whisper ASR for transcription, DistilBERT for scam classification, voice stress analysis for prosodic cues, and LightCNN for deepfake detection. All signals fuse into a single risk score.'
  },
  {
    q: 'Does EchoShield listen to my calls?',
    a: 'No. EchoShield only processes audio when you explicitly enable protection during a call. All analysis happens locally on-device (with optional cloud enhancement). Your privacy is protected.'
  },
  {
    q: 'Which languages are supported?',
    a: 'EchoShield is optimized for Hindi and English, including code-mixed Hinglish. Training pipeline supports 10+ Indian languages via IndicBERT.'
  },
  {
    q: 'Is it free?',
    a: 'Core call screening is free. Premium features include advanced deepfake detection, unlimited cloud API calls, and team management. Visit pricing for details.'
  }
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">EchoShield</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
            <a href="#stats" className="text-gray-300 hover:text-white transition-colors">Impact</a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">Log in</Link>
            <Link href="/app" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black border-b border-white/10 px-6 py-4 space-y-4"
          >
            <a href="#features" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
            <a href="#stats" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Impact</a>
            <a href="#faq" className="block text-gray-300 hover:text-white" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <Link href="/app" className="block px-4 py-2 bg-blue-600 rounded-lg text-center font-medium">
              Get Started
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">AI-Powered Scam Protection</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Hear the truth
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                before the damage
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Real-time AI scam call detection for Indian mobile users.
              Multi-signal analysis, instant alerts, and national scam database protection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/app" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2">
                Start Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold transition-colors">
                See How It Works
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              No credit card required • Free tier available
            </p>
          </motion.div>

          {/* Hero Image/UI Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-5xl">
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-white/10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full mb-4">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-medium">HIGH RISK: 85%</span>
                    </div>
                    <p className="text-gray-400 text-lg">KYC Fraud Detected</p>
                    <p className="text-gray-500 text-sm mt-2">"Aapka KYC incomplete hai..."</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built for real-time protection</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Enterprise-grade AI models optimized for mobile edge computing
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-black to-blue-950/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How EchoShield works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Multi-layer AI pipeline analyzes every call in real-time
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Call Interception', desc: 'When a call comes in, EchoShield screens the number against our national database.' },
              { step: '02', title: 'Live Analysis', desc: 'Audio is transcribed and analyzed for scam patterns, voice stress, and synthetic speech.' },
              { step: '03', title: 'Instant Alert', desc: 'Risk score displayed as overlay with vibration alert. Auto-block at 90%+ confidence.' }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-6xl font-bold text-white/5 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
                {i < 2 && <ArrowRight className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-gray-600" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Trusted by users</h2>
            <p className="text-xl text-gray-400">Protecting thousands of Indians from scam calls</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently asked questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium">{faq.q}</span>
                  <X className={`w-5 h-5 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="px-6 pb-4 text-gray-400"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-white/10 rounded-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to get protected?</h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of users who trust EchoShield for their call safety
            </p>
            <Link href="/app" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-lg transition-colors">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">EchoShield</span>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>

            <div className="text-sm text-gray-500">
              © 2024 EchoShield. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}