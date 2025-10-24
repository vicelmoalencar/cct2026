# Changelog - CCT Platform

## [2025-01-24] - Sistema de Upload de Certificados via Supabase Storage

### 🎉 Novidades

#### Upload Direto de Imagens de Certificado
- **Antes**: Admins precisavam fazer upload em serviços externos (Imgur, Cloudinary) e colar URL
- **Agora**: Upload direto no painel admin com interface drag & drop!

### ✨ Funcionalidades Adicionadas

1. **Interface de Upload Moderna**
   - Drag & drop de imagens
   - Preview da imagem antes de salvar
   - Visualização do template atual
   - Botão para alterar template existente

2. **Integração com Supabase Storage**
   - Bucket `certificate-templates` para armazenamento
   - Conversão automática de imagens para formato compatível
   - Upload via API do Supabase Storage
   - URLs públicas geradas automaticamente

3. **Validações de Upload**
   - Aceita apenas imagens (JPG, PNG, WebP, etc.)
   - Tamanho máximo: 5MB
   - Mensagens de erro claras
   - Preview em tempo real

4. **Armazenamento Organizado**
   - Estrutura: `/certificate-templates/{course_id}/{filename}`
   - Cada curso tem sua própria pasta
   - Substituição automática ao fazer novo upload

### 🔧 Alterações Técnicas

#### Backend (`src/index.tsx`)
- Endpoint `/api/admin/certificate-template` atualizado para aceitar base64
- Conversão de base64 para binary (Uint8Array)
- Upload para Supabase Storage via fetch API
- Geração automática de URL pública
- Salvamento da URL no banco de dados

#### Frontend (`public/static/admin.js`)
- Método `handleCertificateImageSelect()` para processar upload
- Conversão de arquivo para base64 via FileReader
- Preview da imagem selecionada
- Validação de tipo e tamanho
- Interface visual aprimorada no form de curso

#### Migrações
- `migrations/0004_storage_bucket.sql` - Script SQL para criar bucket e políticas RLS

### 📋 Configuração Necessária

**IMPORTANTE**: É necessário configurar o Supabase Storage antes de usar esta funcionalidade!

Consulte o arquivo `SUPABASE_STORAGE_SETUP.md` para instruções detalhadas:

**Passos rápidos:**
1. Acesse Supabase Dashboard → Storage
2. Crie bucket `certificate-templates` (marcar como público ✅)
3. Configure políticas RLS (public read, authenticated write)
4. Teste o upload no painel admin

### 🎯 Como Usar

**Para Administradores:**
1. Acesse painel Admin
2. Crie/edite um curso
3. Na seção "Template de Certificado":
   - Clique em "Fazer Upload do Template" (ou "Alterar Template")
   - Selecione uma imagem (JPG, PNG, etc.)
   - Veja o preview da imagem
4. Clique em "Salvar"
5. A imagem é automaticamente enviada ao Supabase Storage
6. URL pública é gerada e salva no banco

**Para Alunos:**
- Nenhuma mudança visível
- Certificados continuam sendo gerados automaticamente ao completar 100% do curso
- Visualização de certificados permanece a mesma

### 📚 Arquivos Alterados

```
src/index.tsx                        # Backend API - Upload para Storage
public/static/admin.js               # Frontend - Interface de upload
migrations/0004_storage_bucket.sql   # SQL para criar bucket
SUPABASE_STORAGE_SETUP.md           # Guia de configuração
README.md                            # Atualização da documentação
CHANGELOG.md                         # Este arquivo
```

### 🔄 Retrocompatibilidade

✅ **Totalmente compatível com certificados existentes**
- Certificados já gerados continuam funcionando
- URLs antigas (externas) continuam válidas
- Migração gradual possível

### 🐛 Correções de Bugs

- Nenhum bug conhecido nesta versão

### ⚡ Melhorias de Performance

- Upload direto elimina dependência de serviços externos
- CDN do Supabase garante entrega rápida das imagens
- Menos etapas no processo de configuração de certificados

### 📦 Dependências

- Nenhuma dependência nova
- Usa funcionalidades nativas do Supabase (Storage API)
- Compatível com todas as versões atuais

### 🔐 Segurança

- ✅ Validação de tipo de arquivo (apenas imagens)
- ✅ Validação de tamanho (máximo 5MB)
- ✅ Upload requer autenticação (admin only)
- ✅ Leitura pública para exibição de certificados
- ✅ RLS policies configuráveis no Supabase

### 🚀 Deploy

**Para aplicar esta atualização:**

1. **Pull do código**:
   ```bash
   git pull origin main
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Configure Supabase Storage**:
   - Siga instruções em `SUPABASE_STORAGE_SETUP.md`

4. **Deploy**:
   - Easypanel: Click "Rebuild"
   - Aguarde ~2 minutos

5. **Teste**:
   - Acesse painel admin
   - Tente fazer upload de uma imagem de certificado
   - Verifique se URL foi gerada corretamente

### 📝 Notas

- Esta é uma melhoria opcional - o sistema continua funcionando com URLs externas
- Recomendado migrar para Supabase Storage para melhor integração
- Certificados existentes não precisam ser re-enviados

### 🎓 Próximos Passos Sugeridos

1. Migrar certificados existentes para Supabase Storage
2. Adicionar editor de imagem integrado (crop, resize)
3. Suporte a templates de certificado com campos dinâmicos
4. Preview do certificado final antes de salvar

---

**Desenvolvido para**: Vicelmo - Servidor da Justiça do Trabalho  
**Data**: 24 de Janeiro de 2025  
**Versão**: 2.1.0
