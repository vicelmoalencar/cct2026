# 🎯 Implementação do Sistema de Teste Grátis

## 📋 Regras de Negócio

### **1. Tipos de Acesso**

| Tipo | Descrição | Acesso |
|------|-----------|--------|
| **COMPLETO** | Usuário com plano pago ativo | Todas as aulas |
| **TESTE_GRATIS** | Usuário com teste grátis ativo (5 dias) | Apenas aulas marcadas como teste grátis |
| **SEM_ACESSO** | Sem planos ativos | Nenhuma aula (ou apenas gratuitas) |

### **2. Lógica de Verificação**

```
SE usuário tem plano PAGO ativo (não expirado):
  ✅ Acesso COMPLETO (todas as aulas)
  
SENÃO SE usuário tem TESTE GRÁTIS ativo (não expirado):
  ⚠️ Acesso LIMITADO (apenas aulas marcadas com teste_gratis = true)
  
SENÃO:
  ❌ SEM ACESSO (nenhuma aula)
```

---

## 🗄️ Alterações no Banco de Dados

### **1. Tabela `member_subscriptions`**

**Coluna adicionada:**
```sql
teste_gratis BOOLEAN NOT NULL DEFAULT FALSE
```

**Valores:**
- `TRUE` = "Teste grátis 5 dias" ou "Prorrogação de Teste grátis 5 dias"
- `FALSE` = Planos pagos (Hotmart, etc.)

### **2. Tabela `lessons` (PRECISA ADICIONAR)**

```sql
ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS teste_gratis BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN lessons.teste_gratis IS 
  'TRUE = Aula disponível no teste grátis, FALSE = Apenas para assinantes pagos';
```

### **3. View `user_access_status`**

View criada para consulta rápida do status de acesso:

```sql
SELECT * FROM user_access_status WHERE user_email = 'email@exemplo.com';

-- Retorna:
-- tem_plano_pago_ativo: BOOLEAN
-- tem_teste_gratis_ativo: BOOLEAN
-- tipo_acesso: 'COMPLETO' | 'TESTE_GRATIS' | 'SEM_ACESSO'
-- ultimo_plano_pago_expira_em: TIMESTAMP
-- ultimo_teste_expira_em: TIMESTAMP
```

### **4. Funções Helper**

```sql
-- Verifica se tem acesso completo
SELECT user_tem_acesso_completo('email@exemplo.com');
-- Retorna: TRUE ou FALSE

-- Retorna tipo de acesso
SELECT user_tipo_acesso('email@exemplo.com');
-- Retorna: 'COMPLETO', 'TESTE_GRATIS' ou 'SEM_ACESSO'
```

---

## 🔧 Implementação no Backend

### **1. Adicionar Helper de Acesso (src/index.tsx)**

```typescript
// ============================================================================
// HELPER: Verificação de Acesso (Teste Grátis)
// ============================================================================

async function getUserAccessType(email: string, supabaseUrl: string, supabaseKey: string) {
  try {
    const supabase = new SupabaseClient(supabaseUrl, supabaseKey)
    
    // Opção A: Usar função SQL (RECOMENDADO)
    const { data, error } = await supabase.rpc('user_tipo_acesso', { email_usuario: email })
    
    if (error) throw error
    
    return data // 'COMPLETO', 'TESTE_GRATIS', 'SEM_ACESSO'
    
    // Opção B: Consultar diretamente (se RPC não funcionar)
    /*
    const agora = new Date().toISOString()
    
    // Verificar plano pago ativo
    const planoPago = await supabase.query('member_subscriptions', {
      select: 'id, data_expiracao',
      filters: { 
        email_membro: email,
        teste_gratis: false
      },
      single: true
    })
    
    if (planoPago && new Date(planoPago.data_expiracao) > new Date()) {
      return 'COMPLETO'
    }
    
    // Verificar teste grátis ativo
    const testeGratis = await supabase.query('member_subscriptions', {
      select: 'id, data_expiracao',
      filters: { 
        email_membro: email,
        teste_gratis: true
      },
      single: true
    })
    
    if (testeGratis && new Date(testeGratis.data_expiracao) > new Date()) {
      return 'TESTE_GRATIS'
    }
    
    return 'SEM_ACESSO'
    */
  } catch (error) {
    console.error('Error getting user access type:', error)
    return 'SEM_ACESSO' // Default: sem acesso em caso de erro
  }
}

// Middleware para verificar acesso
async function requirePaidAccess(c: any, next: any) {
  const user = c.get('user')
  if (!user || !user.email) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  
  const accessType = await getUserAccessType(user.email, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
  
  if (accessType === 'SEM_ACESSO') {
    return c.json({ 
      error: 'Acesso negado', 
      message: 'Você precisa de uma assinatura ativa para acessar este conteúdo' 
    }, 403)
  }
  
  c.set('accessType', accessType)
  await next()
}
```

### **2. Modificar Endpoint de Aulas (src/index.tsx)**

```typescript
// GET /api/courses/:id/modules/:moduleId/lessons
app.get('/api/courses/:courseId/modules/:moduleId/lessons', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const moduleId = c.req.param('moduleId')
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Buscar tipo de acesso do usuário
    const accessType = await getUserAccessType(user.email, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Buscar todas as aulas do módulo
    const lessons = await supabase.query('lessons', {
      select: '*',
      filters: { module_id: moduleId },
      order: 'order_index.asc'
    })
    
    if (!lessons || lessons.length === 0) {
      return c.json({ lessons: [] })
    }
    
    // Filtrar aulas baseado no tipo de acesso
    let filteredLessons = lessons
    
    if (accessType === 'TESTE_GRATIS') {
      // Usuário com teste grátis: apenas aulas marcadas como teste_gratis
      filteredLessons = lessons.filter(lesson => lesson.teste_gratis === true)
    } else if (accessType === 'SEM_ACESSO') {
      // Sem acesso: nenhuma aula
      filteredLessons = []
    }
    // Se accessType === 'COMPLETO': todas as aulas
    
    // Adicionar flag de acesso em cada aula
    const lessonsWithAccess = filteredLessons.map(lesson => ({
      ...lesson,
      tem_acesso: true,
      tipo_acesso: accessType,
      bloqueada: false
    }))
    
    // Opcional: Incluir aulas bloqueadas para usuários teste_gratis
    if (accessType === 'TESTE_GRATIS') {
      const blockedLessons = lessons
        .filter(lesson => lesson.teste_gratis === false)
        .map(lesson => ({
          ...lesson,
          tem_acesso: false,
          tipo_acesso: accessType,
          bloqueada: true,
          video_url: null, // Ocultar URL do vídeo
          mensagem_bloqueio: '🔒 Conteúdo exclusivo para assinantes'
        }))
      
      // Retornar aulas acessíveis + bloqueadas
      return c.json({ 
        lessons: [...lessonsWithAccess, ...blockedLessons].sort((a, b) => a.order_index - b.order_index),
        accessType,
        mensagem: accessType === 'TESTE_GRATIS' ? 'Você está no período de teste grátis. Algumas aulas estão bloqueadas.' : null
      })
    }
    
    return c.json({ 
      lessons: lessonsWithAccess,
      accessType 
    })
  } catch (error: any) {
    console.error('Error loading lessons:', error)
    return c.json({ error: error.message || 'Failed to load lessons' }, 500)
  }
})
```

### **3. Adicionar Endpoint de Status de Acesso**

```typescript
// GET /api/user/access-status
app.get('/api/user/access-status', requireAuth, async (c) => {
  try {
    const user = c.get('user')
    const supabase = new SupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    const accessType = await getUserAccessType(user.email, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY)
    
    // Buscar detalhes das assinaturas
    const subscriptions = await supabase.query('member_subscriptions', {
      select: '*',
      filters: { email_membro: user.email },
      order: 'data_expiracao.desc'
    })
    
    const planoPagoAtivo = subscriptions?.find(s => 
      !s.teste_gratis && new Date(s.data_expiracao) > new Date()
    )
    
    const testeGratisAtivo = subscriptions?.find(s => 
      s.teste_gratis && new Date(s.data_expiracao) > new Date()
    )
    
    return c.json({
      tipo_acesso: accessType,
      plano_pago_ativo: !!planoPagoAtivo,
      teste_gratis_ativo: !!testeGratisAtivo,
      expira_em: planoPagoAtivo?.data_expiracao || testeGratisAtivo?.data_expiracao || null,
      plano_atual: planoPagoAtivo?.detalhe || testeGratisAtivo?.detalhe || null,
      mensagem: {
        'COMPLETO': '✅ Você tem acesso completo a todos os cursos',
        'TESTE_GRATIS': '⚠️ Você está no período de teste grátis (5 dias). Algumas aulas estão bloqueadas.',
        'SEM_ACESSO': '❌ Você não tem uma assinatura ativa. Assine agora para ter acesso!'
      }[accessType]
    })
  } catch (error: any) {
    console.error('Error getting access status:', error)
    return c.json({ error: error.message }, 500)
  }
})
```

---

## 🎨 Frontend - Exibir Status de Acesso

### **1. Adicionar em `app.js`**

```javascript
const accessManager = {
  accessType: 'SEM_ACESSO',
  
  // Buscar status de acesso
  async getAccessStatus() {
    try {
      const response = await axios.get('/api/user/access-status')
      this.accessType = response.data.tipo_acesso
      return response.data
    } catch (error) {
      console.error('Error getting access status:', error)
      return null
    }
  },
  
  // Verificar se tem acesso a uma aula
  canAccessLesson(lesson) {
    if (this.accessType === 'COMPLETO') return true
    if (this.accessType === 'TESTE_GRATIS') return lesson.teste_gratis === true
    return false
  },
  
  // Mostrar banner de status
  showAccessBanner(status) {
    const banner = document.getElementById('accessBanner')
    if (!banner) return
    
    const config = {
      'COMPLETO': {
        icon: '✅',
        color: 'bg-green-100 text-green-800',
        message: 'Você tem acesso completo a todos os cursos!'
      },
      'TESTE_GRATIS': {
        icon: '⚠️',
        color: 'bg-yellow-100 text-yellow-800',
        message: `Teste grátis ativo. Expira em: ${new Date(status.expira_em).toLocaleDateString('pt-BR')}`
      },
      'SEM_ACESSO': {
        icon: '❌',
        color: 'bg-red-100 text-red-800',
        message: 'Você não tem uma assinatura ativa. Assine agora!'
      }
    }[this.accessType]
    
    banner.className = `px-4 py-3 rounded-lg ${config.color} mb-6`
    banner.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-2xl">${config.icon}</span>
        <div>
          <p class="font-semibold">${config.message}</p>
          ${this.accessType === 'SEM_ACESSO' ? '<a href="/assinar" class="underline">Assinar agora</a>' : ''}
        </div>
      </div>
    `
  }
}

// No init do app:
async init() {
  // ... código existente ...
  
  // Verificar status de acesso
  const accessStatus = await accessManager.getAccessStatus()
  if (accessStatus) {
    accessManager.showAccessBanner(accessStatus)
  }
  
  // ... resto do código ...
}
```

### **2. Modificar Exibição de Aulas**

```javascript
// Ao renderizar lista de aulas
function renderLessons(lessons, accessType) {
  return lessons.map(lesson => {
    const bloqueada = lesson.bloqueada || !accessManager.canAccessLesson(lesson)
    
    return `
      <div class="lesson-card ${bloqueada ? 'opacity-50' : ''}" 
           onclick="${bloqueada ? 'showUpgradeModal()' : `loadLesson(${lesson.id})`}">
        
        ${bloqueada ? '<i class="fas fa-lock text-yellow-500"></i>' : '<i class="fas fa-play-circle text-blue-500"></i>'}
        
        <h4>${lesson.title}</h4>
        
        ${bloqueada ? '<p class="text-sm text-yellow-600">🔒 Conteúdo exclusivo para assinantes</p>' : ''}
        
        ${lesson.teste_gratis ? '<span class="badge bg-green-500">Teste Grátis</span>' : ''}
      </div>
    `
  }).join('')
}

// Modal de upgrade
function showUpgradeModal() {
  alert('🔒 Esta aula é exclusiva para assinantes.\n\nAssine agora e tenha acesso completo a todos os cursos!')
  // Ou abrir modal bonito
}
```

---

## ✅ Checklist de Implementação

### **Banco de Dados:**
- [ ] Executar migration `0015_fix_encoding_and_teste_gratis.sql`
- [ ] Verificar se coluna `teste_gratis` foi criada em `member_subscriptions`
- [ ] Adicionar coluna `teste_gratis` em `lessons` (se não existir)
- [ ] Marcar aulas específicas como `teste_gratis = TRUE`
- [ ] Testar funções SQL: `user_tipo_acesso('email@teste.com')`

### **Backend:**
- [ ] Adicionar função `getUserAccessType()`
- [ ] Adicionar middleware `requirePaidAccess`
- [ ] Modificar endpoint de aulas para filtrar por acesso
- [ ] Criar endpoint `/api/user/access-status`
- [ ] Testar endpoints com diferentes tipos de usuários

### **Frontend:**
- [ ] Adicionar `accessManager` em `app.js`
- [ ] Mostrar banner de status de acesso
- [ ] Modificar renderização de aulas (mostrar ícone de cadeado)
- [ ] Criar modal de upgrade para aulas bloqueadas
- [ ] Adicionar badges "Teste Grátis" nas aulas gratuitas

---

## 🧪 Testes

### **1. Teste com Usuário de Teste Grátis**
```sql
-- Criar usuário de teste
INSERT INTO member_subscriptions (email_membro, detalhe, teste_gratis, data_expiracao)
VALUES ('teste@exemplo.com', 'Teste grátis 5 dias', TRUE, CURRENT_TIMESTAMP + INTERVAL '5 days');

-- Verificar tipo de acesso
SELECT user_tipo_acesso('teste@exemplo.com');
-- Esperado: 'TESTE_GRATIS'
```

**Comportamento esperado:**
- ✅ Vê apenas aulas marcadas com `teste_gratis = TRUE`
- ❌ Aulas pagas aparecem bloqueadas (com cadeado)
- ⚠️ Banner: "Você está no período de teste grátis"

### **2. Teste com Usuário Pago**
```sql
-- Criar assinatura paga
INSERT INTO member_subscriptions (email_membro, detalhe, teste_gratis, data_expiracao)
VALUES ('pago@exemplo.com', 'Transação Hotmart - HP123456', FALSE, CURRENT_TIMESTAMP + INTERVAL '365 days');

-- Verificar tipo de acesso
SELECT user_tipo_acesso('pago@exemplo.com');
-- Esperado: 'COMPLETO'
```

**Comportamento esperado:**
- ✅ Vê TODAS as aulas (teste grátis + pagas)
- ✅ Nenhuma aula bloqueada
- ✅ Banner: "Você tem acesso completo"

### **3. Teste com Usuário Expirado**
```sql
-- Assinatura expirada
INSERT INTO member_subscriptions (email_membro, detalhe, teste_gratis, data_expiracao)
VALUES ('expirado@exemplo.com', 'Transação Hotmart - HP654321', FALSE, CURRENT_TIMESTAMP - INTERVAL '10 days');

-- Verificar tipo de acesso
SELECT user_tipo_acesso('expirado@exemplo.com');
-- Esperado: 'SEM_ACESSO'
```

**Comportamento esperado:**
- ❌ Não vê nenhuma aula
- ❌ Banner: "Você não tem assinatura ativa"
- 🔗 Botão "Assinar agora"

---

## 📊 Queries Úteis

```sql
-- Ver todos os usuários com teste grátis ativo
SELECT email_membro, detalhe, data_expiracao
FROM member_subscriptions
WHERE teste_gratis = TRUE
  AND data_expiracao > CURRENT_TIMESTAMP
ORDER BY data_expiracao;

-- Ver estatísticas de acesso
SELECT 
  tipo_acesso,
  COUNT(*) as quantidade
FROM user_access_status
GROUP BY tipo_acesso;

-- Ver aulas disponíveis no teste grátis
SELECT 
  c.title as curso,
  m.title as modulo,
  l.title as aula
FROM lessons l
JOIN modules m ON m.id = l.module_id
JOIN courses c ON c.id = m.course_id
WHERE l.teste_gratis = TRUE
ORDER BY c.id, m.order_index, l.order_index;
```

---

**Última Atualização:** 2025-01-26  
**Status:** 📋 Documentação completa - Pronto para implementação  
**Próximo Passo:** Executar migration 0015 no Supabase
