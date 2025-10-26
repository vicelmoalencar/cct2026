-- ============================================================================
-- SCRIPT DE EXECUÇÃO PASSO A PASSO
-- ============================================================================
-- Use este script se a migration 0016 completa der erro
-- Execute cada seção separadamente no Supabase SQL Editor
-- ============================================================================

-- ============================================
-- PASSO 1: Adicionar coluna teste_gratis na tabela lessons
-- ============================================

ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS teste_gratis BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_lessons_teste_gratis 
ON lessons(teste_gratis);

-- Verificar se funcionou:
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'lessons' AND column_name = 'teste_gratis';
-- Deve retornar: teste_gratis | boolean | YES


-- ============================================
-- PASSO 2: Criar função user_has_active_subscription
-- ============================================

CREATE OR REPLACE FUNCTION user_has_active_subscription(email_usuario TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM member_subscriptions
    WHERE email_membro = email_usuario
      AND data_expiracao > CURRENT_TIMESTAMP
  );
END;
$$ LANGUAGE plpgsql;

-- Testar:
SELECT user_has_active_subscription('antoniovicelmo@gmail.com');
-- Deve retornar TRUE ou FALSE


-- ============================================
-- PASSO 3: Dropar versões antigas da função
-- ============================================

DROP FUNCTION IF EXISTS user_has_lesson_access(VARCHAR, INTEGER);
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, INTEGER);
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, BIGINT);
DROP FUNCTION IF EXISTS user_has_lesson_access(CHARACTER VARYING, INTEGER);
DROP FUNCTION IF EXISTS user_has_lesson_access(CHARACTER VARYING, BIGINT);

-- Verificar que foram removidas:
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'user_has_lesson_access';
-- Não deve retornar nada


-- ============================================
-- PASSO 4: Criar função principal (BIGINT)
-- ============================================

CREATE OR REPLACE FUNCTION user_has_lesson_access(
  email_usuario TEXT,
  lesson_id BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
  lesson_is_teste_gratis BOOLEAN;
  user_access_type TEXT;
BEGIN
  -- Verificar se a aula está disponível no teste grátis
  SELECT teste_gratis INTO lesson_is_teste_gratis
  FROM lessons
  WHERE id = lesson_id;
  
  -- Se não encontrou a aula, negar acesso
  IF lesson_is_teste_gratis IS NULL THEN
    RETURN false;
  END IF;
  
  -- Obter tipo de acesso do usuário
  user_access_type := user_tipo_acesso(email_usuario);
  
  -- Aplicar regras de acesso
  CASE user_access_type
    WHEN 'COMPLETO' THEN
      RETURN true;
    WHEN 'TESTE_GRATIS' THEN
      RETURN lesson_is_teste_gratis;
    ELSE
      RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Testar:
SELECT user_has_lesson_access('antoniovicelmo@gmail.com', 1::BIGINT);
-- Deve retornar TRUE ou FALSE


-- ============================================
-- PASSO 5: Criar sobrecarga para INTEGER
-- ============================================

CREATE OR REPLACE FUNCTION user_has_lesson_access(
  email_usuario TEXT,
  lesson_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_has_lesson_access(email_usuario, lesson_id::BIGINT);
END;
$$ LANGUAGE plpgsql;

-- Testar:
SELECT user_has_lesson_access('antoniovicelmo@gmail.com', 1);
-- Deve retornar TRUE ou FALSE


-- ============================================
-- PASSO 6: Marcar aulas como teste grátis
-- ============================================

-- Marcar as primeiras 3 aulas de cada módulo
WITH primeiras_aulas AS (
  SELECT 
    id,
    module_id,
    ROW_NUMBER() OVER (PARTITION BY module_id ORDER BY id) as rn
  FROM lessons
)
UPDATE lessons
SET teste_gratis = TRUE
WHERE id IN (
  SELECT id 
  FROM primeiras_aulas 
  WHERE rn <= 3
);

-- Verificar resultado:
SELECT 
  'Total de Aulas' as metrica,
  COUNT(*) as quantidade
FROM lessons
UNION ALL
SELECT 
  'Aulas Teste Grátis' as metrica,
  COUNT(*) as quantidade
FROM lessons
WHERE teste_gratis = TRUE
UNION ALL
SELECT 
  'Aulas Premium' as metrica,
  COUNT(*) as quantidade
FROM lessons
WHERE teste_gratis = FALSE;


-- ============================================
-- PASSO 7: TESTES FINAIS
-- ============================================

-- 7.1. Ver status do seu usuário
SELECT 
  'antoniovicelmo@gmail.com' as usuario,
  user_has_active_subscription('antoniovicelmo@gmail.com') as tem_assinatura_ativa,
  user_tem_acesso_completo('antoniovicelmo@gmail.com') as tem_acesso_completo,
  user_tipo_acesso('antoniovicelmo@gmail.com') as tipo_acesso;

-- 7.2. Ver acesso às primeiras 10 aulas
SELECT 
  l.id,
  l.title,
  l.teste_gratis as disponivel_teste,
  user_has_lesson_access('antoniovicelmo@gmail.com', l.id) as voce_tem_acesso
FROM lessons l
ORDER BY l.id
LIMIT 10;

-- 7.3. Ver distribuição de aulas por módulo
SELECT 
  m.title as modulo,
  COUNT(*) as total_aulas,
  COUNT(CASE WHEN l.teste_gratis THEN 1 END) as aulas_teste_gratis
FROM lessons l
JOIN modules m ON l.module_id = m.id
GROUP BY m.id, m.title
ORDER BY m.id;


-- ============================================================================
-- ✅ VERIFICAÇÃO FINAL
-- ============================================================================
-- 
-- Se todas as queries acima executaram sem erro, você tem:
-- ✅ Coluna teste_gratis criada na tabela lessons
-- ✅ Função user_has_active_subscription() funcionando
-- ✅ Função user_has_lesson_access() funcionando com BIGINT e INTEGER
-- ✅ Primeiras 3 aulas de cada módulo marcadas como teste grátis
-- ✅ Sistema de controle de acesso ativo!
--
-- IMPORTANTE:
-- - Usuários com plano PAGO ativo → acesso total
-- - Usuários com TESTE GRÁTIS ativo → apenas aulas marcadas teste_gratis
-- - Usuários com plano EXPIRADO → sem acesso (bloqueados!)
--
-- ============================================================================
