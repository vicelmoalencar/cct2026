# 🔧 SOLUÇÃO PARA ERRO 500 NA IMPORTAÇÃO CSV

## 🔴 PROBLEMA IDENTIFICADO

O erro acontece porque o **RLS (Row Level Security)** do Supabase está bloqueando as inserções via API.

**Evidência:**
- ✅ INSERT manual no SQL Editor funciona
- ❌ INSERT via API (ANON_KEY) retorna 500

**Causa:** O Supabase tem RLS habilitado nas tabelas, mas não há políticas que permitam inserção via ANON_KEY.

---

## ✅ SOLUÇÃO RÁPIDA (5 minutos)

### Opção 1: Desabilitar RLS Temporariamente (RECOMENDADO para testes)

Execute este SQL no Supabase Dashboard → SQL Editor:

```sql
-- Desabilitar RLS temporariamente
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history DISABLE ROW LEVEL SECURITY;
```

**⚠️ ATENÇÃO:** Isso remove a segurança! Use apenas para desenvolvimento/testes.

---

### Opção 2: Usar Service Role Key (RECOMENDADO para produção)

O Service Role Key tem permissões totais e ignora RLS.

**Passo 1:** Pegar o Service Role Key no Supabase Dashboard

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto
3. Menu lateral → **Settings** → **API**
4. Copie o **service_role** key (não o anon key)

**Passo 2:** Atualizar variáveis de ambiente no Easypanel

1. No Easypanel, vá em **Environment Variables**
2. Mude `SUPABASE_ANON_KEY` para usar o **service_role** key

**OU** adicione uma nova variável:
```
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (seu service role key)
```

**Passo 3:** Atualizar o código para usar Service Role Key em operações admin

No arquivo `src/index.tsx`, nas rotas de admin, trocar:

```typescript
// De:
const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)

// Para:
const supabase = new SupabaseClient(
  c.env.SUPABASE_URL, 
  c.env.SUPABASE_SERVICE_KEY || c.env.SUPABASE_ANON_KEY
)
```

---

## 🎯 QUAL OPÇÃO ESCOLHER?

### Para TESTAR AGORA (desenvolvimento):
✅ **Opção 1** - Desabilitar RLS temporariamente  
- Rápido (5 minutos)
- Funciona imediatamente
- ⚠️ Menos seguro

### Para PRODUÇÃO (depois):
✅ **Opção 2** - Usar Service Role Key  
- Mais seguro
- Requer atualização de código
- Recomendado para produção

---

## 📋 PASSO A PASSO DETALHADO - OPÇÃO 1

1. **Acesse Supabase Dashboard**
   - URL: https://supabase.com/dashboard
   - Projeto: webapp

2. **Abra SQL Editor**
   - Menu lateral → **SQL Editor**
   - Clique em **New query**

3. **Cole e Execute**
   ```sql
   ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
   ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
   ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
   ALTER TABLE progress DISABLE ROW LEVEL SECURITY;
   ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
   ALTER TABLE certificate_templates DISABLE ROW LEVEL SECURITY;
   ALTER TABLE plans DISABLE ROW LEVEL SECURITY;
   ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
   ALTER TABLE payment_history DISABLE ROW LEVEL SECURITY;
   ```

4. **Clique em RUN**

5. **Teste a Importação**
   - Volte ao painel admin
   - Tente importar o CSV novamente
   - Deve funcionar! 🎉

---

## 📋 PASSO A PASSO DETALHADO - OPÇÃO 2

### Parte 1: Pegar Service Role Key

1. **Supabase Dashboard → Settings → API**
2. Copie o valor de **service_role** (secret key)
3. ⚠️ **NUNCA** exponha essa chave publicamente!

### Parte 2: Configurar no Easypanel

1. No Easypanel, vá no seu app
2. **Environment Variables**
3. Adicione:
   ```
   SUPABASE_SERVICE_KEY=sua-service-role-key-aqui
   ```
4. Salve e rebuild

### Parte 3: Atualizar Código (eu posso fazer)

Me avise que você escolheu a Opção 2 e eu atualizo o código para usar o Service Role Key nas operações de admin.

---

## ✅ VERIFICAR SE FUNCIONOU

Após aplicar a solução, teste:

1. Abra o painel admin
2. Vá na aba **Importar**
3. Selecione o arquivo `importacao_cct.csv`
4. Clique em **Importar**
5. Deve começar a criar cursos/módulos/aulas sem erro! 🎉

---

## 🐛 SE AINDA DER ERRO

Se mesmo após desabilitar RLS ainda der erro 500:

1. Abra DevTools (F12) → Console
2. Copie o erro COMPLETO
3. Me envie junto com print da tela

Pode ser outro problema como:
- Limite de requisições (rate limit)
- Dados inválidos no CSV
- Foreign key constraint

---

## 📞 PRÓXIMOS PASSOS

**Depois que a importação funcionar:**

1. ✅ Reabilitar RLS com políticas adequadas
2. ✅ Usar Service Role Key para operações admin
3. ✅ Implementar controle de acesso baseado em email admin
4. ✅ Testar sistema de assinaturas

---

## 💡 RECOMENDAÇÃO

Para **agora**: Use **Opção 1** (desabilitar RLS) para fazer a importação funcionar.

Para **depois**: Migre para **Opção 2** (Service Role Key) para segurança adequada.

---

Me avise qual opção você escolheu e o resultado! 🚀
