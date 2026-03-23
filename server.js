require('dotenv').config({ quiet: true })

const express = require('express')
const cors = require('cors')
const path = require('path')
const supabase = require('./supabaseClient')
const {
  FeatureNotConfiguredError,
  hasLegacyOperationalSchema,
  mapLocationToLot,
  buildAvailabilityFromLocation,
  listLocationsAsLots,
  getLocationLotById,
  getDefaultLotId
} = require('./services/schemaCompat')

// Import Services
const { getDashboardSummary, getAnalytics } = require('./services/dashboard')
const { createReservation, autoAssignReservation, cancelReservation } = require('./services/reservations')
const { updateSpotStatus, releaseSpot } = require('./services/spots')
const { logEvent } = require('./services/events')

const app = express()
const dashboardDistPath = path.join(__dirname, 'dashboard', 'dist')

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const PORT = process.env.PORT || 3000
const FRONTEND_URL = process.env.FRONTEND_URL
const isProduction = process.env.NODE_ENV === 'production'

if (isProduction && !FRONTEND_URL) {
  throw new Error('Missing required environment variable in production: FRONTEND_URL')
}

app.use(cors({
  origin: FRONTEND_URL || '*',
  optionsSuccessStatus: 200
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

function sendError(res, err) {
  const statusCode = err instanceof FeatureNotConfiguredError
    ? err.statusCode
    : err.message === 'Lot not found' || err.message === 'Reservation not found'
      ? 404
      : 500

  return res.status(statusCode).json({ success: false, error: err.message })
}

// ============================================================================
// 1. Health
// ============================================================================
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { message: 'API is running' } })
})

// ============================================================================
// 2. Lots
// ============================================================================
app.get('/lots', async (req, res) => {
  try {
    if (!(await hasLegacyOperationalSchema())) {
      const data = await listLocationsAsLots()
      return res.json({ success: true, data })
    }

    const { data, error } = await supabase.from('Lots').select('*')
    if (error) throw new Error(error.message)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

app.get('/lots/:lotId', async (req, res) => {
  try {
    if (!(await hasLegacyOperationalSchema())) {
      const location = await getLocationLotById(req.params.lotId)
      return res.json({ success: true, data: mapLocationToLot(location) })
    }

    const { data, error } = await supabase
      .from('Lots')
      .select('*')
      .eq('id', req.params.lotId)
      .single()
    if (error) throw new Error('Lot not found')
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

// ============================================================================
// 3. Dashboard summary
// ============================================================================
app.get('/dashboard/:lotId', async (req, res) => {
  try {
    const data = await getDashboardSummary(req.params.lotId)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

// ============================================================================
// 4. Availability / Spots
// ============================================================================
app.get('/availability/:lotId', async (req, res) => {
  try {
    if (!(await hasLegacyOperationalSchema())) {
      const location = await getLocationLotById(req.params.lotId)
      return res.json({
        success: true,
        data: {
          lot_id: req.params.lotId,
          ...buildAvailabilityFromLocation(location)
        }
      })
    }

    const { data: spots, error } = await supabase
      .from('Spots')
      .select('status')
      .eq('lot_id', req.params.lotId)
      
    if (error) throw new Error(error.message)
    
    const total = spots.length
    const available = spots.filter(s => s.status === 'available').length
    const occupied = spots.filter(s => s.status === 'occupied').length
    const reserved = spots.filter(s => s.status === 'reserved').length
    
    res.json({ 
      success: true, 
      data: { 
        lot_id: req.params.lotId, 
        total_spots: total, 
        available_spots: available, 
        occupied_spots: occupied, 
        reserved_spots: reserved 
      } 
    })
  } catch (err) {
    sendError(res, err)
  }
})

app.get('/spots/:lotId', async (req, res) => {
  try {
    if (!(await hasLegacyOperationalSchema())) {
      return res.json({ success: true, data: [] })
    }

    let query = supabase
      .from('Spots')
      .select('*')
      .eq('lot_id', req.params.lotId)
      .order('spot_number', { ascending: true })
      
    if (req.query.status) query = query.eq('status', req.query.status)
    if (req.query.vehicle_type) query = query.eq('vehicle_type', req.query.vehicle_type)
    
    const { data, error } = await query
    if (error) throw new Error(error.message)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

app.patch('/spots/:spotId/status', async (req, res) => {
  try {
    const data = await updateSpotStatus(req.params.spotId, req.body.status, req.body.notes)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

app.post('/spots/:spotId/release', async (req, res) => {
  try {
    const data = await releaseSpot(req.params.spotId, req.body.notes)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

// ============================================================================
// 5. Reservations
// ============================================================================
app.get('/reservations/:lotId', async (req, res) => {
  try {
    if (!(await hasLegacyOperationalSchema())) {
      return res.json({ success: true, data: [] })
    }

    let query = supabase
      .from('Reservations')
      .select('*')
      .eq('lot_id', req.params.lotId)
      .order('created_at', { ascending: false })
      
    if (req.query.status) query = query.eq('status', req.query.status)
    if (req.query.phone_number) query = query.eq('phone_number', req.query.phone_number)
    
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0
    query = query.range(offset, offset + limit - 1)
    
    const { data, error } = await query
    if (error) throw new Error(error.message)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

app.get('/reservations/detail/:reservationId', async (req, res) => {
  try {
    if (!(await hasLegacyOperationalSchema())) {
      return res.status(404).json({ success: false, error: 'Reservation not found' })
    }

    const { data, error } = await supabase
      .from('Reservations')
      .select('*')
      .eq('id', req.params.reservationId)
      .single()
      
    if (error) throw new Error('Reservation not found')
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

app.post('/reservations', async (req, res) => {
  try {
    const data = await createReservation(req.body)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

app.post('/reservations/auto-assign', async (req, res) => {
  try {
    const data = await autoAssignReservation(req.body)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

app.patch('/reservations/:reservationId', async (req, res) => {
  try {
    if (!(await hasLegacyOperationalSchema())) {
      throw new FeatureNotConfiguredError(
        'Reservations are not configured in this environment because the operational schema is not available.'
      )
    }

    const { data, error } = await supabase
      .from('Reservations')
      .update(req.body)
      .eq('id', req.params.reservationId)
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

app.post('/reservations/:reservationId/cancel', async (req, res) => {
  try {
    const data = await cancelReservation(req.params.reservationId, req.body.notes)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

// ============================================================================
// 6. Events / Call Logs
// ============================================================================
app.get('/events/:lotId', async (req, res) => {
  try {
    if (!(await hasLegacyOperationalSchema())) {
      return res.json({ success: true, data: [] })
    }

    let query = supabase
      .from('Events')
      .select('*')
      .eq('lot_id', req.params.lotId)
      .order('created_at', { ascending: false })
      
    if (req.query.event_type) query = query.eq('event_type', req.query.event_type)
    if (req.query.phone_number) query = query.eq('phone_number', req.query.phone_number)
    
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0
    query = query.range(offset, offset + limit - 1)
    
    const { data, error } = await query
    if (error) throw new Error(error.message)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

// ============================================================================
// Locations Setup
// ============================================================================
app.post('/api/locations', async (req, res) => {
  try {
    const locationData = req.body;

    // Server-side validation
    if (!locationData.location_name || !locationData.address) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing required fields: location_name and address" 
      });
    }

    const { data, error } = await supabase
      .from('parking_locations')
      .insert([locationData])
      .select();
      
    if (error) throw new Error(error.message);
    res.json({ success: true, data });
  } catch (err) {
    sendError(res, err)
  }
});

app.get('/call-logs/:lotId', async (req, res) => {
  try {
    if (!(await hasLegacyOperationalSchema())) {
      return res.json({ success: true, data: [] })
    }

    const types = [
      'call_inbound', 
      'call_handled_ai', 
      'call_missed', 
      'sms_inbound', 
      'sms_handled_ai'
    ]
    const { data, error } = await supabase
      .from('Events')
      .select('*')
      .eq('lot_id', req.params.lotId)
      .in('event_type', types)
      .order('created_at', { ascending: false })
      
    if (error) throw new Error(error.message)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

app.post('/events', async (req, res) => {
  try {
    const result = await logEvent(req.body)
    if (result?.disabled) {
      return res.status(503).json({
        success: false,
        error: 'Event logging is not configured in this environment because the operational schema is not available.'
      })
    }

    res.json({ success: true, data: { message: "Event logged successfully" } })
  } catch (err) {
    sendError(res, err)
  }
})

// ============================================================================
// 7. Analytics
// ============================================================================
app.get('/analytics/:lotId', async (req, res) => {
  try {
    const data = await getAnalytics(req.params.lotId, req.query.range)
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

// ============================================================================
// 8. Pricing
// ============================================================================
app.get('/pricing/:lotId', async (req, res) => {
  try {
    if (!(await hasLegacyOperationalSchema())) {
      const location = await getLocationLotById(req.params.lotId)
      return res.json({
        success: true,
        data: {
          id: location.id,
          overnight_price: location.daily_rate
        }
      })
    }

    const { data, error } = await supabase
      .from('Lots')
      .select('id, overnight_price')
      .eq('id', req.params.lotId)
      .single()
      
    if (error || !data) throw new Error('Lot pricing not found')
    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

app.patch('/pricing/:lotId', async (req, res) => {
  try {
    const lotId = await getDefaultLotId()
    if (!(await hasLegacyOperationalSchema())) {
      const { data, error } = await supabase
        .from('parking_locations')
        .update({ daily_rate: req.body.overnight_price })
        .eq('id', req.params.lotId)
        .select('id, daily_rate')
        .single()

      if (error) throw new Error(error.message)

      return res.json({
        success: true,
        data: {
          id: data.id,
          overnight_price: data.daily_rate
        }
      })
    }

    const { data, error } = await supabase
      .from('Lots')
      .update({ overnight_price: req.body.overnight_price })
      .eq('id', req.params.lotId)
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    
    await logEvent({ 
      lot_id: lotId, 
      event_type: 'pricing_updated', 
      message: `Overnight price updated to $${req.body.overnight_price}` 
    })

    res.json({ success: true, data })
  } catch (err) {
    sendError(res, err)
  }
})

// ============================================================================
// TWILIO INTEGRATIONS (Returns TwiML / XML)
// ============================================================================
app.post('/voice', async (req, res) => {
  const from = req.body.From || ''
  res.type('text/xml')

  try {
    const lotId = await getDefaultLotId()
    // Shared backend lookup logic
    const summaryData = await getDashboardSummary(lotId)
    await logEvent({ 
      lot_id: lotId, 
      event_type: 'call_inbound', 
      phone_number: from, 
      message: `Incoming voice call from ${from || 'unknown'}` 
    })
    
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">
    Thank you for calling ${summaryData.lot.name}.
    We currently have ${summaryData.availability.available_spots} available truck parking spots.
    The overnight price is ${summaryData.lot.overnight_price || 'not listed'} dollars.
  </Say>
  <Pause length="1"/>
  <Say voice="alice">
    If you would like to reserve one spot now, press 1.
    To hear the availability again, press 2.
    To end the call, press 3.
  </Say>
  <Gather numDigits="1" action="${BASE_URL}/voice-menu" method="POST" timeout="5"/>
  <Say voice="alice">We did not receive any input. Goodbye.</Say>
  <Hangup/>
</Response>`
    res.send(twiml)
  } catch (err) {
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Sorry, our system is currently experiencing issues. Please call back later.</Say>
  <Hangup/>
</Response>`
    res.send(twiml)
  }
})

app.post('/sms', async (req, res) => {
  const from = req.body.From || ''
  const body = (req.body.Body || '').trim().toLowerCase()
  res.type('text/xml')

  try {
    const lotId = await getDefaultLotId()
    const summaryData = await getDashboardSummary(lotId)
    await logEvent({ 
      lot_id: lotId, 
      event_type: 'sms_inbound', 
      phone_number: from, 
      message: `Incoming SMS: ${body}` 
    })

    let reply = `Welcome to ${summaryData.lot.name}. We have ${summaryData.availability.available_spots} spots available. Price: $${summaryData.lot.overnight_price || 'N/A'}. Reply BOOK to reserve now.`

    if (body === 'book') {
      if (!(await hasLegacyOperationalSchema())) {
        reply = 'Booking by SMS is not configured yet for this location. Please call dispatch for assistance.'
      } else {
        try {
          const resv = await autoAssignReservation({
            lot_id: lotId,
            phone_number: from,
            customer_name: "SMS Dispatch",
            vehicle_type: "truck",
            status: "confirmed",
            source: "sms",
            price: summaryData.lot.overnight_price || null,
            notes: "Auto-Assigned via SMS"
          })
          
          const { data: spot } = await supabase
            .from('Spots')
            .select('spot_number')
            .eq('id', resv.spot_id)
            .single()
            
          reply = `Success! Spot ${spot?.spot_number || resv.spot_id} has been reserved for you.`
        } catch (bookErr) {
          reply = 'Sorry, there are no spots available right now or an error occurred while booking.'
        }
      }
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${reply}</Message>
</Response>`
    res.send(twiml)
  } catch (err) {
    res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>System error. Try again.</Message></Response>`)
  }
})

app.use(express.static(dashboardDistPath))

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path === '/voice' || req.path === '/sms') {
    return next()
  }

  return res.sendFile(path.join(dashboardDistPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT)
})
