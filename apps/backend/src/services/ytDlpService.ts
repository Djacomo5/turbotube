import { exec } from 'child_process';
import { promisify } from 'util';
import { VideoInfo, VideoFormat } from '@turbotube/shared';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export class YtDlpService {
  private static getBinaryPath(): string {
    return process.env.YT_DLP_PATH || 'yt-dlp';
  }

  /**
   * Verifies if yt-dlp is available on the path or configured location.
   */
  public static async isAvailable(): Promise<boolean> {
    try {
      const binary = this.getBinaryPath();
      await execAsync(`"${binary}" --version`);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Fetches metadata for a video URL and returns a parsed VideoInfo object.
   */
  public static async getVideoInfo(url: string): Promise<VideoInfo> {
    const binary = this.getBinaryPath();
    // Use --no-playlist to ensure we only get a single video
    const command = `"${binary}" --dump-json --no-playlist "${url}"`;

    try {
      const { stdout } = await execAsync(command, { maxBuffer: 1024 * 1024 * 10 }); // 10MB buffer for large metadata
      const rawInfo = JSON.parse(stdout);

      const formats: VideoFormat[] = (rawInfo.formats || [])
        .filter((f: any) => {
          // Keep formats that are video-only, audio-only, or both, which have a format_id
          return f.format_id;
        })
        .map((f: any) => ({
          formatId: f.format_id,
          quality: f.height ? `${f.height}p` : 'audio',
          ext: f.ext,
          filesize: f.filesize || f.filesize_approx || undefined,
          fps: f.fps || undefined,
          vcodec: f.vcodec || undefined,
          acodec: f.acodec || undefined,
        }));

      return {
        id: rawInfo.id || '',
        title: rawInfo.title || 'Sem título',
        description: rawInfo.description || '',
        duration: rawInfo.duration || 0,
        author: rawInfo.uploader || rawInfo.channel || 'Desconhecido',
        thumbnailUrl: rawInfo.thumbnail || (rawInfo.thumbnails && rawInfo.thumbnails.length > 0 ? rawInfo.thumbnails[rawInfo.thumbnails.length - 1].url : ''),
        url: url,
        formats: formats,
        views: rawInfo.view_count || undefined,
        uploadDate: rawInfo.upload_date || undefined,
      };
    } catch (error: any) {
      throw new Error(`Erro ao extrair informações com yt-dlp: ${error.message}`);
    }
  }

  /**
   * Downloads a video or audio stream and returns the file path.
   * Format parameter options: 'mp4_1080p', 'mp4_720p', 'mp3'.
   */
  public static async downloadMedia(
    url: string,
    format: 'mp4_1080p' | 'mp4_720p' | 'mp3',
    outputDir: string,
    ffmpegPath?: string
  ): Promise<string> {
    const binary = this.getBinaryPath();
    const videoId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let formatSelection = '';
    let ext = 'mp4';
    let postProcessor = '';

    if (format === 'mp4_1080p') {
      // Best video up to 1080p + best audio, combined
      formatSelection = 'bestvideo[height<=1080]+bestaudio/best';
      ext = 'mp4';
    } else if (format === 'mp4_720p') {
      // Best video up to 720p + best audio, combined
      formatSelection = 'bestvideo[height<=720]+bestaudio/best';
      ext = 'mp4';
    } else if (format === 'mp3') {
      // Extract audio only
      formatSelection = 'bestaudio/best';
      ext = 'mp3';
      postProcessor = '--extract-audio --audio-format mp3 --audio-quality 0';
    }

    const outputFilePattern = path.join(outputDir, `${videoId}.%(ext)s`);
    let command = `"${binary}" -f "${formatSelection}" "${url}" -o "${outputFilePattern}" --no-playlist`;

    if (format === 'mp3') {
      command += ` ${postProcessor}`;
    } else {
      command += ` --merge-output-format mp4`;
    }

    // Pass custom ffmpeg path to yt-dlp if provided
    if (ffmpegPath) {
      command += ` --ffmpeg-location "${ffmpegPath}"`;
    }

    try {
      await execAsync(command);
      
      const finalFileName = `${videoId}.${ext}`;
      const finalPath = path.join(outputDir, finalFileName);

      // Verify that the file exists, if not, find files starting with videoId in the output directory
      if (fs.existsSync(finalPath)) {
        return finalPath;
      }

      const files = fs.readdirSync(outputDir);
      const matchedFile = files.find(f => f.startsWith(videoId));
      if (matchedFile) {
        return path.join(outputDir, matchedFile);
      }

      throw new Error('Arquivo baixado não foi encontrado no diretório de saída.');
    } catch (error: any) {
      throw new Error(`Erro ao baixar com yt-dlp: ${error.message}`);
    }
  }
}
