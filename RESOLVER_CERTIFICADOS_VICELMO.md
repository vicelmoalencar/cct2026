# 🔧 Resolver: Certificados não aparecem para antoniovicelmo@gmail.com

## 📋 Diagnóstico

Verificamos que o email **`antoniovicelmo@gmail.com`** tem **6 certificados** no arquivo CSV:

1. PJECALCPLUS (60h)
2. MINICURSO TRT21
3. Verba por verba (20h)
4. PERÍCIA CONTÁBIL (8h)
5. SIMULAÇÃO AVANÇADA
6. Curso Pje-Calc Iniciantes - 2024 (20h)

**Problema**: Os certificados não foram importados para o banco de dados ainda.

---

## ✅ Solução Rápida (3 passos)

### 1️⃣ Aplicar Migration 0013 (Se ainda não aplicou)

**Supabase SQL Editor → Cole e Execute:**

```sql
-- Arquivo: migrations/0013_certificates_verification_system.sql
-- Copie TODO o conteúdo deste arquivo e execute
```

**Resultado esperado**: 
- Mensagem de sucesso
- Coluna `verification_code` criada
- Função `generate_verification_code()` criada

---

### 2️⃣ Inserir Certificados de Vicelmo

**Supabase SQL Editor → Cole e Execute:**

```sql
-- Arquivo: SQL_INSERIR_CERTIFICADOS_VICELMO.sql
-- Copie TODO o conteúdo deste arquivo e execute
```

**Resultado esperado**:
```
INSERT 6
Query returned successfully in 52ms.
```

Depois execute a query de verificação:
```sql
SELECT 
  user_email,
  user_name,
  course_title,
  carga_horaria,
  verification_code
FROM certificates 
WHERE user_email = 'antoniovicelmo@gmail.com';
```

Deve retornar **6 linhas** com os certificados.

---

### 3️⃣ Testar na Plataforma

1. **Faça logout** (se já estiver logado)
2. **Faça login** com `antoniovicelmo@gmail.com`
3. **Clique no botão "Certificados"** (amarelo) no header
4. **Você verá os 6 certificados** 🎉

---

## 🚀 Solução Alternativa: Importar via Admin Panel

Se preferir importar TODOS os certificados do CSV (não só do Vicelmo):

1. **Faça login como admin** (seu email deve estar na lista de admins)
2. **Clique em "Admin"** no header
3. **Vá para aba "Certificados"**
4. **Clique em "Importar CSV de Certificados"**
5. **Selecione o arquivo `certificados.csv`**
6. **Aguarde a importação** (~170 certificados)
7. **Resultado**: Todos os certificados importados, incluindo os 6 de Vicelmo

**Vantagens:**
- ✅ Importa todos de uma vez
- ✅ Previne duplicatas automaticamente
- ✅ Interface visual

**Desvantagens:**
- ⏱️ Leva alguns minutos
- 📊 Importa todos (não só do Vicelmo)

---

## 🐛 Troubleshooting

### Problema: "function generate_verification_code() does not exist"

**Solução**: Execute primeiro a migration 0013
```sql
-- migrations/0013_certificates_verification_system.sql
```

### Problema: "duplicate key value violates unique constraint"

**Solução**: Os certificados já foram inseridos antes. Verificar:
```sql
SELECT * FROM certificates 
WHERE user_email = 'antoniovicelmo@gmail.com';
```

Se retornar resultados, os certificados já estão lá.

### Problema: Certificados aparecem no SQL mas não na plataforma

**Soluções:**

1. **Limpe o cache do navegador**
   - Ctrl+Shift+Delete → Limpar cache
   - Ou use aba anônima

2. **Faça logout e login novamente**
   - Às vezes o token precisa ser renovado

3. **Verifique os logs do servidor**
   ```bash
   pm2 logs cct-clube-calculo --nostream
   ```

4. **Teste a API diretamente**
   ```bash
   curl http://localhost:3000/api/my-certificates \
     -H "Cookie: sb-access-token=SEU_TOKEN"
   ```

### Problema: Erro 401 Unauthorized ao acessar /api/my-certificates

**Causa**: Token de autenticação inválido ou expirado

**Solução**:
1. Faça logout
2. Faça login novamente
3. O novo token será gerado

---

## 📊 Verificações Finais

Após seguir os passos acima, execute estas queries no Supabase:

**1. Certificados de Vicelmo:**
```sql
SELECT COUNT(*) FROM certificates 
WHERE user_email = 'antoniovicelmo@gmail.com';
-- Esperado: 6
```

**2. Códigos de verificação gerados:**
```sql
SELECT verification_code 
FROM certificates 
WHERE user_email = 'antoniovicelmo@gmail.com';
-- Esperado: 6 códigos únicos (CCT-2025-XXXXX)
```

**3. Teste de verificação pública:**
```
https://seu-dominio.com/verificar/CCT-2025-XXXXX
-- Substitua XXXXX por um código real
-- Esperado: Página mostrando dados do certificado
```

---

## ✅ Checklist de Resolução

- [ ] Migration 0013 aplicada no Supabase
- [ ] Função `generate_verification_code()` existe
- [ ] 6 certificados inseridos para antoniovicelmo@gmail.com
- [ ] Query de verificação retorna 6 linhas
- [ ] Logout e login novamente na plataforma
- [ ] Botão "Certificados" clicado
- [ ] 6 certificados aparecem na tela
- [ ] Teste de visualização de um certificado
- [ ] Teste de download PDF
- [ ] Teste de verificação pública

---

## 🎉 Resultado Final

Após completar os passos, você verá:

```
╔════════════════════════════════════════════╗
║  Meus Certificados                         ║
║  Total de 6 certificado(s) disponível(is)  ║
╚════════════════════════════════════════════╝

📜 PJECALCPLUS (60 horas)
📜 MINICURSO TRT21
📜 Verba por verba (20 horas)
📜 PERÍCIA CONTÁBIL (8 horas)
📜 SIMULAÇÃO AVANÇADA
📜 Curso Pje-Calc Iniciantes - 2024 (20 horas)
```

Cada certificado com botões:
- 👁️ Visualizar Certificado
- ⬇️ Baixar PDF
- 🔗 Compartilhar Link

---

**Criado em**: 2025-10-25  
**Para**: Vicelmo Alencar (antoniovicelmo@gmail.com)
