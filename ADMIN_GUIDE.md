# 🛠️ Guia do Painel de Administração - CCT

## 👨‍💼 Administradores

Os seguintes emails têm acesso ao painel de administração:

- ✅ `antoniovicelmo.alencar@gmail.com` - ANTONIO VICELMO
- ✅ `vicelmo@trt21.jus.br` - VICELMO ALENCAR

---

## 🚀 Como Acessar o Painel Admin

1. **Faça login** com um dos emails de administrador acima
2. **Veja o botão "Admin"** (roxo) no canto superior direito do header
3. **Clique em "Admin"** para abrir o painel de administração

---

## 📚 Funcionalidades do Painel

### 1️⃣ **Gestão de Cursos**

#### Criar Novo Curso
1. Clique na aba **"Cursos"**
2. Clique em **"Novo Curso"** (botão verde)
3. Preencha os campos:
   - **Título**: Nome do curso (obrigatório)
   - **Descrição**: Descrição do curso
   - **Duração**: Duração total em horas
   - **Instrutor**: Nome do instrutor (padrão: "Vicelmo")
4. Clique em **"Salvar"**

#### Editar Curso
1. Na lista de cursos, clique no botão **azul (📝)** do curso
2. Edite os campos desejados
3. Clique em **"Salvar"**

#### Excluir Curso
1. Na lista de cursos, clique no botão **vermelho (🗑️)** do curso
2. Confirme a exclusão
3. ⚠️ **Atenção**: Isso também excluirá todos os módulos e aulas do curso!

---

### 2️⃣ **Gestão de Módulos** (Em breve)

A gestão completa de módulos será implementada em breve. Por enquanto, você pode gerenciar módulos diretamente no banco de dados.

---

### 3️⃣ **Gestão de Aulas** (Em breve)

A gestão completa de aulas será implementada em breve, incluindo:
- ✅ Upload de vídeos do YouTube
- ✅ Upload de vídeos do Vimeo
- ✅ URLs de vídeo personalizadas

---

## 🎥 Como Adicionar Vídeos do YouTube/Vimeo

### Estrutura do Banco de Dados

As aulas suportam 3 tipos de vídeo:

| Tipo | video_provider | video_id | Exemplo |
|------|----------------|----------|---------|
| **YouTube** | `youtube` | ID do vídeo | `dQw4w9WgXcQ` |
| **Vimeo** | `vimeo` | ID do vídeo | `123456789` |
| **URL Personalizada** | `url` | URL completa | `https://meusite.com/video.mp4` |

### Exemplos de video_id

#### YouTube
- URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- **video_id**: `dQw4w9WgXcQ`

- URL: `https://youtu.be/dQw4w9WgXcQ`
- **video_id**: `dQw4w9WgXcQ`

#### Vimeo
- URL: `https://vimeo.com/123456789`
- **video_id**: `123456789`

### Como Inserir Vídeos (Por Enquanto - Via SQL)

```sql
-- Adicionar vídeo do YouTube
UPDATE lessons 
SET 
  video_provider = 'youtube',
  video_id = 'dQw4w9WgXcQ',
  video_url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
WHERE id = 1;

-- Adicionar vídeo do Vimeo
UPDATE lessons 
SET 
  video_provider = 'vimeo',
  video_id = '123456789',
  video_url = 'https://vimeo.com/123456789'
WHERE id = 2;

-- Adicionar URL personalizada
UPDATE lessons 
SET 
  video_provider = 'url',
  video_id = 'https://meusite.com/video.mp4',
  video_url = 'https://meusite.com/video.mp4'
WHERE id = 3;
```

---

## 🗄️ Gerenciamento do Banco de Dados

### Comandos Úteis

#### Consultar Dados

```bash
# Ver todos os cursos
npm run db:console:local -- --command="SELECT * FROM courses"

# Ver todos os módulos
npm run db:console:local -- --command="SELECT * FROM modules"

# Ver todas as aulas
npm run db:console:local -- --command="SELECT * FROM lessons"

# Ver administradores
npm run db:console:local -- --command="SELECT * FROM admins"
```

#### Inserir Dados

```bash
# Adicionar novo módulo
npm run db:console:local -- --command="INSERT INTO modules (course_id, title, description, order_index) VALUES (1, 'Módulo Novo', 'Descrição', 4)"

# Adicionar nova aula com YouTube
npm run db:console:local -- --command="INSERT INTO lessons (module_id, title, description, video_provider, video_id, duration_minutes, order_index) VALUES (1, 'Aula Nova', 'Descrição da aula', 'youtube', 'dQw4w9WgXcQ', 25, 4)"

# Adicionar nova aula com Vimeo
npm run db:console:local -- --command="INSERT INTO lessons (module_id, title, description, video_provider, video_id, duration_minutes, order_index) VALUES (1, 'Aula Vimeo', 'Descrição da aula', 'vimeo', '123456789', 30, 5)"
```

#### Atualizar Dados

```bash
# Atualizar título de um curso
npm run db:console:local -- --command="UPDATE courses SET title='Novo Título' WHERE id=1"

# Atualizar vídeo de uma aula
npm run db:console:local -- --command="UPDATE lessons SET video_provider='youtube', video_id='NovoID' WHERE id=1"
```

---

## 🔐 Como Adicionar Novos Administradores

### Via SQL

```bash
npm run db:console:local -- --command="INSERT INTO admins (email, name) VALUES ('novoadmin@email.com', 'Nome do Admin')"
```

### Para Produção

Quando fizer deploy em produção, use:

```bash
npx wrangler d1 execute cct-production --command="INSERT INTO admins (email, name) VALUES ('novoadmin@email.com', 'Nome do Admin')"
```

---

## 📊 Estatísticas e Relatórios

### Ver Progresso dos Alunos

```bash
# Ver quantas aulas cada aluno completou
npm run db:console:local -- --command="SELECT user_email, COUNT(*) as completed_lessons FROM user_progress WHERE completed=1 GROUP BY user_email"

# Ver comentários por aula
npm run db:console:local -- --command="SELECT l.title, COUNT(c.id) as comments_count FROM lessons l LEFT JOIN comments c ON l.id = c.lesson_id GROUP BY l.id"
```

---

## 🎯 Roadmap - Próximas Funcionalidades

### Prioridade Alta
- [ ] Interface completa de gestão de módulos
- [ ] Interface completa de gestão de aulas
- [ ] Upload de vídeos do YouTube via interface
- [ ] Upload de vídeos do Vimeo via interface
- [ ] Reordenação de módulos e aulas (drag & drop)

### Prioridade Média
- [ ] Preview de vídeos no painel admin
- [ ] Estatísticas de visualização
- [ ] Relatórios de progresso dos alunos
- [ ] Gestão de comentários (moderar, responder)

### Prioridade Baixa
- [ ] Upload direto de vídeos para Cloudflare Stream
- [ ] Legendas e transcrições
- [ ] Certificados personalizáveis
- [ ] Gamificação (badges, pontos)

---

## 🆘 Problemas Comuns

### Botão "Admin" não aparece

**Causa**: Você não está logado com um email de administrador.

**Solução**: 
1. Faça logout
2. Faça login com `antoniovicelmo.alencar@gmail.com` ou `vicelmo@trt21.jus.br`

### Erro ao salvar curso

**Causa**: Campos obrigatórios não preenchidos.

**Solução**: Certifique-se de preencher pelo menos o campo "Título".

### Vídeo não aparece na aula

**Causa**: `video_provider` ou `video_id` não configurados.

**Solução**: Configure os campos corretamente no banco de dados (veja exemplos acima).

---

## 📞 Suporte

Para adicionar novas funcionalidades ou resolver problemas, entre em contato com o desenvolvedor.

---

**Desenvolvido para**: Vicelmo - CCT Clube do Cálculo Trabalhista  
**Data**: 23 de Outubro de 2025  
**Versão**: 1.0
