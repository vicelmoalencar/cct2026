// Supabase Client for Server-Side (Cloudflare Workers)
// Uses direct REST API calls instead of @supabase/supabase-js

export class SupabaseClient {
  private supabaseUrl: string
  private supabaseKey: string
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseUrl = supabaseUrl
    this.supabaseKey = supabaseKey
  }
  
  // Generic query method
  async query(
    table: string, 
    options: {
      select?: string
      filters?: Record<string, any>
      order?: string
      limit?: number
      single?: boolean
    } = {}
  ) {
    const { select = '*', filters = {}, order, limit, single = false } = options
    
    let url = `${this.supabaseUrl}/rest/v1/${table}?select=${select}`
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      url += `&${key}=eq.${value}`
    })
    
    // Add order
    if (order) {
      url += `&order=${order}`
    }
    
    // Add limit
    if (limit) {
      url += `&limit=${limit}`
    }
    
    const headers: Record<string, string> = {
      'apikey': this.supabaseKey,
      'Content-Type': 'application/json'
    }
    
    // Add single result header if needed
    if (single) {
      headers['Accept'] = 'application/vnd.pgrst.object+json'
    }
    
    const response = await fetch(url, { headers })
    
    if (!response.ok) {
      throw new Error(`Supabase query failed: ${response.statusText}`)
    }
    
    return await response.json()
  }
  
  // Insert data
  async insert(table: string, data: any, token?: string) {
    const url = `${this.supabaseUrl}/rest/v1/${table}`
    
    const headers: Record<string, string> = {
      'apikey': this.supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Supabase insert failed: ${error}`)
    }
    
    return await response.json()
  }
  
  // Update data
  async update(table: string, filters: Record<string, any>, data: any, token?: string) {
    let url = `${this.supabaseUrl}/rest/v1/${table}?`
    
    Object.entries(filters).forEach(([key, value]) => {
      url += `${key}=eq.${value}&`
    })
    
    const headers: Record<string, string> = {
      'apikey': this.supabaseKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Supabase update failed: ${error}`)
    }
    
    return await response.json()
  }
  
  // Delete data
  async delete(table: string, filters: Record<string, any>, token?: string) {
    let url = `${this.supabaseUrl}/rest/v1/${table}?`
    
    Object.entries(filters).forEach(([key, value]) => {
      url += `${key}=eq.${value}&`
    })
    
    const headers: Record<string, string> = {
      'apikey': this.supabaseKey,
      'Content-Type': 'application/json'
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Supabase delete failed: ${error}`)
    }
    
    return true
  }
  
  // Execute custom RPC
  async rpc(functionName: string, params: any = {}, token?: string) {
    const url = `${this.supabaseUrl}/rest/v1/rpc/${functionName}`
    
    const headers: Record<string, string> = {
      'apikey': this.supabaseKey,
      'Content-Type': 'application/json'
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(params)
    })
    
    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Supabase RPC failed: ${error}`)
    }
    
    return await response.json()
  }
}
