-- ============================================================================
-- 🚨 EXECUTE ISTO AGORA NO SUPABASE SQL EDITOR
-- ============================================================================
-- Este SQL corrige o erro 500 que você está vendo
-- ============================================================================

-- 1. Remover funções antigas (se existirem)
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, BIGINT) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(VARCHAR, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(VARCHAR, BIGINT) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(CHARACTER VARYING, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(CHARACTER VARYING, BIGINT) CASCADE;

-- 2. Criar função PRINCIPAL (BIGINT)
CREATE OR REPLACE FUNCTION user_has_lesson_access(
  email_usuario TEXT,
  lesson_id BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
  lesson_is_teste_gratis BOOLEAN;
  user_access_type TEXT;
BEGIN
  -- Verificar se a aula é gratuita
  SELECT teste_gratis INTO lesson_is_teste_gratis
  FROM lessons WHERE id = lesson_id;
  
  -- Aula não existe
  IF lesson_is_teste_gratis IS NULL THEN
    RETURN false;
  END IF;
  
  -- ✅ AULAS GRATUITAS: TODO MUNDO PODE ACESSAR (inclusive expirados)
  IF lesson_is_teste_gratis = TRUE THEN
    RETURN true;
  END IF;
  
  -- ❌ AULAS PREMIUM: Só quem tem plano PAGO ATIVO
  user_access_type := user_tipo_acesso(email_usuario);
  RETURN (user_access_type = 'COMPLETO');
END;
$$ LANGUAGE plpgsql;

-- 3. Criar função SOBRECARGA (INTEGER)
CREATE OR REPLACE FUNCTION user_has_lesson_access(
  email_usuario TEXT,
  lesson_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_has_lesson_access(email_usuario, lesson_id::BIGINT);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 🧪 TESTAR SE FUNCIONOU
-- ============================================================================

-- Teste 1: Ver seu tipo de acesso
SELECT 
  'SEU TIPO DE ACESSO' as info,
  user_tipo_acesso('antoniovicelmo@gmail.com') as resultado;

-- Teste 2: Verificar se pode acessar aula 1 (provavelmente gratuita)
SELECT 
  'ACESSO À AULA 1 (GRATUITA)' as info,
  user_has_lesson_access('antoniovicelmo@gmail.com', 1) as resultado;

-- Teste 3: Verificar se pode acessar aula 100 (provavelmente premium)
SELECT 
  'ACESSO À AULA 100 (PREMIUM)' as info,
  user_has_lesson_access('antoniovicelmo@gmail.com', 100) as resultado;

-- Teste 4: Ver distribuição de aulas gratuitas vs premium
SELECT 
  CASE WHEN teste_gratis THEN '🎁 GRATUITAS' ELSE '👑 PREMIUM' END as tipo,
  COUNT(*) as quantidade
FROM lessons
GROUP BY teste_gratis;

-- ============================================================================
-- ✅ RESULTADO ESPERADO:
-- ============================================================================
--
-- Teste 1: Deve mostrar 'COMPLETO', 'TESTE_GRATIS' ou 'SEM_ACESSO'
-- Teste 2: Deve retornar TRUE (aula gratuita)
-- Teste 3: Depende do seu tipo de acesso:
--   - COMPLETO → TRUE
--   - TESTE_GRATIS → FALSE (bloqueado!)
--   - SEM_ACESSO → FALSE (bloqueado!)
--
-- Teste 4: Deve mostrar algo como:
--   🎁 GRATUITAS: 253 aulas
--   👑 PREMIUM: 501 aulas
--
-- ============================================================================
-- ⚠️ SE DER ERRO:
-- ============================================================================
--
-- Erro: "function user_tipo_acesso does not exist"
-- Solução: Execute PRIMEIRO a migration 0015
--
-- Erro: "column teste_gratis does not exist"  
-- Solução: Execute PRIMEIRO a migration 0016 ou FIX_RAPIDO.sql
--
-- ============================================================================
