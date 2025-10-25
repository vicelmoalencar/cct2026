-- ============================================================================
-- MIGRATION 0011: Tabela de Certificados
-- ============================================================================
-- Descrição: Cria tabela para armazenar certificados de conclusão de cursos
-- Data: 2025-10-25
-- Autor: Sistema CCT
-- ============================================================================

-- Criar tabela de certificados
CREATE TABLE IF NOT EXISTS certificates (
  id SERIAL PRIMARY KEY,
  
  -- Dados do usuário
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  
  -- Dados do curso
  course_title VARCHAR(255) NOT NULL,
  carga_horaria INTEGER,
  
  -- Certificado gerado
  certificate_code VARCHAR(50) UNIQUE,
  generated_at TIMESTAMP,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_certificates_email ON certificates(user_email);
CREATE INDEX IF NOT EXISTS idx_certificates_course ON certificates(course_title);
CREATE INDEX IF NOT EXISTS idx_certificates_code ON certificates(certificate_code);
CREATE INDEX IF NOT EXISTS idx_certificates_email_course ON certificates(user_email, course_title);

-- Comentários nas colunas
COMMENT ON TABLE certificates IS 'Certificados de conclusão de cursos emitidos';
COMMENT ON COLUMN certificates.user_email IS 'Email do usuário que concluiu o curso';
COMMENT ON COLUMN certificates.user_name IS 'Nome do usuário (para exibição no certificado)';
COMMENT ON COLUMN certificates.course_title IS 'Título do curso concluído';
COMMENT ON COLUMN certificates.carga_horaria IS 'Carga horária do curso (em horas)';
COMMENT ON COLUMN certificates.certificate_code IS 'Código único do certificado gerado';
COMMENT ON COLUMN certificates.generated_at IS 'Data e hora de geração do certificado';

-- Desabilitar RLS para permitir importação via API
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- FIM DA MIGRATION 0011
-- ============================================================================
