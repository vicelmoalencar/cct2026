// ============================================
// Cliente PostgreSQL para dados do CCT
// Banco: novocct (EasyPanel)
// ============================================
// Utiliza a API fetch nativa do Cloudflare Workers / Node.js
// com chamadas diretas ao banco via string de conexão.
// Como Cloudflare Workers NÃO suporta TCP direto (pg nativo),
// este cliente usa um padrão REST adapter para ambiente Workers,
// e o driver pg para Node.js (produção via server.js).
// ============================================

export class PostgresClient {
  private pool: any = null
  private connectionString: string

  constructor(connectionString: string) {
    // Normalizar: converter formato psycopg2 para formato node-postgres
    this.connectionString = connectionString
      .replace('postgresql+psycopg2://', 'postgresql://')
      .replace('postgres+psycopg2://', 'postgresql://')
  }

  private async getPool() {
    if (this.pool) return this.pool

    // Importar pg dinamicamente (disponível apenas em Node.js via server.js)
    const pg = await import('pg')
    const { Pool } = pg.default || pg

    this.pool = new Pool({
      connectionString: this.connectionString,
      ssl: false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })

    this.pool.on('error', (err: any) => {
      console.error('❌ PostgreSQL pool error:', err.message)
    })

    return this.pool
  }

  // ============================================
  // SELECT com filtros simples
  // ============================================
  async query(
    table: string,
    options: {
      select?: string
      filters?: Record<string, any>
      order?: string        // ex: 'created_at DESC' ou 'created_at.desc'
      limit?: number
      single?: boolean
    } = {}
  ): Promise<any> {
    const { select = '*', filters = {}, order, limit, single = false } = options
    const pool = await this.getPool()

    const conditions: string[] = []
    const values: any[] = []
    let idx = 1

    for (const [key, value] of Object.entries(filters)) {
      conditions.push(`"${key}" = $${idx}`)
      values.push(value)
      idx++
    }

    // Normalizar order: 'created_at.desc' → 'created_at DESC'
    let orderClause = ''
    if (order) {
      orderClause = 'ORDER BY ' + order
        .replace(/\.desc$/i, ' DESC')
        .replace(/\.asc$/i, ' ASC')
        .replace(/,([^,]+)\.desc/gi, ', $1 DESC')
        .replace(/,([^,]+)\.asc/gi, ', $1 ASC')
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const limitClause = (limit || single) ? `LIMIT ${single ? 1 : limit}` : ''

    const sql = `SELECT ${select} FROM "${table}" ${whereClause} ${orderClause} ${limitClause}`.trim()

    const result = await pool.query(sql, values)

    if (single) {
      return result.rows[0] || null
    }
    return result.rows
  }

  // ============================================
  // INSERT
  // ============================================
  async insert(table: string, data: Record<string, any>): Promise<any[]> {
    const pool = await this.getPool()

    const keys = Object.keys(data).filter(k => data[k] !== undefined)
    const values = keys.map(k => data[k])
    const placeholders = keys.map((_, i) => `$${i + 1}`)

    const sql = `
      INSERT INTO "${table}" (${keys.map(k => `"${k}"`).join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `

    const result = await pool.query(sql, values)
    return result.rows
  }

  // ============================================
  // UPDATE
  // ============================================
  async update(
    table: string,
    filters: Record<string, any>,
    data: Record<string, any>
  ): Promise<any[]> {
    const pool = await this.getPool()

    const dataKeys = Object.keys(data).filter(k => data[k] !== undefined)
    const values: any[] = []
    let idx = 1

    const setClauses = dataKeys.map(k => {
      values.push(data[k])
      return `"${k}" = $${idx++}`
    })

    const conditions: string[] = []
    for (const [key, value] of Object.entries(filters)) {
      conditions.push(`"${key}" = $${idx}`)
      values.push(value)
      idx++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const sql = `UPDATE "${table}" SET ${setClauses.join(', ')} ${whereClause} RETURNING *`

    const result = await pool.query(sql, values)
    return result.rows
  }

  // ============================================
  // DELETE
  // ============================================
  async delete(table: string, filters: Record<string, any>): Promise<boolean> {
    const pool = await this.getPool()

    const conditions: string[] = []
    const values: any[] = []
    let idx = 1

    for (const [key, value] of Object.entries(filters)) {
      conditions.push(`"${key}" = $${idx}`)
      values.push(value)
      idx++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const sql = `DELETE FROM "${table}" ${whereClause}`

    await pool.query(sql, values)
    return true
  }

  // ============================================
  // RAW SQL (para chamadas de funções PostgreSQL)
  // ============================================
  async sql(query: string, values: any[] = []): Promise<any[]> {
    const pool = await this.getPool()
    const result = await pool.query(query, values)
    return result.rows
  }

  // ============================================
  // RPC — chama função PostgreSQL
  // ============================================
  async rpc(functionName: string, params: Record<string, any> = {}): Promise<any> {
    const pool = await this.getPool()

    const paramKeys = Object.keys(params)
    const values = paramKeys.map(k => params[k])
    const placeholders = paramKeys.map((k, i) => `${k} => $${i + 1}`).join(', ')

    const sql = `SELECT * FROM ${functionName}(${placeholders})`
    const result = await pool.query(sql, values)

    // Retornar em formato compatível com o código existente
    if (result.rows.length === 1) {
      const row = result.rows[0]
      const keys = Object.keys(row)
      // Se retornou uma única coluna com o nome da função, retornar o valor direto
      if (keys.length === 1) return row[keys[0]]
      return row
    }
    return result.rows
  }

  // ============================================
  // ENCERRAR pool (para shutdown)
  // ============================================
  async end() {
    if (this.pool) {
      await this.pool.end()
      this.pool = null
    }
  }
}
