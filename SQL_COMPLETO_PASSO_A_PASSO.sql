-- ============================================================================
-- SOLUÇÃO COMPLETA PASSO A PASSO
-- ============================================================================
-- Execute CADA BLOCO separadamente no Supabase SQL Editor
-- Aguarde confirmação de sucesso antes de prosseguir para o próximo
-- ============================================================================

-- ============================================================================
-- PASSO 1: Criar coluna verification_code (se não existe)
-- ============================================================================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='verification_code') THEN
    ALTER TABLE certificates ADD COLUMN verification_code VARCHAR(100);
    RAISE NOTICE '✅ Coluna verification_code criada';
  ELSE
    RAISE NOTICE '⚠️ Coluna verification_code já existe';
  END IF;
END $$;

-- Aguarde: "✅ Coluna verification_code criada" ou "⚠️ já existe"

-- ============================================================================
-- PASSO 2: Criar coluna is_verified (se não existe)
-- ============================================================================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='is_verified') THEN
    ALTER TABLE certificates ADD COLUMN is_verified BOOLEAN DEFAULT TRUE;
    RAISE NOTICE '✅ Coluna is_verified criada';
  ELSE
    RAISE NOTICE '⚠️ Coluna is_verified já existe';
  END IF;
END $$;

-- ============================================================================
-- PASSO 3: Criar coluna verification_count (se não existe)
-- ============================================================================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='verification_count') THEN
    ALTER TABLE certificates ADD COLUMN verification_count INTEGER DEFAULT 0;
    RAISE NOTICE '✅ Coluna verification_count criada';
  ELSE
    RAISE NOTICE '⚠️ Coluna verification_count já existe';
  END IF;
END $$;

-- ============================================================================
-- PASSO 4: Criar coluna pdf_url (se não existe)
-- ============================================================================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='certificates' AND column_name='pdf_url') THEN
    ALTER TABLE certificates ADD COLUMN pdf_url TEXT;
    RAISE NOTICE '✅ Coluna pdf_url criada';
  ELSE
    RAISE NOTICE '⚠️ Coluna pdf_url já existe';
  END IF;
END $$;

-- ============================================================================
-- PASSO 5: Criar índice único para verification_code
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_certificates_verification_code 
ON certificates(verification_code);

-- Aguarde: "CREATE INDEX" ou "relation ... already exists"

-- ============================================================================
-- PASSO 6: Criar índice para user_email
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_certificates_user_email 
ON certificates(user_email);

-- Aguarde: "CREATE INDEX" ou "relation ... already exists"

-- ============================================================================
-- PASSO 7: Criar função generate_verification_code()
-- ============================================================================

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

-- Aguarde: "CREATE FUNCTION" ou "replaced"
-- ✅ Função criada com sucesso!

-- ============================================================================
-- PASSO 8: Verificar quantos certificados precisam de código
-- ============================================================================

SELECT 
  COUNT(*) as total_certificados,
  COUNT(verification_code) as com_codigo,
  COUNT(*) - COUNT(verification_code) as sem_codigo
FROM certificates;

-- IMPORTANTE: Anote o número em "sem_codigo"
-- Este é o número que deve aparecer no UPDATE

-- ============================================================================
-- PASSO 9: Atualizar certificados SEM código (UM POR VEZ para debug)
-- ============================================================================

-- Primeiro, vamos testar com 1 certificado apenas:

UPDATE certificates 
SET 
  verification_code = generate_verification_code(),
  is_verified = TRUE,
  verification_count = 0
WHERE id = (
  SELECT id FROM certificates 
  WHERE verification_code IS NULL 
  LIMIT 1
);

-- Aguarde: "UPDATE 1"
-- ✅ Se aparecer "UPDATE 1", a função está funcionando!

-- ============================================================================
-- PASSO 10: Verificar se o código foi gerado
-- ============================================================================

SELECT 
  id,
  user_email,
  user_name,
  course_title,
  verification_code
FROM certificates
WHERE verification_code IS NOT NULL
ORDER BY id
LIMIT 5;

-- DEVE MOSTRAR: Pelo menos 1 linha com verification_code preenchido
-- Exemplo: CCT-2025-A1B2C3D4

-- ============================================================================
-- PASSO 11: Atualizar TODOS os certificados restantes
-- ============================================================================

-- Se o passo 9 funcionou, agora atualize todos:

UPDATE certificates 
SET 
  verification_code = generate_verification_code(),
  is_verified = TRUE,
  verification_count = 0
WHERE verification_code IS NULL;

-- Aguarde: "UPDATE X" (X = número de certificados sem código do passo 8)
-- ✅ Todos os certificados foram atualizados!

-- ============================================================================
-- PASSO 12: Verificação final
-- ============================================================================

SELECT 
  COUNT(*) as total,
  COUNT(verification_code) as com_codigo,
  COUNT(*) - COUNT(verification_code) as sem_codigo
FROM certificates;

-- RESULTADO ESPERADO: sem_codigo = 0
-- ✅ Todos os certificados têm código agora!

-- ============================================================================
-- PASSO 13: Ver certificados de Vicelmo
-- ============================================================================

SELECT 
  id,
  user_email,
  user_name,
  course_title,
  carga_horaria,
  verification_code,
  is_verified,
  verification_count
FROM certificates 
WHERE user_email = 'antoniovicelmo@gmail.com'
ORDER BY id;

-- DEVE MOSTRAR: Todos os certificados de Vicelmo com códigos únicos
-- Exemplo:
-- id | user_email               | course_title    | verification_code
-- 5  | antoniovicelmo@gmail.com | PJECALCPLUS     | CCT-2025-A1B2C3D4
-- 6  | antoniovicelmo@gmail.com | MINICURSO TRT21 | CCT-2025-E5F6G7H8
-- ...

-- ============================================================================
-- PASSO 14: Testar a função de verificação pública
-- ============================================================================

-- Pegue um dos códigos do passo 13 e teste:

SELECT 
  user_email,
  user_name,
  course_title,
  carga_horaria,
  verification_code,
  verification_count
FROM certificates
WHERE verification_code = 'COLE_UM_CODIGO_AQUI';  -- Ex: CCT-2025-A1B2C3D4

-- DEVE RETORNAR: 1 linha com os dados do certificado
-- ✅ Sistema de verificação funcionando!

-- ============================================================================
-- ✅ SUCESSO! Agora teste na plataforma:
-- ============================================================================

-- 1. Limpe cache do navegador (Ctrl+Shift+Delete)
-- 2. Faça logout
-- 3. Faça login com antoniovicelmo@gmail.com
-- 4. Clique no botão "Certificados" (amarelo)
-- 5. Seus certificados devem aparecer! 🎉

-- ============================================================================
-- TROUBLESHOOTING:
-- ============================================================================

-- Se PASSO 9 retornar "UPDATE 0":
-- → Todos os certificados já têm código
-- → Execute PASSO 12 para confirmar

-- Se PASSO 9 der erro "function generate_verification_code() does not exist":
-- → Execute novamente PASSO 7
-- → Aguarde "CREATE FUNCTION"

-- Se PASSO 11 retornar "UPDATE 0":
-- → Todos já foram atualizados no passo 9
-- → Execute PASSO 12 para confirmar

-- Se certificados não aparecem na plataforma:
-- → Abra Console do navegador (F12 → Console)
-- → Execute: fetch('/api/my-certificates').then(r => r.json()).then(console.log)
-- → Deve retornar array com seus certificados
