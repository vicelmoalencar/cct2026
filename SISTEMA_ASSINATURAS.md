# 📋 Sistema de Gerenciamento de Assinaturas/Membros

## 🎯 Visão Geral

Sistema completo para importação e gerenciamento do histórico de assinaturas dos membros do CCT. Permite importar dados de membros do sistema antigo (Bubble.io) e visualizar o histórico de assinaturas.

---

## 📊 Estrutura do Banco de Dados

### ⚠️ IMPORTANTE: Duas Tabelas Diferentes

O sistema possui **DUAS tabelas de assinaturas**:

1. **`subscriptions`** (Migration 0005) - Sistema de planos atual
   - Campos: `user_email`, `plan_id`, `status`, `start_date`, `end_date`
   - Uso: Assinaturas ativas do sistema de planos (Mensal, Trimestral, Anual)

2. **`member_subscriptions`** (Migration 0010) - Histórico de membros antigos
   - Campos: `email_membro`, `origem`, `detalhe`, `data_expiracao`
   - Uso: Histórico importado do sistema antigo (Bubble.io)

### Tabela: `member_subscriptions` (NOVA)

```sql
CREATE TABLE member_subscriptions (
  id SERIAL PRIMARY KEY,
  email_membro VARCHAR(255) NOT NULL,
  data_expiracao TIMESTAMP,
  detalhe TEXT,
  origem VARCHAR(100),
  teste_gratis BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Colunas:**

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | SERIAL | ID único da assinatura |
| `email_membro` | VARCHAR(255) | Email do membro/usuário |
| `data_expiracao` | TIMESTAMP | Data de expiração da assinatura |
| `detalhe` | TEXT | Detalhes do pedido (número, plano, datas) |
| `origem` | VARCHAR(100) | Origem da assinatura (Telegram, CCT 2.0, manual, etc) |
| `teste_gratis` | BOOLEAN | Se é assinatura de teste grátis |
| `ativo` | BOOLEAN | Status atual da assinatura |
| `created_at` | TIMESTAMP | Data de criação do registro |
| `updated_at` | TIMESTAMP | Data da última atualização |

**Índices:**
- `idx_member_subscriptions_email` - Email do membro
- `idx_member_subscriptions_expiracao` - Data de expiração
- `idx_member_subscriptions_origem` - Origem da assinatura
- `idx_member_subscriptions_ativo` - Status ativo
- `idx_member_subscriptions_email_ativo` - Composto (email + ativo)

---

## 🚀 Como Usar

### 1. Aplicar Migration

Execute no **Supabase SQL Editor**:

```sql
-- Copie e cole o conteúdo de: migrations/0010_member_subscriptions.sql
```

Ou execute o comando SQL mínimo:

```sql
-- Criar tabela de histórico de membros
CREATE TABLE IF NOT EXISTS member_subscriptions (
  id SERIAL PRIMARY KEY,
  email_membro VARCHAR(255) NOT NULL,
  data_expiracao TIMESTAMP,
  detalhe TEXT,
  origem VARCHAR(100),
  teste_gratis BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_member_subscriptions_email ON member_subscriptions(email_membro);
ALTER TABLE member_subscriptions DISABLE ROW LEVEL SECURITY;
```

### 2. Rebuild no Easypanel

Após aplicar a migration, faça rebuild da aplicação no Easypanel para deploy do novo código.

### 3. Acessar Interface de Importação

1. Acesse o **Painel Admin**
2. Clique na aba **"Assinaturas"**
3. Clique no botão **"Importar CSV de Membros"**

### 4. Importar CSV

**Formato do CSV:**
```
email_membro; data_expiracao; detalhe; origem; teste_gratis
usuario@exemplo.com;"Aug 10, 2023 12:00 am";"Pedido:1234 - Plano Anual";CCT 2.0;não
teste@exemplo.com;"Dec 31, 2023 11:59 pm";"Alunos Telegram";Telegram;sim
```

**Características:**
- Delimitador: **ponto e vírgula (;)**
- Encoding: **UTF-8**
- Datas: Formato **"MMM DD, YYYY HH:MM am/pm"** (ex: "Aug 10, 2023 12:00 am")
- Teste grátis: **"sim"** ou **"não"**

**Processo de Importação:**
1. Selecione o arquivo CSV
2. Visualize o preview dos primeiros 10 membros
3. Confirme a importação
4. Aguarde o processamento (barra de progresso em tempo real)
5. Visualize o relatório: criados, pulados (duplicados), erros

---

## 📋 APIs Backend

### GET `/api/admin/member-subscriptions`
Lista todas as assinaturas de membros (apenas admin)

**Response:**
```json
{
  "subscriptions": [
    {
      "id": 1,
      "email_membro": "usuario@exemplo.com",
      "data_expiracao": "2023-08-10T00:00:00.000Z",
      "detalhe": "Pedido:1234 - Plano Anual",
      "origem": "CCT 2.0",
      "teste_gratis": false,
      "ativo": true,
      "created_at": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

### GET `/api/admin/member-subscriptions/find?email=EMAIL`
Busca assinaturas de membros por email (para verificar duplicatas)

**Response:**
```json
{
  "subscriptions": [
    { "id": 1, "email_membro": "usuario@exemplo.com", ... }
  ]
}
```

### POST `/api/admin/member-subscriptions`
Cria nova assinatura de membro (apenas admin)

**Request:**
```json
{
  "email_membro": "usuario@exemplo.com",
  "data_expiracao": "2023-12-31T00:00:00.000Z",
  "detalhe": "Pedido:1234 - Plano Anual",
  "origem": "CCT 2.0",
  "teste_gratis": false,
  "ativo": true
}
```

### PUT `/api/admin/member-subscriptions/:id`
Atualiza assinatura de membro existente (apenas admin)

### DELETE `/api/admin/member-subscriptions/:id`
Deleta assinatura de membro (apenas admin)

---

## 🎨 Interface do Admin

### Estatísticas
Exibe 4 cards com:
- **Total** de assinaturas
- **Ativas** (não expiradas)
- **Expiradas** (data vencida)
- **Teste Grátis** (quantidade)

### Tabela de Assinaturas
Colunas:
- Email do membro
- Data de expiração
- Origem (badge colorido)
- Status (ATIVA/EXPIRADA)
- Detalhes do pedido
- Ações (deletar)

**Indicadores visuais:**
- 🟢 Verde = Ativa
- 🔴 Vermelho = Expirada
- 🎁 Roxo = Teste Grátis

---

## ⚙️ Prevenção de Duplicatas

O sistema **verifica duplicatas por email** antes de criar assinaturas:

```javascript
const existing = await adminManager.findMemberSubscriptionByEmail(email)
if (existing && existing.length > 0) {
  skipped++
  continue // Pula duplicata
}
```

**Comportamento:**
- Se email já existe → **Pula** (não cria duplicata)
- Se email é novo → **Cria** assinatura
- Relatório final mostra quantos foram pulados

---

## 📅 Parse de Datas

O sistema converte datas do formato CSV para ISO:

**Input (CSV):**
```
"Aug 10, 2023 12:00 am"
"Dec 31, 2023 11:59 pm"
```

**Output (ISO):**
```
"2023-08-10T00:00:00.000Z"
"2023-12-31T23:59:00.000Z"
```

**Código:**
```javascript
const parsedDate = new Date(row.data_expiracao)
if (!isNaN(parsedDate.getTime())) {
  data_expiracao = parsedDate.toISOString()
}
```

---

## 🔍 Verificação de Status

**Assinatura ATIVA:**
- `ativo = true` **E** (sem data de expiração **OU** data futura)

**Assinatura EXPIRADA:**
- `ativo = false` **OU** data de expiração no passado

```javascript
const now = new Date()
const isExpired = expirationDate && expirationDate <= now
const isActive = sub.ativo && !isExpired
```

---

## 📦 Arquivo CSV de Teste

**Localização:** `/home/user/webapp/membros.csv`

**Tamanho:** 486KB (4.289 linhas)

**Conteúdo:**
- ~4.288 membros
- Origens: Telegram, CCT 2.0, manual
- Datas: 2022-2023
- Testes grátis identificados

---

## 🚀 Performance

**Importação de ~4.288 membros:**
- Tempo estimado: **8-10 minutos**
- Delay entre lotes: 100ms a cada 50 registros
- Progresso em tempo real no modal
- Logs detalhados de cada operação

**Otimizações:**
- Verificação de duplicatas em batch
- Processamento sequencial com delays
- Feedback visual constante

---

## 🔧 Troubleshooting

### Problema: Erro 500 ao importar
**Solução:** Verifique se RLS está desabilitado:
```sql
ALTER TABLE member_subscriptions DISABLE ROW LEVEL SECURITY;
```

### Problema: Erro "column email_membro does not exist"
**Causa:** Você aplicou migration na tabela errada (subscriptions em vez de member_subscriptions)
**Solução:** Aplicar migration correta (0010) que cria tabela `member_subscriptions`

### Problema: Datas não são importadas
**Solução:** Verifique o formato no CSV (deve ser como "Aug 10, 2023 12:00 am")

### Problema: Muitos duplicados
**Solução:** Normal se re-importar o mesmo CSV. Sistema pula duplicatas automaticamente.

### Problema: Importação lenta
**Solução:** Normal para ~4.288 registros. Aguarde 8-10 minutos para conclusão.

---

## 📁 Arquivos Relacionados

| Arquivo | Descrição |
|---------|-----------|
| `migrations/0010_member_subscriptions.sql` | ✅ Migration da tabela (USAR ESTA) |
| `migrations/0009_subscriptions_table.sql` | ❌ Obsoleta (não usar) |
| `SQL_RECRIAR_SUBSCRIPTIONS.sql` | Script para dropar/recriar se necessário |
| `src/index.tsx` | APIs backend |
| `public/static/admin.js` | Interface admin |
| `membros.csv` | CSV de exemplo com ~4.288 membros |

---

## ✅ Próximos Passos

1. ✅ **Aplicar migration** no Supabase SQL Editor
2. ✅ **Rebuild** no Easypanel
3. ✅ **Importar CSV** de membros (~4.288 registros)
4. ⏳ **Testar** sistema de assinaturas
5. ⏳ **Integrar** com sistema de autenticação (próxima etapa)

---

## 🎯 Integração Futura

**Próximo objetivo: Sincronizar tabela `member_subscriptions` com Supabase Auth**

Opções:
- **A)** Verificar assinatura ativa ao fazer login
- **B)** Criar contas Auth automaticamente para membros ativos
- **C)** Trigger que sincroniza Auth ↔ member_subscriptions

**Diferença entre tabelas:**
- `subscriptions` → Sistema de planos atual (não mexer)
- `member_subscriptions` → Histórico de membros antigos (importar CSV aqui)

---

**Pronto para uso! 🎉**

Após aplicar a migration e fazer rebuild, você pode importar os ~4.288 membros do CSV.
