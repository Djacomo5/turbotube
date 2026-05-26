import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseDownloadRow } from '@turbotube/shared';

export class SupabaseService {
  private static client: SupabaseClient | null = null;

  public static getClient(): SupabaseClient | null {
    if (this.client) return this.client;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Graceful degradation: If keys are missing, don't throw an error, just return null.
    if (!url || !key || url === 'your-supabase-project-url' || key === 'your-supabase-anon-key') {
      console.warn('Supabase não configurado. Histórico global e estatísticas estarão indisponíveis.');
      return null;
    }

    try {
      this.client = createClient(url, key);
      return this.client;
    } catch (error) {
      console.error('Falha ao inicializar cliente Supabase:', error);
      return null;
    }
  }

  /**
   * Logs a download event in the database.
   */
  public static async logDownload(data: SupabaseDownloadRow): Promise<boolean> {
    const supabase = this.getClient();
    if (!supabase) return false;

    try {
      const { error } = await supabase
        .from('downloads')
        .insert([
          {
            video_id: data.video_id,
            title: data.title,
            duration: data.duration,
            thumbnail_url: data.thumbnail_url,
            format_type: data.format_type,
          },
        ]);

      if (error) {
        console.error('Erro ao salvar log de download no Supabase:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Falha na comunicação com o Supabase:', err);
      return false;
    }
  }

  /**
   * Fetches the last public downloads to display on the landing page.
   */
  public static async getRecentDownloads(limit = 10): Promise<any[]> {
    const supabase = this.getClient();
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('downloads')
        .select('*')
        .order('downloaded_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Erro ao buscar downloads recentes do Supabase:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Falha na comunicação com o Supabase ao buscar downloads:', err);
      return [];
    }
  }
}
