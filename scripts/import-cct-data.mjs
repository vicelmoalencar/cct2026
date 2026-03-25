import fs from 'node:fs'
import path from 'node:path'
import pg from 'pg'

function normalizeConnectionString(connectionString) {
  return connectionString
    .replace('postgresql+psycopg2://', 'postgresql://')
    .replace('postgres+psycopg2://', 'postgresql://')
}

function cleanField(field) {
  if (field == null) return ''
  return String(field).trim().replace(/^"|"$/g, '').trim()
}

function parseLegacySemicolonCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split(/\r?\n/)
  const headerLine = lines.find((line) => line.trim())

  if (!headerLine) return []

  const headers = headerLine.split(';').map((header) => cleanField(header))
  const rows = []

  for (const line of lines.slice(lines.indexOf(headerLine) + 1)) {
    if (!line.trim()) continue

    const values = line.split(';')
    const row = {}

    headers.forEach((header, index) => {
      row[header] = cleanField(values[index] ?? '')
    })

    rows.push(row)
  }

  return rows
}

function isTruthy(value) {
  return ['sim', 'true', '1', 'yes'].includes(cleanField(value).toLowerCase())
}

function toNullableText(value) {
  const cleaned = cleanField(value)
  return cleaned || null
}

function toInteger(value, fallback = 0) {
  const cleaned = cleanField(value).replace(',', '.')
  if (!cleaned) return fallback

  const parsed = Number.parseFloat(cleaned)
  if (Number.isNaN(parsed)) return fallback

  return Math.round(parsed)
}

function normalizeVideoProvider(value) {
  const cleaned = cleanField(value).toLowerCase()

  if (!cleaned) return 'url'
  if (cleaned.includes('vimeo') || cleaned.includes('vímeo') || cleaned.includes('vìmeo')) return 'vimeo'
  if (cleaned.includes('youtube') || cleaned.includes('you tube')) return 'youtube'
  return 'url'
}

async function main() {
  const connectionString = process.env.DATABASE_CCT

  if (!connectionString) {
    throw new Error('DATABASE_CCT não configurado')
  }

  const rootDir = process.cwd()
  const coursesFile = path.join(rootDir, 'cursos_original.csv')
  const modulesFile = path.join(rootDir, 'modulos_original.csv')
  const lessonsFile = path.join(rootDir, 'aulas_original.csv')

  const coursesRaw = parseLegacySemicolonCsv(coursesFile)
  const modulesRaw = parseLegacySemicolonCsv(modulesFile)
  const lessonsRaw = parseLegacySemicolonCsv(lessonsFile)

  const activeCourses = coursesRaw.filter((course) => isTruthy(course['ativo']))
  const activeModules = modulesRaw.filter((module) => isTruthy(module['ativo']) && isTruthy(module['visibilidade']))
  const activeLessons = lessonsRaw.filter((lesson) => isTruthy(lesson['ativo']) && isTruthy(lesson['visibilidade']))

  const pool = new pg.Pool({
    connectionString: normalizeConnectionString(connectionString),
    ssl: false,
  })

  const client = await pool.connect()

  try {
    const existingCounts = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM courses) AS courses_count,
        (SELECT COUNT(*) FROM modules) AS modules_count,
        (SELECT COUNT(*) FROM lessons) AS lessons_count
    `)

    const counts = existingCounts.rows[0]
    const hasExistingData = Number(counts.courses_count) > 0 || Number(counts.modules_count) > 0 || Number(counts.lessons_count) > 0

    if (hasExistingData && process.env.FORCE_REIMPORT !== '1') {
      throw new Error('As tabelas courses/modules/lessons já possuem dados. Use FORCE_REIMPORT=1 para substituir.')
    }

    await client.query('BEGIN')

    if (hasExistingData) {
      await client.query('TRUNCATE TABLE lessons, modules, courses RESTART IDENTITY CASCADE')
    }

    const courseIdByLegacyId = new Map()
    const moduleIdByLegacyId = new Map()

    for (const course of activeCourses) {
      const result = await client.query(
        `
          INSERT INTO courses (
            title,
            description,
            thumbnail,
            instructor,
            duration_hours,
            offers_certificate,
            is_published
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `,
        [
          cleanField(course['nome']) || 'Curso sem título',
          toNullableText(course['descricao']) || toNullableText(course['breve_descricao']),
          toNullableText(course['firebase_url']) || toNullableText(course['imagem']),
          'Vicelmo Alencar',
          toInteger(course['carga_horaria'], 0),
          isTruthy(course['gerar_certificado']),
          true,
        ]
      )

      courseIdByLegacyId.set(cleanField(course['id_bubble_curso']), result.rows[0].id)
    }

    const sortedModules = [...activeModules].sort((a, b) => toInteger(a['ordenacao'], 0) - toInteger(b['ordenacao'], 0))

    for (const module of sortedModules) {
      const legacyCourseId = cleanField(module['id_bubble_curso'])
      const courseId = courseIdByLegacyId.get(legacyCourseId)

      if (!courseId) continue

      const result = await client.query(
        `
          INSERT INTO modules (
            course_id,
            title,
            description,
            order_index
          )
          VALUES ($1, $2, $3, $4)
          RETURNING id
        `,
        [
          courseId,
          cleanField(module['descricao']) || 'Módulo sem título',
          null,
          toInteger(module['ordenacao'], 0),
        ]
      )

      moduleIdByLegacyId.set(cleanField(module['id_bubble_modulo']), result.rows[0].id)
    }

    const sortedLessons = [...activeLessons].sort((a, b) => toInteger(a['ordenacao'], 999999) - toInteger(b['ordenacao'], 999999))

    for (const lesson of sortedLessons) {
      const legacyModuleId = cleanField(lesson['id_bubble_modulo'])
      const moduleId = moduleIdByLegacyId.get(legacyModuleId)

      if (!moduleId) continue

      const testeGratis = isTruthy(lesson['teste_gratis'])

      await client.query(
        `
          INSERT INTO lessons (
            module_id,
            title,
            description,
            video_url,
            video_provider,
            video_id,
            duration_minutes,
            order_index,
            free_trial,
            teste_gratis
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          moduleId,
          cleanField(lesson['descricao']) || 'Aula sem título',
          null,
          null,
          normalizeVideoProvider(lesson['video_fonte']),
          toNullableText(lesson['video_id']),
          toInteger(lesson['minutos'], 0),
          toInteger(lesson['ordenacao'], 0),
          testeGratis,
          testeGratis,
        ]
      )
    }

    await client.query('COMMIT')

    const finalCounts = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM courses) AS courses_count,
        (SELECT COUNT(*) FROM modules) AS modules_count,
        (SELECT COUNT(*) FROM lessons) AS lessons_count
    `)

    const summary = finalCounts.rows[0]
    console.log(`courses:${summary.courses_count}`)
    console.log(`modules:${summary.modules_count}`)
    console.log(`lessons:${summary.lessons_count}`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
