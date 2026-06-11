'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  PhoneOff,
  PhoneIncoming,
  Shield,
  AlertTriangle,
  Activity,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Brain,
  Fingerprint,
  Search,
  UserX,
  FileWarning,
  Radio,
  Play,
  RotateCcw,
  ChevronDown,
  Zap,
  Eye,
  Clock,
} from 'lucide-react';

// ──────────────────── Scam Scenario Data ────────────────────

interface ScamDialogueLine {
  speaker: 'scammer' | 'system';
  text: string;
  delayMs: number; // delay before this line starts
  riskDelta: number; // how much risk increases
  signals: Partial<RiskSignals>;
}

interface ScamScenario {
  id: string;
  title: string;
  description: string;
  scamType: string;
  callerNumber: string;
  callerName: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  dialogues: ScamDialogueLine[];
}

interface RiskSignals {
  nlp_confidence: number;
  voice_stress: number;
  synthetic_voice: number;
  caller_reputation: number;
  script_match: number;
}

const SCAM_SCENARIOS: ScamScenario[] = [
  {
    id: 'kyc_fraud',
    title: 'KYC Verification Scam',
    description: 'Caller impersonates bank official demanding immediate KYC update to prevent account freeze.',
    scamType: 'KYC_FRAUD',
    callerNumber: '+91 98765 43210',
    callerName: 'Unknown Caller',
    icon: '🏦',
    difficulty: 'Medium',
    dialogues: [
      {
        speaker: 'scammer',
        text: 'Hello, am I speaking with the account holder? This is Rajesh Kumar calling from State Bank of India, head office Mumbai.',
        delayMs: 0,
        riskDelta: 8,
        signals: { nlp_confidence: 0.15, voice_stress: 0.12, caller_reputation: 0.3, script_match: 0.2 },
      },
      {
        speaker: 'system',
        text: '⚡ EchoShield: Caller ID not verified against SBI directory. Monitoring initiated.',
        delayMs: 4000,
        riskDelta: 5,
        signals: { caller_reputation: 0.45 },
      },
      {
        speaker: 'scammer',
        text: 'Sir, I am calling because your KYC documents have expired. If you do not update them within the next 2 hours, your account will be permanently frozen by RBI directive.',
        delayMs: 3000,
        riskDelta: 18,
        signals: { nlp_confidence: 0.55, voice_stress: 0.35, script_match: 0.6 },
      },
      {
        speaker: 'system',
        text: '🔴 EchoShield: HIGH URGENCY language detected. Pattern matches known KYC fraud script template #KYC-2024-047.',
        delayMs: 5000,
        riskDelta: 12,
        signals: { nlp_confidence: 0.72, script_match: 0.78 },
      },
      {
        speaker: 'scammer',
        text: 'For your security verification, I need you to share the OTP that will be sent to your registered mobile number. This is a standard RBI-mandated procedure.',
        delayMs: 3000,
        riskDelta: 22,
        signals: { nlp_confidence: 0.88, voice_stress: 0.52, script_match: 0.85 },
      },
      {
        speaker: 'system',
        text: '🚨 EchoShield CRITICAL: OTP solicitation detected! No legitimate bank ever asks for OTP over phone. Recommendation: TERMINATE CALL IMMEDIATELY.',
        delayMs: 4000,
        riskDelta: 20,
        signals: { nlp_confidence: 0.95, voice_stress: 0.61, script_match: 0.92, caller_reputation: 0.88 },
      },
      {
        speaker: 'scammer',
        text: 'Sir, please hurry. I can see your account is being flagged right now. If you just share the 6-digit code, I can resolve this instantly.',
        delayMs: 4000,
        riskDelta: 10,
        signals: { nlp_confidence: 0.97, voice_stress: 0.72, synthetic_voice: 0.15 },
      },
    ],
  },
  {
    id: 'otp_theft',
    title: 'OTP Theft via UPI',
    description: 'Scammer poses as payment app support asking to "verify" a failed transaction.',
    scamType: 'OTP_THEFT',
    callerNumber: '+91 87654 32109',
    callerName: 'GPay Support',
    icon: '💳',
    difficulty: 'Hard',
    dialogues: [
      {
        speaker: 'scammer',
        text: 'Hello! I am calling from Google Pay customer support. We noticed a failed transaction of ₹15,000 from your account. Can you confirm your registered UPI ID?',
        delayMs: 0,
        riskDelta: 12,
        signals: { nlp_confidence: 0.25, voice_stress: 0.18, caller_reputation: 0.35, script_match: 0.3 },
      },
      {
        speaker: 'system',
        text: '⚡ EchoShield: Number not associated with any verified Google Pay support center. Voice analysis initiated.',
        delayMs: 4500,
        riskDelta: 8,
        signals: { caller_reputation: 0.55, synthetic_voice: 0.1 },
      },
      {
        speaker: 'scammer',
        text: 'I understand your concern, sir. For verification, I am going to send you a small amount of ₹1. Please accept the request to confirm your identity. This is our standard verification process.',
        delayMs: 3500,
        riskDelta: 15,
        signals: { nlp_confidence: 0.52, voice_stress: 0.28, script_match: 0.55 },
      },
      {
        speaker: 'system',
        text: '🔴 EchoShield: Social engineering pattern detected. "Verification via payment" is a known UPI scam vector. Risk elevated.',
        delayMs: 4000,
        riskDelta: 14,
        signals: { nlp_confidence: 0.68, script_match: 0.72 },
      },
      {
        speaker: 'scammer',
        text: 'Actually sir, there seems to be a system error. Instead of receiving, you need to enter your UPI PIN to "accept" the verification. Please enter your PIN when the request comes.',
        delayMs: 4000,
        riskDelta: 25,
        signals: { nlp_confidence: 0.92, voice_stress: 0.58, script_match: 0.88, caller_reputation: 0.82 },
      },
      {
        speaker: 'system',
        text: '🚨 EchoShield CRITICAL: UPI PIN solicitation detected! This is a confirmed scam pattern. Entering PIN will DEBIT money from your account. AUTO-BLOCK RECOMMENDED.',
        delayMs: 3500,
        riskDelta: 18,
        signals: { nlp_confidence: 0.96, voice_stress: 0.65, script_match: 0.94, caller_reputation: 0.91 },
      },
    ],
  },
  {
    id: 'fake_authority',
    title: 'Fake Police / CBI Threat',
    description: 'Caller impersonates law enforcement claiming your Aadhaar is linked to money laundering.',
    scamType: 'FAKE_AUTHORITY',
    callerNumber: '+91 76543 21098',
    callerName: 'CBI Office Delhi',
    icon: '👮',
    difficulty: 'Hard',
    dialogues: [
      {
        speaker: 'scammer',
        text: 'This is Senior Inspector Sharma from the Central Bureau of Investigation, New Delhi. Your Aadhaar number has been flagged in connection with a money laundering case under PMLA Act.',
        delayMs: 0,
        riskDelta: 15,
        signals: { nlp_confidence: 0.35, voice_stress: 0.22, caller_reputation: 0.4, script_match: 0.45 },
      },
      {
        speaker: 'system',
        text: '⚡ EchoShield: Caller claims CBI identity. Number does not match any registered law enforcement directory. Voice stress anomalies detected.',
        delayMs: 5000,
        riskDelta: 10,
        signals: { caller_reputation: 0.62, voice_stress: 0.38 },
      },
      {
        speaker: 'scammer',
        text: 'A case FIR number CBI-2024-ML-7832 has been registered against your Aadhaar. If you do not cooperate, an arrest warrant will be issued within 24 hours.',
        delayMs: 4000,
        riskDelta: 18,
        signals: { nlp_confidence: 0.65, voice_stress: 0.45, script_match: 0.7 },
      },
      {
        speaker: 'system',
        text: '🔴 EchoShield: Legal threat language matches known "digital arrest" scam pattern. CBI never contacts civilians via personal phone calls.',
        delayMs: 4000,
        riskDelta: 15,
        signals: { nlp_confidence: 0.78, script_match: 0.82 },
      },
      {
        speaker: 'scammer',
        text: 'To clear your name, you need to transfer a refundable security deposit of ₹2,50,000 to an RBI escrow account. I will share the account details now.',
        delayMs: 4500,
        riskDelta: 22,
        signals: { nlp_confidence: 0.93, voice_stress: 0.55, script_match: 0.91, caller_reputation: 0.85 },
      },
      {
        speaker: 'system',
        text: '🚨 EchoShield CRITICAL: Financial demand detected from fake authority! No government agency demands money via phone. This is a confirmed "digital arrest" fraud. CALL BLOCKED.',
        delayMs: 3500,
        riskDelta: 15,
        signals: { nlp_confidence: 0.97, voice_stress: 0.68, script_match: 0.95, caller_reputation: 0.94 },
      },
    ],
  },
  {
    id: 'deepfake_voice',
    title: 'AI Voice Clone Attack',
    description: 'Deepfake voice mimicking a family member asking for emergency funds transfer.',
    scamType: 'DEEPFAKE_VOICE',
    callerNumber: '+91 99887 76655',
    callerName: 'Mom ❤️',
    icon: '🤖',
    difficulty: 'Hard',
    dialogues: [
      {
        speaker: 'scammer',
        text: 'Beta, mujhe sun... I have been in an accident near Connaught Place. I am in the hospital and they are asking for immediate payment before treatment.',
        delayMs: 0,
        riskDelta: 10,
        signals: { nlp_confidence: 0.12, voice_stress: 0.65, synthetic_voice: 0.25, caller_reputation: 0.1 },
      },
      {
        speaker: 'system',
        text: '⚡ EchoShield: Contact name matches "Mom" but voice spectral analysis shows anomalies. Deepfake detection scanning initiated...',
        delayMs: 4000,
        riskDelta: 12,
        signals: { synthetic_voice: 0.42, voice_stress: 0.55 },
      },
      {
        speaker: 'scammer',
        text: 'Please beta, they need ₹50,000 urgently. I cannot access my phone properly. Please transfer to this account number I am sharing right now.',
        delayMs: 3500,
        riskDelta: 15,
        signals: { nlp_confidence: 0.38, voice_stress: 0.72, synthetic_voice: 0.58, script_match: 0.4 },
      },
      {
        speaker: 'system',
        text: '🔴 EchoShield: DEEPFAKE ALERT — Voice formant analysis shows 58% synthetic probability. Micro-pause patterns inconsistent with natural speech. Recommend voice verification.',
        delayMs: 4500,
        riskDelta: 20,
        signals: { synthetic_voice: 0.72, voice_stress: 0.68 },
      },
      {
        speaker: 'scammer',
        text: 'Don\'t call me back, my phone battery is dying. Just transfer the money to account 9284710038291, IFSC SBIN0001234. Please hurry beta!',
        delayMs: 4000,
        riskDelta: 22,
        signals: { nlp_confidence: 0.75, voice_stress: 0.78, synthetic_voice: 0.85, script_match: 0.65, caller_reputation: 0.7 },
      },
      {
        speaker: 'system',
        text: '🚨 EchoShield CRITICAL: 85% SYNTHETIC VOICE confirmed! This is an AI-cloned voice. The real contact should be verified via a separate channel. DO NOT TRANSFER FUNDS.',
        delayMs: 3500,
        riskDelta: 16,
        signals: { nlp_confidence: 0.82, synthetic_voice: 0.92, script_match: 0.78, caller_reputation: 0.85 },
      },
    ],
  },
];

// ──────────────────── Risk Gauge Component ────────────────────

function RiskGauge({ score, size = 200 }: { score: number; size?: number }) {
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius; // half circle
  const progress = (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 25) return { stroke: '#22c55e', glow: 'rgba(34, 197, 94, 0.3)', label: 'SAFE', bg: 'from-green-500/10 to-green-500/5' };
    if (s < 50) return { stroke: '#eab308', glow: 'rgba(234, 179, 8, 0.3)', label: 'SUSPICIOUS', bg: 'from-yellow-500/10 to-yellow-500/5' };
    if (s < 75) return { stroke: '#f97316', glow: 'rgba(249, 115, 22, 0.3)', label: 'HIGH RISK', bg: 'from-orange-500/10 to-orange-500/5' };
    return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', label: 'CRITICAL', bg: 'from-red-500/10 to-red-500/5' };
  };

  const { stroke, glow, label } = getColor(score);

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size * 0.65 }}>
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        {/* Background arc */}
        <path
          d={`M 10 ${size * 0.55} A ${radius} ${radius} 0 0 1 ${size - 10} ${size * 0.55}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Active arc */}
        <motion.path
          d={`M 10 ${size * 0.55} A ${radius} ${radius} 0 0 1 ${size - 10} ${size * 0.55}`}
          fill="none"
          stroke={stroke}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <motion.span
          key={Math.round(score)}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl font-black tabular-nums"
          style={{ color: stroke }}
        >
          {Math.round(score)}%
        </motion.span>
        <span className="text-xs font-bold tracking-widest mt-0.5" style={{ color: stroke }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ──────────────────── Signal Bar Component ────────────────────

function SignalBar({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  const pct = Math.min(value * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
        </div>
        <span className="text-xs font-bold tabular-nums" style={{ color }}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ──────────────────── Waveform Visualizer ────────────────────

function VoiceWaveform({ active }: { active: boolean }) {
  const bars = 32;
  return (
    <div className="flex items-center justify-center gap-[2px] h-10">
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-gradient-to-t from-blue-500 to-cyan-400"
          animate={
            active
              ? {
                  height: [4, 8 + Math.random() * 24, 4],
                  opacity: [0.4, 0.9, 0.4],
                }
              : { height: 4, opacity: 0.2 }
          }
          transition={
            active
              ? {
                  duration: 0.4 + Math.random() * 0.4,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: i * 0.02,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

// ──────────────────── Incoming Call Ring Animation ────────────────────

function IncomingCallRing() {
  return (
    <div className="relative w-28 h-28">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-green-400"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 1.8 + i * 0.3, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeOut',
          }}
        />
      ))}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <PhoneIncoming className="w-10 h-10 text-white" />
      </motion.div>
    </div>
  );
}

// ──────────────────── Main Simulator Component ────────────────────

type SimState = 'selecting' | 'ringing' | 'active' | 'ended';

export function ScamSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<ScamScenario | null>(null);
  const [simState, setSimState] = useState<SimState>('selecting');
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);
  const [riskScore, setRiskScore] = useState(0);
  const [signals, setSignals] = useState<RiskSignals>({
    nlp_confidence: 0,
    voice_stress: 0,
    synthetic_voice: 0,
    caller_reputation: 0,
    script_match: 0,
  });
  const [transcript, setTranscript] = useState<{ speaker: string; text: string; displayText: string }[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [latencyMs, setLatencyMs] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Elapsed timer
  useEffect(() => {
    if (simState === 'active') {
      timerRef.current = setInterval(() => setElapsedTime((t) => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simState]);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const cleanup = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const speakText = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 0.9;
      utterance.volume = 0.8;

      // Try to pick a male Indian English voice
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find((v) =>
        v.lang.includes('en-IN') || v.lang.includes('hi-IN')
      );
      const englishVoice = voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'));
      utterance.voice = indianVoice || englishVoice || voices[0] || null;

      synthRef.current = utterance;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [voiceEnabled]);

  const typewriterAppend = useCallback((idx: number, fullText: string) => {
    const words = fullText.split(' ');
    let wordIdx = 0;

    const typeInterval = setInterval(() => {
      if (wordIdx >= words.length) {
        clearInterval(typeInterval);
        return;
      }
      wordIdx++;
      setTranscript((prev) => {
        const updated = [...prev];
        if (updated[idx]) {
          updated[idx] = {
            ...updated[idx],
            displayText: words.slice(0, wordIdx).join(' '),
          };
        }
        return updated;
      });
    }, 60);

    // Save for cleanup
    timeoutRefs.current.push(typeInterval as unknown as ReturnType<typeof setTimeout>);
  }, []);

  const startSimulation = useCallback(
    async (scenario: ScamScenario) => {
      setSelectedScenario(scenario);
      setSimState('ringing');
      setRiskScore(0);
      setSignals({
        nlp_confidence: 0,
        voice_stress: 0,
        synthetic_voice: 0,
        caller_reputation: 0,
        script_match: 0,
      });
      setTranscript([]);
      setCurrentLineIdx(-1);
      setElapsedTime(0);
      setLatencyMs(0);

      // Ring for 3 seconds
      const ringTimeout = setTimeout(() => {
        // Don't auto-answer, user needs to click
      }, 3000);
      timeoutRefs.current.push(ringTimeout);
    },
    []
  );

  const answerCall = useCallback(() => {
    if (!selectedScenario) return;
    setSimState('active');

    const dialogues = selectedScenario.dialogues;
    let cumulativeDelay = 500; // initial delay

    dialogues.forEach((line, idx) => {
      cumulativeDelay += line.delayMs;

      const timeout = setTimeout(async () => {
        setCurrentLineIdx(idx);
        // Simulate latency
        setLatencyMs(Math.floor(80 + Math.random() * 90));

        // Add transcript entry with empty displayText (typewriter fills it)
        const entryIdx = idx;
        setTranscript((prev) => [
          ...prev,
          { speaker: line.speaker, text: line.text, displayText: '' },
        ]);

        // Start typewriter effect
        typewriterAppend(entryIdx, line.text);

        // Update risk score
        setRiskScore((prev) => Math.min(prev + line.riskDelta, 98));

        // Update signals
        setSignals((prev) => ({
          nlp_confidence: Math.min(line.signals.nlp_confidence ?? prev.nlp_confidence, 1),
          voice_stress: Math.min(line.signals.voice_stress ?? prev.voice_stress, 1),
          synthetic_voice: Math.min(line.signals.synthetic_voice ?? prev.synthetic_voice, 1),
          caller_reputation: Math.min(line.signals.caller_reputation ?? prev.caller_reputation, 1),
          script_match: Math.min(line.signals.script_match ?? prev.script_match, 1),
        }));

        // Speak if it's the scammer
        if (line.speaker === 'scammer') {
          await speakText(line.text);
        }
      }, cumulativeDelay);

      timeoutRefs.current.push(timeout);

      // Estimate next delay based on text length for speech
      if (line.speaker === 'scammer') {
        cumulativeDelay += Math.max(line.text.length * 55, 3000);
      } else {
        cumulativeDelay += 2000;
      }
    });

    // End call after all dialogues
    const endTimeout = setTimeout(() => {
      setSimState('ended');
      cleanup();
    }, cumulativeDelay + 2000);
    timeoutRefs.current.push(endTimeout);
  }, [selectedScenario, speakText, typewriterAppend, cleanup]);

  const endCall = useCallback(() => {
    setSimState('ended');
    cleanup();
  }, [cleanup]);

  const resetSimulator = useCallback(() => {
    cleanup();
    setSimState('selecting');
    setSelectedScenario(null);
    setRiskScore(0);
    setSignals({ nlp_confidence: 0, voice_stress: 0, synthetic_voice: 0, caller_reputation: 0, script_match: 0 });
    setTranscript([]);
    setCurrentLineIdx(-1);
    setElapsedTime(0);
  }, [cleanup]);

  // ──────────────────── Render: Scenario Selection ────────────────────

  if (simState === 'selecting') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 border border-[var(--border-default)]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-purple-500/10" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl shadow-lg shadow-red-500/20">
                <Radio className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Scam Call Simulator</h2>
                <p className="text-sm text-[var(--text-secondary)]">Experience EchoShield's AI detection in real-time</p>
              </div>
            </div>
            <p className="text-[var(--text-primary)] text-sm mt-3 max-w-2xl">
              Select a scam scenario below to simulate an incoming call. EchoShield will analyze the
              conversation in real-time — showing live transcription, voice analysis, risk scoring,
              and AI-powered threat detection as the call unfolds.
            </p>
            <div className="flex items-center gap-4 mt-5">
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-white/5 px-3 py-1.5 rounded-full">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Voice Enabled</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-white/5 px-3 py-1.5 rounded-full">
                <Zap className="w-3.5 h-3.5" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] bg-white/5 px-3 py-1.5 rounded-full">
                <Eye className="w-3.5 h-3.5" />
                <span>Live Transcript</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCAM_SCENARIOS.map((scenario, idx) => (
            <motion.button
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => startSimulation(scenario)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 border border-[var(--border-default)] text-left hover:border-blue-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{scenario.icon}</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      scenario.difficulty === 'Easy'
                        ? 'bg-green-500/10 text-green-400'
                        : scenario.difficulty === 'Medium'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {scenario.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-blue-300 transition-colors">
                  {scenario.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">{scenario.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[var(--text-tertiary)] bg-white/5 px-2 py-1 rounded">
                    {scenario.scamType}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-3.5 h-3.5" />
                    <span>Start Simulation</span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // ──────────────────── Render: Incoming Call ────────────────────

  if (simState === 'ringing' && selectedScenario) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[600px] rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-[var(--border-default)] p-8"
      >
        <motion.p
          className="text-sm font-medium text-[var(--text-secondary)] mb-6 tracking-widest uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Incoming Call
        </motion.p>

        <IncomingCallRing />

        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-white">{selectedScenario.callerName}</h3>
          <p className="text-[var(--text-secondary)] font-mono mt-1">{selectedScenario.callerNumber}</p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-xl">{selectedScenario.icon}</span>
            <span className="text-xs text-[var(--text-tertiary)] bg-white/5 px-2 py-1 rounded-full">
              {selectedScenario.scamType}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetSimulator}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={answerCall}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-600 transition-colors"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Phone className="w-9 h-9 text-white" />
          </motion.button>
        </div>

        <p className="mt-6 text-xs text-[var(--text-tertiary)]">Tap the green button to answer</p>
      </motion.div>
    );
  }

  // ──────────────────── Render: Active Call / Ended ────────────────────

  if ((simState === 'active' || simState === 'ended') && selectedScenario) {
    return (
      <div className="space-y-4">
        {/* Call Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-[var(--border-default)] p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                    simState === 'active' ? 'bg-red-500/20 border-2 border-red-500/40' : 'bg-gray-700/50 border-2 border-gray-600'
                  }`}
                >
                  {selectedScenario.icon}
                </div>
                {simState === 'active' && (
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </div>
              <div>
                <h3 className="text-white font-bold">{selectedScenario.callerName}</h3>
                <p className="text-sm text-[var(--text-secondary)] font-mono">{selectedScenario.callerNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-mono tabular-nums">{formatTime(elapsedTime)}</span>
              </div>

              {latencyMs > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">
                  <Zap className="w-3 h-3" />
                  <span className="font-mono">{latencyMs}ms</span>
                </div>
              )}

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                title={voiceEnabled ? 'Mute voice' : 'Enable voice'}
              >
                {voiceEnabled ? (
                  <Volume2 className="w-4 h-4 text-blue-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[var(--text-tertiary)]" />
                )}
              </button>

              {simState === 'active' ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={endCall}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  <PhoneOff className="w-4 h-4" />
                  End Call
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetSimulator}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Simulation
                </motion.button>
              )}
            </div>
          </div>

          {/* Waveform */}
          {simState === 'active' && (
            <div className="mt-4">
              <VoiceWaveform active={isSpeaking} />
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Transcript */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-[var(--border-default)] p-5 h-[500px] flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">LIVE TRANSCRIPT</h3>
                </div>
                {simState === 'active' && (
                  <motion.div
                    className="flex items-center gap-1.5"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-xs text-red-400 font-medium">RECORDING</span>
                  </motion.div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                <AnimatePresence>
                  {transcript.map((entry, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: entry.speaker === 'scammer' ? -20 : 20, y: 10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${entry.speaker === 'system' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          entry.speaker === 'scammer'
                            ? 'bg-white/5 border border-[var(--border-default)] rounded-tl-sm'
                            : 'bg-blue-500/10 border border-blue-500/20 rounded-tr-sm'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {entry.speaker === 'scammer' ? (
                            <Mic className="w-3 h-3 text-red-400" />
                          ) : (
                            <Shield className="w-3 h-3 text-blue-400" />
                          )}
                          <span
                            className={`text-[10px] font-bold tracking-wider uppercase ${
                              entry.speaker === 'scammer' ? 'text-red-400' : 'text-blue-400'
                            }`}
                          >
                            {entry.speaker === 'scammer' ? 'Caller' : 'EchoShield AI'}
                          </span>
                        </div>
                        <p
                          className={`text-sm leading-relaxed ${
                            entry.speaker === 'scammer' ? 'text-[var(--text-primary)]' : 'text-blue-300'
                          }`}
                        >
                          {entry.displayText}
                          {simState === 'active' && idx === transcript.length - 1 && (
                            <motion.span
                              className="inline-block w-0.5 h-4 bg-current ml-0.5 align-text-bottom"
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                            />
                          )}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {transcript.length === 0 && simState === 'active' && (
                  <div className="flex items-center justify-center h-full text-gray-600">
                    <div className="text-center">
                      <Mic className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Listening for audio...</p>
                    </div>
                  </div>
                )}

                <div ref={transcriptEndRef} />
              </div>
            </motion.div>
          </div>

          {/* Right: Risk Score + Signals */}
          <div className="space-y-4">
            {/* Risk Gauge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-[var(--border-default)] p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">RISK SCORE</h3>
              </div>
              <div className="flex justify-center py-2">
                <RiskGauge score={riskScore} size={200} />
              </div>
            </motion.div>

            {/* AI Signals */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-[var(--border-default)] p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">AI SIGNALS</h3>
              </div>
              <div className="space-y-3">
                <SignalBar label="NLP Threat" value={signals.nlp_confidence} icon={Brain} color="#a855f7" />
                <SignalBar label="Voice Stress" value={signals.voice_stress} icon={Activity} color="#f97316" />
                <SignalBar label="Synthetic Voice" value={signals.synthetic_voice} icon={Fingerprint} color="#ef4444" />
                <SignalBar label="Caller Rep." value={signals.caller_reputation} icon={UserX} color="#eab308" />
                <SignalBar label="Script Match" value={signals.script_match} icon={Search} color="#3b82f6" />
              </div>
            </motion.div>

            {/* Call Ended Summary */}
            {simState === 'ended' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-bold text-red-400 tracking-wide">CALL ANALYSIS COMPLETE</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Scam Type</span>
                    <span className="text-white font-bold">{selectedScenario.scamType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Final Risk</span>
                    <span className={`font-bold ${riskScore >= 75 ? 'text-red-400' : riskScore >= 50 ? 'text-orange-400' : 'text-yellow-400'}`}>
                      {Math.round(riskScore)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Duration</span>
                    <span className="text-white font-mono">{formatTime(elapsedTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Avg Latency</span>
                    <span className="text-green-400 font-mono">{latencyMs}ms</span>
                  </div>
                </div>
                <button
                  onClick={resetSimulator}
                  className="w-full mt-4 px-4 py-2.5 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Another Scenario
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default ScamSimulator;
