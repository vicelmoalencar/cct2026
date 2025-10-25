-- ============================================================================
-- SQL para DEBUG - Por que UPDATE não funcionou?
-- ============================================================================

-- 1. Verificar se a coluna verification_code existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'certificates' 
  AND column_name = 'verification_code';

-- RESULTADO ESPERADO: 1 linha mostrando a coluna
-- SE RETORNAR VAZIO: A migration 0013 NÃO foi executada ainda!

-- ============================================================================

-- 2. Verificar se a função generate_verification_code() existe
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'generate_verification_code';

-- RESULTADO ESPERADO: 1 linha mostrando a função
-- SE RETORNAR VAZIO: A migration 0013 NÃO foi executada ainda!

-- ============================================================================

-- 3. Ver estrutura completa da tabela certificates
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'certificates'
ORDER BY ordinal_position;

-- ============================================================================

-- 4. Ver TODOS os certificados (sem filtro)
SELECT 
  id,
  user_email,
  user_name,
  course_title,
  verification_code
FROM certificates
ORDER BY id
LIMIT 20;

-- ============================================================================

-- 5. Contar certificados por status de verification_code
SELECT 
  CASE 
    WHEN verification_code IS NULL THEN 'NULL'
    WHEN verification_code = '' THEN 'VAZIO'
    ELSE 'PREENCHIDO'
  END as status_codigo,
  COUNT(*) as quantidade
FROM certificates
GROUP BY 
  CASE 
    WHEN verification_code IS NULL THEN 'NULL'
    WHEN verification_code = '' THEN 'VAZIO'
    ELSE 'PREENCHIDO'
  END;

-- ============================================================================

-- 6. Total de certificados na tabela
SELECT COUNT(*) as total_certificados FROM certificates;

-- ============================================================================
-- DIAGNÓSTICO:
-- ============================================================================

-- SE query 1 ou 2 retornarem VAZIO:
--   → A migration 0013 NÃO foi executada
--   → SOLUÇÃO: Execute migrations/0013_certificates_verification_system.sql

-- SE query 5 mostrar "NULL" ou "VAZIO" com quantidade > 0:
--   → Os certificados existem mas sem código
--   → SOLUÇÃO: Execute o UPDATE após confirmar que migration foi aplicada

-- SE query 5 mostrar tudo "PREENCHIDO":
--   → UPDATE já funcionou! Códigos foram gerados
--   → SOLUÇÃO: Problema está no frontend ou cache do navegador

-- ============================================================================
-- PRÓXIMOS PASSOS baseados no resultado:
-- ============================================================================

-- CENÁRIO A: Coluna verification_code NÃO EXISTE
-- Execute PRIMEIRO a migration completa:

/*
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='verification_code') THEN
    ALTER TABLE certificates ADD COLUMN verification_code VARCHAR(100) UNIQUE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='is_verified') THEN
    ALTER TABLE certificates ADD COLUMN is_verified BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='verification_count') THEN
    ALTER TABLE certificates ADD COLUMN verification_count INTEGER DEFAULT 0;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_verification_code 
ON certificates(verification_code);

CREATE INDEX IF NOT EXISTS idx_certificates_user_email ON certificates(user_email);

CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'CCT-' || 
                EXTRACT(YEAR FROM CURRENT_TIMESTAMP)::TEXT || '-' ||
                SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8);
    
    SELECT EXISTS(SELECT 1 FROM certificates WHERE verification_code = new_code)
    INTO code_exists;
    
    IF NOT code_exists THEN
      RETURN UPPER(new_code);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
*/

-- Depois de executar acima, execute:
-- UPDATE certificates SET verification_code = generate_verification_code() WHERE verification_code IS NULL;

-- ============================================================================

-- CENÁRIO B: Coluna EXISTE mas UPDATE não funcionou
-- Tente UPDATE de uma linha por vez para debug:

/*
UPDATE certificates 
SET verification_code = generate_verification_code()
WHERE id = 5;  -- ID do primeiro certificado de Vicelmo

-- Verificar:
SELECT id, verification_code FROM certificates WHERE id = 5;
*/

-- ============================================================================

-- CENÁRIO C: Função generate_verification_code() não existe
-- Recrie a função:

/*
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    new_code := 'CCT-' || 
                EXTRACT(YEAR FROM CURRENT_TIMESTAMP)::TEXT || '-' ||
                SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 8);
    
    SELECT EXISTS(SELECT 1 FROM certificates WHERE verification_code = new_code)
    INTO code_exists;
    
    IF NOT code_exists THEN
      RETURN UPPER(new_code);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
*/
