import { z } from 'zod';

// Regex matching youtube.com/watch?v=..., youtu.be/..., and youtube.com/shorts/...
export const YOUTUBE_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|watch\?.+&v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?$/;

export function isYouTubeUrl(url: string): boolean {
  return YOUTUBE_URL_REGEX.test(url);
}

export function extractYouTubeId(url: string): string | null {
  const match = url.match(YOUTUBE_URL_REGEX);
  return match ? match[1] : null;
}

/**
 * Sanitizes input to avoid shell command injections when running child_processes.
 * Removes characters like ;, &, |, $, `, \, ', ", etc.
 */
export function sanitizeShellArg(arg: string): string {
  // Allow normal URL characters but strip execution modifiers
  return arg.replace(/[^a-zA-Z0-9_.\-/:?=&+~]/g, '');
}

export const videoInfoRequestSchema = z.object({
  url: z.string().url({ message: 'URL inválida' }).refine(isYouTubeUrl, {
    message: 'Por favor, insira uma URL válida do YouTube (Vídeo ou Shorts)',
  }),
});

export const downloadRequestSchema = z.object({
  url: z.string().url({ message: 'URL inválida' }).refine(isYouTubeUrl, {
    message: 'Por favor, insira uma URL válida do YouTube',
  }),
  format: z.enum(['mp4_1080p', 'mp4_720p', 'mp3'], {
    errorMap: () => ({ message: 'Formato inválido. Escolha mp4_1080p, mp4_720p ou mp3.' }),
  }),
});
