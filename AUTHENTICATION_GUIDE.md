# 🔐 Guia de Autenticação - CCT

## Testando o Sistema de Autenticação

### 🌐 URL de Teste
https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai

---

## 📝 Como Testar

### 1️⃣ Primeiro Acesso (Registro)

1. **Acesse a URL** acima
2. Você verá a tela de login/registro
3. **Clique na aba "Registrar"**
4. Preencha os campos:
   - **Nome**: Seu nome completo
   - **Email**: Qualquer email válido (ex: `vicelmo@teste.com`)
   - **Senha**: Mínimo 6 caracteres (ex: `senha123`)
5. Clique em **"Criar Conta"**
6. Aguarde a mensagem de sucesso
7. A tela irá automaticamente para a aba "Entrar"

### 2️⃣ Login

1. Na aba **"Entrar"**
2. Digite o **email** e **senha** que você acabou de criar
3. Clique em **"Entrar"**
4. Você será redirecionado para a plataforma de cursos

### 3️⃣ Navegando Autenticado

Agora você está logado e pode:
- ✅ Ver todos os cursos
- ✅ Acessar módulos e aulas
- ✅ Marcar aulas como concluídas
- ✅ Adicionar comentários
- ✅ Ver seu nome no header (canto superior direito)

### 4️⃣ Logout

1. Clique no botão **"Sair"** (vermelho) no canto superior direito
2. Você será deslogado e redirecionado para a tela de login

---

## 🧪 Testes de API (cURL)

### Registrar Usuário
```bash
curl -X POST https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "senha123",
    "name": "Usuário Teste"
  }'
```

**Resposta esperada**:
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to confirm.",
  "user": {
    "id": "...",
    "email": "teste@email.com",
    "user_metadata": {
      "name": "Usuário Teste"
    }
  }
}
```

### Login
```bash
curl -X POST https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "password": "senha123"
  }' \
  -c cookies.txt
```

**Resposta esperada**:
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "teste@email.com",
    "user_metadata": {
      "name": "Usuário Teste"
    }
  }
}
```

### Verificar Sessão
```bash
curl https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/api/auth/me \
  -b cookies.txt
```

**Resposta esperada** (logado):
```json
{
  "user": {
    "id": "...",
    "email": "teste@email.com",
    "user_metadata": {
      "name": "Usuário Teste"
    }
  }
}
```

**Resposta esperada** (não logado):
```json
{
  "user": null
}
```

### Logout
```bash
curl -X POST https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/api/auth/logout \
  -b cookies.txt
```

**Resposta esperada**:
```json
{
  "success": true
}
```

---

## 🔒 Segurança Implementada

- ✅ **Cookies HTTP-only**: Os tokens não podem ser acessados via JavaScript
- ✅ **Cookies Secure**: Funcionam apenas em HTTPS
- ✅ **SameSite**: Proteção contra CSRF
- ✅ **Validação no servidor**: Todos os tokens são validados pelo Supabase
- ✅ **Senha hash**: Senhas são armazenadas com bcrypt no Supabase
- ✅ **Proteção de rotas**: Usuários não autenticados veem apenas a tela de login

---

## 🎯 Fluxo Completo de Autenticação

```
┌──────────────┐
│ Usuário      │
│ acessa site  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐       ┌──────────────┐
│ Frontend verifica│──────▶│ GET /api/    │
│ se está logado   │       │ auth/me      │
└──────┬───────────┘       └──────┬───────┘
       │                          │
       │                          ▼
       │                   ┌──────────────┐
       │                   │ Supabase     │
       │                   │ valida token │
       │                   └──────┬───────┘
       │                          │
       ▼                          ▼
┌──────────────┐           ┌──────────────┐
│ user = null  │           │ user = {...} │
│ Mostra login │           │ Mostra app   │
└──────────────┘           └──────────────┘
```

---

## 🚀 Próximos Passos

### Para Implementar em Produção:

1. **Configure os secrets no Cloudflare Pages**:
   ```bash
   npx wrangler pages secret put SUPABASE_URL
   # Cole: https://ghdfouqzasvxlptbjkin.supabase.co
   
   npx wrangler pages secret put SUPABASE_ANON_KEY
   # Cole: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. **Configure confirmação de email no Supabase**:
   - Acesse o dashboard do Supabase
   - Vá em Authentication > Settings
   - Configure o template de email
   - Habilite "Confirm email"

3. **Configure recuperação de senha**:
   - No Supabase Dashboard
   - Authentication > Settings
   - Configure o template de "Reset Password"

4. **Adicione OAuth (opcional)**:
   - Google, GitHub, etc.
   - Configure no Supabase Dashboard
   - Adicione os providers no frontend

---

## 📞 Suporte

Se tiver qualquer dúvida ou problema, verifique:
1. Os logs do PM2: `pm2 logs cct-clube-calculo --nostream`
2. O console do navegador (F12)
3. A documentação do Supabase: https://supabase.com/docs/guides/auth

---

**Desenvolvido para**: Vicelmo  
**Data**: 23 de Outubro de 2025
