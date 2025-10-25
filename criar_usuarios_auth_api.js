/**
 * ============================================================================
 * Script Node.js: Criar Usuários no Supabase Auth via API Admin
 * ============================================================================
 * Este script cria contas de autenticação para todos os usuários da tabela
 * certificates usando a API Admin do Supabase (mais segura que SQL direto)
 * ============================================================================
 */

const { createClient } = require('@supabase/supabase-js')

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY'

// IMPORTANTE: Use a SERVICE ROLE KEY, não a ANON KEY
// A Service Role Key tem permissões para criar usuários via API Admin

const DEFAULT_PASSWORD = '123456' // Senha temporária padrão

// ============================================================================
// INICIALIZAR SUPABASE CLIENT
// ============================================================================
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================
async function criarUsuariosDosCertificados() {
  console.log('🚀 Iniciando criação de usuários...')
  console.log('📧 Senha padrão:', DEFAULT_PASSWORD)
  console.log('')

  try {
    // 1. Buscar emails únicos da tabela certificates
    console.log('📊 Buscando emails únicos da tabela certificates...')
    const { data: certificates, error: certError } = await supabase
      .from('certificates')
      .select('user_email, user_name')
      .not('user_email', 'is', null)
      .neq('user_email', '')
      .like('user_email', '%@%')

    if (certError) {
      throw new Error(`Erro ao buscar certificados: ${certError.message}`)
    }

    // Obter emails únicos
    const uniqueUsers = {}
    certificates.forEach(cert => {
      if (!uniqueUsers[cert.user_email]) {
        uniqueUsers[cert.user_email] = cert.user_name || 'Aluno'
      }
    })

    const emails = Object.keys(uniqueUsers)
    console.log(`✅ Encontrados ${emails.length} emails únicos`)
    console.log('')

    // 2. Buscar usuários que já existem no Auth
    console.log('🔍 Verificando usuários existentes...')
    const { data: existingUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.warn('⚠️  Não foi possível listar usuários existentes:', authError.message)
      console.log('   Continuando mesmo assim...')
    }

    const existingEmails = new Set(
      existingUsers?.users?.map(u => u.email) || []
    )

    console.log(`✅ ${existingEmails.size} usuários já existem no Auth`)
    console.log('')

    // 3. Filtrar emails que ainda não têm conta
    const emailsToCreate = emails.filter(email => !existingEmails.has(email))
    
    console.log(`📝 ${emailsToCreate.length} usuários precisam ser criados`)
    console.log('')

    if (emailsToCreate.length === 0) {
      console.log('✅ Todos os usuários já possuem conta!')
      return
    }

    // 4. Criar usuários um por um
    let created = 0
    let errors = 0
    let skipped = 0

    console.log('⏳ Criando usuários...')
    console.log('')

    for (let i = 0; i < emailsToCreate.length; i++) {
      const email = emailsToCreate[i]
      const name = uniqueUsers[email]

      try {
        // Criar usuário via API Admin
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: email,
          password: DEFAULT_PASSWORD,
          email_confirm: true, // Email já confirmado
          user_metadata: {
            full_name: name,
            name: name
          }
        })

        if (createError) {
          // Usuário já existe (erro comum)
          if (createError.message.includes('already registered') || 
              createError.message.includes('already exists')) {
            skipped++
            if (skipped <= 5) {
              console.log(`⏭️  Pulado (já existe): ${email}`)
            }
          } else {
            errors++
            console.error(`❌ Erro ao criar ${email}:`, createError.message)
          }
        } else {
          created++
          if (created % 10 === 0) {
            console.log(`✅ Progresso: ${created}/${emailsToCreate.length} criados`)
          } else if (created <= 5) {
            console.log(`✅ Criado: ${email}`)
          }
        }

        // Delay pequeno para não sobrecarregar API
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }

      } catch (error) {
        errors++
        console.error(`❌ Erro ao criar ${email}:`, error.message)
      }
    }

    // 5. Relatório final
    console.log('')
    console.log('═══════════════════════════════════════')
    console.log('✅ Processo concluído!')
    console.log('📊 Resumo:')
    console.log(`   ✅ Criados: ${created}`)
    console.log(`   ⏭️  Pulados: ${skipped}`)
    console.log(`   ❌ Erros: ${errors}`)
    console.log(`   🔐 Senha padrão: ${DEFAULT_PASSWORD}`)
    console.log('⚠️  IMPORTANTE: Usuários devem alterar senha!')
    console.log('═══════════════════════════════════════')

    // 6. Listar primeiros 10 usuários criados (para teste)
    console.log('')
    console.log('📋 Primeiros usuários criados:')
    const sampleEmails = emailsToCreate.slice(0, 10)
    sampleEmails.forEach((email, i) => {
      console.log(`   ${i + 1}. ${email} - Senha: ${DEFAULT_PASSWORD}`)
    })

  } catch (error) {
    console.error('❌ Erro fatal:', error.message)
    process.exit(1)
  }
}

// ============================================================================
// EXECUTAR
// ============================================================================
if (require.main === module) {
  // Verificar variáveis de ambiente
  if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_SERVICE_ROLE_KEY === 'YOUR_SERVICE_ROLE_KEY') {
    console.error('❌ Erro: Configure as variáveis de ambiente:')
    console.error('   export SUPABASE_URL="sua-url"')
    console.error('   export SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"')
    console.error('')
    console.error('⚠️  IMPORTANTE: Use a SERVICE ROLE KEY, não a ANON KEY!')
    process.exit(1)
  }

  criarUsuariosDosCertificados()
    .then(() => {
      console.log('')
      console.log('✅ Script finalizado com sucesso!')
      process.exit(0)
    })
    .catch(error => {
      console.error('❌ Erro ao executar script:', error)
      process.exit(1)
    })
}

module.exports = { criarUsuariosDosCertificados }

/**
 * ============================================================================
 * COMO USAR:
 * ============================================================================
 * 
 * 1. Instalar dependências:
 *    npm install @supabase/supabase-js
 * 
 * 2. Configurar variáveis de ambiente:
 *    export SUPABASE_URL="https://xxx.supabase.co"
 *    export SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key"
 * 
 * 3. Executar:
 *    node criar_usuarios_auth_api.js
 * 
 * ============================================================================
 * ONDE ENCONTRAR SERVICE ROLE KEY:
 * ============================================================================
 * 
 * 1. Acesse seu projeto no Supabase Dashboard
 * 2. Vá em Settings > API
 * 3. Role até "Project API keys"
 * 4. Copie a "service_role" key (NÃO a anon/public key)
 * 
 * ⚠️  ATENÇÃO: A Service Role Key tem TODOS os privilégios!
 * Nunca commit esta key no git ou exponha no frontend!
 * 
 * ============================================================================
 */
