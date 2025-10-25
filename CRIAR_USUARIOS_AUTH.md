# 🔐 Criar Usuários no Supabase Auth a partir de Certificados

## 🎯 Objetivo

Criar contas de autenticação (login) para todos os usuários que possuem certificados emitidos, permitindo que eles façam login no sistema.

---

## 📊 Situação Atual

**Problema:**
- Tabela `certificates` tem ~170 certificados com emails de alunos
- Esses alunos **NÃO têm conta de login** no sistema
- Precisam criar contas manualmente para acessar o sistema

**Solução:**
- Criar contas automaticamente no **Supabase Auth** para todos os emails únicos
- Definir senha padrão temporária: `123456`
- Usuários alteram senha no primeiro login

---

## 🔄 Duas Opções Disponíveis

### **Opção 1: SQL Direto no Supabase** ⚡ (Mais Rápido)
- Execute SQL direto no SQL Editor do Supabase
- Cria todos os usuários de uma vez
- ⚠️ **Pode dar erro de permissões** dependendo do plano

**Arquivo:** `SQL_CRIAR_USUARIOS_AUTH.sql`

---

### **Opção 2: Script Node.js com API Admin** 🛡️ (Mais Seguro)
- Usa API Admin do Supabase
- Mais controle e logs detalhados
- Funciona em todos os planos

**Arquivo:** `criar_usuarios_auth_api.js`

---

## 🚀 OPÇÃO 1: SQL Direto (Recomendada para teste)

### **Passo 1: Abrir SQL Editor**

1. Acesse seu projeto no **Supabase Dashboard**
2. Vá em **SQL Editor**
3. Clique em **New query**

---

### **Passo 2: Testar com 5 Usuários Primeiro**

**Copie e cole este SQL:**

```sql
-- ============================================================================
-- TESTE: Criar 5 usuários para validar
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
DECLARE
  cert_record RECORD;
  new_user_id UUID;
  password_hash TEXT;
  user_count INTEGER := 0;
BEGIN
  -- Senha: 123456
  password_hash := crypt('123456', gen_salt('bf'));
  
  RAISE NOTICE '🧪 TESTE: Criando primeiros 5 usuários';
  RAISE NOTICE '';
  
  -- Apenas primeiros 5 usuários
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
    
    -- Criar usuário
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
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      cert_record.user_email,
      password_hash,
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('full_name', COALESCE(cert_record.user_name, 'Aluno')),
      NOW(),
      NOW(),
      '',
      ''
    );
    
    -- Criar identidade
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
      jsonb_build_object('sub', new_user_id::text, 'email', cert_record.user_email),
      'email',
      NOW(),
      NOW(),
      NOW()
    );
    
    user_count := user_count + 1;
    RAISE NOTICE '✅ Criado: % (Senha: 123456)', cert_record.user_email;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ Teste concluído! % usuários criados', user_count;
END $$;

-- Verificar usuários criados
SELECT 
  email,
  raw_user_meta_data->>'full_name' as nome,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

**Execute e teste o login** com um dos emails criados (senha: `123456`)

---

### **Passo 3: Criar TODOS os Usuários**

Se o teste funcionou, execute o script completo:

**Copie o conteúdo de:** `SQL_CRIAR_USUARIOS_AUTH.sql`

Ou use este SQL resumido:

```sql
-- ============================================================================
-- PRODUÇÃO: Criar TODOS os usuários
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
DECLARE
  cert_record RECORD;
  new_user_id UUID;
  password_hash TEXT;
  user_count INTEGER := 0;
  skip_count INTEGER := 0;
BEGIN
  password_hash := crypt('123456', gen_salt('bf'));
  
  RAISE NOTICE '🚀 Criando TODOS os usuários...';
  RAISE NOTICE '';
  
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
      -- Verificar se já existe
      IF EXISTS (SELECT 1 FROM auth.users WHERE email = cert_record.user_email) THEN
        skip_count := skip_count + 1;
        CONTINUE;
      END IF;
      
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
      
      IF user_count % 10 = 0 THEN
        RAISE NOTICE '✅ Criados: % usuários', user_count;
      END IF;
      
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE '❌ Erro: %', cert_record.user_email;
    END;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '✅ Concluído!';
  RAISE NOTICE '📊 Criados: %', user_count;
  RAISE NOTICE '⏭️  Pulados: %', skip_count;
END $$;
```

---

## 🚀 OPÇÃO 2: Script Node.js (Recomendada para produção)

### **Passo 1: Instalar Dependências**

```bash
cd /home/user/webapp
npm install @supabase/supabase-js
```

---

### **Passo 2: Configurar Variáveis de Ambiente**

**Onde encontrar Service Role Key:**

1. Acesse **Supabase Dashboard**
2. Vá em **Settings → API**
3. Em "Project API keys", copie a **`service_role`** key
4. ⚠️ **NÃO use a `anon` key!**

**Configure no terminal:**

```bash
export SUPABASE_URL="https://seu-projeto.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key-aqui"
```

---

### **Passo 3: Executar Script**

```bash
node criar_usuarios_auth_api.js
```

**Saída esperada:**

```
🚀 Iniciando criação de usuários...
📧 Senha padrão: 123456

📊 Buscando emails únicos da tabela certificates...
✅ Encontrados 95 emails únicos

🔍 Verificando usuários existentes...
✅ 0 usuários já existem no Auth

📝 95 usuários precisam ser criados

⏳ Criando usuários...

✅ Criado: aluno1@example.com
✅ Criado: aluno2@example.com
...
✅ Progresso: 50/95 criados
...

═══════════════════════════════════════
✅ Processo concluído!
📊 Resumo:
   ✅ Criados: 95
   ⏭️  Pulados: 0
   ❌ Erros: 0
   🔐 Senha padrão: 123456
⚠️  IMPORTANTE: Usuários devem alterar senha!
═══════════════════════════════════════
```

---

## 🔍 Verificação

### **SQL para verificar usuários criados:**

```sql
-- Total de usuários no Auth
SELECT COUNT(*) as total_auth
FROM auth.users;

-- Emails únicos em certificates
SELECT COUNT(DISTINCT user_email) as total_certificates
FROM certificates
WHERE user_email IS NOT NULL 
  AND user_email != ''
  AND user_email LIKE '%@%';

-- Emails que já têm conta
SELECT COUNT(DISTINCT c.user_email) as ja_tem_conta
FROM certificates c
INNER JOIN auth.users u ON u.email = c.user_email
WHERE c.user_email IS NOT NULL;

-- Listar últimos 10 usuários criados
SELECT 
  email,
  raw_user_meta_data->>'full_name' as nome,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;
```

---

## 📧 Notificar Usuários

### **Email Template Sugerido:**

```
Assunto: Sua conta foi criada no CCT

Olá [Nome],

Sua conta foi criada no sistema de Cursos CCT!

🔐 Credenciais de Acesso:
Email: [email]
Senha temporária: 123456

🌐 Fazer Login:
https://seu-sistema.com/login

⚠️ IMPORTANTE: 
Por questões de segurança, altere sua senha imediatamente após o primeiro login.

Atenciosamente,
Equipe CCT
```

---

## ⚙️ Configurar Senha Obrigatória no Primeiro Login

### **Opção A: Via Auth Policies**

```sql
-- Forçar usuários a atualizar senha
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"must_change_password": true}'::jsonb
WHERE encrypted_password = crypt('123456', encrypted_password);
```

### **Opção B: No Código Frontend**

```javascript
// Após login, verificar se precisa trocar senha
const { data: { user } } = await supabase.auth.getUser()

if (user?.user_metadata?.must_change_password) {
  // Redirecionar para página de troca de senha
  router.push('/change-password')
}
```

---

## 🛡️ Segurança

### **✅ Boas Práticas:**

1. **Senha Temporária Forte** (opcional):
   - Em vez de `123456`, gerar senhas aleatórias
   - Enviar por email individual

2. **Expiração de Senha**:
   - Senha temporária expira em 24h
   - Usuário precisa resetar se não usar

3. **Verificação de Email**:
   - Sistema já marca `email_confirmed_at = NOW()`
   - Usuários não precisam confirmar email

4. **Service Role Key**:
   - Nunca commit no git
   - Nunca expor no frontend
   - Usar apenas em scripts backend

---

## 📊 Resumo

| Item | Valor |
|------|-------|
| **Emails únicos em certificates** | ~95 |
| **Senha padrão** | 123456 |
| **Email confirmado** | ✅ Sim |
| **Podem fazer login** | ✅ Imediatamente |
| **Devem trocar senha** | ⚠️ Recomendado |

---

## ❓ Troubleshooting

### **Erro: "permission denied for table auth.users"**

**Causa:** Plano Supabase não permite INSERT direto em auth.users

**Solução:** Use a **Opção 2** (Script Node.js com API Admin)

---

### **Erro: "already registered"**

**Causa:** Email já tem conta no sistema

**Solução:** Usuário já pode fazer login (nada a fazer)

---

### **Erro: "invalid password hash"**

**Causa:** Extensão pgcrypto não está habilitada

**Solução:**
```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

---

## ✅ Checklist Final

- [ ] Executar script de criação (SQL ou Node.js)
- [ ] Verificar usuários criados com SQL de verificação
- [ ] Testar login com um usuário
- [ ] Enviar emails para usuários com credenciais
- [ ] Implementar troca de senha forçada (opcional)
- [ ] Documentar senhas em local seguro

---

**Pronto! Todos os alunos com certificados agora podem fazer login! 🎉**
