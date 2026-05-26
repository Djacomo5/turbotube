'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Film, Music, Check, Copy, Share2, Play, ExternalLink, RefreshCw } from 'lucide-react';
import { fetchVideoInfo, getDownloadUrl } from '../services/api';
import { VideoInfo, DownloadFormat, HistoryItem } from '@turbotube/shared';
import { useToast } from './Toast';

interface DownloaderProps {
  onDownloadCompleted: () => void;
}

export const Downloader: React.FC<DownloaderProps> = ({ onDownloadCompleted }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('mp4_1080p');
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast('Por favor, insira uma URL do YouTube.', 'error');
      return;
    }

    setLoading(true);
    setVideoInfo(null);

    try {
      const info = await fetchVideoInfo(url);
      setVideoInfo(info);
      toast('Vídeo detectado com sucesso!', 'success');
    } catch (err: any) {
      toast(err.message || 'Erro ao buscar vídeo. Verifique a URL.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoInfo) return;

    setIsProcessing(true);
    toast('Iniciando processamento no servidor... Aguarde.', 'info');

    // Build the download link
    const downloadUrl = getDownloadUrl(videoInfo.url, selectedFormat);
    
    // Add to localStorage history
    const historyItem: HistoryItem = {
      id: `${videoInfo.id}_${selectedFormat}_${Date.now()}`,
      videoId: videoInfo.id,
      title: videoInfo.title,
      duration: videoInfo.duration,
      thumbnailUrl: videoInfo.thumbnailUrl,
      format: selectedFormat,
      downloadedAt: new Date().toISOString(),
    };

    const storedHistory = localStorage.getItem('turbotube_history');
    let historyList: HistoryItem[] = [];
    if (storedHistory) {
      try {
        historyList = JSON.parse(storedHistory);
      } catch (err) {}
    }
    historyList.unshift(historyItem);
    // Limit to 20 history items
    historyList = historyList.slice(0, 20);
    localStorage.setItem('turbotube_history', JSON.stringify(historyList));

    // Open download link in current window/iframe to trigger file saving
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = downloadUrl;
    document.body.appendChild(iframe);

    // Turn off loader after 6 seconds, informing user
    setTimeout(() => {
      setIsProcessing(false);
      document.body.removeChild(iframe);
      onDownloadCompleted();
      toast('Download enviado para o navegador!', 'success');
    }, 6000);
  };

  const copyThumbnail = () => {
    if (!videoInfo) return;
    navigator.clipboard.writeText(videoInfo.thumbnailUrl);
    setCopied(true);
    toast('Link da Thumbnail copiado!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVideo = () => {
    if (!videoInfo) return;
    navigator.clipboard.writeText(videoInfo.url);
    toast('Link do vídeo copiado para área de transferência!', 'success');
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* URL Form */}
      <form onSubmit={handleSearch} className="w-full relative flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cole o link do YouTube aqui (Vídeo ou Shorts)..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading || isProcessing}
            className="w-full h-14 bg-zinc-900 border border-zinc-800 focus:border-brand rounded-2xl pl-12 pr-4 text-zinc-100 placeholder-zinc-500 font-medium transition-all glow-input"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
        </div>
        <button
          type="submit"
          disabled={loading || isProcessing}
          className="h-14 px-8 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(255,0,60,0.3)] hover:shadow-[0_0_25px_rgba(255,0,60,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none cursor-pointer"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            'Analisar'
          )}
        </button>
      </form>

      {/* Video Details Card */}
      <AnimatePresence>
        {videoInfo && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="mt-8 bg-card border border-card-border p-6 rounded-2xl glass-panel relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Thumbnail side */}
              <div className="relative w-full md:w-80 aspect-video rounded-xl overflow-hidden bg-zinc-950 shadow-inner group">
                <img
                  src={videoInfo.thumbnailUrl}
                  alt={videoInfo.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-12 h-12 text-white fill-white" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/85 text-xs font-semibold text-zinc-200 px-2 py-1 rounded">
                  {formatDuration(videoInfo.duration)}
                </span>
              </div>

              {/* Info & Options side */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-xl font-bold text-white leading-tight line-clamp-2">
                      {videoInfo.title}
                    </h2>
                  </div>
                  <p className="text-sm text-zinc-400 mt-1.5 font-medium">
                    Canal: <span className="text-zinc-300 font-semibold">{videoInfo.author}</span>
                  </p>
                  
                  {/* Share and Copy buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={copyThumbnail}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      Thumbnail
                    </button>
                    <button
                      onClick={shareVideo}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 hover:text-zinc-100 transition-all cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Compartilhar
                    </button>
                  </div>
                </div>

                {/* Formats selectors */}
                <div className="mt-6 border-t border-zinc-900 pt-6">
                  <h3 className="text-sm font-bold text-zinc-300 mb-3">Selecione o formato de saída:</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {/* MP4 1080p */}
                    <button
                      onClick={() => setSelectedFormat('mp4_1080p')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedFormat === 'mp4_1080p'
                          ? 'bg-brand/10 border-brand text-white'
                          : 'bg-zinc-950/50 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      <Film className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold">MP4 1080p</span>
                      <span className="text-[10px] opacity-75 mt-0.5">Full HD</span>
                    </button>

                    {/* MP4 720p */}
                    <button
                      onClick={() => setSelectedFormat('mp4_720p')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedFormat === 'mp4_720p'
                          ? 'bg-brand/10 border-brand text-white'
                          : 'bg-zinc-950/50 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      <Film className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold">MP4 720p</span>
                      <span className="text-[10px] opacity-75 mt-0.5">Alta Definição</span>
                    </button>

                    {/* MP3 */}
                    <button
                      onClick={() => setSelectedFormat('mp3')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedFormat === 'mp3'
                          ? 'bg-brand/10 border-brand text-white'
                          : 'bg-zinc-950/50 border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      <Music className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold">Áudio MP3</span>
                      <span className="text-[10px] opacity-75 mt-0.5">320kbps aprox.</span>
                    </button>
                  </div>

                  <button
                    onClick={handleDownload}
                    disabled={isProcessing}
                    className="w-full mt-6 h-12 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,0,60,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:shadow-none"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Misturando e baixando arquivos...
                      </>
                    ) : (
                      <>
                        Baixar Agora
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Animated process overlay */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10"
                >
                  <div className="relative flex items-center justify-center h-20 w-20 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-zinc-900 border-t-brand animate-spin" />
                    <RefreshCw className="w-8 h-8 text-brand animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Processando Arquivos</h3>
                  <p className="text-sm text-zinc-400 mt-2 max-w-sm">
                    Estamos unindo os fluxos de vídeo de alta resolução com o áudio usando o FFmpeg. O download começará automaticamente em instantes.
                  </p>
                  <div className="w-48 bg-zinc-950 h-1.5 rounded-full overflow-hidden mt-6">
                    <motion.div
                      initial={{ left: '-100%' }}
                      animate={{ left: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="relative h-full bg-brand w-24 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
