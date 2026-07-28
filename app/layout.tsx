import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Internee.pk AI Tutor',
  description: 'Your personalized AI learning assistant powered by Gemini',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{margin:0,padding:0}}>{children}</body>
    </html>
  );
}