# 🎯 INSTRUÇÕES FINAIS - Sistema de Controle de Acesso

## ✅ O Que Já Está Pronto

### Backend
- ✅ Endpoint `/api/user/access-status` criado
- ✅ Endpoint `/api/lessons/:id/access` funcionando
- ✅ Funções SQL prontas (precisa executar migration 0017)

### Frontend
- ✅ Banner de status (verde/amarelo/vermelho)
- ✅ Ícones de cadeado em aulas premium
- ✅ Modal de upgrade com CTAs
- ✅ Script `access-control.js` carregado

### Servidor
- ✅ Build executado
- ✅ PM2 reiniciado
- ✅ Servidor rodando: https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai

---

## 🚀 PASSO FINAL: Executar Migration 0017 no Supabase

### **Execute este SQL no Supabase SQL Editor:**

```sql
-- ============================================================================
-- Migration 0017: Permitir que usuários expirados acessem aulas gratuitas
-- ============================================================================

-- 1. Dropar funções antigas
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, BIGINT) CASCADE;
DROP FUNCTION IF EXISTS user_has_lesson_access(TEXT, INTEGER) CASCADE;

-- 2. Criar função principal (permite aulas gratuitas para todos)
CREATE OR REPLACE FUNCTION user_has_lesson_access(
  email_usuario TEXT,
  lesson_id BIGINT
)
RETURNS BOOLEAN AS $$
DECLARE
  lesson_is_teste_gratis BOOLEAN;
  user_access_type TEXT;
BEGIN
  -- Verificar se a aula está disponível no teste grátis
  SELECT teste_gratis INTO lesson_is_teste_gratis
  FROM lessons
  WHERE id = lesson_id;
  
  -- Se não encontrou a aula, negar acesso
  IF lesson_is_teste_gratis IS NULL THEN
    RETURN false;
  END IF;
  
  -- Se a aula é gratuita, SEMPRE permitir acesso (mesmo para expirados)
  IF lesson_is_teste_gratis = TRUE THEN
    RETURN true;
  END IF;
  
  -- Para aulas premium, verificar tipo de acesso
  user_access_type := user_tipo_acesso(email_usuario);
  
  -- Apenas usuários com plano pago ativo podem acessar aulas premium
  RETURN (user_access_type = 'COMPLETO');
END;
$$ LANGUAGE plpgsql;

-- 3. Criar sobrecarga para INTEGER
CREATE OR REPLACE FUNCTION user_has_lesson_access(
  email_usuario TEXT,
  lesson_id INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN user_has_lesson_access(email_usuario, lesson_id::BIGINT);
END;
$$ LANGUAGE plpgsql;

-- 4. Recriar view de debug
DROP VIEW IF EXISTS lesson_access_debug CASCADE;

CREATE VIEW lesson_access_debug AS
SELECT 
  l.id as lesson_id,
  l.title as lesson_title,
  l.teste_gratis as aula_gratuita,
  u.email_membro as user_email,
  u.tipo_acesso as user_tipo_acesso,
  user_has_lesson_access(u.email_membro::TEXT, l.id) as tem_acesso,
  CASE 
    WHEN l.teste_gratis THEN '🎁 Grátis para todos'
    WHEN u.tipo_acesso = 'COMPLETO' THEN '✅ Acesso liberado (plano pago)'
    WHEN u.tipo_acesso = 'TESTE_GRATIS' THEN '🔒 Bloqueado (precisa plano pago)'
    ELSE '🔒 Bloqueado (precisa plano pago)'
  END as status_acesso
FROM lessons l
CROSS JOIN user_access_status u
LIMIT 100;

-- 5. TESTAR
SELECT 
  'antoniovicelmo@gmail.com' as usuario,
  user_tipo_acesso('antoniovicelmo@gmail.com') as tipo_acesso,
  user_has_lesson_access('antoniovicelmo@gmail.com', 1) as tem_acesso_aula_1;
```

---

## 🎨 Como Vai Funcionar na Prática

### **1. Usuário com Plano Pago Ativo (COMPLETO)**

**Banner:**
```
┌────────────────────────────────────────────────────────────┐
│ ✅ Acesso Completo                          Expira em: 30d │
│ Você tem acesso a todas as 754 aulas do curso             │
└────────────────────────────────────────────────────────────┘
```

**Aulas:**
- ✅ Todas as 754 aulas desbloqueadas
- ✅ Sem ícones de cadeado
- ✅ Pode clicar em qualquer aula

---

### **2. Usuário com Teste Grátis Ativo (TESTE_GRATIS)**

**Banner:**
```
┌────────────────────────────────────────────────────────────┐
│ ⚠️ Teste Grátis - 253 aulas disponíveis  [Fazer Upgrade] │
│ Upgrade para acesso completo a todas as 754 aulas         │
└────────────────────────────────────────────────────────────┘
```

**Aulas:**
- ✅ 253 aulas gratuitas desbloqueadas
- 🔒 501 aulas premium com ícone de cadeado
- ⚠️ Ao clicar em aula premium → Modal de upgrade

---

### **3. Usuário com Plano Expirado (SEM_ACESSO)**

**Banner:**
```
┌────────────────────────────────────────────────────────────┐
│ ❌ Plano Expirado - Renove agora          [Renovar Plano] │
│ Você tem acesso apenas às 253 aulas gratuitas            │
└────────────────────────────────────────────────────────────┘
```

**Aulas:**
- ✅ 253 aulas gratuitas desbloqueadas (NOVO!)
- 🔒 501 aulas premium com ícone de cadeado
- ⚠️ Ao clicar em aula premium → Modal de upgrade

---

## 📱 Modal de Upgrade

Quando usuário tenta acessar aula premium:

```
╔════════════════════════════════════════════════════════════╗
║  🔒 Aula Premium Bloqueada                            [X]  ║
╠════════════════════════════════════════════════════════════╣
║                                                             ║
║  Esta aula faz parte do conteúdo premium e está           ║
║  disponível apenas para membros com plano pago.           ║
║                                                             ║
║  ┌─────────────────────────────────────────────────────┐  ║
║  │ ⚠️ Você está no Teste Grátis                        │  ║
║  │ Acesso a 253 aulas gratuitas. Faça upgrade!        │  ║
║  └─────────────────────────────────────────────────────┘  ║
║                                                             ║
║  ✅ Acesso completo a 754 aulas                            ║
║  ✅ Certificados de conclusão                              ║
║  ✅ Suporte prioritário                                    ║
║  ✅ Atualizações de conteúdo                               ║
║                                                             ║
║     [👑 Fazer Upgrade Agora]  [Agora Não]                 ║
║                                                             ║
╚════════════════════════════════════════════════════════════╝
```

---

## ⚙️ Configuração do Link de Pagamento

**Edite o arquivo:** `public/static/access-control.js`

**Linha 250-252:**
```javascript
// Redirect to payment page (customize this URL)
redirectToPayment() {
  // TODO: Replace with your actual payment URL
  const paymentUrl = 'https://pay.hotmart.com/YOUR_PRODUCT_URL'
  window.open(paymentUrl, '_blank')
  this.closeUpgradeModal()
}
```

**Altere para seu link real:**
```javascript
redirectToPayment() {
  const paymentUrl = 'https://pay.hotmart.com/SEU_LINK_AQUI'
  window.open(paymentUrl, '_blank')
  this.closeUpgradeModal()
}
```

---

## 🧪 Como Testar

### **1. Teste Visual (Navegador)**

1. Acesse: https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai
2. Faça login
3. Você deve ver um dos banners:
   - Verde: Plano pago ativo
   - Amarelo: Teste grátis ativo
   - Vermelho: Plano expirado

### **2. Teste de Bloqueio**

1. Role a lista de aulas
2. Aulas gratuitas: sem cadeado, pode clicar
3. Aulas premium: ícone 🔒, ao clicar abre modal

### **3. Teste SQL (Supabase)**

```sql
-- Ver seu status
SELECT user_tipo_acesso('antoniovicelmo@gmail.com');

-- Ver acesso a aulas
SELECT 
  l.id,
  l.title,
  l.teste_gratis as gratuita,
  user_has_lesson_access('antoniovicelmo@gmail.com', l.id) as pode_acessar
FROM lessons l
ORDER BY l.id
LIMIT 20;
```

---

## 📊 Resumo das Mudanças

| Item | Antes | Depois |
|------|-------|--------|
| **Usuários expirados** | ❌ Sem acesso a nada | ✅ Acessam 253 aulas gratuitas |
| **Banner de status** | ❌ Não existia | ✅ Verde/Amarelo/Vermelho |
| **Ícones de cadeado** | ❌ Não existia | ✅ Nas 501 aulas premium |
| **Modal de upgrade** | ❌ Não existia | ✅ Com CTAs claros |
| **Frontend avisa bloqueio** | ❌ Não | ✅ Sim, antes de clicar |

---

## 🎯 Checklist Final

- [ ] Executar migration 0017 no Supabase
- [ ] Testar banner aparecendo no topo
- [ ] Verificar ícones de cadeado nas aulas premium
- [ ] Testar modal de upgrade ao clicar em aula bloqueada
- [ ] Configurar link de pagamento em `access-control.js`
- [ ] Testar com diferentes tipos de usuário

---

## 📞 Problemas?

Se algo não funcionar:

1. **Banner não aparece:** Verifique console do navegador (F12)
2. **Cadeados não aparecem:** Execute migration 0017
3. **Modal não abre:** Verifique se `access-control.js` foi carregado
4. **Erro 500:** Verifique se funções SQL foram criadas

---

**Última atualização:** 26/10/2025  
**Status:** ✅ Pronto para produção (após executar migration 0017)  
**Commit:** 962f53b
