# 🔧 Solução Definitiva - Erro 403 Storage

## O Problema

Você está recebendo erro **403 Unauthorized** porque as políticas RLS estão bloqueando o upload.

## ✅ Solução Via Interface (MAIS FÁCIL)

### **Opção 1: Desabilitar RLS Temporariamente (Teste Rápido)**

1. Acesse: https://supabase.com/dashboard/project/ghdfouqzasvxlptbjkin/storage/buckets/certificate-templates
2. Clique na aba **"Policies"**
3. No topo da página, você verá: **"Enable RLS"** com um toggle
4. **DESATIVE o RLS** (toggle para OFF/cinza)
5. Teste o upload novamente na plataforma

⚠️ **ATENÇÃO**: Isso deixa o bucket completamente aberto. Use apenas para teste!

---

### **Opção 2: Configurar Políticas pela Interface**

Se você quer manter o RLS ativo (recomendado):

1. Acesse: https://supabase.com/dashboard/project/ghdfouqzasvxlptbjkin/storage/buckets/certificate-templates
2. Vá na aba **"Policies"**
3. **Delete todas as políticas existentes** (clique no ícone de lixeira em cada uma)
4. Clique em **"New Policy"**

#### **Criar 4 Políticas Novas:**

**Política 1: Leitura Pública**
- Nome: `Public Read`
- Allowed operation: **SELECT**
- Target roles: Deixe vazio ou selecione `public`
- Policy definition: 
  ```sql
  bucket_id = 'certificate-templates'
  ```

**Política 2: Insert para Autenticados**
- Nome: `Authenticated Insert`
- Allowed operation: **INSERT**
- Target roles: Deixe vazio
- WITH CHECK expression:
  ```sql
  bucket_id = 'certificate-templates'
  ```

**Política 3: Update para Autenticados**
- Nome: `Authenticated Update`
- Allowed operation: **UPDATE**
- Target roles: Deixe vazio
- USING expression:
  ```sql
  bucket_id = 'certificate-templates'
  ```

**Política 4: Delete para Autenticados**
- Nome: `Authenticated Delete`
- Allowed operation: **DELETE**
- Target roles: Deixe vazio
- USING expression:
  ```sql
  bucket_id = 'certificate-templates'
  ```

---

## ✅ Solução Via SQL (MAIS RÁPIDO)

Execute este SQL no **SQL Editor**:

```sql
-- 1. Desabilitar RLS no bucket temporariamente para limpar
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- 2. Remover todas as políticas antigas
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND policyname ILIKE '%certificate%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- 3. Reabilitar RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas super permissivas
CREATE POLICY "cert_select"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-templates');

CREATE POLICY "cert_insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificate-templates');

CREATE POLICY "cert_update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certificate-templates');

CREATE POLICY "cert_delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'certificate-templates');

-- 5. Verificar
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE 'cert_%';
```

---

## 🧪 Teste Rápido: Desabilitar RLS Completamente

Se nada funcionar, teste com RLS desabilitado:

```sql
-- APENAS PARA TESTE
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

Depois de testar e confirmar que funciona, reabilite:

```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

E configure as políticas corretamente.

---

## 🔍 Verificar Status Atual

Execute para ver o que está configurado:

```sql
-- Ver se RLS está ativo
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- Ver políticas existentes
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
ORDER BY policyname;

-- Ver configuração do bucket
SELECT id, name, public, file_size_limit
FROM storage.buckets
WHERE id = 'certificate-templates';
```

---

## 🎯 Ordem de Tentativas

Tente nesta ordem:

1. ✅ **Desabilitar RLS** → Teste → Se funcionar, problema é nas políticas
2. ✅ **SQL de limpeza** → Criar políticas novas → Teste
3. ✅ **Interface do Supabase** → Deletar e recriar políticas manualmente

---

## 📞 Se Nada Funcionar

Me envie o resultado destes comandos:

```sql
-- Comando 1
SELECT * FROM storage.buckets WHERE id = 'certificate-templates';

-- Comando 2
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname ILIKE '%cert%';

-- Comando 3
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'objects' AND schemaname = 'storage';
```

E tire screenshots:
1. Da aba Policies do bucket
2. Do console do navegador (F12)
3. Do erro completo

---

**RECOMENDAÇÃO**: Comece desabilitando RLS para confirmar que é esse o problema!
