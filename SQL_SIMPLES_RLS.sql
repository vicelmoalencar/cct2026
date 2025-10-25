-- ============================================
-- DESABILITAR RLS - VERSÃO SIMPLES E SEGURA
-- ============================================
-- Execute linha por linha para evitar erros

-- 1. TABELAS PRINCIPAIS (necessárias para importação)
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;

-- 2. TABELAS DE ASSINATURA (se existirem - pode dar erro, é normal)
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history DISABLE ROW LEVEL SECURITY;

-- 3. TABELAS DE CERTIFICADO (se existirem - pode dar erro, é normal)
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates DISABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICAR STATUS
-- ============================================
-- Execute esta query para verificar quais tabelas existem:

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_habilitado
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
