-- ============================================
-- Migration 0021: Armazenar templates de certificado como base64 no Postgres
-- Remove dependência do Supabase Storage
-- ============================================

ALTER TABLE certificate_templates
  ADD COLUMN IF NOT EXISTS template_data TEXT,
  ADD COLUMN IF NOT EXISTS verso_data    TEXT,
  ADD COLUMN IF NOT EXISTS template_mime VARCHAR(50) DEFAULT 'image/jpeg',
  ADD COLUMN IF NOT EXISTS verso_mime    VARCHAR(50) DEFAULT 'image/jpeg';

COMMENT ON COLUMN certificate_templates.template_data IS 'Imagem da frente do certificado em base64';
COMMENT ON COLUMN certificate_templates.verso_data    IS 'Imagem do verso do certificado em base64 (opcional)';
COMMENT ON COLUMN certificate_templates.template_mime IS 'MIME type da imagem da frente';
COMMENT ON COLUMN certificate_templates.verso_mime    IS 'MIME type da imagem do verso';
