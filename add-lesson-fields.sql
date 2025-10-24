-- ============================================
-- Add new fields to lessons table
-- ============================================

-- Add support_text field (texto de apoio)
ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS support_text TEXT;

-- Add transcript field (transcrição)
ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS transcript TEXT;

-- Add attachments field (arquivos anexados - JSON array)
ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Add comments to document the fields
COMMENT ON COLUMN lessons.support_text IS 'Texto de apoio da aula - conteúdo complementar';
COMMENT ON COLUMN lessons.transcript IS 'Transcrição completa do vídeo da aula';
COMMENT ON COLUMN lessons.attachments IS 'Array JSON de arquivos anexados [{name, url, size, type}]';

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'lessons' 
  AND column_name IN ('support_text', 'transcript', 'attachments');
