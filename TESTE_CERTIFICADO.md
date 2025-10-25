# 🧪 Como Testar o Novo Certificado

## 🌐 URL de Teste (Sandbox)
```
https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai
```

---

## 📋 Passo a Passo para Testar

### **1. Fazer Login**
```
URL: https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai
Email: antoniovicelmo@gmail.com
Senha: sua_senha
```

### **2. Acessar Certificados**
- Clicar no botão **"Certificados"** no menu superior
- Você verá seus 6 certificados

### **3. Visualizar Certificado com Módulos**

**Opção A: Pelo botão "Visualizar"**
- Clicar em **"Visualizar"** em qualquer certificado
- Nova aba abre com o certificado HTML
- **O QUE OBSERVAR:**
  - ✅ Logotipo SVG no canto superior esquerdo
  - ✅ Nome da empresa: CENTRO DE ENSINO E APRENDIZAGEM PLUS LTDA
  - ✅ CNPJ: 35.537.045/0001-84
  - ✅ Seção "Módulos Concluídos" (se o curso tiver módulos)
  - ✅ Assinatura da diretora: NÁRGILA DE SOUZA SANTOS
  - ✅ Assinatura do sistema: Sistema CCT 2026

**Opção B: Direto pela URL**
```javascript
// No console do navegador (F12):
fetch('/api/my-certificates')
  .then(r => r.json())
  .then(data => {
    const certId = data.certificates[0].id
    window.open(`/api/certificates/${certId}/html`, '_blank')
  })
```

### **4. Baixar PDF**
- Clicar em **"Baixar PDF"**
- Sistema abre certificado e dispara impressão
- No diálogo de impressão:
  - Selecionar **"Salvar como PDF"**
  - Verificar orientação: **Paisagem (Landscape)**
  - Clicar em **"Salvar"**

### **5. Verificação Pública**

**Opção A: Pelo botão "Compartilhar"**
- Copiar URL de verificação
- Abrir em aba anônima (Ctrl+Shift+N)
- Verificar se módulos aparecem

**Opção B: Direto pela URL**
```
https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai/verificar/CCT-2025-09F80B59
```
(Substituir pelo código real do seu certificado)

**O QUE OBSERVAR:**
- ✅ Página de verificação com dados completos
- ✅ Seção "Módulos Concluídos" com lista de módulos
- ✅ Dados da empresa: CENTRO DE ENSINO E APRENDIZAGEM PLUS LTDA
- ✅ CNPJ: 35.537.045/0001-84
- ✅ Contador de verificações

---

## 🔍 Verificações Específicas

### **A. Certificado COM Módulos**

**Condições necessárias:**
1. Certificado tem `course_id` preenchido
2. Curso correspondente tem módulos na tabela `modules`

**Como verificar:**
```sql
-- No Supabase SQL Editor:
SELECT 
  c.id,
  c.course_title,
  c.course_id,
  COUNT(m.id) as total_modulos
FROM certificates c
LEFT JOIN modules m ON m.course_id = c.course_id
WHERE c.user_email = 'antoniovicelmo@gmail.com'
GROUP BY c.id, c.course_title, c.course_id;
```

**Se total_modulos > 0:**
- ✅ Módulos vão aparecer no certificado
- ✅ Seção "Módulos Concluídos" será exibida

**Se total_modulos = 0:**
- ⚠️ Certificado sem módulos (não tem no curso)
- ❌ Seção "Módulos Concluídos" NÃO aparece

### **B. Certificado SEM course_id**

Se `course_id` for NULL:
- ❌ Sistema não consegue buscar módulos
- ❌ Seção "Módulos Concluídos" NÃO aparece
- ✅ Resto do certificado funciona normalmente

**Solução:**
1. Popular `course_id` manualmente no Supabase, OU
2. Popular `course_modules` diretamente com JSON:
```sql
UPDATE certificates
SET course_modules = '[
  {"title": "Módulo 1 - Introdução", "order": 1},
  {"title": "Módulo 2 - Conteúdo", "order": 2}
]'
WHERE id = 123;
```

---

## 🎨 Elementos do Novo Design

### **1. Cabeçalho**
```
┌─────────────────────────────────────────────────────────┐
│  [LOGO]  CENTRO DE ENSINO E            CCT 2026         │
│          APRENDIZAGEM PLUS LTDA                         │
│          CNPJ: 35.537.045/0001-84                       │
└─────────────────────────────────────────────────────────┘
```

### **2. Corpo Central**
```
                        CERTIFICADO
                            
                   Certificamos que
                            
                    [NOME DO ALUNO]
                    ───────────────
                            
                concluiu com êxito o curso
                            
                  [NOME DO CURSO]
```

### **3. Seção de Módulos (NOVO)**
```
                  Módulos Concluídos:

    ✓ Módulo 1 - Introdução     ✓ Módulo 4 - Prática
    ✓ Módulo 2 - Teoria         ✓ Módulo 5 - Avançado
    ✓ Módulo 3 - Aplicação      ✓ Módulo 6 - Conclusão
```

### **4. Detalhes**
```
    Carga Horária        Data de Conclusão      Data de Emissão
       40 horas              25/01/2025            25/01/2025
```

### **5. Rodapé com Assinaturas**
```
┌─────────────────────────────────────────────────────────┐
│  _____________________________    _____________________  │
│  NÁRGILA DE SOUZA SANTOS         Sistema CCT 2026       │
│  Diretora                        Certificação Digital   │
└─────────────────────────────────────────────────────────┘

                  Código de Verificação:
                   CCT-2025-09F80B59
            Verifique em: https://...
```

---

## 📊 Cenários de Teste

### **Cenário 1: Certificado Completo (Ideal)**
- ✅ `course_id` preenchido
- ✅ Curso tem módulos cadastrados
- ✅ Todos os elementos aparecem
- ✅ PDF gera corretamente

### **Cenário 2: Certificado Sem Módulos no Curso**
- ✅ `course_id` preenchido
- ❌ Curso NÃO tem módulos cadastrados
- ✅ Certificado funciona (sem seção de módulos)
- ✅ PDF gera corretamente

### **Cenário 3: Certificado Sem course_id**
- ❌ `course_id` é NULL
- ❌ Não busca módulos
- ✅ Certificado funciona (sem seção de módulos)
- ✅ PDF gera corretamente

### **Cenário 4: Certificado com course_modules Pré-populado**
- ✅ `course_modules` JSON preenchido
- ✅ Módulos aparecem (mesmo sem course_id)
- ✅ Certificado funciona completamente
- ✅ PDF gera corretamente

---

## 🐛 Problemas Comuns e Soluções

### **Problema: Módulos não aparecem**

**Causas possíveis:**
1. `course_id` é NULL
2. Curso não tem módulos cadastrados
3. Migration 0014 não foi aplicada

**Soluções:**
```sql
-- Verificar se coluna course_modules existe:
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'certificates' 
  AND column_name = 'course_modules';

-- Se não existir, aplicar migration:
ALTER TABLE certificates ADD COLUMN course_modules TEXT;

-- Popular módulos:
-- (Usar script POPULAR_MODULOS_CERTIFICADOS.sql)
```

### **Problema: Logotipo não aparece**

**Causa:** Logotipo é SVG inline, sempre deve aparecer

**Solução:**
- Verificar no console do navegador (F12) se há erros
- Verificar se build foi feito corretamente
- Limpar cache do navegador (Ctrl+Shift+Delete)

### **Problema: PDF corta conteúdo**

**Causas:**
1. Muitos módulos (mais de 10)
2. Nomes de módulos muito longos

**Soluções:**
```css
/* Ajustar no CSS do template */
.modules-section {
  max-height: 150px;  /* Limitar altura */
  overflow: hidden;    /* Esconder excesso */
}

.module-item {
  font-size: 11px;    /* Reduzir fonte */
}
```

---

## ✅ Checklist de Teste

- [ ] Login funcionando
- [ ] Página "Certificados" carrega
- [ ] Botão "Visualizar" abre certificado HTML
- [ ] **Logotipo SVG aparece no cabeçalho**
- [ ] **Nome da empresa aparece**
- [ ] **CNPJ aparece**
- [ ] **Módulos aparecem (se curso tiver)**
- [ ] **Assinatura da diretora aparece**
- [ ] Botão "Baixar PDF" funciona
- [ ] Impressão gera PDF correto
- [ ] Orientação é Landscape (A4 paisagem)
- [ ] Verificação pública funciona
- [ ] Módulos aparecem na verificação
- [ ] Contador de verificações incrementa

---

## 📸 Screenshots Esperadas

### **1. Certificado HTML**
- Cabeçalho com logo e empresa
- Nome do aluno centralizado
- Seção de módulos (grid 2 colunas)
- Assinaturas no rodapé

### **2. Página de Verificação**
- Card branco com ícone verde
- Dados do certificado
- Lista de módulos
- Informações da empresa

### **3. PDF Gerado**
- A4 Landscape (297mm x 210mm)
- Todo conteúdo visível
- Sem cortes
- Qualidade profissional

---

## 🚀 Próximos Passos

1. **Testar no Sandbox** ✅ (URL fornecida acima)
2. **Aplicar Migration no Supabase**
3. **Popular Módulos Existentes**
4. **Rebuild no Easypanel**
5. **Testar em Produção**

---

**URL de Teste Sandbox:**
```
https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai
```

**Login de Teste:**
- Email: antoniovicelmo@gmail.com
- Senha: (sua senha)

---

**Data**: 2025-01-25  
**Status**: ✅ Pronto para Teste  
**Build**: ✅ Concluído  
**Deploy Local**: ✅ Rodando  
