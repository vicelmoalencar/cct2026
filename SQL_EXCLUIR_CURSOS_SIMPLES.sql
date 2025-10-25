-- ============================================
-- EXCLUIR CURSOS 1, 2, 3, 12 - VERSÃO SIMPLES
-- ============================================

-- ⚠️ ATENÇÃO: Operação irreversível!

-- 1. Excluir aulas
DELETE FROM lessons 
WHERE module_id IN (
  SELECT id FROM modules WHERE course_id IN (1, 2, 3, 12)
);

-- 2. Excluir módulos
DELETE FROM modules WHERE course_id IN (1, 2, 3, 12);

-- 3. Excluir cursos
DELETE FROM courses WHERE id IN (1, 2, 3, 12);

-- Verificar resultado
SELECT 'Exclusão concluída!' as status;
