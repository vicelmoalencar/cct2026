# 🔍 Debug: Certificados no banco mas não aparecem no frontend

## ✅ Situação Atual

**Banco de dados (Supabase):**
- ✅ 6 certificados existem
- ✅ `user_email` = antoniovicelmo@gmail.com
- ✅ `verification_code` preenchido (CCT-2025-XXXXX)
- ✅ Todos visíveis na tabela do Supabase

**Frontend (Plataforma):**
- ❌ Botão "Certificados" não mostra nada
- ❌ Ou mostra mensagem "Nenhum certificado disponível"

**Possíveis causas:**
1. Cache do navegador
2. Token de autenticação desatualizado
3. API retornando vazio
4. Erro JavaScript silencioso
5. RLS (Row Level Security) bloqueando consulta

---

## 🚀 Solução Passo a Passo

### **PASSO 1: Verificar RLS (Mais provável)**

Execute no **Supabase SQL Editor**:

```sql
-- Ver se RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'certificates';
```

**Resultado esperado:**
- `rowsecurity = false` → RLS desabilitado (OK)
- `rowsecurity = true` → RLS habilitado (PROBLEMA!)

**Se RLS estiver habilitado, execute:**

```sql
-- Desabilitar RLS na tabela certificates
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;

-- Verificar novamente
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'certificates';
```

---

### **PASSO 2: Limpar Cache e Testar**

1. **Abra o navegador em aba anônima** (Ctrl+Shift+N no Chrome)
2. **Acesse a plataforma**
3. **Faça login** com `antoniovicelmo@gmail.com`
4. **Clique em "Certificados"**

Se aparecer → Era cache!  
Se não aparecer → Vá para Passo 3

---

### **PASSO 3: Testar API Diretamente**

1. **Faça login na plataforma** (aba normal)
2. **Abra Console do navegador** (F12 → Console)
3. **Cole e execute:**

```javascript
fetch('/api/my-certificates')
  .then(r => r.json())
  .then(data => {
    console.log('Resposta da API:', data);
    if (data.certificates) {
      console.log(`✅ ${data.certificates.length} certificados encontrados`);
      console.table(data.certificates);
    } else if (data.error) {
      console.error('❌ Erro:', data.error);
    } else {
      console.warn('⚠️ Resposta inesperada:', data);
    }
  })
  .catch(err => console.error('❌ Erro de rede:', err));
```

**Possíveis resultados:**

#### **A) Sucesso - Mostra certificados:**
```json
✅ 6 certificados encontrados
[
  {
    "id": 5,
    "user_email": "antoniovicelmo@gmail.com",
    "user_name": "Vicelmo Alencar",
    "course_title": "PJECALCPLUS",
    "verification_code": "CCT-2025-09F80B59",
    ...
  }
]
```
→ **API funciona!** Problema está no JavaScript da página de certificados.

#### **B) Array vazio:**
```json
{
  "certificates": []
}
```
→ **API funciona mas não retorna dados.** Problema é RLS ou filtro SQL.

#### **C) Erro 401 Unauthorized:**
```json
{
  "error": "Unauthorized"
}
```
→ **Token inválido.** Faça logout e login novamente.

#### **D) Erro 500:**
```json
{
  "error": "Failed to get certificates"
}
```
→ **Erro no servidor.** Veja logs do PM2.

---

### **PASSO 4: Verificar Logs do Servidor**

```bash
pm2 logs cct-clube-calculo --nostream --lines 50
```

Procure por erros relacionados a:
- `/api/my-certificates`
- `certificates`
- SQL errors

---

### **PASSO 5: Verificar JavaScript da Página**

**No Console (F12), verifique se há erros:**

1. Recarregue a página `/certificates`
2. Olhe a aba **Console**
3. Procure erros em vermelho

Erros comuns:
- `Failed to fetch`
- `Unauthorized`
- `certificateManager is not defined`

---

## 🎯 Teste Rápido de RLS

Execute no **Supabase SQL Editor**:

```sql
-- Tentar buscar certificados como se fosse a API
SELECT * FROM certificates 
WHERE user_email = 'antoniovicelmo@gmail.com';
```

**Se retornar 6 linhas:** RLS não está bloqueando (OK)  
**Se retornar 0 linhas:** RLS está bloqueando! (Execute ALTER TABLE DISABLE RLS)

---

## 🔧 Solução Rápida para RLS

**Cole isso no Supabase SQL Editor:**

```sql
-- Desabilitar RLS em todas as tabelas relacionadas
ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE lessons DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;

-- Verificar
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('certificates', 'courses', 'modules', 'lessons', 'comments', 'user_progress');
```

**Resultado esperado:** Todas com `rowsecurity = false`

---

## 📱 Teste Alternativo: Acesso Direto ao Certificado

Se a API funciona mas a página não, teste acessar um certificado diretamente:

```
https://seu-dominio.com/api/certificates/5/html
```

Substitua `5` pelo ID do seu primeiro certificado.

**Se abrir o certificado HTML:** API funciona perfeitamente!  
**Se der erro 401:** Problema de autenticação.  
**Se der erro 404:** Certificado não encontrado.

---

## 🎬 Próximos Passos

**Execute AGORA:**

1. **Passo 1:** Verificar RLS no Supabase
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'certificates';
   ```

2. **Se RLS = true:** Desabilitar
   ```sql
   ALTER TABLE certificates DISABLE ROW LEVEL SECURITY;
   ```

3. **Passo 2:** Aba anônima → Login → Certificados

4. **Passo 3:** Console (F12) → Teste API com JavaScript acima

5. **Me diga o resultado** do teste da API (console.log)

---

## 📊 Checklist de Debug

- [ ] RLS verificado (true/false?)
- [ ] RLS desabilitado (se estava true)
- [ ] Teste em aba anônima
- [ ] Teste API no console (F12)
- [ ] Resultado da API (vazio/com dados/erro?)
- [ ] Logs do PM2 verificados
- [ ] Erros no console do navegador?

---

## 🆘 Se Nada Funcionar

**Me envie:**

1. **Resultado do RLS:**
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'certificates';
   ```

2. **Resultado do teste da API** (console.log do JavaScript)

3. **Screenshot dos erros** no Console (F12)

4. **Últimas 30 linhas dos logs:**
   ```bash
   pm2 logs cct-clube-calculo --nostream --lines 30
   ```

Com essas informações, identifico o problema exato!

---

**Comece pelo PASSO 1 (verificar RLS) e me diga o resultado!** 🚀
