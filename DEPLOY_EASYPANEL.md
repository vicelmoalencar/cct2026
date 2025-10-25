# 🚀 Deploy para Easypanel - Sistema de Certificados

## ❌ Problema Atual

**Erro:** `GET /api/my-certificates 404 (Not Found)`

**Causa:** Código novo foi commitado mas **não foi feito rebuild no Easypanel**

**Produção está rodando:** Código antigo (sem endpoints de certificados)

---

## ✅ Solução: Fazer Deploy

### **PASSO 1: Verificar Git Status**

```bash
cd /home/user/webapp
git status
```

**Resultado esperado:** `nothing to commit, working tree clean`

Se houver mudanças não commitadas, execute:
```bash
git add .
git commit -m "chore: preparar para deploy"
```

---

### **PASSO 2: Push para GitHub**

```bash
cd /home/user/webapp
git push origin main
```

**Resultado esperado:**
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
Total X (delta Y), reused Z (delta W)
To https://github.com/vicelmoalencar/cct2026.git
   abc1234..def5678  main -> main
```

✅ Código enviado para GitHub

---

### **PASSO 3: Acessar Easypanel**

1. **URL:** Seu painel Easypanel
2. **Login:** Com suas credenciais
3. **Encontrar projeto:** `ensinoplus-dev-cct2026`

---

### **PASSO 4: Fazer Rebuild**

**No Easypanel:**

1. Clique no projeto **ensinoplus-dev-cct2026**
2. Vá para aba **"Geral"** ou **"Deploy"**
3. Clique em **"Rebuild"** (ou "Build & Deploy")
4. Aguarde o processo (~2-5 minutos)

**Você verá:**
- 🔄 Clonando repositório do GitHub
- 📦 Instalando dependências (npm install)
- 🏗️ Build do projeto (npm run build)
- 🚀 Iniciando servidor
- ✅ Deploy concluído

---

### **PASSO 5: Verificar Logs**

**No Easypanel, veja os logs:**

Procure por:
- ✅ `Build completed successfully`
- ✅ `Server started on port 80`
- ✅ `Ready on http://0.0.0.0:80`

**Se houver erros:**
- 📋 Copie a mensagem de erro
- 📸 Tire screenshot
- 🆘 Me envie para análise

---

### **PASSO 6: Testar Produção**

**Após rebuild, teste:**

1. **Abra a produção:**
   ```
   https://ensinoplus-dev-cct2026.n697dr.easypanel.host
   ```

2. **Abra Console (F12)**

3. **Execute:**
   ```javascript
   fetch('/api/my-certificates')
     .then(r => r.json())
     .then(data => console.log('✅ Certificados:', data))
     .catch(err => console.error('❌ Erro:', err))
   ```

**Resultado esperado:**
```json
✅ Certificados: {
  certificates: [
    {
      id: 5,
      user_email: "antoniovicelmo@gmail.com",
      user_name: "Vicelmo Alencar",
      course_title: "PJECALCPLUS",
      verification_code: "CCT-2025-09F80B59",
      ...
    },
    ...
  ]
}
```

✅ **API funcionando!**

---

### **PASSO 7: Fazer Login e Acessar Certificados**

1. **Faça login** com `antoniovicelmo@gmail.com`
2. **Clique em "Certificados"** (botão amarelo)
3. **🎉 Seus 6 certificados devem aparecer!**

---

## 📊 Commits Pendentes de Deploy

Você tem **10 commits novos** desde o último deploy:

```
e84e276 docs: Debug frontend
b8c3c9b docs: Scripts detalhados de debug
7dc9a12 docs: Solução rápida - Atualizar certificados
68a49bc docs: Scripts de diagnóstico
362041b docs: Atualizar README com certificados v2.0
299112d docs: Instruções completas
5c5f7c6 feat: Sistema completo de certificados ⭐ (PRINCIPAL)
006340d feat: Scripts para criar usuários Auth
89054d6 fix: Compatibilizar sistema de certificados
d8910cb feat: Sistema completo de importação
```

**O commit `5c5f7c6`** adiciona:
- ✅ Endpoint `/api/my-certificates`
- ✅ Endpoint `/api/certificates/:id/html`
- ✅ Endpoint `/verificar/:code`
- ✅ Página `/certificates`
- ✅ Template HTML de certificado
- ✅ Sistema de verificação pública

---

## 🔄 Deploy Automático (Futuro)

**Recomendação:** Configure deploy automático no Easypanel

1. **No Easypanel:**
   - Settings → GitHub Integration
   - Enable "Auto Deploy on Push"
   - Branch: `main`

2. **Resultado:**
   - Toda vez que fizer `git push origin main`
   - Easypanel faz rebuild automaticamente
   - Sem intervenção manual

---

## ⚠️ Troubleshooting

### **Erro: "Build failed"**

**Causas comuns:**
1. Erro de sintaxe no código
2. Dependências faltando
3. Variáveis de ambiente não configuradas

**Solução:**
- Veja logs completos no Easypanel
- Me envie a mensagem de erro

---

### **Erro: "Server não inicia"**

**Causas comuns:**
1. Porta já em uso
2. SUPABASE_URL ou SUPABASE_ANON_KEY não configurados
3. Erro no ecosystem.config.cjs

**Solução:**
- Verifique variáveis de ambiente no Easypanel
- `SUPABASE_URL` = https://ghdfouqzasvxlptbjkin.supabase.co
- `SUPABASE_ANON_KEY` = (sua chave anon)

---

### **Erro: "404 ainda"**

**Se mesmo após rebuild continuar 404:**

1. **Verifique se build foi concluído:**
   - Logs devem mostrar "✅ Build completed"

2. **Limpe cache do CDN** (se Easypanel usar CDN)

3. **Force refresh:**
   - Ctrl+Shift+R (Windows)
   - Cmd+Shift+R (Mac)

4. **Teste endpoint de health:**
   ```
   https://ensinoplus-dev-cct2026.n697dr.easypanel.host/health
   ```
   
   Deve retornar:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-10-25T...",
     "environment": {
       "supabase_url": "✅ Configured",
       "supabase_key": "✅ Configured"
     }
   }
   ```

---

## 📱 Variáveis de Ambiente (Confirmar no Easypanel)

**No Easypanel → Environment Variables:**

```
SUPABASE_URL=https://ghdfouqzasvxlptbjkin.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (sua chave completa)
PORT=80
NODE_ENV=production
```

---

## ✅ Checklist de Deploy

- [ ] Git status limpo
- [ ] Git push origin main
- [ ] Easypanel rebuild iniciado
- [ ] Logs mostram "Build completed"
- [ ] Logs mostram "Server started"
- [ ] Endpoint /health responde
- [ ] Endpoint /api/my-certificates responde
- [ ] Login realizado
- [ ] Certificados aparecem na página

---

## 🎉 Após Deploy Bem-Sucedido

**Teste completo:**

1. ✅ Login com antoniovicelmo@gmail.com
2. ✅ Clicar em "Certificados"
3. ✅ Ver 6 certificados listados
4. ✅ Clicar em "Visualizar Certificado"
5. ✅ Ver certificado HTML bonito
6. ✅ Clicar em "Baixar PDF"
7. ✅ Imprimir/Salvar como PDF
8. ✅ Copiar código de verificação (ex: CCT-2025-09F80B59)
9. ✅ Acessar: https://seu-dominio.com/verificar/CCT-2025-09F80B59
10. ✅ Ver página de verificação pública

**Tudo funcionando!** 🎊

---

**Criado em:** 2025-10-25  
**Para:** Deploy do sistema de certificados v2.0
