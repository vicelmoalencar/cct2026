-- ============================================
-- FIX SUPABASE STORAGE POLICIES
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Passo 1: Garantir que o bucket existe e está público
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'certificate-templates',
  'certificate-templates',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']::text[];

-- Passo 2: Remover TODAS as políticas existentes
DO $$ 
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects'
        AND policyname LIKE '%certificate%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- Passo 3: Criar políticas SIMPLES e PERMISSIVAS
-- IMPORTANTE: Usando anon e authenticated sem restrições adicionais

-- Permitir QUALQUER PESSOA ler (para certificados públicos)
CREATE POLICY "certificate_templates_select_policy"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-templates');

-- Permitir QUALQUER USUÁRIO AUTENTICADO fazer upload
CREATE POLICY "certificate_templates_insert_policy"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'certificate-templates');

-- Permitir QUALQUER USUÁRIO AUTENTICADO atualizar
CREATE POLICY "certificate_templates_update_policy"
ON storage.objects FOR UPDATE
USING (bucket_id = 'certificate-templates');

-- Permitir QUALQUER USUÁRIO AUTENTICADO deletar
CREATE POLICY "certificate_templates_delete_policy"
ON storage.objects FOR DELETE
USING (bucket_id = 'certificate-templates');

-- Passo 4: Verificar as políticas criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname LIKE '%certificate%'
ORDER BY policyname;
