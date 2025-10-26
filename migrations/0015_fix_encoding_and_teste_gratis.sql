-- ============================================================================
-- Migration 0015: Corrigir Encoding e Implementar Teste Grátis
-- ============================================================================
-- Data: 2025-01-26
-- Descrição: 
--   1. Corrige problemas de encoding (����) na coluna detalhe
--   2. Marca coluna teste_gratis baseado no detalhe
--   3. Cria coluna teste_gratis se não existir
-- ============================================================================

-- ============================================
-- PARTE 1: VERIFICAR PROBLEMA ATUAL
-- ============================================

-- 1.1. Ver registros com problema de encoding
SELECT 
  id,
  user_email,
  detalhe,
  teste_gratis,
  expires_at
FROM member_subscriptions
WHERE detalhe LIKE '%�%'
ORDER BY id;

-- 1.2. Contar quantos registros têm problema
SELECT 
  COUNT(*) as total_com_problema,
  COUNT(DISTINCT user_email) as usuarios_afetados
FROM member_subscriptions
WHERE detalhe LIKE '%�%';


-- ============================================
-- PARTE 2: CRIAR COLUNA teste_gratis (SE NÃO EXISTIR)
-- ============================================

-- 2.1. Adicionar coluna teste_gratis (BOOLEAN)
ALTER TABLE member_subscriptions 
ADD COLUMN IF NOT EXISTS teste_gratis BOOLEAN DEFAULT FALSE;

-- 2.2. Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_teste_gratis 
ON member_subscriptions(teste_gratis);

-- 2.3. Criar índice composto para verificação de acesso
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_user_active 
ON member_subscriptions(user_email, expires_at, teste_gratis);


-- ============================================
-- PARTE 3: CORRIGIR ENCODING DOS DADOS
-- ============================================

-- 3.1. Corrigir "Teste grátis 5 dias" (com problema de encoding)
UPDATE member_subscriptions
SET detalhe = 'Teste grátis 5 dias'
WHERE detalhe LIKE 'Teste gr_tis 5 dias'
   OR detalhe LIKE 'Teste gr%tis 5 dias'
   OR detalhe LIKE '%Teste gr%5 dias%'
   OR detalhe SIMILAR TO 'Teste gr[^a-z]tis 5 dias';

-- 3.2. Corrigir "Prorrogação de Teste grátis 5 dias"
UPDATE member_subscriptions
SET detalhe = 'Prorrogação de Teste grátis 5 dias'
WHERE detalhe LIKE 'Prorroga%de Teste gr_tis 5 dias'
   OR detalhe LIKE 'Prorroga%de Teste gr%tis 5 dias'
   OR detalhe LIKE '%Prorroga%Teste gr%5 dias%'
   OR detalhe SIMILAR TO 'Prorroga[^a-z]+de Teste gr[^a-z]tis 5 dias';

-- 3.3. Corrigir "Transação Hotmart" (com problema de encoding)
UPDATE member_subscriptions
SET detalhe = REGEXP_REPLACE(detalhe, 'Transa[^a-z]+o Hotmart', 'Transação Hotmart', 'g')
WHERE detalhe LIKE '%Transa%Hotmart%'
  AND detalhe NOT LIKE 'Transação Hotmart%';

-- 3.4. Corrigir "Compra pela Hotmart"
UPDATE member_subscriptions
SET detalhe = 'Compra pela Hotmart - ' || SUBSTRING(detalhe FROM '[A-Z0-9]+$')
WHERE detalhe LIKE 'Compra pela Hotmart%'
  AND detalhe ~ '[A-Z]{2}[0-9]+$';


-- ============================================
-- PARTE 4: MARCAR TESTE GRÁTIS
-- ============================================

-- 4.1. Marcar teste_gratis = TRUE para registros de teste
UPDATE member_subscriptions
SET teste_gratis = TRUE
WHERE detalhe IN (
  'Teste grátis 5 dias',
  'Prorrogação de Teste grátis 5 dias'
);

-- 4.2. Garantir que outros registros sejam FALSE
UPDATE member_subscriptions
SET teste_gratis = FALSE
WHERE detalhe NOT IN (
  'Teste grátis 5 dias',
  'Prorrogação de Teste grátis 5 dias'
)
AND teste_gratis IS NULL;


-- ============================================
-- PARTE 5: ADICIONAR COMENTÁRIOS E CONSTRAINTS
-- ============================================

-- 5.1. Comentários nas colunas
COMMENT ON COLUMN member_subscriptions.teste_gratis IS 
  'Indica se é um plano de teste grátis (5 dias). TRUE = teste grátis, FALSE = plano pago';

COMMENT ON COLUMN member_subscriptions.detalhe IS 
  'Descrição do plano: "Teste grátis 5 dias", "Prorrogação de Teste grátis 5 dias", "Transação Hotmart - HPXXXXXXXXXX", "Compra pela Hotmart - HPXXXXXXXXXX"';

-- 5.2. Adicionar constraint para garantir valor não-nulo
ALTER TABLE member_subscriptions 
ALTER COLUMN teste_gratis SET DEFAULT FALSE;

ALTER TABLE member_subscriptions 
ALTER COLUMN teste_gratis SET NOT NULL;


-- ============================================
-- PARTE 6: CRIAR VIEW PARA VERIFICAÇÃO DE ACESSO
-- ============================================

-- 6.1. Dropar view se existir
DROP VIEW IF EXISTS user_access_status;

-- 6.2. Criar view para status de acesso do usuário
CREATE VIEW user_access_status AS
SELECT 
  user_email,
  
  -- Tem plano PAGO ativo?
  EXISTS (
    SELECT 1 
    FROM member_subscriptions ms2 
    WHERE ms2.user_email = ms.user_email 
      AND ms2.teste_gratis = FALSE
      AND ms2.expires_at > CURRENT_TIMESTAMP
  ) as tem_plano_pago_ativo,
  
  -- Tem plano TESTE ativo?
  EXISTS (
    SELECT 1 
    FROM member_subscriptions ms2 
    WHERE ms2.user_email = ms.user_email 
      AND ms2.teste_gratis = TRUE
      AND ms2.expires_at > CURRENT_TIMESTAMP
  ) as tem_teste_gratis_ativo,
  
  -- Data de expiração do plano pago mais recente
  (
    SELECT MAX(expires_at)
    FROM member_subscriptions ms2
    WHERE ms2.user_email = ms.user_email
      AND ms2.teste_gratis = FALSE
  ) as ultimo_plano_pago_expira_em,
  
  -- Data de expiração do teste grátis mais recente
  (
    SELECT MAX(expires_at)
    FROM member_subscriptions ms2
    WHERE ms2.user_email = ms.user_email
      AND ms2.teste_gratis = TRUE
  ) as ultimo_teste_expira_em,
  
  -- Tipo de acesso
  CASE
    -- Tem plano pago ativo: acesso completo
    WHEN EXISTS (
      SELECT 1 FROM member_subscriptions ms2 
      WHERE ms2.user_email = ms.user_email 
        AND ms2.teste_gratis = FALSE
        AND ms2.expires_at > CURRENT_TIMESTAMP
    ) THEN 'COMPLETO'
    
    -- Tem teste grátis ativo: acesso limitado
    WHEN EXISTS (
      SELECT 1 FROM member_subscriptions ms2 
      WHERE ms2.user_email = ms.user_email 
        AND ms2.teste_gratis = TRUE
        AND ms2.expires_at > CURRENT_TIMESTAMP
    ) THEN 'TESTE_GRATIS'
    
    -- Sem planos ativos: sem acesso
    ELSE 'SEM_ACESSO'
  END as tipo_acesso

FROM member_subscriptions ms
GROUP BY user_email;

-- 6.3. Comentário na view
COMMENT ON VIEW user_access_status IS 
  'View para verificar status de acesso do usuário: COMPLETO (plano pago), TESTE_GRATIS (teste grátis 5 dias), SEM_ACESSO (sem planos ativos)';


-- ============================================
-- PARTE 7: CRIAR FUNÇÃO HELPER
-- ============================================

-- 7.1. Função para verificar se usuário tem acesso completo
CREATE OR REPLACE FUNCTION user_tem_acesso_completo(email_usuario TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM member_subscriptions
    WHERE user_email = email_usuario
      AND teste_gratis = FALSE
      AND expires_at > CURRENT_TIMESTAMP
  );
END;
$$ LANGUAGE plpgsql;

-- 7.2. Função para verificar tipo de acesso
CREATE OR REPLACE FUNCTION user_tipo_acesso(email_usuario TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Tem plano pago ativo?
  IF EXISTS (
    SELECT 1 FROM member_subscriptions
    WHERE user_email = email_usuario
      AND teste_gratis = FALSE
      AND expires_at > CURRENT_TIMESTAMP
  ) THEN
    RETURN 'COMPLETO';
  END IF;
  
  -- Tem teste grátis ativo?
  IF EXISTS (
    SELECT 1 FROM member_subscriptions
    WHERE user_email = email_usuario
      AND teste_gratis = TRUE
      AND expires_at > CURRENT_TIMESTAMP
  ) THEN
    RETURN 'TESTE_GRATIS';
  END IF;
  
  -- Sem acesso
  RETURN 'SEM_ACESSO';
END;
$$ LANGUAGE plpgsql;

-- 7.3. Comentários nas funções
COMMENT ON FUNCTION user_tem_acesso_completo(TEXT) IS 
  'Retorna TRUE se o usuário tem plano PAGO ativo (não expirado)';

COMMENT ON FUNCTION user_tipo_acesso(TEXT) IS 
  'Retorna tipo de acesso: COMPLETO, TESTE_GRATIS ou SEM_ACESSO';


-- ============================================
-- PARTE 8: VERIFICAÇÃO FINAL
-- ============================================

-- 8.1. Ver status de todos os usuários
SELECT 
  user_email,
  tem_plano_pago_ativo,
  tem_teste_gratis_ativo,
  tipo_acesso,
  ultimo_plano_pago_expira_em,
  ultimo_teste_expira_em
FROM user_access_status
ORDER BY 
  CASE tipo_acesso
    WHEN 'COMPLETO' THEN 1
    WHEN 'TESTE_GRATIS' THEN 2
    WHEN 'SEM_ACESSO' THEN 3
  END,
  user_email
LIMIT 20;

-- 8.2. Estatísticas de correção
SELECT 
  '✅ Encoding Corrigido' as status,
  COUNT(*) as total
FROM member_subscriptions
WHERE detalhe NOT LIKE '%�%'

UNION ALL

SELECT 
  '❌ Ainda com Problema' as status,
  COUNT(*) as total
FROM member_subscriptions
WHERE detalhe LIKE '%�%'

UNION ALL

SELECT 
  '✅ Teste Grátis Marcado' as status,
  COUNT(*) as total
FROM member_subscriptions
WHERE teste_gratis = TRUE

UNION ALL

SELECT 
  '✅ Planos Pagos' as status,
  COUNT(*) as total
FROM member_subscriptions
WHERE teste_gratis = FALSE;

-- 8.3. Ver distribuição de planos
SELECT 
  CASE 
    WHEN teste_gratis THEN 'Teste Grátis'
    ELSE 'Plano Pago'
  END as tipo_plano,
  detalhe,
  COUNT(*) as quantidade,
  COUNT(DISTINCT user_email) as usuarios_unicos
FROM member_subscriptions
GROUP BY teste_gratis, detalhe
ORDER BY teste_gratis DESC, quantidade DESC;

-- 8.4. Testar funções com email específico (SUBSTITUA O EMAIL)
SELECT 
  'antoniovicelmo@gmail.com' as usuario,
  user_tem_acesso_completo('antoniovicelmo@gmail.com') as tem_acesso_completo,
  user_tipo_acesso('antoniovicelmo@gmail.com') as tipo_acesso;


-- ============================================================================
-- INSTRUÇÕES DE USO:
-- ============================================================================
-- 
-- OPÇÃO 1: Executar TUDO de uma vez (RECOMENDADO)
-- - Copie TODO este arquivo
-- - Cole no SQL Editor do Supabase
-- - Execute tudo (Ctrl+Enter)
--
-- OPÇÃO 2: Executar por partes
-- - Execute cada PARTE separadamente
-- - Verifique os resultados de cada etapa
--
-- APÓS EXECUTAR:
-- 1. Backend precisa ser atualizado para usar as funções
-- 2. Adicionar lógica de verificação de acesso nas aulas
-- 3. Criar tabela lessons com campo teste_gratis (se não existir)
--
-- REGRA DE NEGÓCIO:
-- - Usuário COM plano pago ativo: acesso a TODAS as aulas
-- - Usuário COM teste grátis ativo: acesso APENAS a aulas marcadas como teste_gratis
-- - Usuário SEM planos ativos: SEM acesso a aulas (ou apenas aulas gratuitas)
-- ============================================================================
