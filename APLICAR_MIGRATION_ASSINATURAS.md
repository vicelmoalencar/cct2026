# 🚀 Como Aplicar a Migration de Assinaturas

## ⚠️ IMPORTANTE: Fazer Backup Antes!

Antes de aplicar a migration, faça backup do banco de dados:

1. Vá para o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto **webapp**
3. Menu lateral: **Database** → **Backups**
4. Clique em **Create backup** (se disponível)

---

## 📋 Passo a Passo para Aplicar a Migration

### Opção 1: Via Supabase Dashboard (SQL Editor) - RECOMENDADO

1. **Abrir SQL Editor**:
   - Acesse: https://supabase.com/dashboard
   - Selecione projeto: **webapp**
   - Menu lateral: **SQL Editor**
   - Clique em **New query**

2. **Copiar o conteúdo da migration**:
   - Abra o arquivo: `/home/user/webapp/migrations/0005_subscription_system.sql`
   - Copie TODO o conteúdo do arquivo

3. **Colar e Executar**:
   - Cole o conteúdo no SQL Editor
   - Clique em **Run** (ou Ctrl+Enter)
   - Aguarde a execução (pode levar alguns segundos)

4. **Verificar Sucesso**:
   - Deve aparecer mensagem de sucesso
   - Verifique se as tabelas foram criadas:
     ```sql
     SELECT table_name 
     FROM information_schema.tables 
     WHERE table_schema = 'public' 
     AND table_name IN ('plans', 'subscriptions', 'payment_history');
     ```

### Opção 2: Via Terminal (se tiver wrangler CLI configurado)

```bash
# No terminal do seu computador (NÃO no sandbox)
cd /caminho/para/seu/projeto
psql "sua-connection-string" < migrations/0005_subscription_system.sql
```

---

## ✅ Verificações Após Aplicar

Execute estes comandos no SQL Editor para verificar:

### 1. Verificar Tabelas Criadas
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('plans', 'subscriptions', 'payment_history')
ORDER BY table_name;
```

**Resultado esperado**: 3 tabelas listadas

### 2. Verificar Planos Padrão
```sql
SELECT id, name, price, duration_days, is_free_trial 
FROM plans 
ORDER BY display_order;
```

**Resultado esperado**: 4 planos (Teste Grátis, Mensal, Trimestral, Anual)

### 3. Verificar Coluna free_trial em lessons
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'lessons' 
AND column_name = 'free_trial';
```

**Resultado esperado**: 1 coluna com tipo BOOLEAN

### 4. Testar Função de Acesso
```sql
-- Teste com uma aula existente (substitua 1 pelo ID de uma aula real)
SELECT user_has_lesson_access('teste@example.com', 1);
```

**Resultado esperado**: `true` ou `false` (sem erro)

---

## 🐛 Troubleshooting

### Erro: "relation already exists"

**Causa**: Tabelas já existem no banco

**Solução**: A migration usa `CREATE TABLE IF NOT EXISTS`, então é seguro ignorar

### Erro: "column already exists"

**Causa**: Coluna `free_trial` já foi adicionada anteriormente

**Solução**: Normal, a migration usa `ADD COLUMN IF NOT EXISTS`

### Erro: "duplicate key value"

**Causa**: Planos padrão já foram inseridos

**Solução**: Normal, a migration usa `ON CONFLICT DO NOTHING`

### Erro: "permission denied"

**Causa**: Usuário sem permissão para criar funções/tabelas

**Solução**: 
1. Verifique se está usando o **Service Role Key** (não o Anon Key)
2. Ou execute via Supabase Dashboard (tem mais permissões)

---

## 📞 Próximos Passos

Após aplicar a migration com sucesso:

1. ✅ Volte aqui e me avise: **"Migration aplicada com sucesso"**
2. 🎨 Vou criar a interface de admin para gerenciar planos/assinaturas
3. 🔐 Vou adicionar controle de acesso nas aulas
4. 💳 Vou criar a página de planos para usuários

---

## 🆘 Se tiver algum problema

Me envie:
1. A mensagem de erro completa
2. O comando SQL que estava executando
3. Print da tela (se possível)
