# 📸 Como Usar o Upload de Certificado

## Passo a Passo Para Ver a Opção de Upload

### ✅ Pré-requisitos

1. **Estar logado na plataforma**
2. **Ter permissão de administrador** (seu email deve estar na tabela `admins` do Supabase)
3. **Estar no painel admin**

---

## 🔐 Passo 1: Verificar se Você é Admin

### Como verificar:

1. **Acesse a plataforma**: https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai
2. **Faça login** com seu email e senha
3. **Verifique se o botão "Admin" aparece** no header (roxo)
   - ✅ **Se aparecer**: Você é admin, continue para o Passo 2
   - ❌ **Se NÃO aparecer**: Você precisa ser adicionado como admin primeiro

### Como adicionar seu email como admin:

Se você não vê o botão "Admin", execute no SQL Editor do Supabase:

```sql
-- Adicionar seu email como admin
INSERT INTO admins (email, created_at)
VALUES ('seu-email@exemplo.com', NOW())
ON CONFLICT (email) DO NOTHING;
```

**Substitua `seu-email@exemplo.com` pelo seu email real!**

---

## 🎛️ Passo 2: Acessar o Painel Admin

1. **Clique no botão "Admin"** (roxo) no header
2. **Você será levado ao Painel de Administração**
3. **Verá 3 abas**:
   - 📚 **Cursos**
   - 📁 **Módulos**
   - ▶️ **Aulas**

---

## ➕ Passo 3: Criar ou Editar um Curso

### Opção A: Criar Novo Curso

1. **Clique no botão verde "Novo Curso"**
2. **Preencha os dados do curso**:
   - Título (obrigatório)
   - Descrição
   - Duração em horas
   - Instrutor

### Opção B: Editar Curso Existente

1. **Encontre o curso na lista**
2. **Clique no botão azul "✏️" (Editar)** ao lado do curso

---

## 🎨 Passo 4: Encontrar a Seção de Upload

**Após abrir o formulário de curso, role para baixo até encontrar:**

```
┌─────────────────────────────────────────┐
│ 🏆 Template de Certificado              │
├─────────────────────────────────────────┤
│                                         │
│ [Se já houver template]                 │
│ ┌─────────────────────────────┐         │
│ │ Template atual:             │         │
│ │ [Imagem do certificado]     │         │
│ │ ✅ Template salvo           │         │
│ └─────────────────────────────┘         │
│                                         │
│ ┌─────────────────────────────┐         │
│ │  ┏━━━━━━━━━━━━━━━━━━━━━━┓  │         │
│ │  ┃ ☁️ Fazer Upload do    ┃  │         │
│ │  ┃    Template           ┃  │         │
│ │  ┗━━━━━━━━━━━━━━━━━━━━━━┛  │         │
│ │                             │         │
│ │  ℹ️ Faça upload da imagem    │         │
│ │  (JPG, PNG). Será          │         │
│ │  armazenada no Supabase    │         │
│ └─────────────────────────────┘         │
│                                         │
│ [Botão Salvar]  [Botão Cancelar]       │
└─────────────────────────────────────────┘
```

---

## 📤 Passo 5: Fazer Upload da Imagem

### Método 1: Clique para Selecionar

1. **Clique no botão amarelo "☁️ Fazer Upload do Template"**
2. **Selecione a imagem do seu computador**
3. **Aguarde o preview aparecer**

### Método 2: Drag & Drop (Arrastar e Soltar)

1. **Arraste a imagem do seu computador**
2. **Solte sobre a área tracejada**
3. **Aguarde o preview aparecer**

---

## 👀 Passo 6: Verificar o Preview

Após selecionar a imagem, você verá:

```
┌─────────────────────────────────────────┐
│ Nova imagem selecionada:                │
│ ┌─────────────────────────────┐         │
│ │ [Preview da imagem]         │         │
│ └─────────────────────────────┘         │
│ ℹ️ Clique em "Salvar" para fazer        │
│    upload desta imagem                  │
└─────────────────────────────────────────┘
```

---

## 💾 Passo 7: Salvar o Curso

1. **Clique no botão "Salvar"** no final do formulário
2. **Aguarde o processo**:
   - ⏳ Salvando dados do curso...
   - ⏳ Fazendo upload da imagem para Supabase Storage...
   - ⏳ Gerando URL pública...
   - ⏳ Salvando URL no banco de dados...
3. **Mensagem de sucesso**: "✅ Curso e template de certificado salvos com sucesso!"

---

## 🎉 Pronto!

Agora o certificado está configurado e será gerado automaticamente quando um aluno completar 100% do curso!

---

## ❓ Problemas Comuns

### "Não vejo o botão Admin"

**Solução**: Adicione seu email na tabela `admins` do Supabase:

```sql
INSERT INTO admins (email, created_at)
VALUES ('seu-email@exemplo.com', NOW());
```

### "Não vejo a seção Template de Certificado"

**Solução**: 
- Certifique-se de que está **dentro do formulário** de criar/editar curso
- Role a página **para baixo**
- A seção fica **após** os campos de Duração e Instrutor

### "Upload não funciona / Erro ao fazer upload"

**Possíveis causas**:

1. **Bucket não criado no Supabase Storage**:
   - Acesse Supabase Dashboard → Storage
   - Crie bucket `certificate-templates`
   - Marque como público ✅
   - Veja `SUPABASE_STORAGE_SETUP.md` para detalhes

2. **Imagem muito grande**:
   - Máximo: 5MB
   - Reduza o tamanho da imagem

3. **Formato não suportado**:
   - Use JPG, PNG ou WebP
   - Evite formatos exóticos

4. **Sem permissão de upload**:
   - Verifique se está logado
   - Verifique se é admin

---

## 🔍 Como Testar se Funcionou

1. **Vá para a aba "Cursos"** no painel admin
2. **Encontre o curso que você configurou**
3. **Clique em "Editar" novamente**
4. **Você deve ver**:
   - ✅ "Template atual:" com a imagem que você enviou
   - ✅ Mensagem "Template salvo no Supabase Storage"

---

## 🌐 URLs de Teste

- **Plataforma**: https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai
- **Produção**: https://ensinoplus-dev-cct2026.n697dr.easypanel.host

---

## 📞 Precisa de Ajuda?

Se ainda não conseguir ver a opção de upload:

1. Tire uma screenshot da tela
2. Verifique o console do navegador (F12 → Console)
3. Verifique se há erros JavaScript
4. Compartilhe as informações comigo para debug

---

**Data**: 24 de Janeiro de 2025  
**Versão**: 2.1.0
