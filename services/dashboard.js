const supabase = require('../supabaseClient')
const {
  hasLegacyOperationalSchema,
  mapLocationToLot,
  buildAvailabilityFromLocation,
  getLocationLotById
} = require('./schemaCompat')

async function getDashboardSummary(lotId) {
  if (!(await hasLegacyOperationalSchema())) {
    const location = await getLocationLotById(lotId)
    const availability = buildAvailabilityFromLocation(location)

    return {
      lot: mapLocationToLot(location),
      kpis: {
        total_calls_today: 0,
        missed_prevented: 0,
        booked_spots: 0,
        revenue_today: 0,
        occupancy_percent: availability.total_spots > 0
          ? Math.round((availability.occupied_spots / availability.total_spots) * 100)
          : 0
      },
      availability,
      recent_activity: []
    }
  }

  // 1. Fetch Lot
  const { data: lot, error: lotError } = await supabase
    .from('Lots')
    .select('*')
    .eq('id', lotId)
    .single()
    
  if (lotError || !lot) throw new Error('Lot not found')

  // 2. Fetch Spot Availability
  const { data: spots } = await supabase
    .from('Spots')
    .select('status')
    .eq('lot_id', lotId)
    
  const total_spots = spots ? spots.length : 0
  const available_spots = spots ? spots.filter(s => s.status === 'available').length : 0
  const occupied_spots = spots ? spots.filter(s => s.status === 'occupied').length : 0
  const reserved_spots = spots ? spots.filter(s => s.status === 'reserved').length : 0
  const occupancy_percent = total_spots > 0 
    ? Math.round(((occupied_spots + reserved_spots) / total_spots) * 100) 
    : 0

  // 3. KPI Calculations (Today's Events)
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayStr = todayStart.toISOString()
  
  const { data: events } = await supabase
    .from('Events')
    .select('*')
    .eq('lot_id', lotId)
    .gte('created_at', todayStr)
    
  const total_calls_today = events 
    ? events.filter(e => ['call_inbound', 'call_missed', 'call_handled_ai'].includes(e.event_type)).length 
    : 0
    
  const missed_prevented = events 
    ? events.filter(e => e.event_type === 'call_handled_ai').length 
    : 0

  // 4. Revenue & Booking Today
  const { data: resvs } = await supabase
    .from('Reservations')
    .select('price, status')
    .eq('lot_id', lotId)
    .gte('created_at', todayStr)
    
  const activeResvs = resvs ? resvs.filter(r => ['confirmed', 'checked_in', 'completed'].includes(r.status)) : []
  // requirement stated "booked_spots = count of active reservations today or current reserved spots"
  const booked_spots_today = Math.max(activeResvs.length, reserved_spots)
  
  const revenue_today = activeResvs.reduce((sum, r) => sum + (Number(r.price) || 0), 0)

  // 5. Recent Activity Log
  const { data: recent_activity } = await supabase
    .from('Events')
    .select('*')
    .eq('lot_id', lotId)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    lot,
    kpis: {
      total_calls_today,
      missed_prevented,
      booked_spots: booked_spots_today,
      revenue_today,
      occupancy_percent
    },
    availability: { 
      total_spots, 
      available_spots, 
      occupied_spots, 
      reserved_spots 
    },
    recent_activity: recent_activity || []
  }
}

async function getAnalytics(lotId, range) {
  // Note: True analytics querying across timeseries ranges would usually use RPC functions or extensive grouping
  // For the immediate refactor stage, returning static shape mock for graph wiring is standard practice
  // pending full Timescale/Window function buildout in Supabase.
  return {
    calls_per_day: [12, 18, 22, 19, 25, 29, 31],
    bookings_per_day: [3, 5, 2, 7, 8, 5, 12],
    occupancy_per_day: [60, 65, 58, 70, 75, 82, 85],
    revenue_per_day: [225, 375, 150, 525, 600, 375, 900]
  }
}

module.exports = { getDashboardSummary, getAnalytics }
