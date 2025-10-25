# 📜 Sistema de Certificados - Instruções de Implantação

## ✅ Melhorias Implementadas

### 🎯 O que mudou:
1. **Certificados em HTML** (não mais imagem) - Template profissional e elegante
2. **Geração de PDF** via impressão do navegador (Ctrl+P / Cmd+P)
3. **Código de verificação único** para cada certificado (ex: CCT-2025-A1B2C3D4)
4. **Página pública de verificação** - Qualquer pessoa pode validar em `/verificar/:codigo`
5. **Área do aluno** - Certificados aparecem automaticamente após login baseado no email
6. **Link de compartilhamento** - Fácil de enviar para validação por terceiros
7. **Contador de verificações** - Sabe quantas vezes o certificado foi verificado

---

## 📋 Passos para Ativar o Sistema

### 1️⃣ Aplicar Migration no Supabase

Acesse o **Supabase SQL Editor** e execute o script:

```sql
-- Localização: migrations/0013_certificates_verification_system.sql
```

**O que esta migration faz:**
- ✅ Adiciona coluna `verification_code` (código único de verificação)
- ✅ Adiciona coluna `pdf_url` (URL do PDF gerado - opcional)
- ✅ Adiciona coluna `is_verified` (indica se certificado é válido)
- ✅ Adiciona coluna `verification_count` (conta quantas verificações)
- ✅ Cria função `generate_verification_code()` para gerar códigos únicos
- ✅ Atualiza todos os certificados existentes com código de verificação
- ✅ Cria índices para performance

**Resultado esperado:**
```
SELECT verification_code, user_email, course_title 
FROM certificates 
LIMIT 5;
```

Deve mostrar códigos como: `CCT-2025-A1B2C3D4`

---

### 2️⃣ (OPCIONAL) Reimportar Certificados CSV

Se você ainda não importou o arquivo `certificados.csv`:

1. Acesse o **Admin Panel** (botão Admin no header)
2. Vá para aba **Certificados**
3. Clique em **Importar CSV de Certificados**
4. Selecione o arquivo `certificados.csv`
5. Aguarde a importação (~170 certificados)

**Observação:** Se os certificados já foram importados ANTES da migration 0013, você precisa:

**Opção A - Atualizar códigos via SQL:**
```sql
-- Gerar códigos para certificados sem código
UPDATE certificates 
SET verification_code = generate_verification_code()
WHERE verification_code IS NULL OR verification_code = '';
```

**Opção B - Reimportar (limpar e importar novamente):**
```sql
-- CUIDADO: Isso apaga TODOS os certificados!
DELETE FROM certificates;
```
Depois importe novamente via Admin Panel.

---

### 3️⃣ Testar o Sistema

#### 🔐 Como usuário (aluno):

1. **Faça login** com um email que tem certificado
   - Exemplo: Use um dos emails do arquivo `certificados.csv`
   - Se não tiver conta, crie usando o script `SQL_CRIAR_USUARIOS_AUTH.sql`

2. **Clique no botão "Certificados"** no header (botão amarelo)
   - Ou acesse: `https://seu-dominio.com/certificates`

3. **Visualize seus certificados:**
   - Botão **"Visualizar Certificado"** - Abre certificado em nova aba
   - Botão **"Baixar PDF"** - Abre janela de impressão (salve como PDF)
   - Botão **"Compartilhar Link"** - Copia link de verificação

4. **Baixar PDF:**
   - Clique em "Baixar PDF"
   - Aguarde nova janela abrir
   - Use `Ctrl+P` (Windows) ou `Cmd+P` (Mac)
   - Selecione "Salvar como PDF"
   - Escolha destino e salve

#### 🔍 Verificação Pública:

1. **Copie o código de verificação** de algum certificado
   - Exemplo: `CCT-2025-A1B2C3D4`

2. **Acesse a URL pública:**
   ```
   https://seu-dominio.com/verificar/CCT-2025-A1B2C3D4
   ```

3. **Resultado:**
   - ✅ **Válido:** Mostra dados do aluno, curso, carga horária, datas
   - ❌ **Inválido:** Mostra mensagem "Certificado não encontrado"
   - 📊 **Contador:** Incrementa toda vez que alguém verifica

#### 🛠️ Como Admin:

1. **Acesse Admin Panel**
2. **Vá para aba Certificados**
3. **Veja nova coluna "Código Verificação"**
4. **Botão "👁️" (olho)** - Visualiza o certificado
5. **Link "Verificar"** - Abre página de verificação pública

---

## 🎨 Recursos do Certificado HTML

### Design Profissional:
- ✅ Borda dupla elegante (azul e cinza escuro)
- ✅ Marca d'água "CCT 2026" em diagonal
- ✅ Layout landscape (A4 horizontal)
- ✅ Fonte serifada (Georgia, Times)
- ✅ Gradiente de fundo (roxo → azul)
- ✅ Código de verificação no rodapé direito
- ✅ Linha de assinatura digital

### Campos Exibidos:
- 👤 Nome do aluno (destaque azul)
- 📚 Nome do curso (destaque negrito)
- ⏱️ Carga horária (em horas)
- 📅 Data de conclusão
- 📅 Data de emissão
- 🔐 Código de verificação único
- 🌐 URL de verificação

---

## 🔗 URLs Importantes

### Para Usuários Logados:
- `/certificates` - Lista de certificados do usuário
- `/api/my-certificates` - API JSON com certificados
- `/api/certificates/:id/html` - Gera HTML do certificado

### Públicas (sem login):
- `/verificar/:codigo` - Página de verificação HTML
- `/api/verify/:codigo` - API JSON de verificação

### Admin:
- Admin Panel → Aba Certificados - Gerenciar certificados

---

## 📊 Estatísticas Disponíveis

No **Admin Panel → Certificados**, você vê:

1. **Total de Certificados** - Quantidade emitida
2. **Alunos Certificados** - Emails únicos
3. **Cursos Diferentes** - Variedade de cursos
4. **Filtros:**
   - 🔍 Buscar por email, nome ou curso
   - 📚 Filtrar por curso específico
   - 🧹 Limpar filtros

---

## 🚀 Próximos Passos Opcionais

### 1. Criar Contas de Autenticação

Se os usuários dos certificados ainda não têm contas:

```bash
# Execute o script SQL (veja SQL_CRIAR_USUARIOS_AUTH.sql)
# Ou use o script Node.js (veja criar_usuarios_auth_api.js)
```

Isso criará contas para todos os emails da tabela `certificates`.

### 2. Notificar Usuários

Envie um email para cada usuário informando:
- ✉️ Que eles têm certificado(s) disponível(is)
- 🔑 Credenciais de acesso (email + senha padrão: 123456)
- 🌐 Link da plataforma
- 📜 Como baixar o certificado em PDF
- 🔗 Link de verificação pública

**Template de email:**
```
Assunto: Seu certificado CCT 2026 está disponível!

Olá [NOME],

Parabéns! Seu certificado de conclusão do curso "[CURSO]" está disponível.

🎓 Acesse: https://seu-dominio.com
📧 Email: [EMAIL]
🔑 Senha: 123456

Após o login, clique em "Certificados" para:
- Visualizar seu certificado
- Baixar PDF
- Compartilhar link de verificação

Código de verificação: [CODIGO]
Link direto: https://seu-dominio.com/verificar/[CODIGO]

Atenciosamente,
CCT 2026
```

### 3. Personalizar Template

Se quiser alterar o design do certificado, edite:
- **Arquivo:** `src/index.tsx`
- **Função:** `generateCertificateHTML()`
- **Linha:** ~1302 (procure por "CERTIFICATE HTML TEMPLATE GENERATOR")

**Dica:** Mantenha os placeholders `${data.xxx}` intactos.

---

## 🐛 Troubleshooting

### Problema: Certificados não aparecem para o usuário

**Solução:**
```sql
-- Verificar se email do usuário corresponde aos certificados
SELECT user_email, course_title 
FROM certificates 
WHERE user_email = 'email@exemplo.com';

-- Se não aparecer nada, o email está errado ou certificado não existe
```

### Problema: Código de verificação não funciona

**Solução:**
```sql
-- Verificar se código existe
SELECT * FROM certificates 
WHERE verification_code = 'CCT-2025-XXXXX';

-- Gerar códigos para certificados sem código
UPDATE certificates 
SET verification_code = generate_verification_code()
WHERE verification_code IS NULL OR verification_code = '';
```

### Problema: PDF não gera corretamente

**Solução:**
- Certifique-se que o navegador está atualizado
- Use Chrome, Edge ou Firefox (melhor suporte a impressão)
- Na janela de impressão, selecione:
  - Destino: **Salvar como PDF**
  - Layout: **Paisagem** (landscape)
  - Margens: **Padrão**
  - Tamanho: **A4**

### Problema: Admin não vê botão de visualizar

**Solução:**
```sql
-- Certificado precisa ter verification_code
UPDATE certificates 
SET verification_code = generate_verification_code()
WHERE verification_code IS NULL;
```

---

## 📝 Resumo das Mudanças

| Antes | Depois |
|-------|--------|
| Certificado em imagem estática | Certificado HTML dinâmico |
| Sem validação | Código de verificação único |
| Sem rastreamento | Contador de verificações |
| Download manual | Botão "Baixar PDF" |
| Sem área do aluno | Página `/certificates` |
| Sem verificação pública | Página `/verificar/:codigo` |

---

## ✅ Checklist de Implantação

- [ ] Migration 0013 aplicada no Supabase
- [ ] Verificado que códigos foram gerados (`SELECT verification_code FROM certificates LIMIT 5`)
- [ ] (Opcional) CSV de certificados importado
- [ ] (Opcional) Contas de usuários criadas com `SQL_CRIAR_USUARIOS_AUTH.sql`
- [ ] Testado login de usuário com certificado
- [ ] Testado visualização de certificados em `/certificates`
- [ ] Testado download de PDF
- [ ] Testado verificação pública em `/verificar/:codigo`
- [ ] Admin panel mostrando códigos de verificação
- [ ] Pronto para notificar usuários via email

---

## 🎉 Pronto!

Seu sistema de certificados agora está completo e profissional!

Se tiver dúvidas, verifique:
- **Logs do servidor:** `pm2 logs cct-clube-calculo --nostream`
- **Console do navegador:** F12 → Console
- **SQL direto:** Use o SQL Editor do Supabase

**Documentação criada em:** 2025-10-25
**Última atualização:** Sistema CCT 2026
