export interface VideoFormat {
  formatId: string;
  quality: '1080p' | '720p' | '480p' | '360p' | 'audio' | string;
  ext: string;
  filesize?: number;
  fps?: number;
  vcodec?: string;
  acodec?: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  description?: string;
  duration: number; // in seconds
  author: string;
  thumbnailUrl: string;
  url: string;
  formats: VideoFormat[];
  views?: number;
  uploadDate?: string;
}

export type DownloadFormat = 'mp4_1080p' | 'mp4_720p' | 'mp3';

export interface DownloadRequest {
  url: string;
  format: DownloadFormat;
}

export interface DownloadResponse {
  status: 'success' | 'error';
  message?: string;
  fileName?: string;
  downloadUrl?: string;
}

export interface HistoryItem {
  id: string; // unique download id or video id + format combo
  videoId: string;
  title: string;
  duration: number;
  thumbnailUrl: string;
  format: DownloadFormat;
  downloadedAt: string; // ISO String
}

export interface SupabaseDownloadRow {
  id?: string;
  video_id: string;
  title: string;
  duration: number;
  thumbnail_url: string;
  format_type: string;
  downloaded_at?: string;
}
