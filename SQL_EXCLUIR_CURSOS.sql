-- ============================================
-- EXCLUIR CURSOS ESPECÍFICOS COM MÓDULOS E AULAS
-- ============================================
-- Este SQL exclui os cursos com IDs 1, 2, 3, 12
-- e todos os módulos e aulas relacionados

-- ⚠️ ATENÇÃO: Esta operação não pode ser desfeita!
-- ⚠️ Faça backup antes de executar se tiver dúvidas

-- ============================================
-- PASSO 1: VERIFICAR O QUE SERÁ EXCLUÍDO
-- ============================================
-- Execute primeiro para ver o que será deletado:

SELECT 
  'CURSO' as tipo,
  c.id,
  c.title as titulo,
  COUNT(DISTINCT m.id) as total_modulos,
  COUNT(l.id) as total_aulas
FROM courses c
LEFT JOIN modules m ON m.course_id = c.id
LEFT JOIN lessons l ON l.module_id = m.id
WHERE c.id IN (1, 2, 3, 12)
GROUP BY c.id, c.title
ORDER BY c.id;

-- ============================================
-- PASSO 2: EXCLUIR AULAS
-- ============================================
-- Excluir todas as aulas dos módulos desses cursos

DELETE FROM lessons 
WHERE module_id IN (
  SELECT id FROM modules 
  WHERE course_id IN (1, 2, 3, 12)
);

-- ============================================
-- PASSO 3: EXCLUIR MÓDULOS
-- ============================================
-- Excluir todos os módulos desses cursos

DELETE FROM modules 
WHERE course_id IN (1, 2, 3, 12);

-- ============================================
-- PASSO 4: EXCLUIR CURSOS
-- ============================================
-- Excluir os cursos

DELETE FROM courses 
WHERE id IN (1, 2, 3, 12);

-- ============================================
-- PASSO 5: VERIFICAR EXCLUSÃO
-- ============================================
-- Verificar se os cursos foram excluídos:

SELECT 
  c.id,
  c.title,
  COUNT(m.id) as modulos_restantes,
  COUNT(l.id) as aulas_restantes
FROM courses c
LEFT JOIN modules m ON m.course_id = c.id
LEFT JOIN lessons l ON l.module_id = m.id
WHERE c.id IN (1, 2, 3, 12)
GROUP BY c.id, c.title;

-- Se retornar 0 linhas, significa que foram excluídos com sucesso! ✅

-- ============================================
-- VERIFICAR CURSOS RESTANTES
-- ============================================

SELECT 
  c.id,
  c.title,
  COUNT(DISTINCT m.id) as total_modulos,
  COUNT(l.id) as total_aulas
FROM courses c
LEFT JOIN modules m ON m.course_id = c.id
LEFT JOIN lessons l ON l.module_id = m.id
GROUP BY c.id, c.title
ORDER BY c.id;
