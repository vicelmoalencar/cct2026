-- ============================================================================
-- FIX RÁPIDO - Execute tudo de uma vez
-- ============================================================================
-- Copie e cole TODO este arquivo no Supabase SQL Editor e clique em RUN
-- ============================================================================

-- 1. Remover view dependente
DROP VIEW IF EXISTS lesson_access_debug CASCADE;

-- 2. Remover funções antigas
DROP FUNCTION IF EXISTS user_has_lesson_access(VARCHAR, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, BIGINT) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(CHARACTER VARYING, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(CHARACTER VARYING, BIGINT) CASCADE;

-- 3. Adicionar coluna teste_gratis
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS teste_gratis BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_lessons_teste_gratis ON lessons(teste_gratis);

-- 4. Criar função user_has_active_subscription
CREATE OR REPLACE FUNCTION user_has_active_subscription(email_usuario TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM member_subscriptions
    WHERE email_membro = email_usuario AND data_expiracao > CURRENT_TIMESTAMP
  );
END;
$$ LANGUAGE plpgsql;

-- 5. Criar função principal user_has_lesson_access (BIGINT)
CREATE OR REPLACE FUNCTION user_has_lesson_access(
  email_usuario TEXT,
  lesson_id BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
  lesson_is_teste_gratis BOOLEAN;
  user_access_type TEXT;
BEGIN
  SELECT teste_gratis INTO lesson_is_teste_gratis FROM lessons WHERE id = lesson_id;
  IF lesson_is_teste_gratis IS NULL THEN RETURN false; END IF;
  
  user_access_type := user_tipo_acesso(email_usuario);
  
  CASE user_access_type
    WHEN 'COMPLETO' THEN RETURN true;
    WHEN 'TESTE_GRATIS' THEN RETURN lesson_is_teste_gratis;
    ELSE RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- 6. Criar sobrecarga para INTEGER
CREATE OR REPLACE FUNCTION user_has_lesson_access(
  email_usuario TEXT,
  lesson_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_has_lesson_access(email_usuario, lesson_id::BIGINT);
END;
$$ LANGUAGE plpgsql;

-- 7. Marcar primeiras 3 aulas de cada módulo como teste grátis
WITH primeiras_aulas AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY module_id ORDER BY id) as rn
  FROM lessons
)
UPDATE lessons SET teste_gratis = TRUE
WHERE id IN (SELECT id FROM primeiras_aulas WHERE rn <= 3);

-- 8. Recriar view de debug
CREATE VIEW lesson_access_debug AS
SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  l.teste_gratis as disponivel_teste_gratis,
  u.email_membro as user_email,
  u.tipo_acesso as user_tipo_acesso,
  user_has_lesson_access(u.email_membro::TEXT, l.id) as tem_acesso
FROM lessons l
CROSS JOIN user_access_status u
LIMIT 100;

-- ============================================================================
-- TESTE RÁPIDO
-- ============================================================================

SELECT '✅ TESTE 1: Status do usuário' as teste;
SELECT 
  user_tipo_acesso('antoniovicelmo@gmail.com') as tipo_acesso,
  user_has_active_subscription('antoniovicelmo@gmail.com') as tem_assinatura;

SELECT '✅ TESTE 2: Acesso a aula 1' as teste;
SELECT user_has_lesson_access('antoniovicelmo@gmail.com', 1) as tem_acesso_aula_1;

SELECT '✅ TESTE 3: Estatísticas' as teste;
SELECT 
  COUNT(*) as total_aulas,
  COUNT(CASE WHEN teste_gratis THEN 1 END) as aulas_teste,
  COUNT(CASE WHEN NOT teste_gratis THEN 1 END) as aulas_premium
FROM lessons;

-- ============================================================================
-- ✅ SUCESSO! Sistema de controle de acesso ativo!
-- ============================================================================
