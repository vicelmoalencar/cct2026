-- ============================================================================
-- Migration 0025: Unifica start_date como TIMESTAMP (igual completion_date)
-- ============================================================================
-- start_date estava como DATE enquanto completion_date e TIMESTAMP. Essa
-- assimetria fazia o cast de um timestamp completo para start_date depender
-- do fuso horario da sessao no momento do INSERT/UPDATE, podendo deslocar a
-- data em +-1 dia perto da meia-noite. Unificar os tipos elimina essa
-- ambiguidade.

ALTER TABLE certificates
  ALTER COLUMN start_date TYPE TIMESTAMP USING start_date::timestamp;

COMMENT ON COLUMN certificates.start_date IS 'Data de início do curso (timestamp completo, mesmo tipo de completion_date)';
