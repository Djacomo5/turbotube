'use client';

import React, { useEffect, useState } from 'react';
import { HistoryItem } from '@turbotube/shared';
import { Trash2, Download, Copy, Share2, Film, Music, Check } from 'lucide-react';
import { useToast } from './Toast';
import { getDownloadUrl } from '../services/api';

interface HistoryListProps {
  refreshTrigger: number;
}

export const HistoryList: React.FC<HistoryListProps> = ({ refreshTrigger }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedHistory = localStorage.getItem('turbotube_history');
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (err) {
        console.error('Falha ao ler histórico local:', err);
      }
    }
  }, [refreshTrigger]);

  const clearHistory = () => {
    localStorage.removeItem('turbotube_history');
    setHistory([]);
    toast('Histórico local removido com sucesso.', 'success');
  };

  const copyThumbnail = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast('Link da Thumbnail copiado!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareDownload = (item: HistoryItem) => {
    const videoUrl = `https://www.youtube.com/watch?v=${item.videoId}`;
    navigator.clipboard.writeText(videoUrl);
    toast('Link do vídeo copiado para compartilhamento!', 'success');
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-card p-6 rounded-2xl border border-card-border glass-panel">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Seu Histórico Local</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Downloads recentes salvos apenas neste navegador.
          </p>
        </div>
        <button
          onClick={clearHistory}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/20 text-xs font-semibold text-red-400 bg-red-950/10 hover:bg-red-950/20 hover:text-red-300 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Limpar Tudo
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {history.map((item) => {
          const isAudio = item.format === 'mp3';
          const downloadLink = getDownloadUrl(`https://www.youtube.com/watch?v=${item.videoId}`, item.format);
          
          return (
            <div
              key={item.id}
              className="flex gap-4 p-3 bg-[#0d0d10] border border-zinc-900 rounded-xl hover:border-zinc-800 transition-colors"
            >
              {/* Thumbnail Container */}
              <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-zinc-950 shrink-0">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute bottom-1 right-1 bg-black/85 text-[10px] font-semibold text-zinc-300 px-1 py-0.5 rounded">
                  {formatDuration(item.duration)}
                </span>
                <span className="absolute top-1 left-1 bg-black/85 px-1 py-0.5 rounded flex items-center justify-center">
                  {isAudio ? (
                    <Music className="w-3 h-3 text-brand" />
                  ) : (
                    <Film className="w-3 h-3 text-zinc-400" />
                  )}
                </span>
              </div>

              {/* Details & Actions */}
              <div className="flex flex-col justify-between overflow-hidden w-full">
                <div>
                  <h3 className="text-xs font-bold text-zinc-200 line-clamp-1 truncate" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wider font-semibold">
                    {item.format.replace('_', ' ')}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-2">
                  <a
                    href={downloadLink}
                    className="flex items-center justify-center p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Baixar novamente"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={() => copyThumbnail(item.thumbnailUrl, item.id)}
                    className="flex items-center justify-center p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Copiar Thumbnail"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => shareDownload(item)}
                    className="flex items-center justify-center p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    title="Compartilhar"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
