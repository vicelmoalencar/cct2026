-- Tabela de Administradores
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserir admin padrão (Vicelmo)
INSERT OR IGNORE INTO admins (email, name) VALUES 
  ('antoniovicelmo.alencar@gmail.com', 'ANTONIO VICELMO'),
  ('vicelmo@trt21.jus.br', 'VICELMO ALENCAR');

-- Atualizar tabela de aulas para suportar vídeos do YouTube e Vimeo
-- SQLite não suporta ALTER TABLE para adicionar CHECK constraint diretamente
-- Então vamos adicionar colunas para armazenar o tipo e ID do vídeo

-- Adicionar colunas para vídeo
ALTER TABLE lessons ADD COLUMN video_provider TEXT CHECK(video_provider IN ('youtube', 'vimeo', 'url', NULL));
ALTER TABLE lessons ADD COLUMN video_id TEXT;

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_lessons_video ON lessons(video_provider, video_id);

-- Atualizar aulas existentes para migrar video_url para o novo formato
-- Detectar automaticamente se é YouTube ou Vimeo baseado na URL
UPDATE lessons 
SET 
  video_provider = CASE 
    WHEN video_url LIKE '%youtube.com%' OR video_url LIKE '%youtu.be%' THEN 'youtube'
    WHEN video_url LIKE '%vimeo.com%' THEN 'vimeo'
    WHEN video_url IS NOT NULL THEN 'url'
    ELSE NULL
  END,
  video_id = CASE 
    WHEN video_url LIKE '%youtube.com%watch%v=%' THEN 
      substr(video_url, instr(video_url, 'v=') + 2, 11)
    WHEN video_url LIKE '%youtu.be/%' THEN 
      substr(video_url, instr(video_url, 'youtu.be/') + 9, 11)
    WHEN video_url LIKE '%vimeo.com/%' THEN 
      replace(replace(video_url, 'https://vimeo.com/', ''), 'http://vimeo.com/', '')
    WHEN video_url IS NOT NULL THEN video_url
    ELSE NULL
  END
WHERE video_url IS NOT NULL;
