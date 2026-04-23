-- ============================================================================
-- Migration 0022: Adiciona start_date e completion_date na tabela certificates
-- ============================================================================

ALTER TABLE certificates
  ADD COLUMN IF NOT EXISTS start_date      DATE,
  ADD COLUMN IF NOT EXISTS completion_date DATE;

COMMENT ON COLUMN certificates.start_date      IS 'Data de início do curso (importada do matricula.csv)';
COMMENT ON COLUMN certificates.completion_date IS 'Data de conclusão do curso (importada do certificados-data.csv)';
