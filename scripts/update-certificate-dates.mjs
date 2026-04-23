/**
 * Atualiza start_date e completion_date na tabela certificates.
 *
 * Fontes:
 *   - migrations/matricula.csv        → user_email, curso, data_inicial
 *   - migrations/certificados-data.csv → user_email, user_name, course_title, data_final
 *
 * Match: user_email + course_title (normalizado: trim + lowercase)
 *
 * Uso: node scripts/update-certificate-dates.mjs
 * Requer: DATABASE_CCT no ambiente ou .env
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Carrega .env sem dependências externas
const envPath = path.resolve(ROOT, '.env')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && v.length && !process.env[k.trim()]) {
      process.env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '')
    }
  }
}

const connStr = (process.env.DATABASE_CCT || '')
  .replace('postgresql+psycopg2://', 'postgresql://')
  .replace('postgres+psycopg2://', 'postgresql://')

if (!connStr) {
  console.error('❌ Variável DATABASE_CCT não definida.')
  process.exit(1)
}

// ── helpers ──────────────────────────────────────────────────────────────────

function norm(s) {
  return (s || '').trim().toLowerCase()
}

/** Converte DD/MM/YYYY → YYYY-MM-DD (aceita com ou sem aspas) */
function parseDate(s) {
  if (!s) return null
  const clean = s.replace(/"/g, '').trim()
  const m = clean.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  return `${m[3]}-${m[2]}-${m[1]}`
}

/**
 * Parser CSV simples. Suporta:
 *   - separador vírgula ou ponto-e-vírgula (detectado pela primeira linha)
 *   - linhas inteiramente entre aspas duplas (como em certificados-data.csv)
 *   - valores individuais com aspas
 */
function parseCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')

  // Remove aspas que envolvem a linha inteira (certificados-data.csv usa isso)
  const content = raw
    .split(/\r?\n/)
    .map(l => l.trim().replace(/^"(.*)"$/, '$1'))
    .join('\n')

  const lines = content.split(/\r?\n/)
  const headerLine = lines.find(l => l.trim())
  const sep = headerLine.includes(';') ? ';' : ','
  const headers = headerLine.split(sep).map(h => h.trim().replace(/"/g, ''))

  const rows = []
  for (let i = lines.indexOf(headerLine) + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const values = line.split(sep)
    const row = {}
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || '').trim().replace(/"/g, '')
    })
    rows.push(row)
  }
  return rows
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const matriculaPath    = path.resolve(ROOT, 'migrations', 'matricula.csv')
  const datafinalPath    = path.resolve(ROOT, 'migrations', 'certificados-data.csv')

  console.log('📂 Lendo CSVs...')
  const matriculas   = parseCsv(matriculaPath)
  const datafinal    = parseCsv(datafinalPath)
  console.log(`   matricula.csv:       ${matriculas.length} linhas`)
  console.log(`   certificados-data.csv: ${datafinal.length} linhas`)

  // Monta mapas: "email|curso_normalizado" → data
  const startMap = new Map()
  for (const r of matriculas) {
    const key = `${norm(r.user_email)}|${norm(r.curso)}`
    const dt  = parseDate(r.data_inicial)
    if (key && dt) startMap.set(key, dt)
  }

  const endMap = new Map()
  for (const r of datafinal) {
    const key = `${norm(r.user_email)}|${norm(r.course_title)}`
    const dt  = parseDate(r.data_final)
    if (key && dt) endMap.set(key, dt)
  }

  console.log(`\n🗂  Entradas únicas — início: ${startMap.size} | final: ${endMap.size}`)

  const { Pool } = pg
  const pool = new Pool({ connectionString: connStr, ssl: false })

  try {
    // Carrega todos os certificados
    const { rows: certs } = await pool.query(
      'SELECT id, user_email, course_title FROM certificates'
    )
    console.log(`🎓 ${certs.length} certificados carregados do banco.\n`)

    let updStart = 0, updEnd = 0, updBoth = 0, semMatch = 0

    for (const cert of certs) {
      const key = `${norm(cert.user_email)}|${norm(cert.course_title)}`
      const sd  = startMap.get(key) || null
      const ed  = endMap.get(key)   || null

      if (!sd && !ed) {
        semMatch++
        continue
      }

      await pool.query(
        `UPDATE certificates
            SET start_date      = COALESCE($1, start_date),
                completion_date = COALESCE($2, completion_date)
          WHERE id = $3`,
        [sd, ed, cert.id]
      )

      if (sd && ed) updBoth++
      else if (sd)  updStart++
      else          updEnd++
    }

    console.log('✅ Atualização concluída:')
    console.log(`   ${updBoth}  certificados com início E conclusão`)
    console.log(`   ${updStart}  apenas início`)
    console.log(`   ${updEnd}  apenas conclusão`)
    console.log(`   ${semMatch}  sem match nos CSVs`)
  } finally {
    await pool.end()
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message)
  process.exit(1)
})
