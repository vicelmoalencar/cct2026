/**
 * Importa usuarios-importados.csv para a tabela usuarios_importados.
 * Uso: node scripts/import-usuarios-csv.mjs [caminho/para/arquivo.csv]
 * Requer: DATABASE_CCT no ambiente ou .env
 * Exemplo: DATABASE_CCT=postgresql://... node scripts/import-usuarios-csv.mjs /tmp/usuarios-importados.csv
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Aceita caminho como argumento ou usa o padrão relativo ao projeto
const csvArg = process.argv[2]
const CSV_PATH = csvArg
  ? path.resolve(csvArg)
  : path.resolve(__dirname, '..', 'usuarios-importados.csv')

if (!fs.existsSync(CSV_PATH)) {
  console.error(`❌ Arquivo CSV não encontrado: ${CSV_PATH}`)
  console.error('Uso: node scripts/import-usuarios-csv.mjs [caminho/para/arquivo.csv]')
  console.error('Exemplo: node scripts/import-usuarios-csv.mjs /tmp/usuarios-importados.csv')
  process.exit(1)
}

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

function toBoolean(val) {
  if (val == null) return false
  return String(val).trim().toLowerCase() === 'sim'
}

function toDate(val) {
  const s = clean(val)
  if (!s) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d.toISOString()
}

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split(/\r?\n/)

  // Primeira linha não-vazia = cabeçalho
  const headerIndex = lines.findIndex(l => l.trim())
  const headers = lines[headerIndex].split(';').map(h => h.trim())

  const rows = []
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const values = line.split(';')
    const row = {}
    headers.forEach((h, idx) => {
      row[h] = clean(values[idx])
    })
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
    // Criar tabela se não existir
    const migrationSql = fs.readFileSync(
      path.resolve(__dirname, '..', 'migrations', '0020_usuarios_importados.sql'),
      'utf8'
    )
    await pool.query(migrationSql)
    console.log('✅ Tabela usuarios_importados verificada/criada.')

    // Limpar dados anteriores para reimportação limpa
    await pool.query('TRUNCATE TABLE usuarios_importados RESTART IDENTITY')
    console.log('🗑️  Dados anteriores removidos.')

    let ok = 0
    let erros = 0

    for (const row of rows) {
      try {
        await pool.query(
          `INSERT INTO usuarios_importados (
            id_bubble_user, nome, first_name, last_name, email,
            assinatura_ativa, ativo, cpf, dt_expiracao,
            end_cep, end_cidade, end_estado, end_logradouro, end_numero,
            foto, id_bubble_plano_atual, senha_provisoria,
            suporte, telefone, teste_gratis, tipo, whatsapp, whatsapp_validacao
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,
            $15,$16,$17,$18,$19,$20,$21,$22,$23
          )`,
          [
            row['id_bubble_user'],
            row['nome'],
            row['first_name'],
            row['last_name'],
            row['email'],
            toBoolean(row['assinatura_ativa']),
            toBoolean(row['ativo']),
            row['cpf'],
            toDate(row['dt_expiracao']),
            row['end_cep'],
            row['end_cidade'],
            row['end_estado'],
            row['end_logradouro'],
            row['end_numero'],
            row['foto'],
            row['id_bubble_plano_atual'],
            row['senha-provisoria'],
            row['suporte'],
            row['telefone'],
            toBoolean(row['teste_gratis']),
            row['tipo'],
            row['whatsapp'],
            row['whatsapp_validacao'],
          ]
        )
        ok++
      } catch (err) {
        erros++
        console.warn(`  ⚠️  Linha ignorada (${row['email'] || '?'}): ${err.message}`)
      }
    }

    console.log(`\n✅ Importação concluída: ${ok} inseridos, ${erros} erros.`)
  } finally {
    await pool.end()
  }
}

main().catch(err => {
  console.error('❌ Erro fatal:', err.message)
  process.exit(1)
})
