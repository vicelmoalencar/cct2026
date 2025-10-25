-- ============================================================================
-- MIGRATION 0012: Adicionar Colunas na Tabela Certificates
-- ============================================================================
-- Descrição: Adiciona colunas faltantes para sistema de importação CSV
-- Data: 2025-10-25
-- Autor: Sistema CCT
-- ============================================================================

-- Adicionar coluna carga_horaria (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='carga_horaria') THEN
    ALTER TABLE certificates ADD COLUMN carga_horaria INTEGER;
  END IF;
END $$;

-- Adicionar coluna certificate_code (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='certificate_code') THEN
    ALTER TABLE certificates ADD COLUMN certificate_code VARCHAR(50) UNIQUE;
  END IF;
END $$;

-- Adicionar coluna generated_at (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='generated_at') THEN
    ALTER TABLE certificates ADD COLUMN generated_at TIMESTAMP;
  END IF;
END $$;

-- Adicionar coluna updated_at (se não existir)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='updated_at') THEN
    ALTER TABLE certificates ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Modificar course_id para aceitar NULL (para certificados importados sem course_id)
ALTER TABLE certificates ALTER COLUMN course_id DROP NOT NULL;

-- Criar índice para certificate_code (se não existir)
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code);

-- Criar índice composto email+course_title (para importação CSV)
CREATE INDEX IF NOT EXISTS idx_certificates_email_course_title ON certificates(user_email, course_title);

-- Desabilitar RLS (se ainda não está)
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;

-- Comentários nas novas colunas
COMMENT ON COLUMN certificates.carga_horaria IS 'Carga horária do curso (em horas)';
COMMENT ON COLUMN certificates.certificate_code IS 'Código único do certificado gerado';
COMMENT ON COLUMN certificates.generated_at IS 'Data e hora de geração do certificado';
COMMENT ON COLUMN certificates.updated_at IS 'Data da última atualização';

-- ============================================================================
-- VERIFICAR ESTRUTURA FINAL
-- ============================================================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'certificates'
ORDER BY ordinal_position;

-- ============================================================================
-- ESTRUTURA ESPERADA:
-- id, user_email, user_name, course_id (NULL OK), course_title,
-- issued_at, completion_date, created_at,
-- carga_horaria (NEW), certificate_code (NEW), generated_at (NEW), updated_at (NEW)
-- ============================================================================
