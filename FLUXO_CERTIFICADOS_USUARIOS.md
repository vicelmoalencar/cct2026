# 🔄 Fluxo Completo: Usuários e Certificados

## 📋 3 Cenários de Usuários

### **Cenário 1: Usuário COM certificado + COM conta** ✅

**Exemplo:** antoniovicelmo@gmail.com

**Situação Atual:**
```
┌─────────────────────────┐       ┌─────────────────────────┐
│  auth.users             │       │  certificates           │
├─────────────────────────┤       ├─────────────────────────┤
│ email: antonio...       │ ◄───► │ user_email: antonio...  │
│ password: (hash)        │       │ course_title: PJECALC   │
│ created_at: 2025-01-01  │       │ verification_code: CCT  │
└─────────────────────────┘       └─────────────────────────┘
      ✅ Existe                         ✅ Existe
```

**Fluxo:**
1. 🔐 Login → Token JWT
2. 📜 Clica "Certificados"
3. 🔍 API busca: `WHERE user_email = 'antonio...'`
4. ✅ **Retorna 6 certificados**
5. 🎉 Usuário vê, baixa PDF, compartilha

**Ações necessárias:** ✅ Nenhuma! Sistema funciona.

---

### **Cenário 2: Usuário COM certificado + SEM conta** ⚠️

**Exemplo:** 89 outros usuários do certificados.csv

**Situação Atual:**
```
┌─────────────────────────┐       ┌─────────────────────────┐
│  auth.users             │       │  certificates           │
├─────────────────────────┤       ├─────────────────────────┤
│ (vazio)                 │   X   │ user_email: ricardo...  │
│                         │       │ course_title: PJECALC   │
│                         │       │ verification_code: CCT  │
└─────────────────────────┘       └─────────────────────────┘
      ❌ NÃO existe                    ✅ Existe
```

**Problema:** Usuário não consegue fazer login!

**Solução A: Criar contas em massa (Recomendado)**

```sql
-- Execute no Supabase SQL Editor
-- Arquivo: SQL_CRIAR_USUARIOS_AUTH.sql

-- Cria contas para TODOS os usuários únicos de certificates
-- Senha padrão: 123456
-- Email pré-confirmado (não precisa verificar)
```

**Resultado:**
```
┌─────────────────────────┐       ┌─────────────────────────┐
│  auth.users             │       │  certificates           │
├─────────────────────────┤       ├─────────────────────────┤
│ email: ricardo...       │ ◄───► │ user_email: ricardo...  │
│ password: 123456 (hash) │       │ course_title: PJECALC   │
│ created_at: 2025-10-25  │       │ verification_code: CCT  │
└─────────────────────────┘       └─────────────────────────┘
      ✅ Criada agora!                 ✅ Já existia
```

**Depois da criação:**
1. 📧 Notificar usuário via email (opcional)
2. 🔐 Usuário faz login (email + senha: 123456)
3. 🔄 Usuário troca senha (opcional: implementar "force change")
4. 📜 Clica "Certificados"
5. ✅ **Certificados aparecem automaticamente!**

**Ações necessárias:**
- ✅ Executar SQL de criação de usuários (1 vez)
- ✅ Enviar email com credenciais (opcional)
- ✅ Implementar troca de senha obrigatória (opcional)

---

**Solução B: Auto-registro (Self-service)**

Usuário acessa plataforma e se registra:

```
1. Clica "Registrar"
2. Preenche:
   - Nome: Ricardo Silva
   - Email: ricardo@example.com  ← DEVE SER EXATO!
   - Senha: minhasenha123
3. Sistema cria conta em auth.users
4. Faz login
5. Clica "Certificados"
6. ✅ Certificados aparecem (match por email)
```

**⚠️ IMPORTANTE:**
- Email deve ser **exatamente igual** ao da tabela certificates
- Case sensitive: `ricardo@example.com` ≠ `Ricardo@example.com`
- Domínio deve ser igual: `ricardo@gmail.com` ≠ `ricardo@outlook.com`

**Ações necessárias:**
- ✅ Nenhuma! Usuário faz tudo sozinho
- ⚠️ Risco: Usuário errar o email e não ver certificados

---

### **Cenário 3: Usuário NOVO sem certificados** 🆕

**Exemplo:** Alguém que nunca fez curso

**Situação Atual:**
```
┌─────────────────────────┐       ┌─────────────────────────┐
│  auth.users             │       │  certificates           │
├─────────────────────────┤       ├─────────────────────────┤
│ (vazio)                 │   X   │ (vazio)                 │
│                         │       │                         │
│                         │       │                         │
└─────────────────────────┘       └─────────────────────────┘
      ❌ NÃO existe                    ❌ NÃO existe
```

**Fluxo:**
1. 🆕 Usuário clica "Registrar"
2. 📝 Preenche: Nome, Email, Senha
3. ✅ Conta criada em auth.users
4. 🔐 Faz login
5. 📜 Clica "Certificados"
6. 📭 **Vê: "Nenhum certificado disponível"**

**Como terá certificados no futuro?**

#### **Opção A: Completar curso (Sistema automático)**

```
1. Usuário assiste aulas
2. Marca todas como "Concluída"
3. Atinge 100% de progresso
4. Sistema gera certificado automaticamente:
   - INSERT INTO certificates (user_email, course_title, ...)
   - verification_code gerado automaticamente
5. ✅ Certificado aparece na página "Certificados"
```

**⚠️ NOTA:** Esse sistema de conclusão automática precisa ser implementado!

#### **Opção B: Admin adiciona manualmente**

**Via Admin Panel:**
1. Admin acessa painel admin
2. Vai em "Certificados"
3. Clica "Adicionar Certificado"
4. Preenche:
   - Email: novo@example.com
   - Nome: João Silva
   - Curso: PJECALCPLUS
   - Carga horária: 60h
5. ✅ Certificado criado com código único
6. Usuário vê na próxima vez que acessar

**Via CSV Import:**
1. Admin prepara CSV:
   ```
   user_email;user_name;course_title;carga_horaria
   novo@example.com;João Silva;PJECALCPLUS;60
   ```
2. Importa via admin panel
3. ✅ Certificado criado automaticamente

---

## 🔍 Como o Sistema Identifica o Usuário?

### **Mecanismo de Matching:**

```typescript
// Endpoint: GET /api/my-certificates

async function getMyCertificates(c) {
  // 1. Extrair email do token JWT
  const user = c.get('user')  // Vem do middleware requireAuth
  const userEmail = user.email  // Ex: "antonio@gmail.com"
  
  // 2. Buscar certificados no banco
  const certificates = await supabase.query('certificates', {
    filters: { user_email: userEmail }  // Match EXATO por email
  })
  
  // 3. Retornar
  return c.json({ certificates })
}
```

**Matching = Comparação exata de strings:**
- `WHERE user_email = 'antonio@gmail.com'`
- **Case sensitive:** `antonio` ≠ `Antonio`
- **Domínio exato:** `gmail.com` ≠ `outlook.com`

---

## 📊 Tabela Resumo

| Cenário | Conta Auth | Certificados | O que o usuário vê? | Ação necessária |
|---------|------------|--------------|---------------------|-----------------|
| **1** | ✅ Existe | ✅ Existe | 🎉 Lista certificados | Nenhuma |
| **2A** | ❌ Não existe | ✅ Existe | 🔒 Não consegue login | Criar conta (SQL) |
| **2B** | ✅ Auto-registro | ✅ Existe | 🎉 Lista certificados | Usuário se registra |
| **3A** | ✅ Existe | ❌ Não existe | 📭 Mensagem "nenhum" | Completar curso |
| **3B** | ✅ Existe | ❌ Não existe | 📭 Mensagem "nenhum" | Admin adiciona |

---

## 🚀 Implementações Futuras (Opcional)

### **1. Geração Automática ao Completar Curso**

```typescript
// Quando usuário marca última aula como concluída
app.post('/api/progress/complete', requireAuth, async (c) => {
  const { lesson_id } = await c.req.json()
  const user = c.get('user')
  
  // Marcar aula como concluída
  await markLessonComplete(user.email, lesson_id)
  
  // Verificar se completou o curso
  const progress = await getCourseProgress(user.email, course_id)
  
  if (progress.percentage === 100) {
    // ✅ Gerar certificado automaticamente!
    await generateCertificate({
      user_email: user.email,
      user_name: user.user_metadata.name,
      course_id: course_id,
      course_title: course.title,
      verification_code: generateCode(),
      completion_date: new Date()
    })
    
    // 🎉 Mostrar popup de parabéns
    return c.json({ 
      completed: true, 
      certificateGenerated: true,
      message: '🎉 Parabéns! Você completou o curso e recebeu um certificado!'
    })
  }
})
```

---

### **2. Troca de Senha Obrigatória no Primeiro Login**

```typescript
// Middleware: requirePasswordChange
app.get('/profile', requireAuth, async (c) => {
  const user = c.get('user')
  
  // Verificar se senha nunca foi trocada
  const isDefaultPassword = user.user_metadata.password_changed === false
  
  if (isDefaultPassword) {
    // Redirecionar para página de troca de senha
    return c.redirect('/change-password?required=true')
  }
  
  // Continuar normalmente
  return renderProfilePage()
})
```

---

### **3. Notificação por Email**

```typescript
// Após criar contas em massa
async function notifyNewUsers() {
  const newUsers = await getRecentlyCreatedUsers()
  
  for (const user of newUsers) {
    await sendEmail({
      to: user.email,
      subject: '🎓 Seu certificado CCT 2026 está disponível!',
      body: `
        Olá ${user.name},
        
        Seu certificado do curso "${user.course}" está disponível!
        
        🔐 Credenciais de acesso:
        Email: ${user.email}
        Senha: 123456
        
        🌐 Acesse: https://ensinoplus-dev-cct2026.n697dr.easypanel.host
        
        ⚠️ Recomendamos trocar sua senha após o primeiro login.
        
        🔗 Código de verificação: ${user.verification_code}
        Verifique em: https://seu-dominio.com/verificar/${user.verification_code}
        
        Atenciosamente,
        CCT 2026
      `
    })
  }
}
```

---

## ✅ Checklist de Implementação

### **Para Usuários Existentes (Cenário 2):**
- [ ] Executar SQL_CRIAR_USUARIOS_AUTH.sql
- [ ] Verificar usuários criados no Supabase Auth
- [ ] (Opcional) Enviar emails com credenciais
- [ ] (Opcional) Implementar troca de senha obrigatória
- [ ] Testar login com um dos usuários criados
- [ ] Verificar se certificados aparecem

### **Para Usuários Novos (Cenário 3):**
- [ ] Sistema de registro já funciona (✅ Implementado)
- [ ] Mensagem "Nenhum certificado" aparece (✅ Implementado)
- [ ] (Futuro) Implementar geração automática ao completar curso
- [ ] (Futuro) Admin pode adicionar certificado manualmente
- [ ] (Futuro) Admin pode importar CSV com novos certificados

---

## 🎯 Recomendação Imediata

**Para os 89 usuários que já têm certificados:**

1. **Execute o SQL de criação de usuários:**
   ```bash
   # Arquivo: SQL_CRIAR_USUARIOS_AUTH.sql
   # Cria ~95 contas com senha: 123456
   ```

2. **(Opcional) Envie email para cada um:**
   ```
   Assunto: Acesse seus certificados CCT 2026
   
   Olá [Nome],
   
   Seus certificados estão disponíveis!
   
   Acesse: https://ensinoplus-dev-cct2026.n697dr.easypanel.host
   Email: [email]
   Senha: 123456
   
   Atenciosamente,
   CCT 2026
   ```

3. **Resultado:**
   - ✅ Todos conseguem fazer login
   - ✅ Todos veem seus certificados automaticamente
   - ✅ Sistema funciona perfeitamente!

---

**Pronto! Sistema completo e escalável.** 🎉

**Qualquer novo usuário que se registrar:**
- Se tiver certificado na tabela → Aparece automaticamente
- Se não tiver → Vê mensagem "nenhum disponível"
- No futuro → Receberá ao completar cursos

**Tudo baseado no match de email!** 📧
