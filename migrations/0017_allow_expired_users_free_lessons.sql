-- ============================================================================
-- Migration 0017: Permitir que usuários expirados acessem aulas gratuitas
-- ============================================================================
-- Data: 2025-10-26
-- Descrição:
--   - Usuários com plano expirado podem acessar aulas marcadas como teste_gratis
--   - Mantém bloqueio apenas para aulas premium
-- ============================================================================

-- Dropar e recriar função com nova lógica
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, BIGINT) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, INTEGER) CASCADE;

-- Criar função principal (BIGINT)
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
  
  -- Se a aula é gratuita, SEMPRE permitir acesso (mesmo para expirados)
  IF lesson_is_teste_gratis = TRUE THEN
    RETURN true;
  END IF;
  
  -- Para aulas premium, verificar tipo de acesso
  user_access_type := user_tipo_acesso(email_usuario);
  
  -- Apenas usuários com plano pago ativo podem acessar aulas premium
  RETURN (user_access_type = 'COMPLETO');
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION user_has_lesson_access(TEXT, BIGINT) IS 
  'Verifica se usuário tem permissão para acessar uma aula. Aulas gratuitas (teste_gratis=TRUE) são acessíveis por TODOS. Aulas premium requerem plano pago ativo.';

-- Criar sobrecarga para INTEGER
CREATE OR REPLACE FUNCTION user_has_lesson_access(
  email_usuario TEXT,
  lesson_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_has_lesson_access(email_usuario, lesson_id::BIGINT);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION user_has_lesson_access(TEXT, INTEGER) IS 
  'Wrapper para compatibilidade - converte INTEGER para BIGINT';

-- Recriar view de debug
DROP VIEW IF EXISTS lesson_access_debug CASCADE;

CREATE VIEW lesson_access_debug AS
SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  l.teste_gratis as aula_gratuita,
  u.email_membro as user_email,
  u.tipo_acesso as user_tipo_acesso,
  user_has_lesson_access(u.email_membro::TEXT, l.id) as tem_acesso,
  CASE 
    WHEN l.teste_gratis THEN '🎁 Grátis para todos'
    WHEN u.tipo_acesso = 'COMPLETO' THEN '✅ Acesso liberado (plano pago)'
    WHEN u.tipo_acesso = 'TESTE_GRATIS' THEN '🔒 Bloqueado (precisa plano pago)'
    ELSE '🔒 Bloqueado (precisa plano pago)'
  END as status_acesso
FROM lessons l
CROSS JOIN user_access_status u
LIMIT 100;

COMMENT ON VIEW lesson_access_debug IS 
  'View para debug: mostra quem tem acesso a cada aula. Aulas gratuitas são acessíveis por todos.';

-- ============================================================================
-- TESTES
-- ============================================================================

-- Teste 1: Usuários expirados podem acessar aulas gratuitas
SELECT '✅ TESTE 1: Usuários expirados acessam aulas gratuitas' as teste;
SELECT 
  email_membro,
  tipo_acesso,
  user_has_lesson_access(email_membro, (SELECT MIN(id) FROM lessons WHERE teste_gratis = TRUE)) as acesso_aula_gratis,
  user_has_lesson_access(email_membro, (SELECT MIN(id) FROM lessons WHERE teste_gratis = FALSE)) as acesso_aula_premium
FROM user_access_status
WHERE tipo_acesso = 'SEM_ACESSO'
LIMIT 3;

-- Teste 2: Ver estatísticas de acesso
SELECT '✅ TESTE 2: Estatísticas de acesso' as teste;
SELECT 
  tipo_acesso,
  COUNT(*) as total_usuarios,
  'Acessam ' || (SELECT COUNT(*) FROM lessons WHERE teste_gratis = TRUE)::TEXT || ' aulas gratuitas' as aulas_gratis,
  CASE 
    WHEN tipo_acesso = 'COMPLETO' THEN 'Acessam TODAS as ' || (SELECT COUNT(*) FROM lessons)::TEXT || ' aulas'
    ELSE 'Bloqueados de ' || (SELECT COUNT(*) FROM lessons WHERE teste_gratis = FALSE)::TEXT || ' aulas premium'
  END as aulas_premium
FROM user_access_status
GROUP BY tipo_acesso
ORDER BY 
  CASE tipo_acesso
    WHEN 'COMPLETO' THEN 1
    WHEN 'TESTE_GRATIS' THEN 2
    WHEN 'SEM_ACESSO' THEN 3
  END;

-- ============================================================================
-- RESULTADO ESPERADO:
-- ============================================================================
-- 
-- ANTES (antigo):
-- - SEM_ACESSO: não acessa NADA
--
-- DEPOIS (novo):
-- - SEM_ACESSO: acessa 253 aulas gratuitas, bloqueado de 501 aulas premium
-- - TESTE_GRATIS: acessa 253 aulas gratuitas, bloqueado de 501 aulas premium
-- - COMPLETO: acessa TODAS as 754 aulas
--
-- ============================================================================
