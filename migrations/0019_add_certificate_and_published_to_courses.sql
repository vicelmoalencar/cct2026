-- ============================================================================
-- Migration 0019: Adicionar colunas de certificado e publicação aos cursos
-- ============================================================================
-- Data: 2025-01-26
-- Descrição: 
--   1. Adiciona coluna offers_certificate (se o curso oferece certificado)
--   2. Adiciona coluna is_published (se o curso está publicado/visível)
--   3. Cria índices para melhor performance
-- ============================================================================

-- Adicionar coluna de certificado
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS offers_certificate BOOLEAN DEFAULT true;

-- Adicionar coluna de publicação
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_courses_offers_certificate 
ON courses(offers_certificate);

CREATE INDEX IF NOT EXISTS idx_courses_is_published 
ON courses(is_published);

-- Criar índice composto para busca de cursos publicados com certificado
CREATE INDEX IF NOT EXISTS idx_courses_published_certificate 
ON courses(is_published, offers_certificate);

-- Comentários nas colunas
COMMENT ON COLUMN courses.offers_certificate IS 
  'Indica se o curso oferece certificado de conclusão. TRUE = oferece certificado, FALSE = não oferece';

COMMENT ON COLUMN courses.is_published IS 
  'Indica se o curso está publicado e visível para os alunos. TRUE = publicado, FALSE = rascunho/oculto';

-- Atualizar cursos existentes (todos publicados e com certificado por padrão)
UPDATE courses 
SET offers_certificate = true,
    is_published = true
WHERE offers_certificate IS NULL 
   OR is_published IS NULL;

-- Verificação
SELECT 
  id,
  title,
  offers_certificate,
  is_published,
  created_at
FROM courses
ORDER BY id;

-- ============================================================================
-- INSTRUÇÕES DE USO:
-- ============================================================================
-- 
-- EXECUTAR NO SUPABASE SQL EDITOR:
-- 1. Copie este arquivo
-- 2. Cole no SQL Editor do Supabase
-- 3. Execute (Ctrl+Enter ou botão Run)
-- 4. Verifique os resultados
--
-- RESULTADO ESPERADO:
-- - Coluna offers_certificate adicionada (todos TRUE por padrão)
-- - Coluna is_published adicionada (todos TRUE por padrão)
-- - Índices criados para performance
-- ============================================================================
