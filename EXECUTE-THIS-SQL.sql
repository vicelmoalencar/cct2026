-- ============================================
-- EXECUTE ESTE SQL NO SUPABASE (em ordem)
-- ============================================
-- Copie TODO este arquivo e execute no SQL Editor do Supabase
-- URL: https://supabase.com/dashboard/project/ghdfouqzasvxlptbjkin/sql/new

-- PASSO 1: Adicionar novos campos na tabela lessons
-- ============================================
ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS support_text TEXT;

ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS transcript TEXT;

ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Add comments to document the fields
COMMENT ON COLUMN lessons.support_text IS 'Texto de apoio da aula - conteúdo complementar';
COMMENT ON COLUMN lessons.transcript IS 'Transcrição completa do vídeo da aula';
COMMENT ON COLUMN lessons.attachments IS 'Array JSON de arquivos anexados [{name, url, size, type, data}]';

-- PASSO 2: Atualizar função RPC para retornar os novos campos
-- ============================================
DROP FUNCTION IF EXISTS get_lesson_with_module(BIGINT);

CREATE OR REPLACE FUNCTION get_lesson_with_module(p_lesson_id BIGINT)
RETURNS TABLE (
  id BIGINT,
  module_id BIGINT,
  title TEXT,
  description TEXT,
  video_url TEXT,
  video_provider TEXT,
  video_id TEXT,
  duration_minutes INTEGER,
  order_index INTEGER,
  created_at TIMESTAMPTZ,
  support_text TEXT,
  transcript TEXT,
  attachments JSONB,
  module_title TEXT,
  course_id BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.module_id,
    l.title,
    l.description,
    l.video_url,
    l.video_provider,
    l.video_id,
    l.duration_minutes,
    l.order_index,
    l.created_at,
    l.support_text,
    l.transcript,
    l.attachments,
    m.title as module_title,
    m.course_id
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  WHERE l.id = p_lesson_id;
END;
$$ LANGUAGE plpgsql;

GRANT EXECUTE ON FUNCTION get_lesson_with_module(BIGINT) TO anon, authenticated;

-- PASSO 3: Verificar se os campos foram criados
-- ============================================
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'lessons' 
  AND column_name IN ('support_text', 'transcript', 'attachments');

-- PASSO 4: (OPCIONAL) Adicionar dados de exemplo em uma aula existente
-- ============================================
-- Descomente as linhas abaixo para testar com a aula ID 1:
/*
UPDATE lessons 
SET 
  support_text = 'Este é um texto de apoio de exemplo.

Conteúdo adicional que complementa a aula:
- Link 1: https://exemplo.com
- Link 2: https://exemplo2.com

Pontos importantes:
1. Primeiro ponto
2. Segundo ponto',
  transcript = 'Esta é uma transcrição de exemplo do vídeo.

[00:00] Introdução
Olá, bem-vindos a esta aula...

[00:30] Conteúdo principal
Vamos falar sobre...

[02:00] Conclusão
Obrigado por assistir!',
  attachments = '[
    {
      "name": "exemplo.pdf",
      "size": 1024000,
      "type": "application/pdf",
      "data": "base64_data_here"
    }
  ]'::jsonb
WHERE id = 1;
*/
