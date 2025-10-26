-- ============================================================================
-- Migration 0016: Corrigir Sistema de Controle de Acesso
-- ============================================================================
-- Data: 2025-10-26
-- Descrição:
--   1. Adiciona coluna teste_gratis na tabela lessons
--   2. Atualiza função user_has_lesson_access() para usar member_subscriptions
--   3. Cria função user_has_active_subscription() simplificada
--   4. Adiciona índices para performance
-- ============================================================================

-- ============================================
-- PARTE 1: ADICIONAR COLUNA NA TABELA LESSONS
-- ============================================

-- 1.1. Adicionar coluna teste_gratis
ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS teste_gratis BOOLEAN DEFAULT FALSE;

-- 1.2. Criar índice
CREATE INDEX IF NOT EXISTS idx_lessons_teste_gratis 
ON lessons(teste_gratis);

-- 1.3. Comentário
COMMENT ON COLUMN lessons.teste_gratis IS 
  'Indica se a aula está disponível no período de teste grátis. TRUE = acessível no teste, FALSE = somente plano pago';


-- ============================================
-- PARTE 2: CRIAR FUNÇÃO SIMPLIFICADA
-- ============================================

-- 2.1. Função para verificar se usuário tem assinatura ativa
CREATE OR REPLACE FUNCTION user_has_active_subscription(email_usuario TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verifica se existe qualquer assinatura ativa (paga ou teste) não expirada
  RETURN EXISTS (
    SELECT 1 
    FROM member_subscriptions
    WHERE email_membro = email_usuario
      AND data_expiracao > CURRENT_TIMESTAMP
  );
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION user_has_active_subscription(TEXT) IS 
  'Retorna TRUE se o usuário tem QUALQUER assinatura ativa (paga ou teste grátis) não expirada';


-- ============================================
-- PARTE 3: ATUALIZAR FUNÇÃO DE ACESSO À AULA
-- ============================================

-- 3.1. Dropar função antiga
DROP FUNCTION IF EXISTS user_has_lesson_access(VARCHAR, INTEGER);
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, INTEGER);

-- 3.2. Criar nova função que usa member_subscriptions
CREATE OR REPLACE FUNCTION user_has_lesson_access(
  email_usuario TEXT,
  lesson_id INTEGER
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
  
  -- Obter tipo de acesso do usuário usando a função existente
  user_access_type := user_tipo_acesso(email_usuario);
  
  -- Lógica de acesso:
  -- 1. COMPLETO (plano pago ativo): acessa TODAS as aulas
  -- 2. TESTE_GRATIS (teste ativo): acessa APENAS aulas marcadas como teste_gratis
  -- 3. SEM_ACESSO (sem planos): não acessa nada
  
  CASE user_access_type
    WHEN 'COMPLETO' THEN
      -- Acesso completo: pode ver qualquer aula
      RETURN true;
    
    WHEN 'TESTE_GRATIS' THEN
      -- Teste grátis: só aulas marcadas como teste_gratis
      RETURN lesson_is_teste_gratis;
    
    ELSE
      -- SEM_ACESSO ou qualquer outro caso: sem acesso
      RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION user_has_lesson_access(TEXT, INTEGER) IS 
  'Verifica se usuário tem permissão para acessar uma aula específica baseado no tipo de plano (COMPLETO, TESTE_GRATIS, SEM_ACESSO)';


-- ============================================
-- PARTE 4: CRIAR VIEW PARA DEBUG
-- ============================================

-- 4.1. Dropar view se existir
DROP VIEW IF EXISTS lesson_access_debug;

-- 4.2. Criar view para facilitar debug
CREATE VIEW lesson_access_debug AS
SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  l.teste_gratis as disponivel_teste_gratis,
  u.email_membro as user_email,
  u.tipo_acesso as user_tipo_acesso,
  user_has_lesson_access(u.email_membro, l.id) as tem_acesso
FROM lessons l
CROSS JOIN user_access_status u
ORDER BY u.email_membro, l.id;

COMMENT ON VIEW lesson_access_debug IS 
  'View para debug: mostra quem tem acesso a cada aula baseado no tipo de plano';


-- ============================================
-- PARTE 5: MARCAR ALGUMAS AULAS COMO TESTE GRÁTIS
-- ============================================

-- 5.1. Marcar as primeiras 3 aulas de cada módulo como teste grátis
-- (Ajuste conforme necessário)
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

-- 5.2. Ver estatísticas
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
-- PARTE 6: VERIFICAÇÃO E TESTES
-- ============================================

-- 6.1. Testar funções com usuário específico
SELECT 
  'antoniovicelmo@gmail.com' as usuario,
  user_has_active_subscription('antoniovicelmo@gmail.com') as tem_assinatura_ativa,
  user_tem_acesso_completo('antoniovicelmo@gmail.com') as tem_acesso_completo,
  user_tipo_acesso('antoniovicelmo@gmail.com') as tipo_acesso;

-- 6.2. Ver acesso do usuário às primeiras 10 aulas
SELECT 
  l.id,
  l.title,
  l.teste_gratis,
  user_has_lesson_access('antoniovicelmo@gmail.com', l.id) as tem_acesso
FROM lessons l
ORDER BY l.id
LIMIT 10;

-- 6.3. Ver estatísticas de acesso por tipo de usuário
SELECT 
  uas.tipo_acesso,
  COUNT(DISTINCT uas.email_membro) as total_usuarios,
  COUNT(CASE WHEN user_has_lesson_access(uas.email_membro, 1) THEN 1 END) as usuarios_com_acesso_aula_1
FROM user_access_status uas
GROUP BY uas.tipo_acesso
ORDER BY 
  CASE uas.tipo_acesso
    WHEN 'COMPLETO' THEN 1
    WHEN 'TESTE_GRATIS' THEN 2
    WHEN 'SEM_ACESSO' THEN 3
  END;


-- ============================================================================
-- INSTRUÇÕES DE USO:
-- ============================================================================
-- 
-- EXECUTAR NO SUPABASE SQL EDITOR:
-- 1. Execute PRIMEIRO a migration 0015 (se ainda não executou)
-- 2. Depois execute esta migration 0016
-- 3. Verifique os resultados da PARTE 6
--
-- RESULTADO ESPERADO:
-- - Coluna teste_gratis adicionada à tabela lessons
-- - Função user_has_lesson_access() atualizada
-- - Primeiras 3 aulas de cada módulo marcadas como teste grátis
-- - Controle de acesso funcionando:
--   * COMPLETO: acessa todas as aulas
--   * TESTE_GRATIS: acessa só aulas marcadas como teste_gratis
--   * SEM_ACESSO: não acessa nada
--
-- PRÓXIMOS PASSOS:
-- 1. Atualizar backend para usar as novas funções
-- 2. Implementar UI no frontend (bloquear aulas premium)
-- 3. Adicionar banner de status de acesso
-- ============================================================================
