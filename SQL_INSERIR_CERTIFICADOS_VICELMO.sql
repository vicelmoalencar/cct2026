-- ============================================================================
-- SQL para Inserir Certificados de antoniovicelmo@gmail.com
-- ============================================================================
-- IMPORTANTE: Execute este script no Supabase SQL Editor
-- ANTES de executar, certifique-se que a migration 0013 foi aplicada!
-- ============================================================================

-- Verificar se a função generate_verification_code() existe
-- (Se não existir, execute primeiro: migrations/0013_certificates_verification_system.sql)

-- Inserir os 6 certificados de Vicelmo Alencar
INSERT INTO certificates (
  user_email, 
  user_name, 
  course_title, 
  carga_horaria, 
  completion_date, 
  issued_at, 
  verification_code,
  is_verified
) VALUES 
  (
    'antoniovicelmo@gmail.com',
    'Vicelmo Alencar',
    'PJECALCPLUS',
    60,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    generate_verification_code(),
    TRUE
  ),
  (
    'antoniovicelmo@gmail.com',
    'Vicelmo Alencar',
    'MINICURSO TRT21',
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    generate_verification_code(),
    TRUE
  ),
  (
    'antoniovicelmo@gmail.com',
    'Vicelmo Alencar',
    'Verba por verba',
    20,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    generate_verification_code(),
    TRUE
  ),
  (
    'antoniovicelmo@gmail.com',
    'Vicelmo Alencar',
    'PERÍCIA CONTÁBIL',
    8,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    generate_verification_code(),
    TRUE
  ),
  (
    'antoniovicelmo@gmail.com',
    'Vicelmo Alencar',
    'SIMULAÇÃO AVANÇADA',
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    generate_verification_code(),
    TRUE
  ),
  (
    'antoniovicelmo@gmail.com',
    'Vicelmo Alencar',
    'Curso Pje-Calc Iniciantes - 2024',
    20,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    generate_verification_code(),
    TRUE
  )
ON CONFLICT (user_email, course_title) DO NOTHING;

-- Verificar se foram inseridos
SELECT 
  id,
  user_email,
  user_name,
  course_title,
  carga_horaria,
  verification_code,
  created_at
FROM certificates 
WHERE user_email = 'antoniovicelmo@gmail.com'
ORDER BY created_at DESC;

-- ============================================================================
-- RESULTADO ESPERADO: 6 certificados para antoniovicelmo@gmail.com
-- ============================================================================

-- Após executar, faça logout e login novamente na plataforma
-- Depois clique no botão "Certificados" (amarelo) no header
