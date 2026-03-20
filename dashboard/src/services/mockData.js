// Mock data generation for ParkAI Dashboard

export const Lots = [
  {
    id: 'lot-1',
    name: 'Downtown Zone A',
    address: '1200 Commerce St, Dallas, TX',
    phone_number: '+1 (555) 019-3821',
    total_spaces: 20,
    overnight_price: 35.00,
    hours: '24/7',
    notes: 'Primary AI testing facility',
    created_at: '2023-01-15T08:00:00Z',
  }
];

// Generate 20 spots for Lot 1
export const Spots = Array.from({ length: 20 }, (_, i) => {
  const spotNumber = `A-${(i + 1).toString().padStart(2, '0')}`;
  // Mixed statuses: mostly available, some occupied, some reserved
  let status = 'available';
  if (i < 8) status = 'occupied';
  else if (i < 12) status = 'reserved';

  return {
    id: i + 1,
    created_at: '2023-01-15T08:00:00Z',
    lot_id: 'lot-1',
    spot_number: spotNumber,
    status: status,
    vehicle_type: i % 3 === 0 ? 'semi-trailer' : 'box-truck',
    notes: i === 3 ? 'Maintenance check required soon' : null,
  };
});

// Generate realistic events
const generateMockEvents = () => {
  const now = new Date();
  const events = [];
  
  // Today's calls
  for (let i = 0; i < 45; i++) {
    const time = new Date(now.getTime() - Math.random() * 86400000);
    events.push({
      id: `evt-call-${i}`,
      created_at: time.toISOString(),
      lot_id: 'lot-1',
      event_type: 'inbound_call',
      spot_id: null,
      message: 'AI successfully handled pricing inquiry',
      phone_number: `+1 (555) ${Math.floor(100+Math.random()*900)}-${Math.floor(1000+Math.random()*9000)}`
    });
  }

  // Today's bookings
  for (let i = 0; i < 12; i++) {
    const time = new Date(now.getTime() - Math.random() * 86400000);
    events.push({
      id: `evt-book-${i}`,
      created_at: time.toISOString(),
      lot_id: 'lot-1',
      event_type: 'reservation_created',
      spot_id: i + 8, // matching some reserved spots
      message: 'New booking confirmed via AI Voice Assistant',
      phone_number: `+1 (555) ${Math.floor(100+Math.random()*900)}-${Math.floor(1000+Math.random()*9000)}`
    });
  }

  // Specific recent activities for the feed
  events.push({
    id: 'evt-recent-1',
    created_at: new Date(now.getTime() - 2 * 60000).toISOString(), // 2 mins ago
    lot_id: 'lot-1',
    event_type: 'reservation_created',
    spot_id: 11,
    message: 'New booking confirmed for Slot A-12',
    phone_number: '+1 (555) 012-9932'
  });

  events.push({
    id: 'evt-recent-2',
    created_at: new Date(now.getTime() - 14 * 60000).toISOString(), // 14 mins ago
    lot_id: 'lot-1',
    event_type: 'missed_call_handled',
    spot_id: null,
    message: 'Missed call handled by AI. Customer inquiry about monthly pricing resolved.',
    phone_number: '+1 (555) 012-3456'
  });

  events.push({
    id: 'evt-recent-3',
    created_at: new Date(now.getTime() - 45 * 60000).toISOString(), // 45 mins ago
    lot_id: 'lot-1',
    event_type: 'system_alert',
    spot_id: null,
    message: 'Low availability warning: Current occupancy reached 94%',
    phone_number: null
  });

  events.push({
    id: 'evt-recent-4',
    created_at: new Date(now.getTime() - 120 * 60000).toISOString(), // 2 hours ago
    lot_id: 'lot-1',
    event_type: 'admin_action',
    spot_id: null,
    message: 'Admin Profile Updated. Alex Rivera changed notification preferences.',
    phone_number: null
  });

  return events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const Events = generateMockEvents();

// Data access services simulating DB calls
export const api = {
  getLots: async () => Lots,
  getSpots: async (lotId) => Spots.filter(s => s.lot_id === lotId),
  getEvents: async (lotId) => lotId ? Events.filter(e => e.lot_id === lotId) : Events,
  
  getDashboardStats: async (lotId) => {
    // Determine metrics primarily from Events and Spots
    const relevantEvents = await api.getEvents(lotId);
    const relevantSpots = await api.getSpots(lotId);
    const lot = Lots.find(l => l.id === lotId) || Lots[0];

    // Helper: is event today
    const now = new Date();
    const isToday = (dateString) => {
      const d = new Date(dateString);
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    };

    const callsToday = relevantEvents.filter(e => e.event_type === 'inbound_call' && isToday(e.created_at)).length;
    const missedPrevented = relevantEvents.filter(e => e.event_type === 'missed_call_handled').length; // Simplify for mock
    const bookedSpots = relevantSpots.filter(s => s.status === 'reserved').length;
    const revenueToday = (bookedSpots + relevantSpots.filter(s => s.status === 'occupied').length) * lot.overnight_price;
    const occupancyPercentage = Math.round(((bookedSpots + relevantSpots.filter(s => s.status === 'occupied').length) / lot.total_spaces) * 100);

    return {
      callsToday: { value: '1,284', trend: '+12%' },
      missedPrevented: { value: '432', trend: '-5%' },
      bookedSpots: { value: '156', trend: '+8%' },
      revenueToday: { value: `$12,450`, trend: '+15%' },
      occupancyPercentage: { value: `${82}%`, trend: '+2%' }
    };
  }
};
