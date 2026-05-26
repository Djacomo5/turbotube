'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 text-zinc-300">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase mb-6 tracking-tight">
          Termos de <span className="text-brand">Serviço</span>
        </h1>
        <p className="text-xs text-zinc-500 mb-8">Última atualização: 25 de Maio de 2026</p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar a plataforma TurboTube, você concorda em cumprir e estar vinculado a estes Termos de Serviço. Caso não concorde com alguma parte deste documento, você deve interromper imediatamente o uso de nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Uso Permitido e Direitos Autorais</h2>
            <p>
              O TurboTube é uma ferramenta de download projetada especificamente para fins educacionais, acadêmicos, pesquisa e backup de conteúdos de sua autoria ou sob licenças públicas (como Creative Commons). 
            </p>
            <p className="mt-2">
              Você é o único responsável pela legalidade das mídias obtidas. O download de materiais protegidos por direitos autorais, sem a devida autorização do titular legal dos direitos, é estritamente proibido e infringe nossos termos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Proteção Contra Abuso e Rate Limit</h2>
            <p>
              Para assegurar a estabilidade do sistema para todos os usuários, aplicamos limites de taxa automáticos (atualmente limitados a 10 requisições por minuto por IP). Tentativas de contornar esses limites, usar scripts de extração em massa ou realizar ataques de negação de serviço resultarão no bloqueio temporário ou permanente do endereço IP infrator.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Limitação de Responsabilidade</h2>
            <p>
              O TurboTube é fornecido "como está" e "conforme disponível". Não oferecemos garantias de que o serviço será ininterrupto, livre de erros ou compatível com todas as URLs inseridas, visto que as plataformas externas atualizam constantemente suas estruturas. Não nos responsabilizamos por quaisquer danos resultantes do uso ou da incapacidade de usar nossa ferramenta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Modificações dos Termos</h2>
            <p>
              Reservamo-nos o direito de alterar estes termos a qualquer momento, sem aviso prévio. O uso continuado do serviço após tais mudanças constituirá sua aceitação das novas regras.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
