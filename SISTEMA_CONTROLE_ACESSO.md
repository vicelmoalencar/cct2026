# 🔐 Sistema de Controle de Acesso - CCT Clube do Cálculo Trabalhista

## 📊 Visão Geral

O sistema implementa **3 níveis de acesso** baseados no status da assinatura do usuário:

| Tipo de Acesso | Descrição | Acesso às Aulas |
|----------------|-----------|-----------------|
| **COMPLETO** | Plano pago ativo não expirado | ✅ Todas as aulas (teste + premium) |
| **TESTE_GRATIS** | Teste grátis 5 dias ativo | ⚠️ Apenas aulas marcadas como `teste_gratis = TRUE` |
| **SEM_ACESSO** | Sem planos ativos ou todos expirados | ❌ Nenhuma aula |

---

## 🗄️ Estrutura do Banco de Dados

### Tabela: `member_subscriptions`

Armazena as assinaturas dos usuários:

```sql
- email_membro (TEXT) - Email do usuário
- detalhe (TEXT) - Descrição do plano
- teste_gratis (BOOLEAN) - TRUE para teste grátis, FALSE para plano pago
- data_expiracao (TIMESTAMP) - Data de expiração
- ativo (BOOLEAN) - Status geral
```

### Tabela: `lessons`

Armazena as aulas do curso:

```sql
- id (INTEGER) - ID da aula
- title (TEXT) - Título da aula
- teste_gratis (BOOLEAN) - TRUE = acessível no teste, FALSE = apenas premium
- module_id (INTEGER) - ID do módulo
- ... outros campos ...
```

---

## 🔧 Funções do PostgreSQL

### 1. `user_tipo_acesso(email_usuario TEXT)`

**Retorna**: `'COMPLETO'`, `'TESTE_GRATIS'` ou `'SEM_ACESSO'`

**Lógica**:
```sql
-- Tem plano PAGO ativo?
IF EXISTS (plano pago com data_expiracao > NOW) THEN
  RETURN 'COMPLETO';

-- Tem plano TESTE ativo?  
IF EXISTS (plano teste com data_expiracao > NOW) THEN
  RETURN 'TESTE_GRATIS';

-- Sem planos ativos
RETURN 'SEM_ACESSO';
```

**Exemplo de uso**:
```sql
SELECT user_tipo_acesso('usuario@email.com');
-- Retorna: 'COMPLETO'
```

---

### 2. `user_tem_acesso_completo(email_usuario TEXT)`

**Retorna**: `BOOLEAN`

**Lógica**: Verifica se o usuário tem plano PAGO ativo (não teste grátis)

**Exemplo de uso**:
```sql
SELECT user_tem_acesso_completo('usuario@email.com');
-- Retorna: TRUE ou FALSE
```

---

### 3. `user_has_active_subscription(email_usuario TEXT)`

**Retorna**: `BOOLEAN`

**Lógica**: Verifica se o usuário tem QUALQUER assinatura ativa (paga OU teste)

**Exemplo de uso**:
```sql
SELECT user_has_active_subscription('usuario@email.com');
-- Retorna: TRUE se tem plano ativo, FALSE se expirou
```

---

### 4. `user_has_lesson_access(email_usuario TEXT, lesson_id INTEGER)`

**Retorna**: `BOOLEAN`

**Lógica**:
```sql
1. Busca se a aula tem teste_gratis = TRUE
2. Busca tipo de acesso do usuário
3. Aplica regras:
   - COMPLETO → pode acessar QUALQUER aula
   - TESTE_GRATIS → pode acessar APENAS aulas com teste_gratis = TRUE
   - SEM_ACESSO → não pode acessar NADA
```

**Exemplo de uso**:
```sql
SELECT user_has_lesson_access('usuario@email.com', 123);
-- Retorna: TRUE se pode acessar a aula 123, FALSE se não pode
```

---

## 📡 API Endpoints (Backend - Hono)

### `GET /api/lessons/:id/access`

Verifica se o usuário tem acesso à aula específica.

**Headers**: Cookies `sb-access-token` (opcional)

**Response**:
```json
{
  "hasAccess": true,
  "reason": "active_subscription"
}
```

**Possíveis valores de `reason`**:
- `"active_subscription"` - Usuário tem plano ativo e pode acessar
- `"no_active_subscription"` - Usuário não tem plano ativo
- `"not_authenticated"` - Usuário não está logado
- `"free_trial"` - Aula está disponível sem login (teste grátis)
- `"invalid_token"` - Token de autenticação inválido
- `"error"` - Erro no servidor

---

### `GET /api/user/access-status`

Retorna o status de acesso do usuário.

**Headers**: Cookies `sb-access-token` (obrigatório)

**Response**:
```json
{
  "email": "usuario@email.com",
  "accessType": "COMPLETO",
  "hasActiveSubscription": true,
  "hasFullAccess": true,
  "expirationDate": "2025-12-31T23:59:59Z"
}
```

---

## 🎨 Frontend (JavaScript)

### Exemplo de Uso no Frontend

```javascript
// 1. Verificar status de acesso do usuário
async function checkUserAccess() {
  const response = await axios.get('/api/user/access-status')
  const { accessType, hasFullAccess } = response.data
  
  if (accessType === 'SEM_ACESSO') {
    showUpgradeModal()
  } else if (accessType === 'TESTE_GRATIS') {
    showTesteBanner('Você está no período de teste grátis')
  } else {
    showFullAccessBanner()
  }
}

// 2. Verificar acesso a uma aula específica
async function checkLessonAccess(lessonId) {
  const response = await axios.get(`/api/lessons/${lessonId}/access`)
  
  if (!response.data.hasAccess) {
    // Bloquear aula
    showLockedLesson(lessonId)
  } else {
    // Permitir acesso
    loadLesson(lessonId)
  }
}

// 3. Filtrar aulas visíveis para teste grátis
function filterLessons(lessons, accessType) {
  if (accessType === 'COMPLETO') {
    return lessons // Mostrar todas
  } else if (accessType === 'TESTE_GRATIS') {
    return lessons.filter(l => l.teste_gratis === true)
  } else {
    return [] // SEM_ACESSO: não mostrar nada
  }
}
```

---

## 🧪 Cenários de Teste

### Cenário 1: Usuário com Plano Pago Ativo

**Dados**:
- Email: `usuario@email.com`
- Assinatura: `teste_gratis = FALSE`, `data_expiracao = 2025-12-31`

**Resultado**:
```sql
user_tipo_acesso() → 'COMPLETO'
user_has_lesson_access(usuario, 1) → TRUE (qualquer aula)
user_has_lesson_access(usuario, 999) → TRUE (qualquer aula)
```

---

### Cenário 2: Usuário com Teste Grátis Ativo

**Dados**:
- Email: `teste@email.com`
- Assinatura: `teste_gratis = TRUE`, `data_expiracao = 2025-11-01`

**Resultado**:
```sql
user_tipo_acesso() → 'TESTE_GRATIS'
user_has_lesson_access(teste, 1) → TRUE (se aula 1 tem teste_gratis = TRUE)
user_has_lesson_access(teste, 999) → FALSE (se aula 999 tem teste_gratis = FALSE)
```

---

### Cenário 3: Usuário com Plano Expirado

**Dados**:
- Email: `expirado@email.com`
- Assinatura: `teste_gratis = FALSE`, `data_expiracao = 2024-12-31` (passado)

**Resultado**:
```sql
user_tipo_acesso() → 'SEM_ACESSO'
user_has_lesson_access(expirado, 1) → FALSE
user_has_lesson_access(expirado, 999) → FALSE
```

❌ **BLOQUEADO**: Não pode acessar nenhuma aula até renovar o plano!

---

## 📋 Checklist de Implementação

### ✅ Banco de Dados (Supabase)

- [ ] Executar migration 0015 (encoding + teste_gratis em member_subscriptions)
- [ ] Executar migration 0016 (teste_gratis em lessons + funções)
- [ ] Verificar que funções estão criadas
- [ ] Marcar aulas específicas como `teste_gratis = TRUE`

### ✅ Backend (src/index.tsx)

- [ ] Endpoint `/api/lessons/:id/access` usando `user_has_lesson_access()`
- [ ] Endpoint `/api/user/access-status` retornando tipo de acesso
- [ ] Middleware `requireAuth` funcionando corretamente
- [ ] Logs de acesso negado para debugging

### ✅ Frontend (public/static/app.js)

- [ ] Função `checkUserAccess()` ao carregar página
- [ ] Função `checkLessonAccess(lessonId)` antes de abrir aula
- [ ] Banner de status de acesso (COMPLETO / TESTE_GRATIS / SEM_ACESSO)
- [ ] Ícone de cadeado em aulas bloqueadas
- [ ] Modal de upgrade para usuários sem acesso
- [ ] Mensagem clara explicando limitações do teste grátis

---

## 🚀 Próximos Passos

1. **Executar Migrations no Supabase**
   - 0015_fix_encoding_and_teste_gratis_CORRIGIDO.sql
   - 0016_fix_access_control.sql

2. **Marcar Aulas de Teste**
   - Definir quais aulas estarão disponíveis no teste grátis
   - Executar UPDATE manual ou usar script da migration

3. **Atualizar Backend**
   - Verificar que endpoints usam as funções corretas
   - Adicionar logs para debug

4. **Implementar UI no Frontend**
   - Banner de status
   - Bloqueio visual de aulas premium
   - Modal de upgrade

5. **Testar Completo**
   - Testar com usuário COMPLETO
   - Testar com usuário TESTE_GRATIS
   - Testar com usuário SEM_ACESSO
   - Testar expiração de plano

---

## 📞 Suporte

Se encontrar problemas:

1. Verificar logs do backend: `pm2 logs cct-clube-calculo --nostream`
2. Verificar console do browser: F12 → Console
3. Testar funções SQL diretamente no Supabase SQL Editor
4. Verificar se migrations foram executadas corretamente

---

**Última atualização**: 26/10/2025  
**Versão**: 1.0  
**Autor**: AI Assistant (Claude)
