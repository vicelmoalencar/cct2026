/**
 * Importa Aulas_favoritas.csv para a tabela user_favorites.
 * Formato: AULA;CURSO;EMAIL (separador ;, encoding latin-1)
 *
 * Uso: node scripts/import-aulas-favoritas.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

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

function norm(s) { return (s || '').trim().toLowerCase() }

// Converte buffer latin-1 para string com acentos corretos
function readLatin1(filePath) {
  const buf = fs.readFileSync(filePath)
  return buf.toString('latin1')
}

async function main() {
  const csvPath = path.resolve(ROOT, 'migrations', 'Aulas_favoritas.csv')
  const text = readLatin1(csvPath)
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l && l !== ';;')

  // Pula cabeçalho
  const rows = lines.slice(1).map(l => {
    const [aula, curso, email] = l.split(';')
    return { aula: (aula || '').trim(), curso: (curso || '').trim(), email: (email || '').trim().toLowerCase() }
  }).filter(r => r.aula && r.curso && r.email && r.email.includes('@'))

  console.log(`📋 ${rows.length} favoritos válidos encontrados.`)

  const { Pool } = pg
  const pool = new Pool({ connectionString: connStr, ssl: false })

  try {
    // Roda a migration primeiro
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id         SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        lesson_id  INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_email, lesson_id)
      )
    `)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_favorites_user_email ON user_favorites(user_email)`)
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_favorites_lesson_id  ON user_favorites(lesson_id)`)
    console.log('✅ Tabela user_favorites pronta.')

    // Carrega todas as lições: "curso|titulo" → lesson_id
    const { rows: lessons } = await pool.query(`
      SELECT l.id, l.title, c.title AS course_title
      FROM lessons l
      JOIN modules m ON m.id = l.module_id
      JOIN courses c ON c.id = m.course_id
    `)
    const lessonMap = new Map()
    for (const l of lessons) {
      lessonMap.set(`${norm(l.course_title)}|${norm(l.title)}`, l.id)
    }
    console.log(`🎓 ${lessons.length} aulas carregadas do banco.\n`)

    let inserted = 0, skipped = 0, notFound = 0

    for (const { aula, curso, email } of rows) {
      const key = `${norm(curso)}|${norm(aula)}`
      const lessonId = lessonMap.get(key)

      if (!lessonId) {
        console.warn(`  ⚠️  Não encontrada: [${curso}] → "${aula}"`)
        notFound++
        continue
      }

      try {
        const r = await pool.query(
          `INSERT INTO user_favorites (user_email, lesson_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [email, lessonId]
        )
        if (r.rowCount > 0) inserted++
        else skipped++
      } catch (err) {
        console.warn(`  ❌ Erro (${email}): ${err.message}`)
      }
    }

    console.log('\n✅ Importação concluída:')
    console.log(`   ${inserted}  favoritos inseridos`)
    console.log(`   ${skipped}  duplicatas ignoradas`)
    console.log(`   ${notFound}  aulas não encontradas`)
  } finally {
    await pool.end()
  }
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })
