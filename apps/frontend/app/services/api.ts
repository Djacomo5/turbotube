import axios from 'axios';
import { VideoInfo, DownloadResponse } from '@turbotube/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchVideoInfo = async (url: string): Promise<VideoInfo> => {
  const response = await api.post('/api/video-info', { url });
  if (response.data?.status === 'success') {
    return response.data.data;
  }
  throw new Error(response.data?.message || 'Falha ao buscar informações do vídeo.');
};

export const getDownloadUrl = (url: string, format: string): string => {
  const encodedUrl = encodeURIComponent(url);
  const encodedFormat = encodeURIComponent(format);
  return `${API_URL}/api/download?url=${encodedUrl}&format=${encodedFormat}`;
};

export const fetchRecentDownloads = async (): Promise<any[]> => {
  try {
    const response = await api.get('/api/recent-downloads');
    if (response.data?.status === 'success') {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Falha ao buscar downloads recentes do backend:', error);
    return [];
  }
};
