// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from "next/font/google";
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Kidde | Control de Embarques',
  description: 'Sistema de registro y control de embarques diarios — Kidde',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
