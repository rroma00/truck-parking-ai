const supabase = require('../supabaseClient')

async function logEvent({ lot_id, event_type, spot_id, message, phone_number }) {
  const { error } = await supabase.from('Events').insert([{
    lot_id, event_type, spot_id, message, phone_number
  }])
  if (error) console.error('Error logging event:', error)
}

module.exports = { logEvent }
