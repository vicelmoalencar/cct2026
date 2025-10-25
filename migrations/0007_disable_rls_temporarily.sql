-- ============================================
-- DESABILITAR RLS TEMPORARIAMENTE PARA TESTES
-- ============================================
-- ATENÇÃO: Isso remove a segurança RLS!
-- Use apenas para desenvolvimento/testes
-- Em produção, você deve usar Service Role Key ou políticas adequadas

-- Desabilitar RLS em todas as tabelas principais
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS nas tabelas de assinatura (se existirem)
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history DISABLE ROW LEVEL SECURITY;

-- Comentário
COMMENT ON TABLE courses IS 'RLS DESABILITADO - Usar apenas em desenvolvimento';
