-- ============================================
-- LIMPAR TUDO - VERSÃO COM CASCADE
-- ============================================
-- Esta versão usa TRUNCATE com CASCADE
-- É mais rápida e garante limpeza completa
-- ⚠️ ATENÇÃO: Operação irreversível!

-- ============================================
-- VERIFICAR ANTES DE LIMPAR
-- ============================================
SELECT 
  'Cursos' as tabela, 
  COUNT(*) as total,
  CASE 
    WHEN COUNT(*) > 0 THEN '⚠️ SERÁ DELETADO'
    ELSE '✅ Já vazio'
  END as status
FROM courses
UNION ALL
SELECT 
  'Módulos' as tabela, 
  COUNT(*) as total,
  CASE 
    WHEN COUNT(*) > 0 THEN '⚠️ SERÁ DELETADO'
    ELSE '✅ Já vazio'
  END as status
FROM modules
UNION ALL
SELECT 
  'Aulas' as tabela, 
  COUNT(*) as total,
  CASE 
    WHEN COUNT(*) > 0 THEN '⚠️ SERÁ DELETADO'
    ELSE '✅ Já vazio'
  END as status
FROM lessons;

-- ============================================
-- OPÇÃO 1: TRUNCATE (MAIS RÁPIDO)
-- ============================================
-- Limpa todas as tabelas e reseta IDs automaticamente

TRUNCATE TABLE lessons, modules, courses RESTART IDENTITY CASCADE;

-- Limpar tabelas relacionadas (se existirem)
TRUNCATE TABLE comments RESTART IDENTITY CASCADE;
TRUNCATE TABLE progress RESTART IDENTITY CASCADE;
TRUNCATE TABLE certificates RESTART IDENTITY CASCADE;
TRUNCATE TABLE certificate_templates RESTART IDENTITY CASCADE;

-- ============================================
-- OPÇÃO 2: DELETE (MAIS SEGURO)
-- ============================================
-- Use esta opção se TRUNCATE der erro

-- DELETE FROM comments;
-- DELETE FROM progress;
-- DELETE FROM certificates;
-- DELETE FROM certificate_templates;
-- DELETE FROM lessons;
-- DELETE FROM modules;
-- DELETE FROM courses;

-- ALTER SEQUENCE courses_id_seq RESTART WITH 1;
-- ALTER SEQUENCE modules_id_seq RESTART WITH 1;
-- ALTER SEQUENCE lessons_id_seq RESTART WITH 1;
-- ALTER SEQUENCE comments_id_seq RESTART WITH 1;
-- ALTER SEQUENCE progress_id_seq RESTART WITH 1;
-- ALTER SEQUENCE certificates_id_seq RESTART WITH 1;
-- ALTER SEQUENCE certificate_templates_id_seq RESTART WITH 1;

-- ============================================
-- VERIFICAR APÓS LIMPEZA
-- ============================================
SELECT 
  'Cursos' as tabela, 
  COUNT(*) as restantes
FROM courses
UNION ALL
SELECT 
  'Módulos' as tabela, 
  COUNT(*) as restantes
FROM modules
UNION ALL
SELECT 
  'Aulas' as tabela, 
  COUNT(*) as restantes
FROM lessons
UNION ALL
SELECT 
  'Comentários' as tabela, 
  COUNT(*) as restantes
FROM comments;

-- Todos devem estar em 0 ✅

-- ============================================
-- VERIFICAR SEQUÊNCIAS (IDs resetados)
-- ============================================
SELECT 
  sequence_name,
  last_value
FROM information_schema.sequences
WHERE sequence_name IN (
  'courses_id_seq',
  'modules_id_seq', 
  'lessons_id_seq',
  'comments_id_seq'
)
ORDER BY sequence_name;

-- last_value deve ser 1 para todas ✅
