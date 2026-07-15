# API Externa — Integração com outros sistemas Ensino Plus

API somente leitura para outro sistema da Ensino Plus consultar dados do CCT (usuários, assinaturas, certificados, cursos, aulas, módulos, comentários e favoritas).

## Autenticação

Todas as rotas exigem o header `X-API-Key` com o valor da variável de ambiente `EXTERNAL_API_KEY`.

```
X-API-Key: <chave>
```

Sem a chave, ou com uma chave errada, a API responde `401 Unauthorized`. Se a variável `EXTERNAL_API_KEY` não estiver configurada no ambiente, a API responde `500`.

**Chave atual (ambiente local / `.env`):**
```
5a72991d8b6a0573b36b5d9258eb2ea1449239806c92ed6c918696e76d9be79a
```

> Em produção, essa variável precisa ser cadastrada manualmente no painel do EasyPanel (o `.env` local não é usado lá).

## Base URL

```
https://novocct.ensinoplus.com.br/api/external/v1
```

## Endpoints

### Usuários

`GET /users?email=<busca parcial>&limit=<n>`
Busca usuários por email ou nome (parcial, case-insensitive). Sem `email`, lista os mais recentes.

`GET /users/:email`
Perfil completo de um usuário: dados cadastrais, assinaturas locais (`member_subscriptions`), assinaturas no SuitePlus (se configurado) e certificados.

```json
{
  "user": { "id": 65, "email": "...", "nome": "...", "ativo": true, ... },
  "subscriptions": [ { "email_membro": "...", "data_expiracao": "...", "ativo": true, "origem": "hotmart", ... } ],
  "suiteplus_subscriptions": [ { "product_id": 4, "status": "active", "expires_at": "...", ... } ],
  "certificates": [ { "course_title": "...", "certificate_code": "...", ... } ]
}
```

### Assinaturas

`GET /subscriptions?email=<email>&status=active|expired&limit=<n>`
Lista assinaturas (`member_subscriptions`). `status=active` filtra `data_expiracao > agora` e `ativo = true`; `status=expired` filtra o inverso.

### Certificados

`GET /certificates?email=<email>&limit=<n>`
Lista certificados. Sem `email`, lista os mais recentes.

### Cursos, módulos e aulas

`GET /courses`
Lista todos os cursos com contagem de módulos e aulas.

`GET /courses/:id`
Curso completo, com módulos e respectivas aulas aninhadas.

```json
{
  "course": { "id": 1, "title": "PJECALCPLUS", ... },
  "modules": [
    { "id": 10, "title": "...", "order_index": 1, "lessons": [ { "id": 17, "title": "...", "is_published": true, ... } ] }
  ]
}
```

`GET /modules/:id`
Um módulo específico e suas aulas.

`GET /lessons/:id`
Detalhe de uma aula (inclui `course_id`, `course_title`, `module_title`).

### Comentários

`GET /comments?lesson_id=<id>&email=<email>&limit=<n>`
Lista comentários, filtrando por aula e/ou autor.

### Favoritas

`GET /favorites?email=<email>` (**`email` é obrigatório**)
Lista as aulas favoritadas por um aluno.

## Exemplos

```bash
curl -H "X-API-Key: $EXTERNAL_API_KEY" \
  "https://novocct.ensinoplus.com.br/api/external/v1/users/aluno@exemplo.com"

curl -H "X-API-Key: $EXTERNAL_API_KEY" \
  "https://novocct.ensinoplus.com.br/api/external/v1/subscriptions?status=active&limit=20"

curl -H "X-API-Key: $EXTERNAL_API_KEY" \
  "https://novocct.ensinoplus.com.br/api/external/v1/courses/1"
```

## Limitações atuais

- **Somente leitura** — não há endpoints de criação, edição ou exclusão nesta API.
- Todos os endpoints de listagem aceitam `limit` (máximo 200, padrão 50).
- Implementação em [`src/index.tsx`](src/index.tsx) — seção `API ROUTES - EXTERNAL INTEGRATION`.

Precisando de escrita (criar/editar/excluir algum recurso) ou de outro recurso não listado aqui, é só pedir — o padrão de autenticação (`X-API-Key`) já está pronto para ser reaproveitado.
