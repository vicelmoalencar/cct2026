# Configuração do Supabase Storage para Certificados

## Passo 1: Criar o Bucket via Interface do Supabase

### Opção A: Via Dashboard (Recomendado)

1. **Acesse o Supabase Dashboard**: https://supabase.com/dashboard
2. **Vá para Storage**:
   - No menu lateral, clique em "Storage"
   - Clique em "Create a new bucket"
3. **Configure o bucket**:
   - **Name**: `certificate-templates`
   - **Public bucket**: ✅ **ATIVADO** (muito importante!)
   - **Allowed MIME types**: `image/*` (apenas imagens)
   - **Max file size**: `5MB`
4. **Clique em "Create bucket"**

### Opção B: Via SQL Editor

Caso prefira usar SQL:

```sql
-- Execute este script no SQL Editor do Supabase
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-templates', 'certificate-templates', true)
ON CONFLICT (id) DO NOTHING;
```

## Passo 2: Configurar Políticas de Acesso (RLS)

### Via Dashboard (Recomendado)

1. **Vá para Storage > certificate-templates**
2. **Clique em "Policies"**
3. **Adicione as seguintes políticas**:

#### Policy 1: Leitura Pública
- **Nome**: `Public can read certificate templates`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**: `bucket_id = 'certificate-templates'`

#### Policy 2: Upload Autenticado
- **Nome**: `Authenticated users can upload`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **Policy definition**: `bucket_id = 'certificate-templates'`

#### Policy 3: Atualização Autenticada
- **Nome**: `Authenticated users can update`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **Policy definition**: `bucket_id = 'certificate-templates'`

### Via SQL Editor

Caso prefira SQL, execute o arquivo `migrations/0004_storage_bucket.sql`:

```bash
# Execute no SQL Editor do Supabase
cat migrations/0004_storage_bucket.sql
```

## Passo 3: Verificar a Configuração

1. **Teste de Upload**:
   - Acesse o painel Admin da aplicação
   - Edite ou crie um curso
   - Tente fazer upload de uma imagem de certificado
   - Verifique se o upload foi bem-sucedido

2. **Teste de Acesso Público**:
   - Após fazer upload, a URL deve ser algo como:
     ```
     https://[PROJECT-ID].supabase.co/storage/v1/object/public/certificate-templates/[COURSE-ID]/[IMAGE-NAME]
     ```
   - Cole essa URL no navegador para verificar se a imagem é acessível

## Estrutura de Armazenamento

```
certificate-templates/
├── 1/                    # Course ID 1
│   └── certificado.jpg
├── 2/                    # Course ID 2
│   └── certificado.png
└── 3/                    # Course ID 3
    └── certificado.jpg
```

## Observações Importantes

1. **Bucket Público**: O bucket DEVE ser público para que os certificados possam ser visualizados sem autenticação
2. **Organização por Curso**: Cada curso tem sua própria pasta (ID do curso)
3. **Formato de Imagens**: Aceita JPG, PNG, WebP, etc.
4. **Tamanho Máximo**: 5MB por imagem (configurado no frontend)
5. **Substituição Automática**: Upload de nova imagem substitui a anterior automaticamente

## Solução de Problemas

### Erro: "Bucket does not exist"
- Certifique-se de que o bucket foi criado com o nome exato: `certificate-templates`

### Erro: "Access denied"
- Verifique se o bucket está configurado como público
- Verifique se as políticas RLS foram criadas corretamente

### Erro: "File too large"
- Reduza o tamanho da imagem para menos de 5MB
- Use ferramentas de compressão de imagem

### Imagem não carrega no certificado
- Verifique a URL gerada no banco de dados (tabela `certificate_templates`)
- Teste a URL diretamente no navegador
- Verifique se o bucket está público

## Exemplo de URL Gerada

```
https://xxxxxxxxxxx.supabase.co/storage/v1/object/public/certificate-templates/1/certificado-calculo-trabalhista.jpg
```

Onde:
- `xxxxxxxxxxx`: ID do seu projeto Supabase
- `1`: ID do curso
- `certificado-calculo-trabalhista.jpg`: Nome do arquivo

## Benefícios do Supabase Storage

✅ **Armazenamento integrado** - Tudo no mesmo lugar
✅ **URLs públicas** - Sem necessidade de serviços externos
✅ **Segurança** - Controle de acesso via RLS
✅ **Performance** - CDN global do Supabase
✅ **Custo** - Incluído no plano Supabase
✅ **Versionamento** - Substituição automática de templates

## Diferença do Método Anterior

### Antes (URL Externa):
- Precisava fazer upload em Imgur, Cloudinary, etc.
- Copiar e colar URL manualmente
- Dependência de serviços externos

### Agora (Supabase Storage):
- Upload direto no admin panel
- Arrastar e soltar imagem
- Tudo gerenciado internamente
- Sem dependências externas
