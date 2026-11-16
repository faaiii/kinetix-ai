import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kinetix - Unconstrained AI Workspace & Artifacts',
  description: 'Fast, unconstrained AI workspace with interactive Artifacts, transparent token telemetry, and live execution.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
