# 🔧 Configuração do Supabase

## ⚠️ IMPORTANTE: Configure a URL de Redirecionamento

Para que a confirmação de email funcione corretamente, você precisa configurar a URL de redirecionamento no Supabase.

---

## 📝 Passo a Passo

### 1️⃣ Acesse o Dashboard do Supabase

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione o projeto: `ghdfouqzasvxlptbjkin`

### 2️⃣ Configure a URL de Redirecionamento

1. No menu lateral, clique em **Authentication** (🔐)
2. Clique em **URL Configuration**
3. Encontre a seção **"Redirect URLs"**

### 3️⃣ Adicione as URLs

Adicione as seguintes URLs permitidas:

#### Para Desenvolvimento (Sandbox):
```
https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/auth/callback
https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai
```

#### Para Produção (quando fizer deploy):
```
https://seu-dominio.pages.dev/auth/callback
https://seu-dominio.pages.dev
```

### 4️⃣ Configure o Site URL

Na mesma tela, encontre **"Site URL"**:

#### Para Desenvolvimento:
```
https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai
```

#### Para Produção:
```
https://seu-dominio.pages.dev
```

### 5️⃣ Salve as Configurações

Clique em **Save** no final da página.

---

## 🧪 Testando a Confirmação de Email

Depois de configurar as URLs:

1. **Registre um novo usuário** no site
2. **Verifique seu email** - você receberá um email do Supabase
3. **Clique no link de confirmação** no email
4. Você será redirecionado para: `https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/auth/callback`
5. O sistema processará o token automaticamente
6. Você será logado automaticamente

---

## 🔄 Se Você Já Tem um Link de Confirmação

Se você já recebeu um email e o link está apontando para `localhost:3000`, você tem duas opções:

### Opção 1: Usar a URL Diretamente (Solução Rápida)

Copie o token da URL que você recebeu e cole no navegador trocando o domínio:

**URL que você recebeu:**
```
http://localhost:3000/#access_token=SEU_TOKEN_AQUI&...
```

**URL corrigida (use esta):**
```
https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/#access_token=SEU_TOKEN_AQUI&...
```

### Opção 2: Registrar Novamente

1. Configure as URLs no Supabase (passos acima)
2. Registre um novo usuário com outro email
3. O novo link já virá com a URL correta

---

## 📧 Configurações Adicionais de Email (Opcional)

### Desabilitar Confirmação de Email (Para Testes)

Se você quiser testar sem confirmação de email:

1. No Supabase Dashboard, vá em **Authentication**
2. Clique em **Providers**
3. Clique em **Email**
4. **Desmarque** a opção **"Confirm email"**
5. Salve

⚠️ **Atenção**: Isso permite que qualquer email seja usado sem confirmação. Use apenas para desenvolvimento!

### Personalizar Template de Email

1. No Supabase Dashboard, vá em **Authentication**
2. Clique em **Email Templates**
3. Selecione **"Confirm signup"**
4. Personalize o template conforme necessário
5. A variável `{{ .ConfirmationURL }}` contém o link de confirmação

---

## ✅ Verificação

Depois de configurar, teste:

1. ✅ Registre um novo usuário
2. ✅ Receba o email de confirmação
3. ✅ Clique no link do email
4. ✅ Seja redirecionado para o site
5. ✅ Esteja logado automaticamente

---

## 🆘 Problemas Comuns

### "Link inválido" ou "Token expirado"

- **Causa**: O token expira em 1 hora
- **Solução**: Registre novamente ou peça um novo email de confirmação

### Redirecionamento para localhost

- **Causa**: URL de redirecionamento não configurada
- **Solução**: Configure as URLs no Supabase (passo 2)

### Email não chegou

- **Causa**: Email pode estar no spam ou Supabase tem rate limit
- **Solução**: 
  - Verifique a pasta de spam
  - Aguarde 1 minuto entre tentativas
  - Desabilite confirmação de email (para testes)

---

## 📚 Documentação Oficial

- [Supabase Auth Configuration](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

---

**Desenvolvido para**: Vicelmo  
**Projeto**: CCT - Clube do Cálculo Trabalhista  
**Data**: 23 de Outubro de 2025
