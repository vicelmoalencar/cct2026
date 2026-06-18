-- ============================================================================
-- Migration 0025: Aulas gratuitas consideram teste_gratis OU free_trial
-- ============================================================================
-- Descrição:
--   A tabela lessons tem duas colunas que marcam aula gratuita: a antiga
--   `free_trial` (migration 0005) e a nova `teste_gratis` (migration 0015).
--   O frontend trata a aula como gratuita se QUALQUER uma for verdadeira, mas
--   a função user_has_lesson_access só olhava `teste_gratis`. Aulas legadas
--   marcadas só com `free_trial=true` apareciam como gratuitas na UI mas eram
--   bloqueadas no backend (modal "Plano Expirado" em aula grátis).
--
--   Esta migration alinha a função com o frontend: aula é gratuita se
--   teste_gratis OU free_trial for verdadeira.
-- ============================================================================

DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, BIGINT) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, INTEGER) CASCADE;

CREATE OR REPLACE FUNCTION user_has_lesson_access(
  email_usuario TEXT,
  lesson_id BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
  lesson_is_free BOOLEAN;
  user_access_type TEXT;
BEGIN
  -- Aula é gratuita se teste_gratis OU free_trial for verdadeira
  SELECT COALESCE(teste_gratis, false) OR COALESCE(free_trial, false)
  INTO lesson_is_free
  FROM lessons
  WHERE id = lesson_id;

  -- Se não encontrou a aula, negar acesso
  IF lesson_is_free IS NULL THEN
    RETURN false;
  END IF;

  -- Aula gratuita: SEMPRE liberar (mesmo para expirados / sem login)
  IF lesson_is_free = TRUE THEN
    RETURN true;
  END IF;

  -- Aula premium: requer plano pago ativo
  user_access_type := user_tipo_acesso(email_usuario);
  RETURN (user_access_type = 'COMPLETO');
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION user_has_lesson_access(TEXT, BIGINT) IS
  'Verifica acesso a uma aula. Aula gratuita (teste_gratis OU free_trial = TRUE) é acessível por TODOS. Aula premium requer plano pago ativo.';

-- Sobrecarga para INTEGER
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
