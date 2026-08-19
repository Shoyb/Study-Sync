import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudySync — Admission Study Tracker',
  description: 'Track your HSC 2026 admission preparation progress, manage revision schedules, and collaborate with peers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
