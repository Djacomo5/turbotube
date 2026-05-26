'use client';

import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-brand transition-shadow group-hover:shadow-[0_0_15px_rgba(255,0,60,0.6)]">
            <Play className="h-5 w-5 text-white fill-white translate-x-[1px]" />
          </div>
          <span className="text-xl font-black tracking-tight text-white uppercase sm:block">
            Turbo<span className="text-brand">Tube</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
            Início
          </Link>
          <Link href="/about" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
            Sobre
          </Link>
          <Link href="/terms" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
            Termos
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
            Privacidade
          </Link>
        </nav>
      </div>
    </header>
  );
};
