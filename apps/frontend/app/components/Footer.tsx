'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-950 bg-black py-8 mt-auto">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-center md:text-left">
          <div>
            <p className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} TurboTube. Todos os direitos reservados.
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Desenvolvido com Next.js, Fastify, Supabase, yt-dlp e FFmpeg.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            <Link href="/about" className="hover:text-zinc-300 transition-colors">
              Sobre Nós
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Políticas de Privacidade
            </Link>
          </div>
        </div>
        <div className="mt-6 border-t border-zinc-900/50 pt-4 text-center">
          <p className="text-xs text-zinc-700 max-w-2xl mx-auto">
            Aviso: O TurboTube é uma ferramenta de download para fins de backup pessoal e uso educacional. Não incentivamos o download de materiais protegidos por direitos autorais sem a permissão dos proprietários legais.
          </p>
        </div>
      </div>
    </footer>
  );
};
