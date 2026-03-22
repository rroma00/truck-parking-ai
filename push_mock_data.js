const supabase = require('./supabaseClient');

async function main() {
  const defaultData = {
    location_name: "North Houston Logistics Center",
    address: "North Houston Logistics Center, TX",
    phone_number: "(555) 123-4567",
    after_hours_phone: "(555) 987-6543",
    booking_type: "Reservation Required",
    is_24_7: true,
    office_hours_start: "08:00", // '08:00 AM'
    office_hours_end: "18:00",   // '06:00 PM'
    after_hours_parking_allowed: true,
    after_hours_entry_allowed: true,
    after_hours_exit_allowed: true,
    automatic_gate: true,
    default_gate_code: "1234#",
    gate_instructions: "Pull up close to the sensor...",
    permitted_vehicle_types: ["Tractor-Trailer", "Trailer Only"],
    is_53ft_friendly: true,
    is_drop_trailer_allowed: false,
    max_vehicle_length: 75,
    max_stay_duration: "No Limit",
    surface_type: "Dirt",
    security_gated_fenced: true,
    security_cameras: true,
    security_well_lit: true,
    security_on_site: false,
    security_notes: "Mention roving patrols or keycard access details...",
    daily_rate: 25.00,
    weekly_rate: 140.00,
    monthly_rate: 500.00,
    total_spaces: 100,
    available_spaces: 45,
    is_real_time_tracking_enabled: false,
    arrival_directions: "Take Exit 45, turn right at the Texaco...",
    where_to_park: "Park in rows 5-10 against the back fence...",
    late_arrival_contact_info: "Call (555) 123-4567 for gate override or use the AI chat.",
    ai_handled_questions: ["After-hours parking?"]
  };

  try {
    const { data, error } = await supabase
      .from('parking_locations')
      .insert([defaultData])
      .select();

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Successfully inserted data into Supabase:", data);
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

main();
