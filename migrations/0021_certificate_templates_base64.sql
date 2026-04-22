-- ============================================
-- Migration 0021: Cria/atualiza certificate_templates com suporte a base64
-- Remove dependência do Supabase Storage
-- ============================================

-- Cria a tabela se não existir (com todas as colunas já incluídas)
CREATE TABLE IF NOT EXISTS certificate_templates (
  id            SERIAL PRIMARY KEY,
  course_id     INTEGER NOT NULL,
  template_url  TEXT,
  template_data TEXT,
  template_mime VARCHAR(50) DEFAULT 'image/jpeg',
  verso_data    TEXT,
  verso_mime    VARCHAR(50) DEFAULT 'image/jpeg',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Se a tabela já existia, adiciona as colunas novas sem erro
ALTER TABLE certificate_templates
  ADD COLUMN IF NOT EXISTS template_data TEXT,
  ADD COLUMN IF NOT EXISTS template_mime VARCHAR(50) DEFAULT 'image/jpeg',
  ADD COLUMN IF NOT EXISTS verso_data    TEXT,
  ADD COLUMN IF NOT EXISTS verso_mime    VARCHAR(50) DEFAULT 'image/jpeg';

-- template_url agora pode ser NULL (gerada dinamicamente pela API)
ALTER TABLE certificate_templates
  ALTER COLUMN template_url DROP NOT NULL;

CREATE INDEX IF NOT EXISTS idx_certificate_templates_course_id ON certificate_templates(course_id);

COMMENT ON COLUMN certificate_templates.template_data IS 'Imagem da frente do certificado em base64';
COMMENT ON COLUMN certificate_templates.verso_data    IS 'Imagem do verso do certificado em base64 (opcional)';
COMMENT ON COLUMN certificate_templates.template_mime IS 'MIME type da imagem da frente';
COMMENT ON COLUMN certificate_templates.verso_mime    IS 'MIME type da imagem do verso';
