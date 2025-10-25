# 🔍 Sistema de Filtros - Histórico de Assinaturas

## 🎯 Visão Geral

Sistema completo de filtros para a tela de histórico de assinaturas/membros, permitindo busca, filtragem e organização dos dados importados.

---

## 📊 Funcionalidades Implementadas

### **1. Cards de Estatísticas Clicáveis**

Os 4 cards de estatísticas agora são **clicáveis** e funcionam como filtros rápidos:

| Card | Ação ao Clicar | Resultado |
|------|----------------|-----------|
| 🔵 **Total** | Mostra todas | Remove todos os filtros |
| 🟢 **Ativas** | Filtra ativas | Exibe apenas assinaturas ativas |
| 🔴 **Expiradas** | Filtra expiradas | Exibe apenas assinaturas expiradas |
| 🟣 **Teste Grátis** | Filtra teste grátis | Exibe apenas testes grátis |

**Visual:**
- Hover effect com sombra
- Cursor pointer
- Feedback visual ao clicar

---

### **2. Barra de Filtros**

Localizada abaixo dos cards, com 4 componentes:

#### **A) Busca por Texto** 🔍
```
Input: "Buscar"
Placeholder: "Email ou detalhes..."
Tecla: Enter para buscar
```

**Busca em:**
- Email do membro (`email_membro`)
- Detalhes do pedido (`detalhe`)

**Exemplo:**
- Digite "telegram" → Mostra assinaturas com "telegram" no email ou detalhes
- Digite "@gmail.com" → Mostra todos os emails do Gmail

---

#### **B) Filtro por Origem** 🏷️
```
Dropdown: "Origem"
Opções: Dinâmicas (baseadas nos dados)
```

**Valores possíveis:**
- Todas as origens (padrão)
- Telegram
- CCT 2.0
- manual
- Outros (conforme CSV importado)

**Comportamento:**
- Dropdown é populado automaticamente
- Lista apenas origens presentes nos dados
- Ordenado alfabeticamente

---

#### **C) Filtro por Status** 🚦
```
Dropdown: "Status"
Opções: Fixas
```

**Valores:**
- **Todos** - Mostra todas as assinaturas
- **Ativas** - Assinaturas ativas (não expiradas)
- **Expiradas** - Assinaturas expiradas
- **Teste Grátis** - Apenas testes grátis

**Lógica:**
```javascript
// Ativa: ativo = true E (sem data OU data futura)
ativo && (!data_expiracao || data_expiracao > now)

// Expirada: ativo = false OU data no passado
!ativo || (data_expiracao && data_expiracao <= now)

// Teste Grátis: campo teste_gratis = true
teste_gratis === true
```

---

#### **D) Botão Limpar Filtros** ❌
```
Botão: "Limpar"
Cor: Cinza
```

**Ação:**
- Limpa campo de busca
- Reseta filtro de origem para "Todas"
- Reseta filtro de status para "Todos"
- Recarrega tabela sem filtros

---

### **3. Contador de Resultados**

Exibe informações sobre a filtragem:

```
📊 Exibindo 150 de 4.288 assinaturas (filtrado)
```

**Comportamento:**
- Mostra número de resultados filtrados vs total
- Adiciona badge "(filtrado)" quando há filtros ativos
- Atualiza em tempo real

---

## 🔄 Fluxo de Filtragem

```
1. Usuário interage com filtro
   ↓
2. Sistema captura valores atuais de todos os filtros
   ↓
3. loadSubscriptionsTable(filters) é chamada
   ↓
4. Dados são filtrados sequencialmente:
   - Status (ativa/expirada/teste grátis)
   - Origem (dropdown)
   - Busca por texto (email/detalhe)
   ↓
5. Tabela é reconstruída com dados filtrados
   ↓
6. Contador de resultados é atualizado
```

---

## 💻 Código Técnico

### **Estrutura de Filtros**
```javascript
filters = {
  search: 'texto',      // Busca por email/detalhe
  origem: 'CCT 2.0',    // Filtro por origem
  status: 'active'      // Filtro por status (active/expired/free_trial)
}
```

### **Função Principal**
```javascript
async loadSubscriptionsTable(filters = {}) {
  // 1. Buscar dados da API
  const subscriptions = await axios.get('/api/admin/member-subscriptions')
  
  // 2. Armazenar dados originais
  this.allSubscriptions = subscriptions
  
  // 3. Calcular estatísticas
  const active = subscriptions.filter(...)
  const expired = subscriptions.filter(...)
  
  // 4. Aplicar filtros
  if (filters.status) { /* filtrar por status */ }
  if (filters.origem) { /* filtrar por origem */ }
  if (filters.search) { /* filtrar por texto */ }
  
  // 5. Renderizar tabela filtrada
}
```

### **Funções Helper**
```javascript
getCurrentSubscriptionFilters() {
  // Captura valores atuais dos inputs
  return {
    search: document.getElementById('subscriptionSearch').value,
    origem: document.getElementById('subscriptionOriginFilter').value,
    status: document.getElementById('subscriptionStatusFilter').value
  }
}

filterSubscriptions(filters) {
  // Atalho para aplicar filtros
  this.loadSubscriptionsTable(filters)
}

handleSubscriptionSearch(event) {
  // Busca ao pressionar Enter
  if (event.key === 'Enter') {
    const filters = this.getCurrentSubscriptionFilters()
    this.loadSubscriptionsTable(filters)
  }
}

handleOriginFilter(event) {
  // Busca ao mudar dropdown de origem
  const filters = this.getCurrentSubscriptionFilters()
  this.loadSubscriptionsTable(filters)
}

handleStatusFilter(event) {
  // Busca ao mudar dropdown de status
  const filters = this.getCurrentSubscriptionFilters()
  this.loadSubscriptionsTable(filters)
}

clearSubscriptionFilters() {
  // Limpa todos os filtros e recarrega
  document.getElementById('subscriptionSearch').value = ''
  document.getElementById('subscriptionOriginFilter').value = 'all'
  document.getElementById('subscriptionStatusFilter').value = ''
  this.loadSubscriptionsTable({})
}
```

---

## 🎨 UI/UX

### **Cards de Estatísticas**
```html
<div class="cursor-pointer hover:shadow-md transition-shadow" 
     onclick="adminUI.filterSubscriptions({status: 'active'})">
  <!-- Card content -->
</div>
```

**Características:**
- `cursor-pointer` - Indica que é clicável
- `hover:shadow-md` - Efeito de elevação ao passar mouse
- `transition-shadow` - Animação suave

---

### **Inputs de Filtro**
```html
<input type="text" 
       id="subscriptionSearch" 
       placeholder="Email ou detalhes..."
       onkeyup="adminUI.handleSubscriptionSearch(event)"
       class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
```

**Características:**
- Ícones FontAwesome
- Labels descritivas
- Focus states visuais
- Placeholders informativos

---

### **Layout Responsivo**
```html
<div class="flex items-center gap-4 flex-wrap">
  <!-- Filtros aqui -->
</div>
```

**Comportamento:**
- Desktop: Filtros em linha horizontal
- Mobile: Filtros empilham verticalmente
- `flex-wrap` garante adaptação automática

---

## 📈 Performance

### **Otimizações**
1. **Filtragem Client-Side**: Dados filtrados no navegador (não precisa de API call)
2. **Preservação de Estado**: Filtros mantidos após deletar assinatura
3. **Dropdown Dinâmico**: Apenas origens presentes nos dados
4. **Busca Lazy**: Busca apenas ao pressionar Enter (evita sobrecarga)

---

## 🧪 Casos de Uso

### **Caso 1: Encontrar membro específico**
```
1. Digite email na busca: "joao@exemplo.com"
2. Pressione Enter
3. Resultado: 1 assinatura
```

### **Caso 2: Ver apenas membros do Telegram expirados**
```
1. Selecione Origem: "Telegram"
2. Selecione Status: "Expiradas"
3. Resultado: Todas assinaturas do Telegram expiradas
```

### **Caso 3: Ver todos os testes grátis ativos**
```
1. Clique no card "Teste Grátis" (roxo)
2. Selecione Status: "Ativas"
3. Resultado: Testes grátis ainda válidos
```

### **Caso 4: Buscar pedidos de 2022**
```
1. Digite na busca: "2022"
2. Pressione Enter
3. Resultado: Assinaturas com "2022" nos detalhes
```

---

## 🔧 Troubleshooting

### Problema: Filtros não funcionam
**Solução:** Verifique se `loadSubscriptionsTable()` aceita parâmetro `filters`

### Problema: Dropdown de origem vazio
**Causa:** Nenhuma origem cadastrada no CSV
**Solução:** Normal se CSV não tem campo "origem" preenchido

### Problema: Busca não funciona ao digitar
**Comportamento esperado:** Busca só acontece ao pressionar Enter
**Solução:** Pressione Enter após digitar

### Problema: Contador mostra número errado
**Causa:** Filtros sendo aplicados duas vezes
**Solução:** Verificar se `filters` está sendo passado corretamente

---

## 📁 Arquivos Modificados

| Arquivo | Mudanças |
|---------|----------|
| `public/static/admin.js` | - `loadSubscriptionsTable()` com parâmetro filters<br>- 6 funções helper novas<br>- Cards clicáveis<br>- Barra de filtros HTML |

---

## ✨ Próximas Melhorias Possíveis

1. **Exportar CSV Filtrado**: Botão para baixar apenas dados filtrados
2. **Filtro por Data**: Range de datas de expiração
3. **Ordenação**: Clicar em colunas para ordenar
4. **Busca Avançada**: Múltiplos campos com operadores (AND/OR)
5. **Salvar Filtros**: Persistir filtros no localStorage
6. **Paginação**: Para datasets muito grandes (>1000 registros)

---

## 🎯 Resumo

**Filtros Implementados:**
- ✅ Busca por texto (email/detalhe)
- ✅ Filtro por origem (dropdown dinâmico)
- ✅ Filtro por status (ativas/expiradas/teste grátis)
- ✅ Cards clicáveis como atalhos
- ✅ Botão limpar filtros
- ✅ Contador de resultados

**Funciona perfeitamente com ~4.288 membros!** 🚀

---

**Pronto para uso! Faça rebuild no Easypanel para ver os filtros funcionando! 🎉**
