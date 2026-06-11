import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EchoShield - Real-Time AI Scam Call Detector',
  description: 'AI-powered scam call detection for Indian mobile users. Hear the truth before the damage is done.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06060b] text-gray-100 antialiased">{children}</body>
    </html>
  );
}