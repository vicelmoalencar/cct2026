# 🔧 Problemas Identificados e Soluções

## 📋 Problemas Reportados

1. ❌ **Módulos não aparecem no certificado**
2. ❌ **Botão de Admin não aparece**

---

## 🔍 Causa Raiz: Row Level Security (RLS)

Ambos os problemas são causados por **RLS (Row Level Security)** habilitado no PostgreSQL/Supabase que está **bloqueando as queries**.

### **O que é RLS?**
- Sistema de segurança do PostgreSQL
- Filtra linhas da tabela com base em políticas
- Pode bloquear queries mesmo com credenciais válidas

### **Por que está bloqueando?**
```sql
-- RLS habilitado + Políticas restritivas = Queries bloqueadas
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
```

---

## 🎯 Problema 1: Módulos não aparecem

### **Causa Técnica:**
1. RLS habilitado na tabela `modules`
2. Query `SELECT * FROM modules WHERE course_id = X` é **bloqueada**
3. Backend não consegue buscar módulos
4. Certificado é gerado sem a seção de módulos

### **Evidência no Código:**
```typescript
// src/index.tsx linha 1784
const courseModules = await supabase.query('modules', {
  select: 'title, order_index',
  filters: { course_id: cert.course_id },
  order: 'order_index.asc'
})
// ❌ Retorna [] vazio por causa do RLS
```

### **Soluções:**

#### **Solução A: Desabilitar RLS (RÁPIDO)**
```sql
-- No Supabase SQL Editor:
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
```
✅ **Vantagens:** Imediato, simples  
⚠️ **Desvantagens:** Remove proteção de segurança

#### **Solução B: Ajustar Políticas RLS (RECOMENDADO)**
```sql
-- Permitir leitura pública de módulos
DROP POLICY IF EXISTS "Anyone can view modules" ON modules;
CREATE POLICY "Anyone can view modules"
  ON modules FOR SELECT
  USING (true);

-- Permitir leitura de certificados por email
DROP POLICY IF EXISTS "Users can view own certificates" ON certificates;
CREATE POLICY "Users can view own certificates"
  ON certificates FOR SELECT
  USING (auth.jwt() ->> 'email' = user_email);
```
✅ **Vantagens:** Mantém segurança  
⚠️ **Desvantagens:** Mais complexo

#### **Solução C: Popular course_modules com JSON**
```sql
-- Pré-armazenar módulos no certificado (ignora RLS)
UPDATE certificates c
SET course_modules = (
  SELECT json_agg(
    json_build_object('title', m.title, 'order', m.order_index)
    ORDER BY m.order_index
  )::TEXT
  FROM modules m
  WHERE m.course_id = c.course_id
)
WHERE c.course_id IS NOT NULL;
```
✅ **Vantagens:** Não depende de query runtime  
⚠️ **Desvantagens:** Precisa atualizar quando módulos mudam

---

## 🎯 Problema 2: Botão Admin não aparece

### **Causa Técnica:**
1. RLS habilitado na tabela `admins`
2. Query `SELECT * FROM admins WHERE email = X` é **bloqueada**
3. Função `isAdmin()` retorna `false`
4. Frontend esconde botão de admin

### **Evidência no Código:**
```typescript
// src/index.tsx linha 704-710
async function isAdmin(email: string, supabaseUrl: string, supabaseKey: string) {
  try {
    const supabase = new SupabaseClient(supabaseUrl, supabaseKey)
    const result = await supabase.query('admins', {
      select: '*',
      filters: { email },
      single: true
    })
    return result !== null  // ❌ Sempre retorna null por causa do RLS
  } catch (error) {
    return false
  }
}
```

### **Soluções:**

#### **Solução A: Desabilitar RLS (RÁPIDO)**
```sql
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
```
✅ **Vantagens:** Imediato  
⚠️ **Desvantagens:** Admins ficam públicos (não é grave, mas não é ideal)

#### **Solução B: Ajustar Política RLS (RECOMENDADO)**
```sql
-- Permitir que qualquer autenticado consulte admins
DROP POLICY IF EXISTS "Authenticated users can view admins" ON admins;
CREATE POLICY "Authenticated users can view admins"
  ON admins FOR SELECT
  TO authenticated
  USING (true);
```
✅ **Vantagens:** Mantém controle  
⚠️ **Desvantagens:** Requer conhecimento de RLS

#### **Solução C: Usar Service Role Key**
```typescript
// Backend precisa usar SUPABASE_SERVICE_ROLE_KEY ao invés de ANON_KEY
const supabase = new SupabaseClient(
  supabaseUrl, 
  supabaseServiceRoleKey  // ✅ Ignora RLS
)
```
✅ **Vantagens:** Bypassa RLS quando necessário  
⚠️ **Desvantagens:** Precisa adicionar variável de ambiente

---

## 🚀 Script de Correção Rápida

Execute este SQL no Supabase para resolver **AMBOS** os problemas:

```sql
-- ============================================
-- FIX RÁPIDO: Desabilitar RLS
-- ============================================

-- 1. Desabilitar RLS em todas as tabelas relevantes
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- 2. Aplicar Migration 0014 (adicionar coluna course_modules)
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS course_modules TEXT;

CREATE INDEX IF NOT EXISTS idx_certificates_with_modules 
ON certificates(id) 
WHERE course_modules IS NOT NULL;

-- 3. Popular módulos nos certificados existentes
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

-- 4. Adicionar seu email como admin
INSERT INTO admins (email, name)
VALUES ('antoniovicelmo@gmail.com', 'ANTONIO VICELMO')
ON CONFLICT (email) DO NOTHING;

-- 5. Verificar resultados
SELECT 'RLS Status' as check_type, tablename, rowsecurity as enabled
FROM pg_tables 
WHERE tablename IN ('certificates', 'modules', 'admins')
UNION ALL
SELECT 'Admin Check', email, 'true'
FROM admins 
WHERE email = 'antoniovicelmo@gmail.com'
UNION ALL
SELECT 'Modules Check', course_title, 
  CASE 
    WHEN course_modules IS NULL THEN 'NO MODULES'
    ELSE 'HAS MODULES'
  END
FROM certificates 
WHERE user_email = 'antoniovicelmo@gmail.com'
LIMIT 3;
```

---

## ✅ Checklist de Verificação

### **Antes de executar o fix:**
- [ ] Fazer backup do banco (Supabase > Database > Backups)
- [ ] Ler o script `DEBUG_E_FIX_RLS.sql` completamente
- [ ] Entender o que cada comando faz

### **Executar o fix:**
- [ ] Copiar o script acima
- [ ] Abrir Supabase SQL Editor
- [ ] Colar e executar (Ctrl+Enter)
- [ ] Verificar resultados da última query

### **Após executar o fix:**
- [ ] RLS desabilitado em `certificates`, `modules`, `admins`
- [ ] Coluna `course_modules` existe
- [ ] Certificados têm módulos populados
- [ ] Email está na tabela `admins`

### **Testar no aplicativo:**
- [ ] Fazer logout e login novamente
- [ ] Verificar se botão "Admin" aparece
- [ ] Clicar em "Certificados"
- [ ] Abrir um certificado
- [ ] Verificar se módulos aparecem
- [ ] Baixar PDF e verificar módulos

### **Deploy em produção:**
- [ ] Rebuild no Easypanel
- [ ] Aguardar 2-5 minutos
- [ ] Testar em produção

---

## 🔍 Como Diagnosticar

### **Teste 1: RLS Status**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('certificates', 'modules', 'admins', 'courses');
```
**Esperado:**
```
tablename      | rowsecurity
---------------|-------------
certificates   | f  (false = desabilitado)
modules        | f
admins         | f
courses        | f
```

### **Teste 2: Módulos no Certificado**
```sql
SELECT 
  id,
  course_title,
  course_id,
  course_modules
FROM certificates
WHERE user_email = 'antoniovicelmo@gmail.com'
LIMIT 1;
```
**Esperado:** `course_modules` contém JSON com array de módulos

### **Teste 3: Admin Cadastrado**
```sql
SELECT * FROM admins WHERE email = 'antoniovicelmo@gmail.com';
```
**Esperado:** 1 linha com seu email

### **Teste 4: Módulos no Curso**
```sql
SELECT 
  c.id,
  c.title,
  COUNT(m.id) as total_modules
FROM courses c
LEFT JOIN modules m ON m.course_id = c.id
GROUP BY c.id, c.title
HAVING COUNT(m.id) > 0
LIMIT 5;
```
**Esperado:** Lista de cursos com módulos

---

## 📞 Se Ainda Não Funcionar

### **Problema: Módulos não aparecem AINDA**

**Verifique:**
1. `course_id` não é NULL no certificado?
2. Curso realmente tem módulos cadastrados?
3. JSON em `course_modules` está válido?

**Teste manual:**
```sql
-- Ver certificado específico
SELECT * FROM certificates WHERE id = 1;

-- Ver módulos do curso
SELECT * FROM modules WHERE course_id = (
  SELECT course_id FROM certificates WHERE id = 1
);
```

### **Problema: Botão Admin não aparece AINDA**

**Verifique:**
1. Email cadastrado corretamente (case-sensitive)?
2. Fez logout/login após adicionar admin?
3. Navegador não está com cache antigo?

**Teste no console (F12):**
```javascript
fetch('/api/admin/check')
  .then(r => r.json())
  .then(data => console.log('Admin status:', data.isAdmin))
// Esperado: true
```

**Limpar cache:**
- Chrome/Edge: Ctrl+Shift+Delete
- Firefox: Ctrl+Shift+Delete
- Safari: Cmd+Option+E

---

## 🎓 Entendendo RLS

### **Por que RLS existe?**
- Proteger dados sensíveis
- Multi-tenancy (vários usuários/empresas no mesmo banco)
- Compliance (LGPD, GDPR)

### **Quando desabilitar RLS?**
✅ **Sim:**
- Tabelas públicas (cursos, módulos)
- Ambiente de desenvolvimento/teste
- Quando políticas complexas causam problemas

❌ **Não:**
- Dados pessoais (users, passwords)
- Dados financeiros (payments, transactions)
- Produção sem políticas adequadas

### **Alternativas ao desabilitar RLS:**
1. **Políticas bem configuradas** (recomendado)
2. **Service Role Key** no backend (bypassa RLS)
3. **Armazenar dados no JSON** (evita queries extras)

---

## 📚 Arquivos de Referência

- **`migrations/DEBUG_E_FIX_RLS.sql`** - Script completo de diagnóstico e fix
- **`migrations/0014_add_modules_to_certificates.sql`** - Migration de módulos
- **`migrations/POPULAR_MODULOS_CERTIFICADOS.sql`** - Popular módulos existentes
- **`CERTIFICADO_ATUALIZADO.md`** - Documentação do novo certificado

---

**Última Atualização:** 2025-01-25  
**Status:** 🔴 Problemas identificados, soluções documentadas  
**Ação Necessária:** Executar `DEBUG_E_FIX_RLS.sql` no Supabase
