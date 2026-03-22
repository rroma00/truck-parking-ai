const supabase = require('../supabaseClient')
const { logEvent } = require('./events')
const { requireLegacyOperationalSchema } = require('./schemaCompat')

async function createReservation(payload) {
  await requireLegacyOperationalSchema('Reservations')

  // 1. Validate spot exists and belongs to lot
  const { data: spot, error: spotError } = await supabase
    .from('Spots')
    .select('*')
    .eq('id', payload.spot_id)
    .single()
    
  if (spotError || !spot) throw new Error('Spot not found')
  if (spot.lot_id !== payload.lot_id) throw new Error('Spot does not belong to specified lot')
  
  // 2. Validate spot availability
  if (spot.status !== 'available') throw new Error('Spot is currently not available for booking')

  // 3. Create Reservation
  const { data: resv, error } = await supabase
    .from('Reservations')
    .insert([{
      lot_id: payload.lot_id,
      spot_id: payload.spot_id,
      phone_number: payload.phone_number,
      customer_name: payload.customer_name,
      vehicle_type: payload.vehicle_type,
      status: payload.status,
      source: payload.source,
      start_time: payload.start_time,
      end_time: payload.end_time,
      price: payload.price,
      notes: payload.notes
    }])
    .select()
    .single()

  if (error) throw new Error(error.message)

  // 4. Update spot status to reserved
  await supabase
    .from('Spots')
    .update({ status: 'reserved' })
    .eq('id', payload.spot_id)

  // 5. Log events
  await logEvent({ 
    lot_id: payload.lot_id, 
    event_type: 'reservation_created', 
    spot_id: payload.spot_id, 
    phone_number: payload.phone_number, 
    message: `Reservation created for Spot ${spot.spot_number}` 
  })
  
  if (payload.status === 'confirmed') {
    await logEvent({ 
      lot_id: payload.lot_id, 
      event_type: 'reservation_confirmed', 
      spot_id: payload.spot_id, 
      phone_number: payload.phone_number, 
      message: `Reservation automatically confirmed for Spot ${spot.spot_number}` 
    })
  }
  
  await logEvent({ 
    lot_id: payload.lot_id, 
    event_type: 'spot_reserved', 
    spot_id: payload.spot_id, 
    message: `Spot ${spot.spot_number} marked as reserved` 
  })

  return resv
}

async function autoAssignReservation(payload) {
  await requireLegacyOperationalSchema('Reservations')

  // Find next available spot by spot_number
  const { data: spot, error: spotError } = await supabase
    .from('Spots')
    .select('*')
    .eq('lot_id', payload.lot_id)
    .eq('status', 'available')
    .order('spot_number', { ascending: true })
    .limit(1)
    .single()

  if (spotError || !spot) throw new Error('No available spots to auto-assign')

  // Inject the chosen spot and reuse the create flow
  const resvPayload = { ...payload, spot_id: spot.id }
  return await createReservation(resvPayload)
}

async function cancelReservation(reservationId, notes) {
  await requireLegacyOperationalSchema('Reservations')

  const { data: resv, error } = await supabase
    .from('Reservations')
    .select('*')
    .eq('id', reservationId)
    .single()
    
  if (error || !resv) throw new Error('Reservation not found')

  // Update reservation status
  const { data: updatedResv, error: updError } = await supabase
    .from('Reservations')
    .update({ 
      status: 'cancelled', 
      notes: notes ? (resv.notes ? resv.notes + ' | ' + notes : notes) : resv.notes 
    })
    .eq('id', reservationId)
    .select()
    .single()
  
  if (updError) throw new Error(updError.message)

  // Free up spot ONLY if no other active reservations are tied to it
  const { data: otherResvs } = await supabase
    .from('Reservations')
    .select('id')
    .eq('spot_id', resv.spot_id)
    .neq('id', reservationId)
    .in('status', ['pending', 'confirmed', 'checked_in'])

  if (!otherResvs || otherResvs.length === 0) {
    await supabase
      .from('Spots')
      .update({ status: 'available' })
      .eq('id', resv.spot_id)
  }

  await logEvent({ 
    lot_id: resv.lot_id, 
    event_type: 'reservation_cancelled', 
    spot_id: resv.spot_id, 
    phone_number: resv.phone_number, 
    message: `Reservation cancelled${notes ? ': ' + notes : ''}` 
  })

  return updatedResv
}

module.exports = { createReservation, autoAssignReservation, cancelReservation }
