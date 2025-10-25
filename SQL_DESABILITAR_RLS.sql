-- ============================================
-- DESABILITAR RLS - APENAS TABELAS EXISTENTES
-- ============================================

-- Desabilitar RLS nas tabelas principais (que certamente existem)
ALTER TABLE IF EXISTS courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lessons DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS nas tabelas de certificado (podem existir ou não)
ALTER TABLE IF EXISTS certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS certificate_templates DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS nas tabelas de assinatura (se existirem)
ALTER TABLE IF EXISTS plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_history DISABLE ROW LEVEL SECURITY;

-- Desabilitar RLS nas tabelas auxiliares (se existirem)
ALTER TABLE IF EXISTS progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_courses DISABLE ROW LEVEL SECURITY;

-- Verificar quais tabelas existem
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('courses', 'modules', 'lessons') THEN '✅ PRINCIPAL'
    WHEN table_name IN ('plans', 'subscriptions', 'payment_history') THEN '💳 ASSINATURA'
    WHEN table_name IN ('certificates', 'certificate_templates') THEN '📜 CERTIFICADO'
    ELSE '📦 OUTRAS'
  END as categoria
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN (
    'courses', 'modules', 'lessons', 
    'progress', 'certificates', 'certificate_templates',
    'plans', 'subscriptions', 'payment_history', 'user_courses'
  )
ORDER BY categoria, table_name;
