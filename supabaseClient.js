require('dotenv').config({ quiet: true })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY

if (!supabaseUrl) {
  throw new Error('Missing required environment variable: SUPABASE_URL')
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing required environment variable: SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

module.exports = supabase
