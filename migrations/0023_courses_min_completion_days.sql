-- ============================================================================
-- Migration 0023: Adiciona prazo mínimo de conclusão na tabela courses
-- ============================================================================
-- Impede que o aluno complete o curso (e receba o certificado) em um período
-- menor do que o exigido, contando da primeira à última aula marcada como
-- assistida.

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS min_completion_days INTEGER;

COMMENT ON COLUMN courses.min_completion_days IS 'Prazo mínimo (em dias) entre a data de início e a data de conclusão do curso, exigido para emissão do certificado. NULL = sem restrição.';
