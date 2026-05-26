'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Cpu, RefreshCw, Star } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 text-zinc-300">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase mb-6 tracking-tight">
          Sobre o <span className="text-brand">TurboTube</span>
        </h1>
        <p className="text-base sm:text-lg leading-relaxed text-zinc-400 mb-10 font-medium">
          O TurboTube é uma plataforma SaaS de última geração projetada para simplificar a extração de conteúdo do YouTube para backups pessoais, fins educacionais e uso offline de mídias autorizadas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Card 1 */}
          <div className="bg-card border border-card-border p-6 rounded-2xl glass-panel">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-brand mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Processamento de Alta Performance</h3>
            <p className="text-xs leading-relaxed text-zinc-500">
              Nosso servidor utiliza algoritmos otimizados com `yt-dlp` e `FFmpeg` para mesclar canais adaptativos de áudio e vídeo de alta definição em tempo recorde no backend.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-card border border-card-border p-6 rounded-2xl glass-panel">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-brand mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Segurança & Privacidade Absoluta</h3>
            <p className="text-xs leading-relaxed text-zinc-500">
              Os arquivos temporários baixados são removidos automaticamente do servidor após o download, garantindo que não armazenamos cópias persistentes dos seus dados ou links.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-card border border-card-border p-6 rounded-2xl glass-panel">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-brand mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Sem Anúncios Abusivos</h3>
            <p className="text-xs leading-relaxed text-zinc-500">
              Cansado de pop-ups perigosos? O TurboTube foi desenvolvido no formato premium limpo, oferecendo uma experiência focada na facilidade de uso do usuário, livre de spams ou cookies invasivos.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-card border border-card-border p-6 rounded-2xl glass-panel">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-950 text-brand mb-4">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Padrão Tecnológico Moderno</h3>
            <p className="text-xs leading-relaxed text-zinc-500">
              Interface desenvolvida com Next.js 15, animações suaves com Framer Motion, e backend modular em TypeScript baseado no framework ultra-veloz Fastify.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t border-zinc-900 pt-10">
          <h2 className="text-xl font-bold text-white mb-4 uppercase">Nossa Missão</h2>
          <p className="text-sm leading-relaxed text-zinc-400">
            Fornecer a melhor experiência possível para que estudantes, produtores de conteúdo e entusiastas de tecnologia possam acessar e baixar materiais de estudo offline, tutoriais de código ou trilhas sonoras autorizadas com o máximo de agilidade e o mínimo de fricção possível.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
