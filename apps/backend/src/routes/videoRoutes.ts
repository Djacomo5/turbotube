import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { videoInfoRequestSchema, downloadRequestSchema } from '@turbotube/shared';
import { YtDlpService } from '../services/ytDlpService.js';
import { FfmpegService } from '../services/ffmpegService.js';
import { SupabaseService } from '../services/supabaseService.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define a directory for temporary files inside the project structure
const TEMP_DIR = path.join(__dirname, '../../temp');

export async function videoRoutes(fastify: FastifyInstance) {
  
  // Endpoint to fetch video metadata
  fastify.post('/api/video-info', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const parsedBody = videoInfoRequestSchema.safeParse(request.body);
      if (!parsedBody.success) {
        return reply.status(400).send({
          status: 'error',
          message: parsedBody.error.errors[0].message,
        });
      }

      const { url } = parsedBody.data;
      const info = await YtDlpService.getVideoInfo(url);
      
      return reply.send({
        status: 'success',
        data: info,
      });
    } catch (error: any) {
      fastify.log.error(error);
      return reply.status(500).send({
        status: 'error',
        message: error.message || 'Erro ao processar as informações do vídeo.',
      });
    }
  });

  // Endpoint to download the processed media file (runs as GET for easier streaming & browser download handling)
  fastify.get('/api/download', async (request: FastifyRequest, reply: FastifyReply) => {
    let filePathToDelete: string | null = null;

    try {
      const parsedQuery = downloadRequestSchema.safeParse(request.query);
      if (!parsedQuery.success) {
        return reply.status(400).send({
          status: 'error',
          message: parsedQuery.error.errors[0].message,
        });
      }

      const { url, format } = parsedQuery.data;

      // Ensure FFmpeg is available if merging is needed (MP4 1080p, 720p or converting to MP3)
      const ffmpegAvailable = await FfmpegService.isAvailable();
      const ffmpegPath = FfmpegService.getBinaryPath();

      // Download and process
      const localFilePath = await YtDlpService.downloadMedia(
        url,
        format,
        TEMP_DIR,
        ffmpegAvailable ? ffmpegPath : undefined
      );

      filePathToDelete = localFilePath;

      if (!fs.existsSync(localFilePath)) {
        return reply.status(404).send({
          status: 'error',
          message: 'Arquivo processado não foi encontrado no servidor.',
        });
      }

      // Read file stats to get content-length
      const stat = fs.statSync(localFilePath);
      const originalFileName = path.basename(localFilePath);

      // Fetch video info to get a friendly filename
      let friendlyFileName = originalFileName;
      try {
        const info = await YtDlpService.getVideoInfo(url);
        // Replace invalid filename characters
        const safeTitle = info.title.replace(/[^a-zA-Z0-9]/g, '_');
        const ext = format === 'mp3' ? 'mp3' : 'mp4';
        friendlyFileName = `${safeTitle}.${ext}`;

        // Log this download to Supabase
        await SupabaseService.logDownload({
          video_id: info.id,
          title: info.title,
          duration: info.duration,
          thumbnail_url: info.thumbnailUrl,
          format_type: format,
        });
      } catch (err) {
        fastify.log.warn('Could not extract details for friendly filename, sending raw.');
      }

      // Stream file to user
      const fileStream = fs.createReadStream(localFilePath);

      // Set headers for download
      reply.raw.writeHead(200, {
        'Content-Type': format === 'mp3' ? 'audio/mpeg' : 'video/mp4',
        'Content-Length': stat.size,
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(friendlyFileName)}`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
      });

      // Pipe the readstream to response raw stream
      fileStream.pipe(reply.raw);

      // Cleanup files after stream closes or ends
      const cleanup = () => {
        if (filePathToDelete && fs.existsSync(filePathToDelete)) {
          try {
            fs.unlinkSync(filePathToDelete);
            fastify.log.info(`Cleaned up temp file: ${filePathToDelete}`);
          } catch (e: any) {
            fastify.log.error(e, `Failed to delete temp file ${filePathToDelete}`);
          }
          filePathToDelete = null;
        }
      };

      reply.raw.on('close', cleanup);
      reply.raw.on('finish', cleanup);

      // Wait until pipe is finished
      return reply;
    } catch (error: any) {
      fastify.log.error(error);
      
      // Clean up if there was an error during download/process
      if (filePathToDelete && fs.existsSync(filePathToDelete)) {
        try {
          fs.unlinkSync(filePathToDelete);
        } catch (e) {}
      }

      return reply.status(500).send({
        status: 'error',
        message: error.message || 'Erro ao processar e baixar o vídeo.',
      });
    }
  });

  // Optional endpoint to retrieve recent global downloads from Supabase
  fastify.get('/api/recent-downloads', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const recent = await SupabaseService.getRecentDownloads(12);
      return reply.send({
        status: 'success',
        data: recent,
      });
    } catch (error: any) {
      return reply.status(500).send({
        status: 'error',
        message: 'Erro ao buscar downloads recentes.',
      });
    }
  });
}
