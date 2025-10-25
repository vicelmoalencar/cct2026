-- ============================================================================
-- MIGRATION 0010: Tabela de Histórico de Membros (Importação CSV)
-- ============================================================================
-- SOLUÇÃO: Criar tabela separada para histórico de membros do sistema antigo
-- Mantém a tabela 'subscriptions' original intacta para o sistema de planos
-- ============================================================================

-- Criar tabela NOVA para histórico de membros importados
CREATE TABLE IF NOT EXISTS member_subscriptions (
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
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_email ON member_subscriptions(email_membro);
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_expiracao ON member_subscriptions(data_expiracao);
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_origem ON member_subscriptions(origem);
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_ativo ON member_subscriptions(ativo);
CREATE INDEX IF NOT EXISTS idx_member_subscriptions_email_ativo ON member_subscriptions(email_membro, ativo);

-- Comentários nas colunas
COMMENT ON TABLE member_subscriptions IS 'Histórico de membros importados do sistema antigo (Bubble.io)';
COMMENT ON COLUMN member_subscriptions.email_membro IS 'Email do membro/usuário';
COMMENT ON COLUMN member_subscriptions.data_expiracao IS 'Data de expiração da assinatura antiga';
COMMENT ON COLUMN member_subscriptions.detalhe IS 'Detalhes do pedido (número, plano, datas)';
COMMENT ON COLUMN member_subscriptions.origem IS 'Origem da assinatura (Telegram, CCT 2.0, manual, etc)';
COMMENT ON COLUMN member_subscriptions.teste_gratis IS 'Se era assinatura de teste grátis';
COMMENT ON COLUMN member_subscriptions.ativo IS 'Status da assinatura no momento da importação';

-- Desabilitar RLS para permitir importação via API
ALTER TABLE member_subscriptions DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- NOTA: Esta tabela é SEPARADA da tabela 'subscriptions' existente
-- 
-- subscriptions = Sistema atual de planos (mensal, trimestral, anual)
-- member_subscriptions = Histórico importado do sistema antigo
-- 
-- Ambas podem coexistir sem conflito
-- ============================================================================

-- Verificar estrutura criada:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'member_subscriptions'
ORDER BY ordinal_position;
