import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EchoShield - Real-Time Scam Call Detector',
  description: 'AI-powered scam call detection for Indian mobile users. Hear the truth before the damage is done.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}