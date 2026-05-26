# 🚀 TurboTube - Downloader Premium de Vídeos do YouTube

TurboTube é uma plataforma web premium completa (SaaS) para download de vídeos e conversão de áudios em MP3, desenvolvida com as melhores práticas de engenharia de software moderno.

---

## 🛠️ Stack Tecnológica

### Frontend (Diretório `apps/frontend`)
* **Framework**: Next.js 15 (App Router)
* **Linguagem**: TypeScript
* **Estilização**: TailwindCSS (Design futurista, neon red, dark mode, glassmorphic cards)
* **Biblioteca de Animação**: Framer Motion
* **Ícones**: Lucide Icons
* **Comunicação com API**: Axios

### Backend (Diretório `apps/backend`)
* **Framework**: Fastify (TypeScript)
* **Integração de Mídia**: `yt-dlp` (via child_process) e `FFmpeg`
* **Proteções**: Rate Limiting anti-spam (máximo 10 downloads/queries por IP por minuto)
* **Banco de Dados**: Supabase (Log global e estatísticas de download)

### Compartilhado (Diretório `packages/shared`)
* **Tipagens**: Interfaces TypeScript comuns
* **Validações**: Schemas de validação Zod (validação de URLs do YouTube/Shorts e sanitização de CLI contra injeções de comando)

---

## 📋 Pré-requisitos & Instalação de Binários

Para rodar o backend localmente, você precisa ter as ferramentas `yt-dlp` e `ffmpeg` instaladas em sua máquina e disponíveis no `PATH` do sistema.

### 🍎 macOS
```bash
brew install yt-dlp ffmpeg
```

### 🐧 Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
# yt-dlp (recomenda-se baixar o executável atualizado diretamente)
sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

### 🪟 Windows
1. Baixe o executável do `ffmpeg` em [ffmpeg.org](https://ffmpeg.org/download.html) e do `yt-dlp` em [github.com/yt-dlp/yt-dlp](https://github.com/yt-dlp/yt-dlp/releases).
2. Adicione os caminhos das pastas onde salvou os executáveis nas **Variáveis de Ambiente** do seu sistema (`PATH`).

---

## 🏗️ Estrutura do Monorepo

```
/turbotube
  ├── package.json         # Workspaces (apps/frontend, apps/backend, packages/shared)
  ├── tsconfig.json       # Configuração base de TypeScript
  ├── .env                # Variáveis de ambiente locais (não versionado)
  ├── .env.example        # Arquivo de exemplo com as variáveis configuráveis
  ├── apps
  │   ├── frontend/       # Aplicação Next.js 15
  │   └── backend/        # Servidor Fastify (TypeScript)
  └── packages
      └── shared/         # Pacote de validação e tipos compartilhados
```

---

## ⚡ Instalação & Uso Local

1. **Clonar e acessar o repositório:**
   ```bash
   cd /Users/djacomosantos/.gemini/antigravity/scratch/turbotube
   ```

2. **Instalar dependências (utilizando a flag de peer-deps devido ao Next 15 + React 19):**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configurar as Variáveis de Ambiente:**
   Copie o arquivo `.env.example` para `.env` na raiz do projeto:
   ```bash
   cp .env.example .env
   ```
   Abra o arquivo `.env` e configure conforme necessário (por exemplo, adicione suas credenciais do Supabase se desejar habilitar o histórico global).

4. **Compilar pacote compartilhado:**
   ```bash
   npm run build:shared
   ```

5. **Iniciar os servidores de desenvolvimento (Frontend na porta 3000 e Backend na 4000):**
   ```bash
   npm run dev
   ```

---

## 💾 Banco de Dados Supabase (Opcional)

Para exibir downloads recentes globalmente e estatísticas na plataforma, crie uma tabela chamada `downloads` no painel SQL do seu projeto Supabase:

```sql
create table downloads (
  id uuid default gen_random_uuid() primary key,
  video_id text not null,
  title text not null,
  duration int not null,
  thumbnail_url text,
  format_type text not null, -- 'mp4_720p', 'mp4_1080p', 'mp3'
  downloaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar leitura pública (RLS - Read Access) se desejar exibir na landing page
alter table downloads enable row level security;

create policy "Permitir leitura pública"
on downloads for select
to public
using (true);

create policy "Permitir inserções do backend"
on downloads for insert
to authenticated, anon
with check (true);
```

---

## 🚀 Como fazer Deploy

### 🖥️ Frontend (Vercel)
O frontend Next.js 15 está pronto para ser hospedado na Vercel:
1. Conecte seu repositório no painel da Vercel.
2. Defina o diretório raiz como `apps/frontend`.
3. Adicione a variável de ambiente:
   * `NEXT_PUBLIC_API_URL`: URL de produção onde o seu backend Fastify está rodando (ex: `https://turbotube-api.up.railway.app`).
4. Clique em **Deploy**.

### ⚙️ Backend (Render.com - Grátis)
O backend Fastify está preparado para rodar no plano gratuito do **Render** utilizando Docker:
1. Conecte seu repositório no painel do Render.com.
2. Escolha **New** > **Web Service**.
3. Escolha o seu repositório do GitHub.
4. Configure as seguintes opções:
   * **Language**: Selecione `Docker`.
   * **Docker Command**: Deixe em branco (ele usará o `CMD` definido no `Dockerfile`).
   * **Dockerfile Path**: `apps/backend/Dockerfile`.
5. Vá na seção **Advanced** e adicione as variáveis de ambiente:
   * `PORT`: `4000`.
   * `HOST`: `0.0.0.0`.
   * `NODE_ENV`: `production`.
   * `SUPABASE_URL` / `SUPABASE_ANON_KEY` (se for integrar o banco).
6. Clique em **Deploy Web Service**. O Render irá construir o contêiner Docker contendo o Node, FFmpeg e yt-dlp automaticamente e disponibilizará o serviço gratuitamente.

