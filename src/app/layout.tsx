import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import FloatingPopup from '@/components/FloatingPopup';
import ThemeToggle from '@/components/ThemeToggle';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TN Engineering College Predictor',
  description: 'Predict suitable engineering colleges in Tamil Nadu based on Class 12 cutoff marks.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      <body className={inter.className}>
        {children}
        <FloatingPopup />
        <Analytics />
      </body>
    </html>
  );
}
