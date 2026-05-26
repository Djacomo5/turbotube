'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 text-zinc-300">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase mb-6 tracking-tight">
          Política de <span className="text-brand">Privacidade</span>
        </h1>
        <p className="text-xs text-zinc-500 mb-8">Última atualização: 25 de Maio de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Coleta de Dados</h2>
            <p>
              O TurboTube prioriza a privacidade do usuário. Não exigimos cadastro, e-mail ou dados de pagamento para a utilização de nossas funções fundamentais. O histórico dos vídeos baixados que você visualiza é armazenado localmente em seu navegador via `localStorage` e nunca é enviado para nossos servidores com identificação pessoal.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Processamento e Retenção de Arquivos</h2>
            <p>
              Os vídeos e áudios baixados são temporariamente armazenados no servidor apenas durante a duração do processamento (mesclagem com FFmpeg) e do download em si. O sistema exclui automaticamente todas as mídias e arquivos temporários do disco imediatamente após a conclusão ou encerramento da transmissão do download, mantendo o disco livre de dados residuais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Logs e Estatísticas de Download</h2>
            <p>
              Se a integração com o Supabase estiver configurada, podemos armazenar logs agregados anônimos das mídias baixadas (título do vídeo, duração, formato de download e data/hora) para exibir na seção de estatísticas globais e recentes. Esses dados não são associados a endereços IP ou perfis de usuário individuais.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Cookies</h2>
            <p>
              Não utilizamos cookies de rastreamento de terceiros para publicidade ou monitoramento de comportamento. Apenas fazemos uso do armazenamento local do navegador para viabilizar a funcionalidade de histórico de download pessoal, o qual pode ser limpo por você a qualquer momento com um único clique.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Segurança</h2>
            <p>
              Implementamos medidas rígidas de segurança no backend, incluindo sanitização completa de URLs e variáveis de ambiente, prevenindo execução de comandos arbitrários e protegendo o ambiente do servidor contra acessos não autorizados.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
