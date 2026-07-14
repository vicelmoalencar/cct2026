-- ============================================================================
-- Migration 0024: Adiciona publicar/despublicar por aula
-- ============================================================================
-- Permite ocultar uma aula especifica dos alunos (curriculo do curso, player
-- e contagem de aulas para conclusao/certificado) sem precisar despublicar
-- o curso inteiro. Default true para nao afetar aulas ja existentes.

ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN lessons.is_published IS 'Indica se a aula está publicada e visível para os alunos. NULL nunca ocorre (default true).';
