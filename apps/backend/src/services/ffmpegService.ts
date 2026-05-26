import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class FfmpegService {
  /**
   * Returns the configured or resolved path to ffmpeg.
   */
  public static getBinaryPath(): string | undefined {
    return process.env.FFMPEG_PATH || undefined;
  }

  /**
   * Verifies if ffmpeg is available in the environment.
   */
  public static async isAvailable(): Promise<boolean> {
    try {
      const binary = this.getBinaryPath() || 'ffmpeg';
      await execAsync(`"${binary}" -version`);
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Can perform a manual video + audio merge using FFmpeg if needed.
   * Typically, yt-dlp handles this, but having this manual method makes the backend extremely robust.
   */
  public static async mergeVideoAudio(videoPath: string, audioPath: string, outputPath: string): Promise<void> {
    const binary = this.getBinaryPath() || 'ffmpeg';
    const command = `"${binary}" -y -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 "${outputPath}"`;
    
    try {
      await execAsync(command);
    } catch (error: any) {
      throw new Error(`Erro ao mesclar áudio/vídeo com FFmpeg: ${error.message}`);
    }
  }

  /**
   * Extracts audio stream to MP3 using FFmpeg from an input video file.
   */
  public static async extractMp3(inputPath: string, outputPath: string): Promise<void> {
    const binary = this.getBinaryPath() || 'ffmpeg';
    const command = `"${binary}" -y -i "${inputPath}" -vn -c:a libmp3lame -q:a 2 "${outputPath}"`;

    try {
      await execAsync(command);
    } catch (error: any) {
      throw new Error(`Erro ao extrair MP3 com FFmpeg: ${error.message}`);
    }
  }
}
