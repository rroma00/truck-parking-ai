const supabase = require('../supabaseClient')
const { hasLegacyOperationalSchema } = require('./schemaCompat')

async function logEvent({ lot_id, event_type, spot_id, message, phone_number }) {
  if (!(await hasLegacyOperationalSchema())) {
    return { logged: false, disabled: true }
  }

  const { error } = await supabase.from('Events').insert([{
    lot_id, event_type, spot_id, message, phone_number
  }])

  if (error) {
    throw new Error(error.message)
  }

  return { logged: true, disabled: false }
}

module.exports = { logEvent }
