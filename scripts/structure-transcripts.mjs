/**
 * Estrutura todas as transcrições brutas das aulas usando IA (OpenRouter/Gemini).
 *
 * Antes de qualquer alteração, grava um CSV de backup com as transcrições originais.
 * A seção "## Resumo" gerada pela IA é extraída e salva na description da aula.
 *
 * Uso:
 *   node scripts/structure-transcripts.mjs              # simulação (só gera CSV de backup)
 *   node scripts/structure-transcripts.mjs --apply      # grava CSV + chama IA + atualiza banco
 *   node scripts/structure-transcripts.mjs --limit=5    # limita quantidade de aulas processadas
 *   node scripts/structure-transcripts.mjs --delay=2000 # ms entre chamadas à IA (padrão: 1500)
 *
 * Requer:
 *   DATABASE_CCT
 *   VITE_OPENROUTER_API_KEY
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const shouldApply = process.argv.includes('--apply')
const limitArg = process.argv.find((a) => a.startsWith('--limit='))
const delayArg = process.argv.find((a) => a.startsWith('--delay='))
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 0
const delay = delayArg ? parseInt(delayArg.split('=')[1], 10) : 1500

// ─── helpers ────────────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.resolve(ROOT, '.env')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '')
    }
  }
}

function csvEscape(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

function writeBackupCsv(lessons) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const file = path.resolve(ROOT, `backup-transcripts-${ts}.csv`)
  const header = ['id', 'title', 'description', 'transcript']
  const rows = [
    header.map(csvEscape).join(','),
    ...lessons.map((l) =>
      [l.id, l.title, l.description, l.transcript].map(csvEscape).join(',')
    ),
  ]
  fs.writeFileSync(file, rows.join('\n'), 'utf8')
  console.log(`\n📄 Backup CSV salvo em: ${path.relative(ROOT, file)}`)
  return file
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── IA ─────────────────────────────────────────────────────────────────────

async function structureTranscript(lesson, apiKey) {
  const systemPrompt =
    'Você é um especialista em direito trabalhista, liquidação de sentença judicial e uso do software PJe-Calc. ' +
    'Sua tarefa é pegar transcrições brutas de aulas e organizá-las em Markdown estruturado, claro e didático.'

  const userPrompt =
    `Abaixo está a transcrição bruta de uma aula chamada "${lesson.title}".\n\n` +
    'Organize essa transcrição em Markdown estruturado, sem inventar conteúdo. ' +
    'Apenas reorganize, agrupe por tópicos e formate o que já está no texto:\n' +
    '- Título principal com #\n' +
    '- Tópicos e subtópicos com ## e ###\n' +
    '- Conceitos importantes em **negrito**\n' +
    '- > Blockquote para trechos de destaque ou alertas\n' +
    '- Listas com - quando houver enumerações\n' +
    '- Um ## Resumo ao final com os pontos principais\n\n' +
    'Transcrição bruta:\n---\n' +
    lesson.transcript +
    '\n---'

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://cct2026.com.br',
      'X-Title': 'CCT2026 Admin',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenRouter ${response.status}: ${err.slice(0, 300)}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content || ''
}

function extractResumo(structured) {
  // Captura tudo a partir de "## Resumo" (case-insensitive) até o próximo ## ou fim
  const match = structured.match(/##\s+Resumo\s*([\s\S]*?)(?=\n##\s|$)/i)
  if (!match) return null
  return match[1].trim() || null
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main() {
  loadEnv()

  const apiKey = process.env.VITE_OPENROUTER_API_KEY
  if (!apiKey) throw new Error('VITE_OPENROUTER_API_KEY não definida.')

  const connStr = (process.env.DATABASE_CCT || '')
    .replace('postgresql+psycopg2://', 'postgresql://')
    .replace('postgres+psycopg2://', 'postgresql://')
  if (!connStr) throw new Error('DATABASE_CCT não definida.')

  const pool = new pg.Pool({ connectionString: connStr, ssl: false })

  try {
    const { rows: lessons } = await pool.query(`
      SELECT id, title, description, transcript
      FROM lessons
      WHERE transcript IS NOT NULL AND LENGTH(TRIM(transcript)) > 0
      ORDER BY id
      ${limit > 0 ? `LIMIT ${limit}` : ''}
    `)

    console.log(`\n🔍 Aulas com transcrição encontradas: ${lessons.length}`)

    // Backup sempre — independente de --apply
    writeBackupCsv(lessons)

    if (!shouldApply) {
      console.log('\n⚠️  Modo simulação. Nenhuma alteração feita.')
      console.log('   Rode com --apply para chamar a IA e atualizar o banco.\n')
      return
    }

    console.log(`\n🤖 Iniciando estruturação via IA (delay ${delay}ms entre chamadas)...\n`)

    const results = []
    let ok = 0
    let failed = 0

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i]
      process.stdout.write(`  [${i + 1}/${lessons.length}] #${lesson.id} ${lesson.title.slice(0, 50)}... `)

      try {
        const structured = await structureTranscript(lesson, apiKey)
        const resumo = extractResumo(structured)

        results.push({ lesson, structured, resumo })
        console.log(`✅  (resumo: ${resumo ? 'sim' : 'não'})`)
        ok++
      } catch (err) {
        console.log(`❌  ${err.message}`)
        failed++
        results.push({ lesson, structured: null, resumo: null, error: err.message })
      }

      if (i < lessons.length - 1) await sleep(delay)
    }

    console.log(`\n📊 Resultado: ${ok} OK, ${failed} falhas`)

    // Grava no banco
    const client = await pool.connect()
    await client.query('BEGIN')
    try {
      for (const { lesson, structured, resumo, error } of results) {
        if (error || !structured) continue
        await client.query(
          `UPDATE lessons
           SET transcript = $1,
               description = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE description END
           WHERE id = $3`,
          [structured, resumo, lesson.id]
        )
      }
      await client.query('COMMIT')
      console.log(`✅  Banco atualizado com ${ok} transcrições estruturadas.\n`)
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    } finally {
      client.release()
    }

  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error('\n❌ Erro fatal:', err.message)
  process.exit(1)
})
