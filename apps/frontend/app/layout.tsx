import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastProvider } from './components/Toast';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TurboTube - Downloader Premium de Vídeos do YouTube',
  description: 'Baixe vídeos e áudios do YouTube grátis em alta definição 1080p e 720p ou converta para MP3 de forma simples, rápida e segura.',
  keywords: 'download youtube, baixar videos youtube, converter mp3, youtube downloader, 1080p download, turbotube',
  authors: [{ name: 'TurboTube Team' }],
  openGraph: {
    title: 'TurboTube - Downloader Premium de Vídeos do YouTube',
    description: 'Baixe vídeos e áudios do YouTube grátis em alta definição 1080p e 720p ou converta para MP3.',
    type: 'website',
    url: 'https://turbotube.app',
    images: [
      {
        url: 'https://turbotube.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TurboTube Downloader',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-brand selection:text-white">
        <ToastProvider>
          {/* Neon Radial Light Glow */}
          <div className="absolute top-0 left-0 w-full h-[600px] bg-glow-radial pointer-events-none -z-10" />
          {/* Animated background Grid pattern */}
          <div className="absolute top-0 left-0 w-full h-[600px] bg-grid-pattern pointer-events-none -z-10 opacity-60" />
          
          <Header />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
