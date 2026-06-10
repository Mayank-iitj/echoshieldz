import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EchoShield - Real-Time AI Scam Call Detector',
  description: 'AI-powered scam call detection for Indian mobile users. Hear the truth before the damage is done.',
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}