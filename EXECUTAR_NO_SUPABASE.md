# 🔧 Migration para corrigir campo teste_gratis

## ⚠️ PROBLEMA IDENTIFICADO

A função `get_lesson_with_module()` no banco de dados **NÃO retorna o campo `teste_gratis`**, causando inconsistência entre:
- Lista de cursos (mostra corretamente: 2 grátis + 1 premium)
- Menu lateral da aula (mostra incorretamente: todas as aulas sem o campo teste_gratis)

## ✅ SOLUÇÃO

Execute o SQL abaixo no **Supabase SQL Editor**:

### 📋 Acesse:
1. Vá para https://supabase.com/dashboard/project/ghdfouqzasvxlptbjkin/sql/new
2. Cole o SQL abaixo
3. Clique em "RUN"

### 📝 SQL para executar:

```sql
-- Drop existing function
DROP FUNCTION IF EXISTS get_lesson_with_module(BIGINT);

-- Recreate function with teste_gratis and other missing fields
CREATE OR REPLACE FUNCTION get_lesson_with_module(p_lesson_id BIGINT)
RETURNS TABLE (
  id BIGINT,
  module_id BIGINT,
  title TEXT,
  description TEXT,
  video_url TEXT,
  video_provider TEXT,
  video_id TEXT,
  duration_minutes INTEGER,
  order_index INTEGER,
  created_at TIMESTAMPTZ,
  module_title TEXT,
  course_id BIGINT,
  teste_gratis BOOLEAN,
  free_trial BOOLEAN,
  support_text TEXT,
  transcript TEXT,
  attachments JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.module_id,
    l.title,
    l.description,
    l.video_url,
    l.video_provider,
    l.video_id,
    l.duration_minutes,
    l.order_index,
    l.created_at,
    m.title as module_title,
    m.course_id,
    l.teste_gratis,
    l.free_trial,
    l.support_text,
    l.transcript,
    l.attachments
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  WHERE l.id = p_lesson_id;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_lesson_with_module(BIGINT) TO anon, authenticated;
```

## 🎯 O que isso faz:

1. **Remove a função antiga** que não tinha o campo `teste_gratis`
2. **Cria nova função** incluindo:
   - `teste_gratis` - Campo principal de controle de acesso
   - `free_trial` - Campo alternativo
   - `support_text` - Texto de apoio da aula
   - `transcript` - Transcrição da aula
   - `attachments` - Anexos da aula
3. **Concede permissões** para usuários anônimos e autenticados

## ✅ Após executar:

1. Verifique se não há erros na execução
2. O servidor já está preparado para receber o novo campo
3. Teste novamente o menu lateral - agora deve mostrar corretamente:
   - 🎁 Grátis (Introdução, Aula 1)
   - 👑 Premium (Aula 2, Aula 3, Horas extras, Impugnação)

## 📊 Resultado esperado:

**Lista de cursos**: 
- Introdução (Grátis)
- Aula 1 (Grátis)
- Aula 2 (Premium) 🔒

**Menu lateral**:
- Introdução (Grátis)
- Aula 1 (Grátis)
- Aula 2 (Premium) 🔒
- Aula 3 (Premium) 🔒
- Horas extras (Premium) 🔒
- Impugnação (Premium) 🔒

## 🚀 Após executar no Supabase:

```bash
# Não precisa reiniciar o servidor
# O sistema já vai começar a receber o campo correto
```

---

**Arquivo da migration**: `migrations/0018_add_teste_gratis_to_lesson_function.sql`
