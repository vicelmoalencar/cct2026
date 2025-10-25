-- ============================================================================
-- SQL PARA RECRIAR TABELA SUBSCRIPTIONS (HISTÓRICO DE MEMBROS)
-- ============================================================================
-- ATENÇÃO: Este script DELETA a tabela subscriptions antiga e recria
-- Se você tem dados importantes, faça backup antes!
-- ============================================================================

-- 1. DROPAR tabela antiga (se existir)
DROP TABLE IF EXISTS subscriptions CASCADE;

-- 2. CRIAR nova tabela com estrutura correta
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  
  -- Dados do membro
  email_membro VARCHAR(255) NOT NULL,
  
  -- Datas da assinatura
  data_expiracao TIMESTAMP,
  
  -- Informações adicionais
  detalhe TEXT,
  origem VARCHAR(100),
  teste_gratis BOOLEAN DEFAULT false,
  
  -- Status da assinatura (calculado)
  ativo BOOLEAN DEFAULT true,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CRIAR índices para performance
CREATE INDEX idx_subscriptions_email ON subscriptions(email_membro);
CREATE INDEX idx_subscriptions_expiracao ON subscriptions(data_expiracao);
CREATE INDEX idx_subscriptions_origem ON subscriptions(origem);
CREATE INDEX idx_subscriptions_ativo ON subscriptions(ativo);
CREATE INDEX idx_subscriptions_email_ativo ON subscriptions(email_membro, ativo);

-- 4. COMENTÁRIOS nas colunas
COMMENT ON TABLE subscriptions IS 'Histórico de assinaturas/membros do sistema';
COMMENT ON COLUMN subscriptions.email_membro IS 'Email do membro/usuário';
COMMENT ON COLUMN subscriptions.data_expiracao IS 'Data de expiração da assinatura';
COMMENT ON COLUMN subscriptions.detalhe IS 'Detalhes do pedido (número, plano, datas)';
COMMENT ON COLUMN subscriptions.origem IS 'Origem da assinatura (Telegram, CCT 2.0, manual, etc)';
COMMENT ON COLUMN subscriptions.teste_gratis IS 'Se é assinatura de teste grátis';
COMMENT ON COLUMN subscriptions.ativo IS 'Status atual da assinatura (calculado)';

-- 5. DESABILITAR RLS para permitir importação via API
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PRONTO! Agora você pode importar o CSV de membros
-- ============================================================================

-- Para verificar se foi criada corretamente:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'subscriptions'
ORDER BY ordinal_position;
