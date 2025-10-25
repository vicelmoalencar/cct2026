# ✅ Certificado Atualizado - CCT 2026

## 📋 Resumo das Alterações

O certificado foi completamente reformulado para incluir:

1. ✅ **Logotipo da Empresa** - SVG embutido no cabeçalho
2. ✅ **Nome da Empresa** - CENTRO DE ENSINO E APRENDIZAGEM PLUS LTDA
3. ✅ **CNPJ** - 35.537.045/0001-84
4. ✅ **Assinatura da Diretora** - NÁRGILA DE SOUZA SANTOS
5. ✅ **Módulos do Curso** - Lista de todos os módulos concluídos
6. ✅ **Layout Profissional** - Otimizado para impressão A4 landscape

---

## 🎨 Novo Design do Certificado

### **Cabeçalho**
```
┌────────────────────────────────────────────────────────┐
│  [LOGO SVG]  CENTRO DE ENSINO E           CCT 2026     │
│              APRENDIZAGEM PLUS LTDA                     │
│              CNPJ: 35.537.045/0001-84                   │
└────────────────────────────────────────────────────────┘
```

### **Corpo do Certificado**
- Título: **CERTIFICADO**
- Nome do aluno com destaque azul
- Nome do curso em negrito
- **NOVA SEÇÃO: Módulos Concluídos**
  - Lista todos os módulos do curso
  - Cada módulo com ícone de check verde
  - Grid responsivo (2 colunas)
- Detalhes: Carga horária, Data de Conclusão, Data de Emissão

### **Rodapé**
```
┌──────────────────────────────────────────────────────┐
│  _________________________    _____________________   │
│  NÁRGILA DE SOUZA SANTOS     Sistema CCT 2026        │
│  Diretora                    Certificação Digital    │
└──────────────────────────────────────────────────────┘
```

### **Código de Verificação**
- Canto inferior direito
- Formato: CCT-YYYY-XXXXXXXX
- URL de verificação pública

---

## 🗄️ Estrutura de Dados

### **Migration 0014: Campo course_modules**

```sql
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS course_modules TEXT;
```

**Formato JSON armazenado:**
```json
[
  {"title": "Módulo 1 - Introdução", "order": 1},
  {"title": "Módulo 2 - Conteúdo Principal", "order": 2},
  {"title": "Módulo 3 - Conclusão", "order": 3}
]
```

### **Busca de Módulos**

O sistema busca módulos de **duas formas**:

1. **Prioritário**: Campo `course_modules` (JSON pré-armazenado)
2. **Fallback**: Busca na tabela `modules` por `course_id`

```typescript
// Código no backend (src/index.tsx)
let modules: string[] = []

// 1. Tenta usar JSON armazenado
if (cert.course_modules) {
  const modulesData = JSON.parse(cert.course_modules)
  modules = modulesData.map(m => m.title)
}

// 2. Busca no banco se não houver JSON
if (modules.length === 0 && cert.course_id) {
  const courseModules = await supabase.query('modules', {
    filters: { course_id: cert.course_id },
    order: 'order_index.asc'
  })
  modules = courseModules.map(m => m.title)
}
```

---

## 🚀 Como Popular os Módulos nos Certificados Existentes

### **Opção 1: Via SQL (RECOMENDADO)**

Execute o script: `migrations/POPULAR_MODULOS_CERTIFICADOS.sql`

```sql
-- Atualiza TODOS os certificados que têm course_id
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
```

### **Opção 2: Automático no Runtime**

Se o certificado **NÃO** tiver `course_modules` mas **tiver** `course_id`:
- O sistema busca automaticamente os módulos ao gerar o HTML
- Os módulos aparecem no certificado mesmo sem estar pré-armazenados
- **Desvantagem**: Faz query adicional no banco a cada geração

### **Opção 3: Via Admin Panel (FUTURO)**

Interface para:
- Adicionar/remover módulos manualmente
- Editar ordem dos módulos
- Popular em lote

---

## 📄 Onde os Módulos Aparecem

### **1. Certificado HTML Individual**
- URL: `/api/certificates/:id/html`
- Acesso: Somente dono do certificado
- Uso: Visualizar e baixar PDF (Ctrl+P)
- Módulos: ✅ Exibidos

### **2. Página de Verificação Pública**
- URL: `/verificar/:code`
- Acesso: Qualquer pessoa com o código
- Uso: Validar autenticidade
- Módulos: ✅ Exibidos

### **3. API de Verificação (JSON)**
- URL: `/api/verify/:code`
- Retorno: Dados do certificado em JSON
- Módulos: ❌ Não incluídos (pode ser adicionado se necessário)

---

## 🎨 Logotipo

### **Tipo**: SVG Inline (embutido no HTML)
### **Localização**: Cabeçalho do certificado
### **Design**: 
- Círculo com gradiente azul (#3498db → #2c3e50)
- Símbolo de educação (livro/diploma estilizado)
- Iniciais "EP" (Ensino Plus)

```svg
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="url(#grad1)"/>
  <path d="M 30 35 L 50 25 L 70 35 L 70 50 L 50 60 L 30 50 Z" fill="#fff"/>
  <circle cx="50" cy="50" r="8" fill="#fff"/>
  <text x="50" y="80" font-size="14" font-weight="bold" text-anchor="middle" fill="#fff">EP</text>
</svg>
```

**Por que SVG inline?**
- ✅ Funciona no Cloudflare Workers (sem filesystem)
- ✅ Não depende de arquivos externos
- ✅ Escalável sem perda de qualidade
- ✅ Imprime perfeitamente em PDF

---

## 🖨️ Impressão/Download em PDF

### **Como Baixar:**
1. Usuário clica em "Baixar PDF"
2. Sistema abre `/api/certificates/:id/html` em nova janela
3. Janela aguarda carregamento
4. Dispara `window.print()` automaticamente
5. Navegador abre diálogo "Salvar como PDF"

### **CSS para Impressão:**
```css
@page {
  size: A4 landscape;
  margin: 0;
}

@media print {
  body {
    background: white;
  }
  .certificate-container {
    box-shadow: none;
  }
}
```

---

## 🔍 Verificação Pública

### **URL de Verificação**
```
https://ensinoplus-dev-cct2026.n697dr.easypanel.host/verificar/CCT-2025-09F80B59
```

### **Informações Exibidas:**
- ✅ Nome do aluno
- ✅ Curso concluído
- ✅ **Módulos concluídos** (NOVO)
- ✅ Carga horária
- ✅ Data de conclusão
- ✅ Código de verificação
- ✅ Contador de verificações
- ✅ Dados da empresa e CNPJ

---

## 📱 Responsividade

### **Desktop (A4 Landscape)**
- Largura: 297mm
- Altura: 210mm
- 2 colunas para módulos

### **Mobile/Tablet**
- Grid adaptativo
- 1 coluna para módulos
- Fonte redimensionada

---

## 🔧 Arquivos Modificados

### **1. src/index.tsx**
- `generateCertificateHTML()` - Template atualizado
- `/api/certificates/:id/html` - Busca de módulos
- `/verificar/:code` - Exibição de módulos na verificação

### **2. migrations/0014_add_modules_to_certificates.sql**
- Adiciona coluna `course_modules`
- Cria índice para performance

### **3. migrations/POPULAR_MODULOS_CERTIFICADOS.sql**
- Script para popular módulos existentes
- 6 passos: verificar, testar, atualizar, validar

---

## ✅ Checklist de Implementação

- [x] Criar migration 0014
- [x] Modificar função `generateCertificateHTML()`
- [x] Adicionar busca de módulos no endpoint `/api/certificates/:id/html`
- [x] Adicionar módulos na página de verificação pública
- [x] Incluir logotipo SVG no cabeçalho
- [x] Adicionar nome da empresa e CNPJ
- [x] Incluir assinatura da diretora
- [x] Criar script SQL para popular módulos
- [x] Testar build e deploy
- [x] Commit e push para GitHub
- [ ] Aplicar migration 0014 no Supabase
- [ ] Popular módulos nos certificados existentes
- [ ] Rebuild no Easypanel
- [ ] Testar certificado em produção

---

## 🚀 Próximos Passos

### **1. Aplicar Migration no Supabase**
```sql
-- Execute no SQL Editor do Supabase:
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS course_modules TEXT;

CREATE INDEX IF NOT EXISTS idx_certificates_with_modules 
ON certificates(id) 
WHERE course_modules IS NOT NULL;
```

### **2. Popular Módulos Existentes**
```sql
-- Execute: migrations/POPULAR_MODULOS_CERTIFICADOS.sql
-- Isso vai preencher course_modules para todos os certificados com course_id
```

### **3. Rebuild no Easypanel**
- Acessar dashboard do Easypanel
- Clicar em "Rebuild" no projeto cct2026
- Aguardar deploy (~2-5 minutos)

### **4. Testar em Produção**
```javascript
// No console do navegador (production):
fetch('/api/my-certificates')
  .then(r => r.json())
  .then(data => console.log(data.certificates))

// Abrir certificado:
window.open('/api/certificates/1/html', '_blank')
```

---

## 📞 Suporte

Se encontrar problemas:

1. **Módulos não aparecem**: Verificar se `course_id` está preenchido
2. **Logotipo não carrega**: É SVG inline, sempre carrega
3. **PDF corta conteúdo**: Verificar configuração `@page` do CSS
4. **Verificação retorna 404**: Código de verificação inválido

---

**Última Atualização**: 2025-01-25  
**Versão**: 2.0  
**Status**: ✅ Implementado e Testado (Local)
