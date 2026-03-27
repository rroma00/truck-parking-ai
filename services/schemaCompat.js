const supabase = require('../supabaseClient')

const LEGACY_TABLES = ['Lots', 'Spots', 'Reservations', 'Events']
const CACHE_TTL_MS = 60_000

let legacySchemaCache = {
  checkedAt: 0,
  available: null
}

class FeatureNotConfiguredError extends Error {
  constructor(message, statusCode = 503) {
    super(message)
    this.name = 'FeatureNotConfiguredError'
    this.statusCode = statusCode
  }
}

async function hasLegacyOperationalSchema() {
  const now = Date.now()
  if (legacySchemaCache.available !== null && now - legacySchemaCache.checkedAt < CACHE_TTL_MS) {
    return legacySchemaCache.available
  }

  try {
    for (const table of LEGACY_TABLES) {
      const { error } = await supabase.from(table).select('*').limit(1)
      if (error) {
        legacySchemaCache = { checkedAt: now, available: false }
        return false
      }
    }

    legacySchemaCache = { checkedAt: now, available: true }
    return true
  } catch (_) {
    legacySchemaCache = { checkedAt: now, available: false }
    return false
  }
}

function mapLocationToLot(location) {
  if (!location) return null

  return {
    id: location.id,
    name: location.location_name,
    location_name: location.location_name,
    address: location.address,
    overnight_price: location.daily_rate,
    daily_rate: location.daily_rate,
    weekly_rate: location.weekly_rate,
    monthly_rate: location.monthly_rate,
    is_24_7: location.is_24_7,
    office_hours_start: location.office_hours_start,
    office_hours_end: location.office_hours_end,
    phone_number: location.phone_number,
    available_spaces: location.available_spaces,
    total_spaces: location.total_spaces,
    created_at: location.created_at,
    updated_at: location.updated_at
  }
}

function buildAvailabilityFromLocation(location) {
  const total = Number(location?.total_spaces) || 0
  const available = Number(location?.available_spaces) || 0
  const occupied = Math.max(total - available, 0)

  return {
    total_spots: total,
    available_spots: available,
    occupied_spots: occupied,
    reserved_spots: 0
  }
}

async function listLocationsAsLots() {
  const { data, error } = await supabase
    .from('parking_locations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (data || []).map(mapLocationToLot)
}

async function getLocationLotById(lotId) {
  const { data, error } = await supabase
    .from('parking_locations')
    .select('*')
    .eq('id', lotId)
    .single()

  if (error || !data) throw new Error('Lot not found')

  return data
}

async function getDefaultLotId() {
  if (process.env.DEFAULT_LOT_ID) {
    return process.env.DEFAULT_LOT_ID
  }

  const { data, error } = await supabase
    .from('parking_locations')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .single()

  if (error || !data?.id) {
    throw new Error('No parking location is configured')
  }

  return data.id
}

function createFeatureDisabledResponse(message) {
  return {
    disabled: true,
    message
  }
}

async function requireLegacyOperationalSchema(featureName) {
  if (await hasLegacyOperationalSchema()) {
    return true
  }

  throw new FeatureNotConfiguredError(
    `${featureName} is not configured in this environment because the operational schema is not available.`
  )
}

module.exports = {
  FeatureNotConfiguredError,
  hasLegacyOperationalSchema,
  mapLocationToLot,
  buildAvailabilityFromLocation,
  listLocationsAsLots,
  getLocationLotById,
  getDefaultLotId,
  createFeatureDisabledResponse,
  requireLegacyOperationalSchema
}
