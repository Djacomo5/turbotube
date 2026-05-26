import fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';
import { videoRoutes } from './routes/videoRoutes.js';
import { YtDlpService } from './services/ytDlpService.js';
import { FfmpegService } from './services/ffmpegService.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../../.env') });
dotenv.config(); // fallback to local directory env

const server = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register CORS
await server.register(cors, {
  origin: '*', // Allow all for public SaaS, but can restrict to frontend URL in prod
  methods: ['GET', 'POST', 'OPTIONS'],
});

// Register Rate Limiting (max 10 downloads or metadata queries per minute per IP)
await server.register(rateLimit, {
  max: 10,
  timeWindow: '1 minute',
  errorResponseBuilder: (request, context) => {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Limite de taxa excedido. Por favor, aguarde ${context.after} para tentar novamente.`,
    };
  },
});

// Register Video Routes
await server.register(videoRoutes);

// Add simple health check route
server.get('/health', async () => {
  const ytDlpAvailable = await YtDlpService.isAvailable();
  const ffmpegAvailable = await FfmpegService.isAvailable();
  
  return {
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    dependencies: {
      ytDlp: ytDlpAvailable ? 'available' : 'unavailable',
      ffmpeg: ffmpegAvailable ? 'available' : 'unavailable',
    }
  };
});

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '4000', 10);
    const host = process.env.HOST || '0.0.0.0';

    // Ensure temp directory exists
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Log dependency warnings
    const ytDlpAvailable = await YtDlpService.isAvailable();
    const ffmpegAvailable = await FfmpegService.isAvailable();
    
    if (!ytDlpAvailable) {
      server.log.warn('ATENÇÃO: A ferramenta yt-dlp não está disponível ou não foi encontrada no PATH. As extrações falharão.');
    }
    if (!ffmpegAvailable) {
      server.log.warn('ATENÇÃO: A ferramenta ffmpeg não está disponível ou não foi encontrada no PATH. Conversões MP3 e mesclagem de 1080p falharão.');
    }

    await server.listen({ port, host });
    server.log.info(`Servidor TurboTube Backend rodando em http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
