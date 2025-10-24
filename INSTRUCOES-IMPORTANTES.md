# 🚨 INSTRUÇÕES IMPORTANTES - LEIA PRIMEIRO!

## ⚠️ Por que os campos não aparecem?

Os campos de **Texto de Apoio**, **Transcrição** e **Arquivos** não estão aparecendo na tela de assistir aula porque:

1. ❌ O SQL ainda não foi executado no Supabase
2. ❌ Os campos ainda não existem na tabela `lessons` do banco de dados
3. ❌ A função RPC ainda não foi atualizada

## ✅ Como resolver (2 minutos):

### PASSO 1: Execute o SQL no Supabase

1. Acesse: https://supabase.com/dashboard/project/ghdfouqzasvxlptbjkin/sql/new

2. Copie TODO o conteúdo do arquivo: **`EXECUTE-THIS-SQL.sql`**

3. Cole no SQL Editor e clique em **RUN**

4. Você verá uma mensagem de sucesso ✅

### PASSO 2: Teste com uma aula existente

Depois de executar o SQL, você tem 2 opções:

**Opção A: Adicionar dados via Admin Panel**
1. Acesse: https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai
2. Faça login como admin
3. Vá em "Aulas" → Edite uma aula existente
4. Preencha os campos:
   - Texto de Apoio
   - Transcrição
   - Upload de arquivos
5. Salve

**Opção B: Adicionar dados via SQL (mais rápido para testar)**
1. No SQL Editor do Supabase, execute:

```sql
UPDATE lessons 
SET 
  support_text = 'Este é um texto de apoio de exemplo com conteúdo complementar.',
  transcript = 'Transcrição completa do vídeo da aula...',
  attachments = '[]'::jsonb
WHERE id = 1;
```

### PASSO 3: Verifique na página da aula

1. Acesse a aplicação
2. Entre em qualquer curso
3. Clique em uma aula
4. Role até o final da página (abaixo dos comentários)
5. Você verá as seções colapsáveis! 🎉

## 📋 O que você verá depois:

### Na parte inferior da página da aula:

**1. 📄 Texto de Apoio** (se tiver conteúdo)
- Botão colapsável azul
- Ao clicar, expande mostrando o texto

**2. 📎 Arquivos para Download** (se tiver arquivos)
- Botão colapsável verde
- Mostra quantidade de arquivos
- Cards com ícone, nome, tamanho e botão de download

**3. 💬 Transcrição do Vídeo** (se tiver transcrição)
- Botão colapsável roxo
- Texto em fonte monoespaçada

## 🔧 Arquivos importantes:

- **`EXECUTE-THIS-SQL.sql`** → SQL completo para executar no Supabase
- **`add-lesson-fields.sql`** → Apenas adiciona os campos (parte 1)
- **`update-rpc-with-new-fields.sql`** → Atualiza função RPC (parte 2)

## ⚡ Resumo rápido:

1. ✅ Execute `EXECUTE-THIS-SQL.sql` no Supabase
2. ✅ Edite uma aula no admin ou adicione dados via SQL
3. ✅ Acesse a aula e veja as seções colapsáveis na parte inferior

## 🆘 Se ainda não aparecer:

1. Verifique no SQL Editor se os campos existem:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'lessons' 
  AND column_name IN ('support_text', 'transcript', 'attachments');
```

2. Verifique se a aula tem conteúdo:
```sql
SELECT id, title, support_text, transcript, attachments 
FROM lessons 
WHERE id = 1;
```

3. Limpe o cache do navegador (Ctrl+Shift+R)

---

**Dúvidas?** Me chame que te ajudo! 😊
