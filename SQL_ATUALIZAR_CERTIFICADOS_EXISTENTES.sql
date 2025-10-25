-- ============================================================================
-- SQL para Atualizar Certificados Existentes com Verification Code
-- ============================================================================
-- PROBLEMA: Certificados já estão na tabela mas sem verification_code
-- SOLUÇÃO: Gerar códigos para certificados existentes
-- ============================================================================

-- 1. PRIMEIRO: Verificar se a migration 0013 foi aplicada
-- Execute no Supabase SQL Editor:

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'certificates' 
  AND column_name IN ('verification_code', 'verification_count', 'is_verified', 'pdf_url')
ORDER BY column_name;

-- Resultado esperado: 4 colunas
-- Se não aparecer nada, execute primeiro: migrations/0013_certificates_verification_system.sql

-- ============================================================================

-- 2. Verificar certificados SEM verification_code
SELECT 
  id,
  user_email,
  user_name,
  course_title,
  verification_code
FROM certificates
WHERE verification_code IS NULL OR verification_code = '';

-- ============================================================================

-- 3. ATUALIZAR: Gerar verification_code para TODOS os certificados sem código
UPDATE certificates 
SET 
  verification_code = generate_verification_code(),
  is_verified = TRUE,
  verification_count = 0
WHERE verification_code IS NULL OR verification_code = '';

-- ============================================================================

-- 4. Verificar certificados de antoniovicelmo@gmail.com
SELECT 
  id,
  user_email,
  user_name,
  course_title,
  carga_horaria,
  verification_code,
  is_verified,
  created_at
FROM certificates 
WHERE user_email = 'antoniovicelmo@gmail.com'
ORDER BY id;

-- Resultado esperado: Todos com verification_code preenchido (CCT-2025-XXXXX)

-- ============================================================================

-- 5. TESTE: Verificar total de certificados com código
SELECT 
  COUNT(*) as total,
  COUNT(verification_code) as com_codigo,
  COUNT(*) - COUNT(verification_code) as sem_codigo
FROM certificates;

-- Resultado esperado: sem_codigo = 0 (todos com código)

-- ============================================================================
-- OBSERVAÇÕES:
-- ============================================================================

-- ✅ course_id NULL é NORMAL para certificados importados via CSV
-- ✅ O sistema funciona perfeitamente com course_id NULL
-- ✅ Apenas user_email, user_name, course_title são obrigatórios
-- ✅ verification_code é gerado automaticamente pela função

-- ============================================================================
-- APÓS EXECUTAR ESTE SQL:
-- ============================================================================

-- 1. Faça logout da plataforma
-- 2. Faça login novamente com antoniovicelmo@gmail.com
-- 3. Clique no botão "Certificados" (amarelo) no header
-- 4. ✅ Seus certificados devem aparecer!

-- ============================================================================
-- TROUBLESHOOTING:
-- ============================================================================

-- Se aparecer erro: "function generate_verification_code() does not exist"
-- SOLUÇÃO: Execute primeiro a migration 0013:
--   migrations/0013_certificates_verification_system.sql

-- Se ainda não aparecer certificados na plataforma:
-- SOLUÇÃO: Verifique o endpoint da API no navegador (F12 → Network):
--   GET /api/my-certificates
--   Deve retornar JSON com seus certificados
