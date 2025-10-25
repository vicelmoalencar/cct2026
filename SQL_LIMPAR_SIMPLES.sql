-- ============================================
-- LIMPAR TUDO - VERSÃO SIMPLES E RÁPIDA
-- ============================================
-- ⚠️ ATENÇÃO: Operação irreversível!
-- ⚠️ Faça backup antes!

-- 1. Limpar dados relacionados (opcional - se as tabelas existirem)
DELETE FROM progress;
DELETE FROM comments;
DELETE FROM certificates;
DELETE FROM certificate_templates;

-- 2. Excluir aulas, módulos e cursos
DELETE FROM lessons;
DELETE FROM modules;
DELETE FROM courses;

-- 3. Resetar IDs (começar do 1)
ALTER SEQUENCE courses_id_seq RESTART WITH 1;
ALTER SEQUENCE modules_id_seq RESTART WITH 1;
ALTER SEQUENCE lessons_id_seq RESTART WITH 1;

-- Verificar resultado
SELECT 'Limpeza concluída!' as status,
       (SELECT COUNT(*) FROM courses) as cursos,
       (SELECT COUNT(*) FROM modules) as modulos,
       (SELECT COUNT(*) FROM lessons) as aulas;

-- Todos devem estar em 0 ✅
