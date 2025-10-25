# ⚡ FIX RÁPIDO - 5 Minutos

## 🎯 Problema
- ❌ Módulos não aparecem no certificado
- ❌ Botão Admin não aparece

## 🔧 Causa
**RLS (Row Level Security)** está bloqueando as queries no banco de dados.

---

## 🚀 Solução em 3 Passos

### **PASSO 1: Abrir Supabase SQL Editor** (30 segundos)

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: **cct2026**
3. Clique em: **SQL Editor** (ícone </> na lateral)
4. Clique em: **+ New query**

---

### **PASSO 2: Executar Script de Correção** (1 minuto)

**Copie e cole este SQL inteiro:**

```sql
-- ============================================
-- FIX COMPLETO - RLS + Migration + Admin
-- ============================================

-- 1. DESABILITAR RLS (Remove bloqueio)
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- 2. MIGRATION 0014 (Adicionar coluna módulos)
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS course_modules TEXT;

CREATE INDEX IF NOT EXISTS idx_certificates_with_modules 
ON certificates(id) 
WHERE course_modules IS NOT NULL;

-- 3. POPULAR MÓDULOS (Preencher certificados existentes)
UPDATE certificates c
SET course_modules = (
  SELECT json_agg(
    json_build_object('title', m.title, 'order', m.order_index)
    ORDER BY m.order_index
  )::TEXT
  FROM modules m
  WHERE m.course_id = c.course_id
)
WHERE c.course_id IS NOT NULL
  AND (c.course_modules IS NULL OR c.course_modules = '')
  AND EXISTS (SELECT 1 FROM modules m WHERE m.course_id = c.course_id);

-- 4. ADICIONAR ADMIN (Seu email com nome)
INSERT INTO admins (email, name)
VALUES ('antoniovicelmo@gmail.com', 'ANTONIO VICELMO')
ON CONFLICT (email) DO NOTHING;

-- 5. VERIFICAÇÃO (Ver resultados)
SELECT 
  '✅ RLS Desabilitado' as status,
  tablename,
  CASE WHEN rowsecurity THEN '❌ ATIVO' ELSE '✅ INATIVO' END as rls_status
FROM pg_tables 
WHERE tablename IN ('certificates', 'modules', 'admins')

UNION ALL

SELECT 
  '✅ Admin Cadastrado' as status,
  email,
  '✅ OK'
FROM admins 
WHERE email = 'antoniovicelmo@gmail.com'

UNION ALL

SELECT 
  '✅ Certificados com Módulos' as status,
  user_email,
  CASE 
    WHEN course_modules IS NULL THEN '❌ SEM MÓDULOS'
    WHEN course_modules = '' THEN '❌ VAZIO'
    ELSE '✅ COM MÓDULOS'
  END
FROM certificates 
WHERE user_email = 'antoniovicelmo@gmail.com'
LIMIT 10;
```

**Depois:**
1. Clique em **Run** (Ctrl+Enter)
2. Aguarde 5-10 segundos
3. Veja os resultados na parte inferior

---

### **PASSO 3: Rebuild no Easypanel** (2-5 minutos)

1. Acesse: Dashboard do Easypanel
2. Encontre: Projeto **cct2026**
3. Clique em: **Rebuild**
4. Aguarde: Build completar (~2-5 minutos)

---

## ✅ Verificar se Funcionou

### **Teste 1: Botão Admin**
1. Acesse: https://ensinoplus-dev-cct2026.n697dr.easypanel.host
2. Faça logout (se estiver logado)
3. Faça login novamente
4. ✅ Deve aparecer botão **"Admin"** no menu

### **Teste 2: Módulos no Certificado**
1. Clique em: **"Certificados"**
2. Clique em: **"Visualizar"** em qualquer certificado
3. ✅ Deve aparecer seção **"Módulos Concluídos"**
4. ✅ Deve aparecer lista de módulos com ícones de check

### **Teste 3: Verificação Pública**
1. Copie o código do certificado (ex: CCT-2025-09F80B59)
2. Acesse: https://ensinoplus-dev-cct2026.n697dr.easypanel.host/verificar/CCT-2025-09F80B59
3. ✅ Deve aparecer seção **"Módulos Concluídos"**

---

## 🎯 Resultados Esperados

### **Após executar o SQL:**
```
✅ RLS Desabilitado     | certificates | ✅ INATIVO
✅ RLS Desabilitado     | modules      | ✅ INATIVO
✅ RLS Desabilitado     | admins       | ✅ INATIVO
✅ Admin Cadastrado     | antoniovicelmo@gmail.com | ✅ OK
✅ Certificados c/ Mód. | antoniovicelmo@gmail.com | ✅ COM MÓDULOS
```

### **Após rebuild:**
- ✅ Botão "Admin" visível
- ✅ Módulos aparecem no certificado
- ✅ Logotipo da empresa aparece
- ✅ Nome da empresa e CNPJ aparecem
- ✅ Assinatura da diretora aparece

---

## 🚨 Se Não Funcionar

### **Problema: SQL dá erro**
**Possíveis causas:**
- Tabela não existe
- Sintaxe incompatível

**Solução:**
Execute em partes (copie uma seção por vez)

### **Problema: Módulos ainda não aparecem**
**Verifique:**
```sql
-- Ver se certificado tem course_id
SELECT id, course_title, course_id, course_modules
FROM certificates
WHERE user_email = 'antoniovicelmo@gmail.com'
LIMIT 1;
```

**Se course_id for NULL:**
- Certificado importado de CSV sem vínculo com curso
- Precisa associar manualmente OU
- Popular `course_modules` diretamente com JSON

### **Problema: Botão Admin ainda não aparece**
**Verifique:**
```sql
-- Ver se está cadastrado
SELECT * FROM admins WHERE email = 'antoniovicelmo@gmail.com';
```

**Se não aparecer linha:**
- Email pode estar diferente (case-sensitive)
- Execute novamente o INSERT

**Limpe o cache:**
- Ctrl+Shift+Delete (Chrome/Edge/Firefox)
- Cmd+Option+E (Safari)
- Ou abra aba anônima

---

## 📞 Debug Avançado

### **Ver logs do servidor:**
```bash
# No sandbox:
pm2 logs --nostream --lines 50
```

### **Testar API diretamente:**
```javascript
// No console do navegador (F12):

// Teste 1: Verificar admin
fetch('/api/admin/check')
  .then(r => r.json())
  .then(d => console.log('Admin:', d.isAdmin))

// Teste 2: Ver certificados
fetch('/api/my-certificates')
  .then(r => r.json())
  .then(d => console.log('Certificados:', d.certificates))
```

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- **`PROBLEMAS_E_SOLUCOES.md`** - Explicação técnica completa
- **`migrations/DEBUG_E_FIX_RLS.sql`** - Script com 6 partes de diagnóstico
- **`CERTIFICADO_ATUALIZADO.md`** - Documentação do novo certificado

---

## ⏱️ Tempo Total Estimado

| Etapa | Tempo |
|-------|-------|
| Abrir Supabase | 30s |
| Executar SQL | 1min |
| Aguardar resultado | 10s |
| Rebuild Easypanel | 2-5min |
| Testar aplicação | 1min |
| **TOTAL** | **5-8 minutos** |

---

## 🎉 Pronto!

Após seguir estes 3 passos:
- ✅ Módulos vão aparecer nos certificados
- ✅ Botão Admin vai aparecer no menu
- ✅ Sistema funcionando 100%

**Dúvidas?** Consulte `PROBLEMAS_E_SOLUCOES.md` para troubleshooting detalhado.

---

**Última Atualização:** 2025-01-25  
**Tempo de Execução:** 5-8 minutos  
**Dificuldade:** ⭐ Fácil (copiar e colar SQL)
