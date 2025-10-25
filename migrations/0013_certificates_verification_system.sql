-- ============================================================================
-- MIGRATION 0013: Sistema de Verificação de Certificados
-- ============================================================================
-- Descrição: Adiciona código de verificação único e campos para sistema HTML/PDF
-- Data: 2025-10-25
-- Autor: Sistema CCT
-- ============================================================================

-- Adicionar coluna verification_code (código único para verificação pública)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='verification_code') THEN
    ALTER TABLE certificates ADD COLUMN verification_code VARCHAR(100) UNIQUE;
  END IF;
END $$;

-- Adicionar coluna pdf_url (URL do PDF gerado)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='pdf_url') THEN
    ALTER TABLE certificates ADD COLUMN pdf_url TEXT;
  END IF;
END $$;

-- Adicionar coluna is_verified (se certificado foi verificado)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='is_verified') THEN
    ALTER TABLE certificates ADD COLUMN is_verified BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Adicionar coluna verification_count (quantas vezes foi verificado)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='verification_count') THEN
    ALTER TABLE certificates ADD COLUMN verification_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Criar índice único para verification_code
CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_verification_code 
ON certificates(verification_code);

-- Criar índice para user_email (para buscar certificados do usuário logado)
CREATE INDEX IF NOT EXISTS idx_certificates_user_email ON certificates(user_email);

-- Função para gerar código de verificação único
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Gerar código: CCT-YYYY-XXXXX (ex: CCT-2025-A1B2C)
    new_code := 'CCT-' || 
                EXTRACT(YEAR FROM CURRENT_TIMESTAMP)::TEXT || '-' ||
                SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8);
    
    -- Verificar se código já existe
    SELECT EXISTS(SELECT 1 FROM certificates WHERE verification_code = new_code)
    INTO code_exists;
    
    -- Se não existe, retornar
    IF NOT code_exists THEN
      RETURN UPPER(new_code);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Atualizar certificados existentes sem verification_code
UPDATE certificates 
SET verification_code = generate_verification_code()
WHERE verification_code IS NULL OR verification_code = '';

-- Comentários nas novas colunas
COMMENT ON COLUMN certificates.verification_code IS 'Código único para verificação pública do certificado';
COMMENT ON COLUMN certificates.pdf_url IS 'URL do PDF gerado (opcional)';
COMMENT ON COLUMN certificates.is_verified IS 'Indica se certificado é válido e verificável';
COMMENT ON COLUMN certificates.verification_count IS 'Número de vezes que o certificado foi verificado';

-- ============================================================================
-- VERIFICAR ESTRUTURA FINAL
-- ============================================================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'certificates'
ORDER BY ordinal_position;

-- ============================================================================
-- TESTE: Verificar alguns códigos gerados
-- ============================================================================
SELECT 
  id,
  user_email,
  user_name,
  course_title,
  verification_code,
  is_verified
FROM certificates
LIMIT 10;
