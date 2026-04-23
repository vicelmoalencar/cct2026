/**
 * Importa "aulas assistidas.txt" para a tabela user_progress.
 *
 * Formato do arquivo:
 *   Curso          ← 3 linhas de cabeçalho (ignoradas)
 *   aula
 *   assistidos
 *   [nome do curso]
 *   [título da aula]
 *   [email1, email2, ...]   ← opcional (quando há alunos)
 *   [nome do curso]
 *   ...
 *
 * Uso: node scripts/import-aulas-assistidas.mjs
 * Requer: DATABASE_CCT no ambiente ou .env
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Carrega .env
const envPath = path.resolve(ROOT, '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && v.length && !process.env[k.trim()])
      process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '')
  }
}

const connStr = (process.env.DATABASE_CCT || '')
  .replace('postgresql+psycopg2://', 'postgresql://')
  .replace('postgres+psycopg2://', 'postgresql://')

if (!connStr) { console.error('❌ DATABASE_CCT não definida.'); process.exit(1) }

// ── parser ────────────────────────────────────────────────────────────────────

function parseFile(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0)

  // Pula as 3 linhas de cabeçalho (Curso / aula / assistidos)
  let i = 3

  const records = [] // { course, lesson, emails[] }

  while (i < lines.length) {
    const courseLine = lines[i]
    const lessonLine = lines[i + 1]

    // Verifica se temos pelo menos curso + aula
    if (!lessonLine) break

    // Linha seguinte pode ser emails ou próximo curso
    const nextLine = lines[i + 2] || ''
    let emails = []

    if (nextLine.includes('@')) {
      emails = nextLine.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
      i += 3
    } else {
      i += 2
    }

    records.push({ course: courseLine, lesson: lessonLine, emails })
  }

  return records
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const filePath = path.resolve(ROOT, 'migrations', 'aulas assistidas.txt')
  console.log('📂 Lendo arquivo...')
  const records = parseFile(filePath)

  const withEmails = records.filter(r => r.emails.length > 0)
  const totalEntries = withEmails.reduce((s, r) => s + r.emails.length, 0)
  console.log(`📋 ${records.length} aulas encontradas, ${withEmails.length} com alunos, ${totalEntries} entradas para importar.`)

  const { Pool } = pg
  const pool = new Pool({ connectionString: connStr, ssl: false })

  try {
    // Carrega todas as lições em memória: "CURSO|TITULO" → lesson_id
    const { rows: lessons } = await pool.query(`
      SELECT l.id, l.title, c.title AS course_title
      FROM lessons l
      JOIN modules m ON m.id = l.module_id
      JOIN courses c ON c.id = m.course_id
    `)

    const lessonMap = new Map()
    for (const l of lessons) {
      const key = `${l.course_title.trim().toLowerCase()}|${l.title.trim().toLowerCase()}`
      lessonMap.set(key, l.id)
    }
    console.log(`🎓 ${lessons.length} aulas carregadas do banco.\n`)

    let inserted = 0, skipped = 0, semAula = 0, semEmail = 0

    for (const { course, lesson, emails } of records) {
      if (emails.length === 0) { semEmail++; continue }

      const key = `${course.trim().toLowerCase()}|${lesson.trim().toLowerCase()}`
      const lessonId = lessonMap.get(key)

      if (!lessonId) {
        console.warn(`  ⚠️  Aula não encontrada: [${course.trim()}] → "${lesson.trim()}"`)
        semAula++
        continue
      }

      for (const email of emails) {
        try {
          await pool.query(
            `INSERT INTO user_progress (user_email, lesson_id, completed, completed_at)
             VALUES ($1, $2, true, NOW())
             ON CONFLICT (user_email, lesson_id) DO NOTHING`,
            [email, lessonId]
          )
          inserted++
        } catch (err) {
          console.warn(`  ❌ Erro (${email} / lesson ${lessonId}): ${err.message}`)
        }
      }
    }

    console.log('\n✅ Importação concluída:')
    console.log(`   ${inserted}  registros inseridos`)
    console.log(`   ${skipped}  duplicatas ignoradas`)
    console.log(`   ${semAula}  aulas não encontradas no banco`)
    console.log(`   ${semEmail}  aulas sem lista de alunos`)
  } finally {
    await pool.end()
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message)
  process.exit(1)
})
