'use client';

import React, { useState } from 'react';
import { Downloader } from './components/Downloader';
import { HistoryList } from './components/HistoryList';
import { Film, Music, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const handleDownloadCompleted = () => {
    // Increment key to trigger useEffect inside HistoryList
    setHistoryRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center w-full py-16 sm:py-24">
      {/* Hero Section */}
      <div className="text-center px-4 max-w-3xl mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand/20 bg-brand/5 text-[11px] font-bold tracking-wider text-brand uppercase mb-6"
        >
          <Zap className="w-3.5 h-3.5" />
          Serviço Premium & Ilimitado
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-[1.1] sm:leading-[1.05]"
        >
          Baixe Vídeos do YouTube em <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-rose-500 font-extrabold">Alta Velocidade</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base sm:text-lg text-zinc-400 mt-6 max-w-xl mx-auto font-medium"
        >
          Cole o link de qualquer vídeo ou Shorts abaixo, escolha a resolução desejada e baixe em MP4 ou MP3 sem anúncios irritantes.
        </motion.p>
      </div>

      {/* Downloader Form Wrapper */}
      <Downloader onDownloadCompleted={handleDownloadCompleted} />

      {/* History panel */}
      <HistoryList refreshTrigger={historyRefreshKey} />

      {/* Features Grid */}
      <div className="mx-auto max-w-5xl px-6 lg:px-8 mt-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-brand uppercase tracking-wider">Desempenho SaaS</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl uppercase">
            Por que usar o TurboTube?
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-4 sm:grid-cols-2">
            
            {/* Feature 1 */}
            <div className="flex flex-col bg-[#0c0c0e]/80 border border-zinc-900 p-5 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-sm font-bold leading-7 text-zinc-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-brand">
                  <Film className="h-5 w-5" />
                </div>
                Qualidade de Vídeo 1080p
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-xs leading-6 text-zinc-500">
                <p className="flex-auto">
                  Baixe em Full HD (1080p) e HD (720p). Nosso servidor une automaticamente os melhores canais de vídeo e áudio em segundos.
                </p>
              </dd>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col bg-[#0c0c0e]/80 border border-zinc-900 p-5 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-sm font-bold leading-7 text-zinc-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-brand">
                  <Music className="h-5 w-5" />
                </div>
                Extração de MP3 Alta
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-xs leading-6 text-zinc-500">
                <p className="flex-auto">
                  Converta qualquer vídeo em música MP3 de alta taxa de amostragem. Ideal para ouvir playlists offline no seu celular.
                </p>
              </dd>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col bg-[#0c0c0e]/80 border border-zinc-900 p-5 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-sm font-bold leading-7 text-zinc-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-brand">
                  <Zap className="h-5 w-5" />
                </div>
                Sem Cadastro e Rápido
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-xs leading-6 text-zinc-500">
                <p className="flex-auto">
                  Sem limites chatos, contas ou telas de espera. Cole a URL e baixe instantaneamente diretamente dos servidores.
                </p>
              </dd>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col bg-[#0c0c0e]/80 border border-zinc-900 p-5 rounded-2xl">
              <dt className="flex items-center gap-x-3 text-sm font-bold leading-7 text-zinc-200">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-brand">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                Ambiente 100% Seguro
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-xs leading-6 text-zinc-500">
                <p className="flex-auto">
                  Não salvamos arquivos no servidor por mais de alguns minutos. Todos os temporários são excluídos logo após o download.
                </p>
              </dd>
            </div>

          </dl>
        </div>
      </div>
    </div>
  );
}
