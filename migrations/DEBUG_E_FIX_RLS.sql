-- ============================================================================
-- DEBUG E FIX: RLS e Migration 0014
-- ============================================================================
-- Data: 2025-01-25
-- Descrição: Diagnóstico e correção de problemas de RLS e módulos
-- ============================================================================

-- ============================================
-- PARTE 1: VERIFICAR STATUS ATUAL
-- ============================================

-- 1.1. Verificar se coluna course_modules existe
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'certificates' 
  AND column_name = 'course_modules';
-- Esperado: 1 linha (se não aparecer, migration 0014 não foi aplicada)

-- 1.2. Verificar RLS na tabela certificates
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'certificates';
-- Se rls_enabled = true, RLS está ATIVO (pode bloquear queries)

-- 1.3. Verificar RLS na tabela modules
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'modules';
-- Se rls_enabled = true, RLS está ATIVO

-- 1.4. Verificar RLS na tabela admins
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'admins';
-- Se rls_enabled = true, RLS está ATIVO

-- 1.5. Verificar políticas RLS em certificates
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'certificates';

-- 1.6. Verificar políticas RLS em modules
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'modules';

-- 1.7. Verificar políticas RLS em admins
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'admins';

-- 1.8. Verificar certificados do usuário
SELECT 
  id,
  user_email,
  course_title,
  course_id,
  course_modules,
  CASE 
    WHEN course_modules IS NULL THEN 'NULL'
    WHEN course_modules = '' THEN 'VAZIO'
    ELSE 'TEM DADOS'
  END as status_modules
FROM certificates
WHERE user_email = 'antoniovicelmo@gmail.com'
ORDER BY id;

-- 1.9. Verificar se existem módulos nos cursos
SELECT 
  c.id as course_id,
  c.title as course_title,
  COUNT(m.id) as total_modules
FROM courses c
LEFT JOIN modules m ON m.course_id = c.id
GROUP BY c.id, c.title
HAVING COUNT(m.id) > 0
ORDER BY c.id;

-- 1.10. Verificar admins cadastrados
SELECT 
  email,
  created_at
FROM admins
ORDER BY created_at DESC;


-- ============================================
-- PARTE 2: APLICAR MIGRATION 0014 (SE NECESSÁRIO)
-- ============================================

-- 2.1. Adicionar coluna course_modules (IDEMPOTENTE)
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS course_modules TEXT;

-- 2.2. Criar índice (IDEMPOTENTE)
CREATE INDEX IF NOT EXISTS idx_certificates_with_modules 
ON certificates(id) 
WHERE course_modules IS NOT NULL;

-- 2.3. Adicionar comentário
COMMENT ON COLUMN certificates.course_modules IS 'Lista de módulos do curso em formato JSON';


-- ============================================
-- PARTE 3: DESABILITAR RLS (SE ESTIVER CAUSANDO PROBLEMAS)
-- ============================================

-- 3.1. Desabilitar RLS em certificates (TEMPORÁRIO PARA DEBUG)
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;

-- 3.2. Desabilitar RLS em modules
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;

-- 3.3. Desabilitar RLS em admins
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- 3.4. Desabilitar RLS em courses
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;


-- ============================================
-- PARTE 4: POPULAR MÓDULOS (SE NECESSÁRIO)
-- ============================================

-- 4.1. Atualizar certificados COM course_id para ter módulos
UPDATE certificates c
SET course_modules = (
  SELECT json_agg(
    json_build_object(
      'title', m.title,
      'order', m.order_index
    ) ORDER BY m.order_index
  )::TEXT
  FROM modules m
  WHERE m.course_id = c.course_id
)
WHERE c.course_id IS NOT NULL
  AND (c.course_modules IS NULL OR c.course_modules = '')
  AND EXISTS (
    SELECT 1 FROM modules m WHERE m.course_id = c.course_id
  );


-- ============================================
-- PARTE 5: ADICIONAR EMAIL COMO ADMIN
-- ============================================

-- 5.1. Inserir antoniovicelmo@gmail.com como admin (SE NÃO EXISTIR)
INSERT INTO admins (email)
VALUES ('antoniovicelmo@gmail.com')
ON CONFLICT (email) DO NOTHING;


-- ============================================
-- PARTE 6: VERIFICAÇÃO FINAL
-- ============================================

-- 6.1. Verificar RLS após desabilitar
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('certificates', 'modules', 'admins', 'courses')
ORDER BY tablename;
-- Esperado: rls_enabled = false para todas

-- 6.2. Verificar certificados com módulos
SELECT 
  id,
  user_email,
  course_title,
  course_id,
  CASE 
    WHEN course_modules IS NULL THEN 'SEM MÓDULOS'
    WHEN course_modules = '' THEN 'VAZIO'
    ELSE 'COM MÓDULOS (' || (
      SELECT COUNT(*)::TEXT 
      FROM json_array_elements(course_modules::json)
    ) || ')'
  END as status
FROM certificates
WHERE user_email = 'antoniovicelmo@gmail.com'
ORDER BY id;

-- 6.3. Verificar admin cadastrado
SELECT * FROM admins WHERE email = 'antoniovicelmo@gmail.com';


-- ============================================================================
-- INSTRUÇÕES DE USO:
-- ============================================================================
-- 
-- OPÇÃO 1: Executar TUDO de uma vez (RECOMENDADO)
-- - Copie TODO este arquivo e cole no SQL Editor do Supabase
-- - Execute tudo (Ctrl+Enter ou botão Run)
-- - Isso vai diagnosticar E corrigir todos os problemas
--
-- OPÇÃO 2: Executar por partes
-- - Execute PARTE 1 primeiro (diagnóstico)
-- - Analise os resultados
-- - Execute PARTE 2, 3, 4 e 5 conforme necessário
-- - Execute PARTE 6 para verificar
--
-- OBSERVAÇÕES:
-- - Este script é IDEMPOTENTE (pode executar múltiplas vezes sem problemas)
-- - RLS desabilitado é TEMPORÁRIO para debug (pode reabilitar depois)
-- - Após executar, faça rebuild no Easypanel
-- ============================================================================
