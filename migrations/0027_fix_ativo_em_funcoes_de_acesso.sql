-- ============================================================================
-- Migration 0027: user_tipo_acesso() e user_tem_acesso_completo() ignoram `ativo`
-- ============================================================================
-- Descrição:
--   As duas funções de acesso (criadas na 0015) nunca olham a coluna `ativo`
--   de member_subscriptions - só checam teste_gratis e data_expiracao. Isso
--   faz o checkbox "Assinatura Ativa" da tela admin "Editar Assinatura" não
--   ter NENHUM efeito real: desmarcar `ativo` numa assinatura continua
--   liberando acesso completo às aulas, porque user_has_lesson_access() (ver
--   0025) chama user_tipo_acesso() pra decidir, e essa função nunca filtra
--   por `ativo`.
--
--   O resto do código (TypeScript, em vários pontos - ver src/index.tsx) já
--   sabia disso e tinha fallbacks com `AND COALESCE(ativo, true) = true`,
--   mas só rodam quando a função de banco já disse "sem acesso" - nunca
--   corrigem um falso positivo dela, só adicionam acesso, nunca revogam.
--
--   Esta migration alinha as duas funções de banco com o mesmo critério que
--   o resto do código já usa (COALESCE(ativo, true) = true), sem mudar mais
--   nada do comportamento (múltiplas assinaturas por e-mail continuam
--   valendo "qualquer uma ativa e não vencida libera acesso" - não mexe
--   nisso, só passa a respeitar o campo `ativo`).
-- ============================================================================

CREATE OR REPLACE FUNCTION user_tem_acesso_completo(email_usuario TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM member_subscriptions
    WHERE email_membro = email_usuario
      AND teste_gratis = FALSE
      AND data_expiracao > CURRENT_TIMESTAMP
      AND COALESCE(ativo, true) = true
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION user_tipo_acesso(email_usuario TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Tem plano pago ativo?
  IF EXISTS (
    SELECT 1 FROM member_subscriptions
    WHERE email_membro = email_usuario
      AND teste_gratis = FALSE
      AND data_expiracao > CURRENT_TIMESTAMP
      AND COALESCE(ativo, true) = true
  ) THEN
    RETURN 'COMPLETO';
  END IF;

  -- Tem teste grátis ativo?
  IF EXISTS (
    SELECT 1 FROM member_subscriptions
    WHERE email_membro = email_usuario
      AND teste_gratis = TRUE
      AND data_expiracao > CURRENT_TIMESTAMP
      AND COALESCE(ativo, true) = true
  ) THEN
    RETURN 'TESTE_GRATIS';
  END IF;

  -- Sem acesso
  RETURN 'SEM_ACESSO';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION user_tem_acesso_completo(TEXT) IS
  'Retorna TRUE se o usuário tem plano PAGO ativo (não expirado, ativo=true)';

COMMENT ON FUNCTION user_tipo_acesso(TEXT) IS
  'COMPLETO (plano pago ativo), TESTE_GRATIS (teste grátis ativo) ou SEM_ACESSO - considera ativo=true em ambos os casos';

-- Verificação pós-migration (ajuste o e-mail pra conferir um caso real na sua base):
-- SELECT user_tipo_acesso('teste@example.com');
