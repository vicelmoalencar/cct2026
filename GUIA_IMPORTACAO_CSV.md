# 📥 Guia de Importação de Cursos via CSV

## 🎯 Objetivo

Permite importar cursos completos (com módulos e aulas) de forma rápida usando arquivos CSV, ideal para migrar conteúdo de outras plataformas.

---

## 🚀 Como Usar

### Passo 1: Acessar a Tab de Importação

1. Entre no **Painel Administrativo**
2. Clique na tab **"Importar"** (ícone de arquivo)
3. Você verá instruções sobre o formato do CSV

### Passo 2: Baixar o Modelo CSV

1. Clique no botão **"Baixar Modelo CSV"**
2. Um arquivo `template_importacao_cursos.csv` será baixado
3. Este arquivo contém exemplos de como estruturar seus dados

### Passo 3: Preparar Seus Dados

Edite o arquivo CSV com seus cursos. Use o formato:

```csv
tipo,curso_titulo,curso_descricao,curso_instrutor,curso_duracao_horas,modulo_titulo,modulo_descricao,aula_titulo,aula_descricao,aula_video_provider,aula_video_id,aula_duracao_minutos,aula_ordem,aula_teste_gratis
```

### Passo 4: Upload e Preview

1. Clique em **"Selecionar Arquivo CSV"**
2. Escolha seu arquivo CSV
3. O sistema irá mostrar um **preview** dos dados
4. Verifique se tudo está correto

### Passo 5: Confirmar Importação

1. Se os dados estiverem corretos, clique em **"Confirmar Importação"**
2. Acompanhe o progresso em tempo real
3. Aguarde a mensagem de conclusão

---

## 📋 Formato do CSV

### Estrutura das Colunas

| Coluna | Descrição | Obrigatório | Exemplo |
|--------|-----------|-------------|---------|
| `tipo` | Tipo do item | ✅ Sim | curso, modulo, aula |
| `curso_titulo` | Título do curso | ✅ Para cursos | Cálculos Trabalhistas Básico |
| `curso_descricao` | Descrição do curso | ❌ Não | Aprenda os fundamentos |
| `curso_instrutor` | Nome do instrutor | ❌ Não | João Silva |
| `curso_duracao_horas` | Duração em horas | ❌ Não | 20 |
| `modulo_titulo` | Título do módulo | ✅ Para módulos | Módulo 1: Introdução |
| `modulo_descricao` | Descrição do módulo | ❌ Não | Conceitos básicos |
| `aula_titulo` | Título da aula | ✅ Para aulas | Aula 1: O que é CLT |
| `aula_descricao` | Descrição da aula | ❌ Não | Introdução à CLT |
| `aula_video_provider` | Provedor do vídeo | ✅ Para aulas | youtube, vimeo, url |
| `aula_video_id` | ID ou URL do vídeo | ✅ Para aulas | dQw4w9WgXcQ |
| `aula_duracao_minutos` | Duração em minutos | ❌ Não | 15 |
| `aula_ordem` | Ordem da aula | ❌ Não | 1 |
| `aula_teste_gratis` | Aula gratuita? | ❌ Não | sim ou nao |

### Valores Aceitos

**tipo:**
- `curso` - Define um novo curso
- `modulo` - Define um novo módulo (dentro do último curso criado)
- `aula` - Define uma nova aula (dentro do último módulo criado)

**aula_video_provider:**
- `youtube` - Para vídeos do YouTube
- `vimeo` - Para vídeos do Vimeo
- `url` - Para URLs diretas de vídeo

**aula_teste_gratis:**
- `sim` - Aula disponível para usuários sem assinatura
- `nao` - Aula apenas para assinantes

---

## 📝 Exemplo Completo

```csv
tipo,curso_titulo,curso_descricao,curso_instrutor,curso_duracao_horas,modulo_titulo,modulo_descricao,aula_titulo,aula_descricao,aula_video_provider,aula_video_id,aula_duracao_minutos,aula_ordem,aula_teste_gratis
curso,Cálculos Trabalhistas Básico,Aprenda os fundamentos dos cálculos,João Silva,20,,,,,,,,
modulo,,,,,Módulo 1: Introdução,Conceitos básicos e fundamentais,,,,,,,
aula,,,,,,,Aula 1: O que é CLT,Introdução à Consolidação das Leis do Trabalho,youtube,dQw4w9WgXcQ,15,1,sim
aula,,,,,,,Aula 2: Conceitos iniciais,Conceitos fundamentais do direito trabalhista,youtube,dQw4w9WgXcQ,20,2,nao
modulo,,,,,Módulo 2: Cálculos Básicos,Aprenda cálculos essenciais,,,,,,,
aula,,,,,,,Aula 3: Horas Extras,Como calcular horas extras,youtube,dQw4w9WgXcQ,25,1,nao
curso,Cálculos Trabalhistas Avançado,Cálculos complexos e avançados,Maria Santos,30,,,,,,,,
modulo,,,,,Módulo 1: Verbas Rescisórias,Cálculo de rescisões,,,,,,,
aula,,,,,,,Aula 1: Aviso Prévio,Como calcular aviso prévio,youtube,dQw4w9WgXcQ,30,1,nao
```

### Como Ler Este Exemplo:

**Linha 2:** Cria o curso "Cálculos Trabalhistas Básico"
- Instrutor: João Silva
- Duração: 20 horas

**Linha 3:** Cria o módulo "Módulo 1: Introdução" dentro do curso
- Descrição: Conceitos básicos e fundamentais

**Linhas 4-5:** Criam 2 aulas dentro do módulo
- Aula 1: Gratuita (teste grátis)
- Aula 2: Apenas para assinantes

**Linha 6:** Cria o módulo "Módulo 2: Cálculos Básicos"

**Linha 7:** Cria 1 aula dentro do módulo 2

**Linha 8:** Cria um NOVO curso "Cálculos Trabalhistas Avançado"
- A partir daqui, módulos e aulas pertencem a este novo curso

---

## 🎯 Regras Importantes

### 1. Hierarquia

Os itens seguem uma hierarquia:
```
CURSO
  └── MÓDULO
       └── AULA
```

- Um **CURSO** deve ser criado antes de seus módulos
- Um **MÓDULO** deve ser criado antes de suas aulas
- As **AULAS** são sempre adicionadas ao último módulo criado

### 2. Células Vazias

- Use células vazias para campos que não se aplicam
- Exemplo: Uma linha de "aula" não precisa preencher campos de curso

### 3. Ordem das Linhas

A ordem no arquivo CSV define:
- A ordem de criação dos itens
- O relacionamento curso → módulo → aula
- A sequência de módulos e aulas

### 4. IDs de Vídeo

**YouTube:**
- Use o ID do vídeo (parte após `v=`)
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- ID: `dQw4w9WgXcQ`

**Vimeo:**
- Use o ID numérico do vídeo
- URL: `https://vimeo.com/123456789`
- ID: `123456789`

**URL Direta:**
- Cole a URL completa do vídeo
- Exemplo: `https://exemplo.com/video.mp4`

---

## 💡 Dicas e Boas Práticas

### 1. Testar com Poucos Dados Primeiro

Antes de importar centenas de aulas:
1. Crie um CSV pequeno (1 curso, 1 módulo, 2-3 aulas)
2. Faça a importação de teste
3. Verifique se tudo foi criado corretamente
4. Só então importe o arquivo completo

### 2. Usar Excel ou Google Sheets

É mais fácil editar no Excel/Sheets:
- Organize os dados em colunas
- Use fórmulas para repetir valores
- Exporte como CSV quando terminar

### 3. Encoding UTF-8

Salve o CSV com encoding UTF-8 para suportar:
- Acentos (á, é, í, ó, ú)
- Cedilha (ç)
- Caracteres especiais

### 4. Backup Antes de Importar

Se você já tem cursos no sistema:
- Considere fazer um backup do banco antes
- Ou importe em horário de baixo uso

### 5. Campos Obrigatórios

Sempre preencha:
- `tipo` (em todas as linhas)
- `curso_titulo` (em linhas de curso)
- `modulo_titulo` (em linhas de módulo)
- `aula_titulo`, `aula_video_provider`, `aula_video_id` (em linhas de aula)

---

## 🐛 Troubleshooting

### Erro: "Formato de CSV inválido"

**Causa:** Arquivo não tem as colunas necessárias

**Solução:** 
- Baixe novamente o template
- Certifique-se de que a primeira linha contém os nomes das colunas

### Erro: "Módulo sem curso definido"

**Causa:** Tentou criar um módulo antes de criar um curso

**Solução:**
- A primeira linha (após o cabeçalho) deve ser de tipo "curso"
- Sempre defina um curso antes de seus módulos

### Erro: "Aula sem módulo definido"

**Causa:** Tentou criar uma aula antes de criar um módulo

**Solução:**
- Defina um módulo antes de suas aulas
- Estrutura correta: curso → módulo → aula

### Importação Lenta

**Causa:** Muitos itens sendo importados

**Solução:**
- É normal para arquivos grandes
- O sistema aguarda 100ms entre cada item
- Acompanhe o log de progresso

---

## 📊 Exemplo de Estrutura Completa

Este exemplo cria 2 cursos completos:

```
📚 Curso 1: Cálculos Trabalhistas Básico (20h)
   📂 Módulo 1: Introdução
      ▶️ Aula 1: O que é CLT (15min) [GRÁTIS]
      ▶️ Aula 2: Conceitos iniciais (20min)
   📂 Módulo 2: Cálculos Básicos
      ▶️ Aula 3: Horas Extras (25min)

📚 Curso 2: Cálculos Trabalhistas Avançado (30h)
   📂 Módulo 1: Verbas Rescisórias
      ▶️ Aula 1: Aviso Prévio (30min)
```

---

## 🎓 Exemplos de Uso

### Caso 1: Curso Simples

Um curso básico com 1 módulo e 3 aulas:

```csv
tipo,curso_titulo,curso_descricao,curso_instrutor,curso_duracao_horas,modulo_titulo,modulo_descricao,aula_titulo,aula_descricao,aula_video_provider,aula_video_id,aula_duracao_minutos,aula_ordem,aula_teste_gratis
curso,Introdução ao Cálculo,Curso básico,Ana Silva,5,,,,,,,,
modulo,,,,,Primeiros Passos,Conceitos iniciais,,,,,,,
aula,,,,,,,Boas-vindas,Apresentação do curso,youtube,abc123,5,1,sim
aula,,,,,,,Conceitos básicos,Fundamentos,youtube,def456,15,2,sim
aula,,,,,,,Primeiro cálculo,Exemplo prático,youtube,ghi789,20,3,nao
```

### Caso 2: Múltiplos Cursos

Importar vários cursos de uma vez:

```csv
tipo,curso_titulo,curso_descricao,curso_instrutor,curso_duracao_horas,modulo_titulo,modulo_descricao,aula_titulo,aula_descricao,aula_video_provider,aula_video_id,aula_duracao_minutos,aula_ordem,aula_teste_gratis
curso,Curso A,Descrição A,João,10,,,,,,,,
modulo,,,,,Módulo A1,Descrição A1,,,,,,,
aula,,,,,,,Aula A1.1,,youtube,a1,10,1,sim
curso,Curso B,Descrição B,Maria,15,,,,,,,,
modulo,,,,,Módulo B1,Descrição B1,,,,,,,
aula,,,,,,,Aula B1.1,,youtube,b1,15,1,sim
```

---

## 📞 Suporte

Se encontrar problemas:

1. **Verifique o log de importação** - Ele mostra exatamente onde ocorreu o erro
2. **Revise o formato do CSV** - Certifique-se de seguir o modelo
3. **Teste com dados menores** - Facilita identificar o problema
4. **Confira os caracteres especiais** - Use UTF-8 encoding

---

## ✅ Checklist Antes de Importar

- [ ] Baixei o template CSV
- [ ] Preenchi todos os campos obrigatórios
- [ ] Segui a hierarquia curso → módulo → aula
- [ ] Testei com um arquivo pequeno primeiro
- [ ] Salvei o CSV com encoding UTF-8
- [ ] Fiz backup dos dados existentes (se aplicável)
- [ ] Verifiquei o preview antes de confirmar

---

## 🎉 Pronto para Importar!

Agora você está pronto para importar seus cursos via CSV. Boa importação! 🚀
