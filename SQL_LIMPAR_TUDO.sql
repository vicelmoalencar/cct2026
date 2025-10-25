-- ============================================
-- LIMPAR TODOS OS CURSOS, MÓDULOS E AULAS
-- ============================================
-- ⚠️⚠️⚠️ ATENÇÃO: ESTA OPERAÇÃO É IRREVERSÍVEL! ⚠️⚠️⚠️
-- ⚠️⚠️⚠️ TODOS OS DADOS SERÃO PERDIDOS! ⚠️⚠️⚠️
-- 
-- Use apenas se tiver certeza absoluta!
-- Faça BACKUP antes de executar!

-- ============================================
-- PASSO 1: VERIFICAR O QUE SERÁ EXCLUÍDO
-- ============================================
-- Execute primeiro para ver quantos registros serão deletados:

SELECT 
  'CURSOS' as tipo,
  COUNT(*) as total
FROM courses
UNION ALL
SELECT 
  'MÓDULOS' as tipo,
  COUNT(*) as total
FROM modules
UNION ALL
SELECT 
  'AULAS' as tipo,
  COUNT(*) as total
FROM lessons;

-- ============================================
-- PASSO 2: LIMPAR DADOS RELACIONADOS (OPCIONAL)
-- ============================================
-- Limpar progresso dos usuários
DELETE FROM progress;

-- Limpar comentários
DELETE FROM comments;

-- Limpar certificados emitidos
DELETE FROM certificates;

-- Limpar templates de certificados
DELETE FROM certificate_templates;

-- ============================================
-- PASSO 3: EXCLUIR TODAS AS AULAS
-- ============================================
DELETE FROM lessons;

-- Verificar
SELECT COUNT(*) as aulas_restantes FROM lessons;
-- Deve retornar 0

-- ============================================
-- PASSO 4: EXCLUIR TODOS OS MÓDULOS
-- ============================================
DELETE FROM modules;

-- Verificar
SELECT COUNT(*) as modulos_restantes FROM modules;
-- Deve retornar 0

-- ============================================
-- PASSO 5: EXCLUIR TODOS OS CURSOS
-- ============================================
DELETE FROM courses;

-- Verificar
SELECT COUNT(*) as cursos_restantes FROM courses;
-- Deve retornar 0

-- ============================================
-- PASSO 6: RESETAR SEQUÊNCIAS (AUTO INCREMENT)
-- ============================================
-- Resetar IDs para começar do 1 novamente

ALTER SEQUENCE courses_id_seq RESTART WITH 1;
ALTER SEQUENCE modules_id_seq RESTART WITH 1;
ALTER SEQUENCE lessons_id_seq RESTART WITH 1;

-- Se as tabelas relacionadas também foram limpas:
ALTER SEQUENCE progress_id_seq RESTART WITH 1;
ALTER SEQUENCE comments_id_seq RESTART WITH 1;
ALTER SEQUENCE certificates_id_seq RESTART WITH 1;
ALTER SEQUENCE certificate_templates_id_seq RESTART WITH 1;

-- ============================================
-- PASSO 7: VERIFICAÇÃO FINAL
-- ============================================
SELECT 
  'CURSOS' as tabela,
  COUNT(*) as registros_restantes
FROM courses
UNION ALL
SELECT 
  'MÓDULOS' as tabela,
  COUNT(*) as registros_restantes
FROM modules
UNION ALL
SELECT 
  'AULAS' as tabela,
  COUNT(*) as registros_restantes
FROM lessons;

-- Todos devem retornar 0! ✅

-- ============================================
-- MENSAGEM FINAL
-- ============================================
SELECT '✅ Banco de dados limpo com sucesso!' as status,
       'Pronto para nova importação' as proxima_etapa;
