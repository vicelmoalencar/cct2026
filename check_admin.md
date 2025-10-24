# 🔍 Verificação de Admin

## Como Verificar e Adicionar Admin

### Passo 1: Verificar se Você é Admin

Execute no **SQL Editor do Supabase**:

```sql
-- Verificar admins cadastrados
SELECT * FROM admins;
```

**Resultado esperado**:
- Se aparecer seu email → ✅ Você já é admin
- Se não aparecer → ❌ Precisa adicionar seu email

---

### Passo 2: Adicionar Seu Email como Admin

Se seu email NÃO apareceu na lista, execute:

```sql
-- Adicionar seu email como admin
INSERT INTO admins (email, created_at)
VALUES ('antoniovicelmo.alencar@gmail.com', NOW())
ON CONFLICT (email) DO NOTHING;
```

**⚠️ IMPORTANTE**: Substitua `antoniovicelmo.alencar@gmail.com` pelo email que você usa para fazer login na plataforma!

---

### Passo 3: Verificar Novamente

```sql
-- Confirmar que foi adicionado
SELECT * FROM admins;
```

Agora seu email deve aparecer na lista!

---

### Passo 4: Fazer Logout e Login Novamente

1. **Saia da plataforma** (botão "Sair" no header)
2. **Faça login novamente**
3. **Agora o botão "Admin" (roxo) deve aparecer** no header!

---

## 🎯 Testando a Funcionalidade de Upload

Após fazer login como admin:

1. ✅ **Verificar**: Botão "Admin" (roxo) aparece no header?
2. ✅ **Clicar**: No botão "Admin"
3. ✅ **Verificar**: Você foi para o painel de administração?
4. ✅ **Clicar**: No botão "Novo Curso" (verde) OU em "Editar" (azul) em um curso existente
5. ✅ **Rolar para baixo**: Até a seção "Template de Certificado"
6. ✅ **Verificar**: Você vê o botão amarelo "Fazer Upload do Template"?

Se você vê o botão amarelo → **SUCESSO! ✅**

---

## 🐛 Troubleshooting

### "Não vejo o botão Admin mesmo após adicionar meu email"

**Solução**:
1. Limpe o cache do navegador (Ctrl+Shift+Delete)
2. Faça logout
3. Faça login novamente
4. Atualize a página (F5)

### "O botão Admin aparece mas dá erro ao clicar"

**Solução**:
1. Abra o console do navegador (F12 → Console)
2. Veja se há erros JavaScript
3. Tire uma screenshot e compartilhe

### "Vejo o formulário de curso mas não vejo a seção de certificado"

**Possível causa**: 
- Código antigo no navegador (cache)

**Solução**:
1. Limpe o cache (Ctrl+Shift+Delete)
2. Atualize a página com Ctrl+F5 (força reload)
3. Verifique novamente

---

## 📊 Status Esperado

Após seguir todos os passos:

| Item | Status |
|------|--------|
| Email na tabela admins | ✅ |
| Login realizado | ✅ |
| Botão "Admin" visível | ✅ |
| Painel admin acessível | ✅ |
| Formulário de curso carrega | ✅ |
| Seção "Template de Certificado" visível | ✅ |
| Botão "Fazer Upload" funciona | ✅ |

---

## 🔗 Links Úteis

- **Plataforma Local**: https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai
- **Produção**: https://ensinoplus-dev-cct2026.n697dr.easypanel.host
- **Supabase Dashboard**: https://supabase.com/dashboard/project/ghdfouqzasvxlptbjkin

---

**Data**: 24 de Janeiro de 2025
