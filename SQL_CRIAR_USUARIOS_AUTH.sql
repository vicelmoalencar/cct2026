-- ============================================================================
-- SQL: Criar Usuários no Supabase Auth a partir da Tabela Certificates
-- ============================================================================
-- ATENÇÃO: Este script deve ser executado no SQL Editor do Supabase
-- Ele cria contas de autenticação para todos os usuários únicos da tabela certificates
-- ============================================================================

-- ============================================================================
-- OPÇÃO 1: Usando auth.users (Recomendada - API Nativa do Supabase)
-- ============================================================================
-- IMPORTANTE: Este script usa a extensão pgcrypto para gerar senhas
-- As senhas serão definidas como "123456" temporariamente
-- Os usuários devem alterar a senha no primeiro login
-- ============================================================================

-- 1. Habilitar extensão pgcrypto (necessária para crypt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Criar função para gerar UUID v4 (se não existir)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Script para criar usuários no auth.users
DO $$
DECLARE
  cert_record RECORD;
  new_user_id UUID;
  password_hash TEXT;
  user_count INTEGER := 0;
  skip_count INTEGER := 0;
BEGIN
  -- Senha padrão temporária
  password_hash := crypt('123456', gen_salt('bf'));
  
  -- Log início
  RAISE NOTICE '🚀 Iniciando criação de usuários...';
  RAISE NOTICE '📧 Senha padrão: 123456 (usuários devem alterar)';
  RAISE NOTICE '';
  
  -- Loop pelos emails únicos da tabela certificates
  FOR cert_record IN 
    SELECT DISTINCT 
      user_email,
      user_name
    FROM certificates
    WHERE user_email IS NOT NULL 
      AND user_email != ''
      AND user_email LIKE '%@%'
    ORDER BY user_email
  LOOP
    BEGIN
      -- Verificar se usuário já existe no auth.users
      IF EXISTS (
        SELECT 1 FROM auth.users 
        WHERE email = cert_record.user_email
      ) THEN
        skip_count := skip_count + 1;
        IF skip_count <= 10 THEN
          RAISE NOTICE '⏭️  Pulado (já existe): %', cert_record.user_email;
        END IF;
        CONTINUE;
      END IF;
      
      -- Gerar novo UUID para o usuário
      new_user_id := uuid_generate_v4();
      
      -- Inserir usuário no auth.users
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',  -- instance_id padrão
        new_user_id,
        'authenticated',
        'authenticated',
        cert_record.user_email,
        password_hash,
        NOW(),  -- Email já confirmado
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object(
          'full_name', COALESCE(cert_record.user_name, 'Aluno'),
          'name', COALESCE(cert_record.user_name, 'Aluno')
        ),
        NOW(),
        NOW(),
        '',
        ''
      );
      
      -- Criar identidade no auth.identities
      INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        uuid_generate_v4(),
        new_user_id,
        jsonb_build_object(
          'sub', new_user_id::text,
          'email', cert_record.user_email
        ),
        'email',
        NOW(),
        NOW(),
        NOW()
      );
      
      user_count := user_count + 1;
      
      -- Log progresso a cada 10 usuários
      IF user_count % 10 = 0 THEN
        RAISE NOTICE '✅ Criados: % usuários', user_count;
      END IF;
      
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '❌ Erro ao criar %: %', cert_record.user_email, SQLERRM;
    END;
  END LOOP;
  
  -- Log final
  RAISE NOTICE '';
  RAISE NOTICE '═══════════════════════════════════════';
  RAISE NOTICE '✅ Processo concluído!';
  RAISE NOTICE '📊 Usuários criados: %', user_count;
  RAISE NOTICE '⏭️  Usuários pulados (já existiam): %', skip_count;
  RAISE NOTICE '🔐 Senha padrão: 123456';
  RAISE NOTICE '⚠️  Usuários devem alterar senha no primeiro login';
  RAISE NOTICE '═══════════════════════════════════════';
  
END $$;

-- ============================================================================
-- OPÇÃO 2: Script Simplificado (Caso a Opção 1 dê erro de permissões)
-- ============================================================================
-- Este script apenas lista os emails que precisam ser criados
-- Você pode usar a API do Supabase para criar manualmente ou via código
-- ============================================================================

/*
-- Listar emails únicos para criar
SELECT 
  ROW_NUMBER() OVER (ORDER BY user_email) as num,
  user_email,
  user_name,
  COUNT(*) as total_certificados
FROM certificates
WHERE user_email IS NOT NULL 
  AND user_email != ''
  AND user_email LIKE '%@%'
  AND user_email NOT IN (
    SELECT email FROM auth.users
  )
GROUP BY user_email, user_name
ORDER BY user_email;
*/

-- ============================================================================
-- VERIFICAÇÃO: Conferir usuários criados
-- ============================================================================

-- Contar usuários criados
SELECT 
  'Usuários no Auth' as tipo,
  COUNT(*) as total
FROM auth.users
UNION ALL
SELECT 
  'Emails únicos em Certificates' as tipo,
  COUNT(DISTINCT user_email) as total
FROM certificates
WHERE user_email IS NOT NULL 
  AND user_email != ''
  AND user_email LIKE '%@%'
UNION ALL
SELECT 
  'Emails que já existem no Auth' as tipo,
  COUNT(DISTINCT c.user_email) as total
FROM certificates c
INNER JOIN auth.users u ON u.email = c.user_email
WHERE c.user_email IS NOT NULL 
  AND c.user_email != ''
  AND c.user_email LIKE '%@%';

-- ============================================================================
-- IMPORTANTE: NOTIFICAR USUÁRIOS
-- ============================================================================
-- Após executar este script, você deve:
-- 1. Enviar email para todos os usuários com suas credenciais
-- 2. Orientar a alteração de senha no primeiro login
-- 3. Considerar implementar reset de senha forçado
-- ============================================================================

-- Email template sugerido:
/*
Olá [Nome],

Sua conta foi criada no sistema CCT!

Email: [email]
Senha temporária: 123456

Por favor, faça login em [URL] e altere sua senha imediatamente.

Atenciosamente,
Equipe CCT
*/

-- ============================================================================
-- OPÇÃO 3: Criar apenas alguns usuários para teste
-- ============================================================================
-- Descomente e ajuste para testar com poucos usuários primeiro
-- ============================================================================

/*
DO $$
DECLARE
  cert_record RECORD;
  new_user_id UUID;
  password_hash TEXT;
  user_count INTEGER := 0;
BEGIN
  password_hash := crypt('123456', gen_salt('bf'));
  
  -- Apenas primeiros 5 usuários para teste
  FOR cert_record IN 
    SELECT DISTINCT 
      user_email,
      user_name
    FROM certificates
    WHERE user_email IS NOT NULL 
      AND user_email != ''
      AND user_email LIKE '%@%'
      AND user_email NOT IN (SELECT email FROM auth.users)
    ORDER BY user_email
    LIMIT 5
  LOOP
    new_user_id := uuid_generate_v4();
    
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id, 'authenticated', 'authenticated',
      cert_record.user_email, password_hash, NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', COALESCE(cert_record.user_name, 'Aluno')),
      NOW(), NOW(), '', ''
    );
    
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      uuid_generate_v4(), new_user_id,
      jsonb_build_object('sub', new_user_id::text, 'email', cert_record.user_email),
      'email', NOW(), NOW(), NOW()
    );
    
    user_count := user_count + 1;
    RAISE NOTICE '✅ Criado: %', cert_record.user_email;
  END LOOP;
  
  RAISE NOTICE 'Total criados: %', user_count;
END $$;
*/
