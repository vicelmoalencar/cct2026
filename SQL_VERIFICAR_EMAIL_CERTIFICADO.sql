-- ============================================================================
-- SQL para Verificar Certificados de um Email Específico
-- ============================================================================

-- 1. Verificar se o email tem certificados
SELECT 
  id,
  user_email,
  user_name,
  course_title,
  carga_horaria,
  verification_code,
  completion_date,
  created_at
FROM certificates 
WHERE user_email = 'antoniovicelmo@gmail.com';

-- 2. Verificar emails similares (caso haja variação)
SELECT 
  user_email,
  COUNT(*) as total_certificados
FROM certificates 
WHERE LOWER(user_email) LIKE '%vicelmo%'
GROUP BY user_email
ORDER BY total_certificados DESC;

-- 3. Listar TODOS os emails na tabela de certificados
SELECT 
  user_email,
  user_name,
  COUNT(*) as total_certificados
FROM certificates 
GROUP BY user_email, user_name
ORDER BY user_email;

-- 4. Verificar total de certificados na tabela
SELECT COUNT(*) as total_certificados FROM certificates;

-- 5. Verificar se coluna verification_code existe e está preenchida
SELECT 
  COUNT(*) as total,
  COUNT(verification_code) as com_codigo,
  COUNT(*) - COUNT(verification_code) as sem_codigo
FROM certificates;

-- ============================================================================
-- DIAGNÓSTICO: Execute cada query acima no Supabase SQL Editor
-- ============================================================================

-- Se não aparecer nada na query 1, mas aparecer na query 2:
-- O email está com grafia diferente (maiúsculas, espaços, etc)

-- Se não aparecer nada em nenhuma query:
-- Os certificados não foram importados ainda

-- SOLUÇÃO: Importar certificados via Admin Panel
-- Admin Panel → Certificados → Importar CSV
