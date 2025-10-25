-- ============================================================================
-- MIGRATION 0009: Tabela de Assinaturas/Membros
-- ============================================================================
-- Descrição: Cria tabela para armazenar histórico de assinaturas dos membros
-- Data: 2025-10-25
-- Autor: Sistema CCT
-- ============================================================================

-- Criar tabela de assinaturas
CREATE TABLE IF NOT EXISTS subscriptions (
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

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email_membro);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiracao ON subscriptions(data_expiracao);
CREATE INDEX IF NOT EXISTS idx_subscriptions_origem ON subscriptions(origem);
CREATE INDEX IF NOT EXISTS idx_subscriptions_ativo ON subscriptions(ativo);

-- Criar índice composto para buscar assinatura ativa por email
CREATE INDEX IF NOT EXISTS idx_subscriptions_email_ativo ON subscriptions(email_membro, ativo);

-- Comentários nas colunas
COMMENT ON TABLE subscriptions IS 'Histórico de assinaturas/membros do sistema';
COMMENT ON COLUMN subscriptions.email_membro IS 'Email do membro/usuário';
COMMENT ON COLUMN subscriptions.data_expiracao IS 'Data de expiração da assinatura';
COMMENT ON COLUMN subscriptions.detalhe IS 'Detalhes do pedido (número, plano, datas)';
COMMENT ON COLUMN subscriptions.origem IS 'Origem da assinatura (Telegram, CCT 2.0, manual, etc)';
COMMENT ON COLUMN subscriptions.teste_gratis IS 'Se é assinatura de teste grátis';
COMMENT ON COLUMN subscriptions.ativo IS 'Status atual da assinatura (calculado)';

-- ============================================================================
-- IMPORTANTE: Desabilitar RLS para permitir importação via API
-- ============================================================================
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- FIM DA MIGRATION 0009
-- ============================================================================
