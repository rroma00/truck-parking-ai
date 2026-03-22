const supabase = require('../supabaseClient')
const { logEvent } = require('./events')
const { requireLegacyOperationalSchema } = require('./schemaCompat')

async function updateSpotStatus(spotId, status, notes) {
  await requireLegacyOperationalSchema('Spot management')

  const { data: spot, error: findError } = await supabase
    .from('Spots')
    .select('*')
    .eq('id', spotId)
    .single()
    
  if (findError || !spot) throw new Error('Spot not found')

  const { data, error } = await supabase
    .from('Spots')
    .update({ status, notes })
    .eq('id', spotId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logEvent({
    lot_id: spot.lot_id,
    event_type: 'spot_status_changed',
    spot_id: spotId,
    message: `Spot ${spot.spot_number} status manually changed to ${status}${notes ? ' - ' + notes : ''}`,
    phone_number: null
  })

  return data
}

async function releaseSpot(spotId, notes) {
  await requireLegacyOperationalSchema('Spot management')

  const { data: spot, error: findError } = await supabase
    .from('Spots')
    .select('*')
    .eq('id', spotId)
    .single()
    
  if (findError || !spot) throw new Error('Spot not found')

  // Release any active reservations attached strictly to this spot
  const { data: activeResvs } = await supabase
    .from('Reservations')
    .select('id')
    .eq('spot_id', spotId)
    .in('status', ['confirmed', 'checked_in'])

  if (activeResvs && activeResvs.length > 0) {
    for (const r of activeResvs) {
      await supabase
        .from('Reservations')
        .update({ status: 'completed' })
        .eq('id', r.id)
        
      await logEvent({ 
        lot_id: spot.lot_id, 
        event_type: 'reservation_released', 
        spot_id: spotId, 
        message: 'Reservation marked completed because spot was released' 
      })
    }
  }

  // Set spot back to available
  const { data, error } = await supabase
    .from('Spots')
    .update({ status: 'available', notes: null })
    .eq('id', spotId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  await logEvent({
    lot_id: spot.lot_id,
    event_type: 'spot_released',
    spot_id: spotId,
    message: `Spot ${spot.spot_number} released manually${notes ? ' - ' + notes : ''}`
  })

  return data
}

module.exports = { updateSpotStatus, releaseSpot }
