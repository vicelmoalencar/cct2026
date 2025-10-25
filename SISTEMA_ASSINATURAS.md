# 📋 Sistema de Gerenciamento de Assinaturas/Membros

## 🎯 Visão Geral

Sistema completo para importação e gerenciamento do histórico de assinaturas dos membros do CCT. Permite importar dados de membros do sistema antigo (Bubble.io) e visualizar o histórico de assinaturas.

---

## 📊 Estrutura do Banco de Dados

### Tabela: `subscriptions`

```sql
CREATE TABLE subscriptions (
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
- `idx_subscriptions_email` - Email do membro
- `idx_subscriptions_expiracao` - Data de expiração
- `idx_subscriptions_origem` - Origem da assinatura
- `idx_subscriptions_ativo` - Status ativo
- `idx_subscriptions_email_ativo` - Composto (email + ativo)

---

## 🚀 Como Usar

### 1. Aplicar Migration

Execute no **Supabase SQL Editor**:

```sql
-- Copie e cole o conteúdo de: migrations/0009_subscriptions_table.sql
```

Ou execute o comando SQL mínimo:

```sql
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
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

### GET `/api/admin/subscriptions`
Lista todas as assinaturas (apenas admin)

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

### GET `/api/admin/subscriptions/find?email=EMAIL`
Busca assinaturas por email (para verificar duplicatas)

**Response:**
```json
{
  "subscriptions": [
    { "id": 1, "email_membro": "usuario@exemplo.com", ... }
  ]
}
```

### POST `/api/admin/subscriptions`
Cria nova assinatura (apenas admin)

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

### PUT `/api/admin/subscriptions/:id`
Atualiza assinatura existente (apenas admin)

### DELETE `/api/admin/subscriptions/:id`
Deleta assinatura (apenas admin)

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
const existing = await adminManager.findSubscriptionByEmail(email)
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
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
```

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
| `migrations/0009_subscriptions_table.sql` | Migration da tabela |
| `src/index.tsx` | APIs backend (linhas 1163-1293) |
| `public/static/admin.js` | Interface admin (linhas 1668-3297) |
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

**Próximo objetivo: Sincronizar tabela `subscriptions` com Supabase Auth**

Opções:
- **A)** Verificar assinatura ativa ao fazer login
- **B)** Criar contas Auth automaticamente para membros ativos
- **C)** Trigger que sincroniza Auth ↔ subscriptions

---

**Pronto para uso! 🎉**

Após aplicar a migration e fazer rebuild, você pode importar os ~4.288 membros do CSV.
