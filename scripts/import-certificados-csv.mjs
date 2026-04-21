/**
 * Importa certificados.csv para a tabela certificates.
 * Busca o course_id pelo título do curso na tabela courses (match case-insensitive).
 * Gera certificate_code único para cada registro.
 *
 * Uso: node scripts/import-certificados-csv.mjs [caminho/para/arquivo.csv]
 * Requer: DATABASE_CCT no ambiente ou .env
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Suporte a .env simples sem dependências externas
const envPath = path.resolve(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && v.length && !process.env[k.trim()]) {
      process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '')
    }
  }
}

const csvArg = process.argv[2]
const CSV_PATH = csvArg
  ? path.resolve(csvArg)
  : path.resolve(__dirname, '..', 'certificados.csv')

if (!fs.existsSync(CSV_PATH)) {
  console.error(`❌ Arquivo CSV não encontrado: ${CSV_PATH}`)
  console.error('Uso: node scripts/import-certificados-csv.mjs [caminho/para/arquivo.csv]')
  process.exit(1)
}

const connStr = (process.env.DATABASE_CCT || '')
  .replace('postgresql+psycopg2://', 'postgresql://')
  .replace('postgres+psycopg2://', 'postgresql://')

if (!connStr) {
  console.error('❌ Variável DATABASE_CCT não definida.')
  process.exit(1)
}

// --- helpers ---

function clean(val) {
  if (val == null) return null
  const s = String(val).trim()
  return s === '' ? null : s
}

function generateCode() {
  return 'CCT-' + crypto.randomBytes(4).toString('hex').toUpperCase()
}

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split(/\r?\n/)
  const headerIndex = lines.findIndex(l => l.trim())
  const headers = lines[headerIndex].split(';').map(h => h.trim())

  const rows = []
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const values = line.split(';')
    const row = {}
    headers.forEach((h, idx) => { row[h] = clean(values[idx]) })
    rows.push(row)
  }
  return rows
}

// --- main ---

async function main() {
  console.log(`📂 Lendo ${CSV_PATH}...`)
  const rows = parseCsv(CSV_PATH)
  console.log(`📋 ${rows.length} registros encontrados no CSV.`)

  const { Pool } = pg
  const pool = new Pool({ connectionString: connStr, ssl: false })

  try {
    // Carregar todos os cursos uma vez só (evita N queries)
    const { rows: courses } = await pool.query('SELECT id, title FROM courses')
    const courseMap = new Map(courses.map(c => [c.title.toLowerCase().trim(), c.id]))
    console.log(`🎓 ${courses.length} cursos carregados do banco.`)

    let ok = 0, skipped = 0, semCurso = 0, erros = 0

    for (const row of rows) {
      const userEmail   = row['user_email']
      const userName    = row['user_name']
      const courseTitle = row['course_title']
      const cargaHor    = row['carga_horaria'] ? parseInt(row['carga_horaria']) : null

      if (!userEmail || !courseTitle) {
        console.warn(`  ⚠️  Linha ignorada (dados incompletos): ${JSON.stringify(row)}`)
        skipped++
        continue
      }

      // Busca course_id por título (case-insensitive)
      const courseId = courseMap.get(courseTitle.toLowerCase().trim()) || null
      if (!courseId) {
        console.warn(`  ⚠️  Curso não encontrado no banco: "${courseTitle}"`)
        semCurso++
      }

      // Verifica duplicata
      const { rows: existing } = await pool.query(
        'SELECT id FROM certificates WHERE user_email = $1 AND course_title = $2',
        [userEmail, courseTitle]
      )
      if (existing.length > 0) {
        console.log(`  ⏭️  Já existe: ${userEmail} / ${courseTitle}`)
        skipped++
        continue
      }

      try {
        await pool.query(
          `INSERT INTO certificates
            (user_email, user_name, course_id, course_title, carga_horaria, certificate_code, generated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
          [userEmail, userName, courseId, courseTitle, cargaHor, generateCode()]
        )
        ok++
      } catch (err) {
        erros++
        console.warn(`  ❌ Erro (${userEmail} / ${courseTitle}): ${err.message}`)
      }
    }

    console.log(`\n✅ Importação concluída:`)
    console.log(`   ${ok} inseridos`)
    console.log(`   ${skipped} ignorados (duplicatas ou dados incompletos)`)
    console.log(`   ${semCurso} sem course_id (curso não encontrado pelo título)`)
    console.log(`   ${erros} erros`)
  } finally {
    await pool.end()
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message)
  process.exit(1)
})
