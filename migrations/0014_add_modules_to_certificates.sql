-- ============================================================================
-- Migration 0014: Adicionar campo de módulos aos certificados
-- ============================================================================
-- Data: 2025-01-25
-- Descrição: Adiciona coluna para armazenar os módulos concluídos no certificado
-- ============================================================================

-- Adicionar coluna course_modules (JSON) para armazenar lista de módulos
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS course_modules TEXT;

-- Comentário explicativo
COMMENT ON COLUMN certificates.course_modules IS 'Lista de módulos do curso em formato JSON: [{"title": "Módulo 1", "order": 1}, ...]';

-- Criar índice para busca de certificados com módulos
CREATE INDEX IF NOT EXISTS idx_certificates_with_modules 
ON certificates(id) 
WHERE course_modules IS NOT NULL;

-- ============================================================================
-- FIM DA MIGRATION 0014
-- ============================================================================
