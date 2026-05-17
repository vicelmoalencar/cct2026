/**
 * Localiza transcrições em inglês e as remove (seta NULL).
 *
 * A detecção é feita por contagem de stopwords: compara a frequência de
 * palavras comuns em inglês vs. português. Sem chamada de API — roda offline.
 *
 * Uso:
 *   node scripts/remove-english-transcripts.mjs              # simulação: lista as aulas detectadas
 *   node scripts/remove-english-transcripts.mjs --apply      # apaga as transcrições em inglês
 *   node scripts/remove-english-transcripts.mjs --threshold=2 # fator mínimo (padrão: 2)
 *
 * Requer: DATABASE_CCT
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const shouldApply = process.argv.includes('--apply')
const thresholdArg = process.argv.find((a) => a.startsWith('--threshold='))
const threshold = thresholdArg ? parseFloat(thresholdArg.split('=')[1]) : 2
const idsArg = process.argv.find((a) => a.startsWith('--ids='))
const forcedIds = idsArg ? idsArg.split('=')[1].split(',').map(Number) : []

// ─── stopwords ───────────────────────────────────────────────────────────────

const EN_WORDS = new Set([
  'the','is','are','was','were','be','been','being','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall',
  'this','that','these','those','it','its','they','them','their','there',
  'with','from','about','into','through','during','before','after','above',
  'below','between','each','few','more','most','other','some','such','than',
  'too','very','just','because','if','then','so','but','or','and','not',
  'what','which','who','whom','when','where','why','how','all','both',
  'can','an','in','on','at','to','of','for','by','as','up','out','off',
  'he','she','we','you','i','me','him','her','us','our','your','my','his',
])

const PT_WORDS = new Set([
  'o','a','os','as','um','uma','uns','umas','de','do','da','dos','das',
  'em','no','na','nos','nas','por','pelo','pela','pelos','pelas',
  'que','se','não','com','para','ao','aos','à','às','mais','mas',
  'como','foi','são','ser','está','este','esta','esse','essa','isso',
  'ele','ela','eles','elas','eu','você','nós','eles',
  'quando','onde','também','já','ainda','porque','então','aqui','ali',
  'muito','bem','depois','antes','durante','sobre','entre','contra',
  'vamos','pode','deve','tem','ter','fazer','feito','sendo','tendo',
  'cálculo','aula','vídeo','sistema','valor','salário','verba',
])

function detectLanguage(text) {
  // Remove linhas de cabeçalho Markdown (# ## ###) e blockquotes que a IA adicionou em PT
  const stripped = text
    .split('\n')
    .filter((line) => !/^#{1,3}\s/.test(line.trim()) && !/^>\s/.test(line.trim()))
    .join(' ')

  const words = stripped
    .toLowerCase()
    .replace(/[^a-záéíóúãõâêîôûàèìòùç\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2) // ignora palavras de 1-2 letras (ambíguas)

  let enScore = 0
  let ptScore = 0

  for (const word of words) {
    if (EN_WORDS.has(word)) enScore++
    if (PT_WORDS.has(word)) ptScore++
  }

  const total = words.length || 1
  const enRatio = enScore / total
  const ptRatio = ptScore / total

  const isEnglish = enScore > 3 && (ptRatio === 0 || enRatio / Math.max(ptRatio, 0.001) >= threshold)

  return { isEnglish, enScore, ptScore, enRatio, ptRatio, words: total }
}

// ─── helpers ─────────────────────────────────────────────────────────────────

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
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  loadEnv()

  const connStr = (process.env.DATABASE_CCT || '')
    .replace('postgresql+psycopg2://', 'postgresql://')
    .replace('postgres+psycopg2://', 'postgresql://')
  if (!connStr) throw new Error('DATABASE_CCT não definida.')

  const pool = new pg.Pool({ connectionString: connStr, ssl: false })

  try {
    const { rows: lessons } = await pool.query(`
      SELECT id, title, transcript
      FROM lessons
      WHERE transcript IS NOT NULL AND LENGTH(TRIM(transcript)) > 0
      ORDER BY id
    `)

    console.log(`\n🔍 Analisando ${lessons.length} transcrições...\n`)

    const english = []
    const portuguese = []

    for (const lesson of lessons) {
      const result = detectLanguage(lesson.transcript)
      const entry = { ...lesson, ...result }
      if (result.isEnglish) {
        english.push(entry)
      } else {
        portuguese.push(entry)
      }
    }

    console.log(`🇧🇷 Português: ${portuguese.length}`)
    console.log(`🇺🇸 Inglês detectado: ${english.length}\n`)

    // Adiciona IDs forçados via --ids que não foram detectados automaticamente
    for (const id of forcedIds) {
      if (!english.find((l) => l.id === id)) {
        const lesson = lessons.find((l) => l.id === id)
        if (lesson) english.push({ ...lesson, enScore: '?', ptScore: '?', forced: true })
        else console.warn(`  ⚠️  ID ${id} não encontrado no banco.`)
      }
    }

    if (english.length === 0) {
      console.log('✅ Nenhuma transcrição em inglês encontrada.')
      return
    }

    console.log('Transcrições a remover:')
    for (const l of english) {
      const preview = (l.transcript || '').slice(0, 80).replace(/\n/g, ' ')
      const tag = l.forced ? '[forçado]' : `en=${l.enScore} pt=${l.ptScore}`
      console.log(`  #${l.id} | ${tag} | ${l.title.slice(0, 40)} | "${preview}..."`)
    }

    // Backup CSV
    const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const file = path.resolve(ROOT, `backup-english-transcripts-${ts}.csv`)
    const header = ['id', 'title', 'transcript']
    const rows = [
      header.map(csvEscape).join(','),
      ...english.map((l) => [l.id, l.title, l.transcript].map(csvEscape).join(',')),
    ]
    fs.writeFileSync(file, rows.join('\n'), 'utf8')
    console.log(`\n📄 Backup salvo em: ${path.relative(ROOT, file)}`)

    if (!shouldApply) {
      console.log('\n⚠️  Modo simulação. Rode com --apply para apagar as transcrições.\n')
      return
    }

    const ids = english.map((l) => l.id)
    await pool.query(
      `UPDATE lessons SET transcript = NULL WHERE id = ANY($1::int[])`,
      [ids]
    )
    console.log(`\n✅ ${ids.length} transcrições em inglês removidas (apenas o campo transcript).\n`)

  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error('\n❌ Erro fatal:', err.message)
  process.exit(1)
})
