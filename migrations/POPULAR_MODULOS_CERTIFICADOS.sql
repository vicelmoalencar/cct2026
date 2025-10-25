-- ============================================================================
-- Script para popular campo course_modules nos certificados existentes
-- ============================================================================
-- Data: 2025-01-25
-- Descrição: Busca módulos dos cursos e armazena no campo course_modules
-- ============================================================================

-- PASSO 1: Verificar certificados SEM módulos e COM course_id
SELECT 
  id,
  user_name,
  course_title,
  course_id,
  course_modules
FROM certificates
WHERE course_id IS NOT NULL
  AND (course_modules IS NULL OR course_modules = '');

-- PASSO 2: UPDATE individual (TESTE) - Atualizar um certificado
-- Substitua o ID pelo ID real de um certificado
/*
DO $$
DECLARE
  cert_id INTEGER := 1;  -- SUBSTITUA PELO ID REAL
  course_id_val INTEGER;
  modules_json TEXT;
BEGIN
  -- Buscar course_id do certificado
  SELECT course_id INTO course_id_val
  FROM certificates
  WHERE id = cert_id;
  
  -- Buscar módulos e gerar JSON
  SELECT json_agg(
    json_build_object(
      'title', m.title,
      'order', m.order_index
    ) ORDER BY m.order_index
  )::TEXT INTO modules_json
  FROM modules m
  WHERE m.course_id = course_id_val;
  
  -- Atualizar certificado
  IF modules_json IS NOT NULL THEN
    UPDATE certificates
    SET course_modules = modules_json
    WHERE id = cert_id;
    
    RAISE NOTICE 'Certificado % atualizado com % módulos', cert_id, 
      (SELECT COUNT(*) FROM modules WHERE course_id = course_id_val);
  ELSE
    RAISE NOTICE 'Certificado % não tem módulos no curso %', cert_id, course_id_val;
  END IF;
END $$;
*/

-- PASSO 3: UPDATE em LOTE - Atualizar TODOS os certificados
-- Este comando atualiza todos os certificados que têm course_id mas não têm course_modules
UPDATE certificates c
SET course_modules = (
  SELECT json_agg(
    json_build_object(
      'title', m.title,
      'order', m.order_index
    ) ORDER BY m.order_index
  )::TEXT
  FROM modules m
  WHERE m.course_id = c.course_id
)
WHERE c.course_id IS NOT NULL
  AND (c.course_modules IS NULL OR c.course_modules = '')
  AND EXISTS (
    SELECT 1 FROM modules m WHERE m.course_id = c.course_id
  );

-- PASSO 4: Verificar resultado
SELECT 
  id,
  user_name,
  course_title,
  course_id,
  CASE 
    WHEN course_modules IS NULL THEN 'SEM MÓDULOS'
    WHEN course_modules = '' THEN 'VAZIO'
    ELSE (
      SELECT COUNT(*)::TEXT || ' módulos'
      FROM json_array_elements(course_modules::json)
    )
  END as modulos_status
FROM certificates
WHERE course_id IS NOT NULL
ORDER BY id DESC
LIMIT 20;

-- PASSO 5: Ver exemplo de certificado com módulos
SELECT 
  id,
  user_name,
  course_title,
  course_modules
FROM certificates
WHERE course_modules IS NOT NULL
  AND course_modules != ''
LIMIT 1;

-- PASSO 6: Contar certificados por status de módulos
SELECT 
  CASE 
    WHEN course_id IS NULL THEN 'Sem course_id'
    WHEN course_modules IS NULL OR course_modules = '' THEN 'Sem módulos populados'
    ELSE 'Com módulos populados'
  END as status,
  COUNT(*) as quantidade
FROM certificates
GROUP BY 
  CASE 
    WHEN course_id IS NULL THEN 'Sem course_id'
    WHEN course_modules IS NULL OR course_modules = '' THEN 'Sem módulos populados'
    ELSE 'Com módulos populados'
  END;

-- ============================================================================
-- OBSERVAÇÕES:
-- ============================================================================
-- 1. Execute o PASSO 1 para ver quantos certificados precisam ser atualizados
-- 2. Execute o PASSO 2 (descomente) para testar com UM certificado
-- 3. Execute o PASSO 3 para atualizar TODOS em lote
-- 4. Execute os PASSOS 4, 5 e 6 para verificar o resultado
--
-- ATENÇÃO: Se course_id for NULL nos certificados, os módulos não podem
-- ser vinculados automaticamente. Nesse caso, será necessário:
-- - Atualizar course_id manualmente, ou
-- - Popular course_modules manualmente com JSON, ou
-- - Adicionar módulos via admin panel quando implementado
-- ============================================================================
