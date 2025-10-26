# 🐛 DEBUG - Por Que Aulas Premium Não Estão Bloqueando?

## 🔍 Como Verificar o Que Está Acontecendo

### **Passo 1: Abrir Console do Navegador**

1. Pressione **F12** (Windows/Linux) ou **Cmd+Option+I** (Mac)
2. Clique na aba **Console**
3. Limpe o console (ícone 🚫 ou Ctrl+L)

### **Passo 2: Recarregar e Navegar**

1. Recarregue a página (Ctrl+F5)
2. Faça login (se necessário)
3. Clique em um curso
4. Observe as mensagens no console

---

## 📋 O Que Você DEVE Ver no Console

### **Quando Página Carrega:**
```
👤 User access status: {
  accessType: "SEM_ACESSO",  // ou "COMPLETO" ou "TESTE_GRATIS"
  hasFullAccess: false,
  email: "usuario@email.com"
}
```

### **Quando Curso Carrega:**
```
🔍 Attaching click handlers to 9 lessons

Lesson 1: isPremium=false, accessType=SEM_ACESSO
✅ Lesson 1 is accessible

Lesson 2: isPremium=false, accessType=SEM_ACESSO
✅ Lesson 2 is accessible

Lesson 3: isPremium=false, accessType=SEM_ACESSO
✅ Lesson 3 is accessible

Lesson 4: isPremium=true, accessType=SEM_ACESSO
🔒 BLOCKING lesson 4

Lesson 5: isPremium=true, accessType=SEM_ACESSO
🔒 BLOCKING lesson 5
```

### **Quando Clica em Aula Bloqueada:**
```
🚫 Blocked click on premium lesson 4
```

---

## ❌ Problemas Possíveis

### **Problema 1: accessType = null ou undefined**

**Console mostra:**
```
👤 User access status: null
```

**Causa:** API `/api/user/access-status` não está retornando dados

**Solução:**
```javascript
// Verificar se endpoint funciona:
fetch('/api/user/access-status')
  .then(r => r.json())
  .then(console.log)
```

---

### **Problema 2: isPremium = false para todas**

**Console mostra:**
```
Lesson 1: isPremium=false
Lesson 2: isPremium=false
Lesson 3: isPremium=false
Lesson 4: isPremium=false  ❌ DEVERIA SER TRUE!
```

**Causa:** Coluna `teste_gratis` não está preenchida corretamente

**Solução:** Execute no Supabase SQL Editor:
```sql
-- Ver distribuição
SELECT teste_gratis, COUNT(*) FROM lessons GROUP BY teste_gratis;

-- Se retornar NULL ou todas FALSE:
-- Execute migrations/FIX_RAPIDO.sql
```

---

### **Problema 3: "🔒 BLOCKING" aparece mas aula abre**

**Console mostra:**
```
🔒 BLOCKING lesson 4
[ao clicar]
(nenhuma mensagem "🚫 Blocked click")
```

**Causa:** Event listener não está sendo aplicado corretamente

**Solução:** O código já tem a correção (clone node). Mas verifique se:
1. Console mostra "🔒 BLOCKING"
2. Ao clicar, mostra "🚫 Blocked click"
3. Se não mostra, o inline `onclick` ainda está ativo

---

### **Problema 4: attachLessonClickHandlers não é chamado**

**Console mostra:**
```
(nenhuma mensagem "🔍 Attaching click handlers")
```

**Causa:** `accessManager` não está definido ou inicializado

**Solução:** Verificar se script foi carregado:
```javascript
console.log(typeof accessManager)
// Deve retornar: "object"
```

---

## 🧪 Testes Manuais no Console

### **Teste 1: Verificar accessManager**
```javascript
console.log(accessManager)
console.log(accessManager.userAccessStatus)
```

**Resultado esperado:**
```javascript
{
  userAccessStatus: {
    accessType: "SEM_ACESSO",
    hasFullAccess: false,
    ...
  }
}
```

---

### **Teste 2: Verificar atributos das aulas**
```javascript
document.querySelectorAll('.lesson-item').forEach(item => {
  console.log({
    id: item.dataset.lessonId,
    isPremium: item.dataset.isPremium,
    hasOnclick: item.hasAttribute('onclick'),
    opacity: item.style.opacity
  })
})
```

**Resultado esperado:**
```javascript
// Aula gratuita:
{ id: "1", isPremium: "false", hasOnclick: true, opacity: "" }

// Aula premium BLOQUEADA:
{ id: "4", isPremium: "true", hasOnclick: false, opacity: "0.7" }
```

---

### **Teste 3: Forçar bloqueio manual**
```javascript
// Pegar uma aula premium
const premiumLesson = document.querySelector('[data-lesson-id="4"]')

// Remover onclick
premiumLesson.onclick = null
premiumLesson.removeAttribute('onclick')

// Adicionar listener
premiumLesson.addEventListener('click', (e) => {
  e.preventDefault()
  e.stopPropagation()
  alert('BLOQUEADO!')
  return false
}, true)

// Testar clicando na aula
```

---

## ✅ Checklist de Verificação

Execute estes comandos no Console e copie os resultados:

```javascript
// 1. AccessManager existe?
console.log('AccessManager:', typeof accessManager)

// 2. Status do usuário?
console.log('User Status:', accessManager?.userAccessStatus)

// 3. Quantas aulas premium?
console.log('Premium lessons:', 
  document.querySelectorAll('[data-is-premium="true"]').length
)

// 4. Quantas aulas bloqueadas visualmente?
console.log('Locked lessons:', 
  document.querySelectorAll('.premium-locked').length
)

// 5. Teste clicar em aula premium
// (deve mostrar "🚫 Blocked click" no console)
```

---

## 📸 Me Envie

Para ajudar a diagnosticar, me envie:

1. **Screenshot do console** após clicar em um curso
2. **Resultado dos comandos** do Checklist acima
3. **Diga**: Qual curso abriu? Qual aula tentou clicar?

---

**Última atualização**: 26/10/2025  
**Commit**: 4ac582c
