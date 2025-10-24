# 🔄 Migração para Supabase - Guia Completo

## 📋 Passo a Passo

### **Passo 1: Executar o Script SQL no Supabase** ✨

1. **Acesse o Supabase Dashboard**:
   ```
   https://supabase.com/dashboard/project/ghdfouqzasvxlptbjkin/sql/new
   ```

2. **Abra o arquivo** `supabase-schema.sql` que está na raiz do projeto

3. **Copie TODO o conteúdo** do arquivo

4. **Cole no SQL Editor** do Supabase

5. **Clique em "RUN"** (botão no canto inferior direito)

6. **Aguarde a execução** - deve mostrar "Success" ✅

---

### **Passo 2: Verificar se as Tabelas Foram Criadas**

No Supabase Dashboard:

1. Vá em **Table Editor** (ícone de tabela no menu lateral)
2. Você deve ver estas tabelas:
   - ✅ `admins`
   - ✅ `courses`
   - ✅ `modules`
   - ✅ `lessons`
   - ✅ `comments`
   - ✅ `user_progress`

---

### **Passo 3: Verificar os Dados de Exemplo**

1. Clique na tabela **`courses`**
2. Você deve ver 3 cursos:
   - Cálculos Trabalhistas Fundamentais
   - Cálculos de Rescisão
   - Perícias e Cálculos Complexos

3. Clique na tabela **`admins`**
4. Você deve ver seus 2 emails

---

### **Passo 4: Atualizar o Código da Aplicação**

⚠️ **IMPORTANTE**: Preciso atualizar o código do backend para usar Supabase ao invés de D1.

Arquivos que precisam ser modificados:
- `src/index.tsx` - Todas as rotas da API
- `wrangler.jsonc` - Remover configuração do D1

Vou fazer isso agora...

---

## ✅ O que Muda:

### **Antes (D1 - SQLite)**
```typescript
const { results } = await c.env.DB.prepare(`
  SELECT * FROM courses
`).all()
```

### **Depois (Supabase - PostgreSQL)**
```typescript
const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
const courses = await supabase.query('courses')
```

---

## 🎯 Vantagens do Supabase:

✅ **Banco de Dados em Produção** - Dados persistem permanentemente  
✅ **PostgreSQL Completo** - Mais poderoso que SQLite  
✅ **Row Level Security (RLS)** - Segurança nativa por linha  
✅ **Realtime** - Atualizações em tempo real (futuro)  
✅ **Dashboard Visual** - Veja e edite dados facilmente  
✅ **Backup Automático** - Supabase cuida dos backups  
✅ **Escalabilidade** - Suporta milhões de registros  

---

## 📊 Estrutura das Tabelas:

### **courses**
- id (BIGSERIAL)
- title (TEXT)
- description (TEXT)
- thumbnail (TEXT)
- instructor (TEXT)
- duration_hours (INTEGER)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)

### **modules**
- id (BIGSERIAL)
- course_id (BIGINT) → FOREIGN KEY courses(id)
- title (TEXT)
- description (TEXT)
- order_index (INTEGER)
- created_at (TIMESTAMPTZ)

### **lessons**
- id (BIGSERIAL)
- module_id (BIGINT) → FOREIGN KEY modules(id)
- title (TEXT)
- description (TEXT)
- video_url (TEXT)
- video_provider (TEXT) - 'youtube', 'vimeo', 'url'
- video_id (TEXT)
- duration_minutes (INTEGER)
- order_index (INTEGER)
- created_at (TIMESTAMPTZ)

### **comments**
- id (BIGSERIAL)
- lesson_id (BIGINT) → FOREIGN KEY lessons(id)
- user_id (UUID) → FOREIGN KEY auth.users(id)
- user_name (TEXT)
- user_email (TEXT)
- comment_text (TEXT)
- created_at (TIMESTAMPTZ)

### **user_progress**
- id (BIGSERIAL)
- user_id (UUID) → FOREIGN KEY auth.users(id)
- user_email (TEXT)
- lesson_id (BIGINT) → FOREIGN KEY lessons(id)
- completed (BOOLEAN)
- completed_at (TIMESTAMPTZ)

### **admins**
- id (BIGSERIAL)
- email (TEXT UNIQUE)
- name (TEXT)
- created_at (TIMESTAMPTZ)

---

## 🔒 Segurança (RLS Policies):

O script já configura automaticamente:

- ✅ **Todos podem ler** cursos, módulos, aulas, comentários
- ✅ **Apenas admins podem modificar** cursos, módulos, aulas
- ✅ **Usuários autenticados podem comentar**
- ✅ **Usuários só veem/editam seu próprio progresso**
- ✅ **Apenas admins podem ver a lista de admins**

---

## 🆘 Problemas Comuns:

### Erro: "relation already exists"
**Causa**: Tabelas já foram criadas  
**Solução**: Ignore, está tudo certo!

### Erro: "permission denied"
**Causa**: RLS está bloqueando  
**Solução**: Certifique-se de estar autenticado

### Tabelas não aparecem
**Causa**: Script não foi executado  
**Solução**: Execute o script SQL novamente

---

## 📞 Próximos Passos:

1. **Execute o script SQL** no Supabase Dashboard
2. **Verifique as tabelas** foram criadas
3. **Me confirme** que está tudo certo
4. **Eu atualizo o código** para usar Supabase

---

**Pronto para começar? Execute o script SQL primeiro!** 🚀
