#!/bin/bash

# Script para adicionar dados de teste na aula ID 1

echo "Adicionando texto de apoio, transcrição e arquivo de teste na aula ID 1..."

curl -X PUT http://localhost:3000/api/admin/lessons/1 \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_email=antoniovicelmo.alencar@gmail.com" \
  -d '{
    "title": "Bem-vindo ao CCT",
    "description": "Apresentação do curso e metodologia",
    "video_provider": "vimeo",
    "video_id": "898989",
    "duration_minutes": 10,
    "order_index": 1,
    "support_text": "📚 TEXTO DE APOIO - AULA 1\n\nEste é um conteúdo complementar para ajudar nos estudos.\n\n🔗 Links úteis:\n- Link 1: https://www.tst.jus.br\n- Link 2: https://www.planalto.gov.br\n\n📝 Pontos importantes:\n1. Primeiro conceito fundamental\n2. Segunda regra importante\n3. Terceira observação crítica\n\n💡 Dica: Revise este conteúdo após assistir o vídeo!",
    "transcript": "💬 TRANSCRIÇÃO DA AULA 1\n\n[00:00] Introdução\nOlá, bem-vindos ao CCT - Clube do Cálculo Trabalhista!\nMeu nome é Vicelmo e hoje vamos iniciar nossa jornada...\n\n[00:30] Sobre o curso\nNeste curso você vai aprender todos os conceitos fundamentais\ndos cálculos trabalhistas, desde o básico até casos complexos.\n\n[01:00] Metodologia\nVamos usar uma abordagem prática, com exemplos reais\ne exercícios que você encontrará no dia a dia.\n\n[02:00] Próximos passos\nNa próxima aula, vamos começar com os conceitos básicos.\nAté lá, revise o material de apoio!\n\n[02:30] Encerramento\nObrigado por participar e nos vemos na próxima aula!",
    "attachments": [
      {
        "name": "Material_Complementar.pdf",
        "size": 524288,
        "type": "application/pdf",
        "data": "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL1Jlc291cmNlcyA8PAovRm9udCA8PAovRjEgNCAwIFIKPj4KPj4KL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSA5IFRmCjUwIDcwMCBUZAooTWF0ZXJpYWwgQ29tcGxlbWVudGFyIGRhIEF1bGEgMSkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2NCAwMDAwMCBuIAowMDAwMDAwMTkwIDAwMDAwIG4gCjAwMDAwMDAyNTkgMDAwMDAgbiAKMDAwMDAwMDM0NCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQzNgolJUVPRgo="
      }
    ]
  }'

echo -e "\n\n✅ Dados de teste adicionados!"
echo "Acesse a aula 1 para ver: https://3000-ikpt0knkee9oqi1r0i931-8f57ffe2.sandbox.novita.ai"
