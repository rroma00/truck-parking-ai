import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const summaryCards = [
  { label: 'Active Today', value: '12', detail: '4 new arrivals in the last hour' },
  { label: 'AI Conversations', value: '48', detail: '91% resolved without escalation' },
  { label: 'Expected Arrivals', value: '8', detail: '3 within the next 30 minutes' },
  { label: 'Repeat Drivers', value: '65%', detail: 'Strong retention at this location' }
];

const driverFilters = ['All', 'Expected', 'On Site', 'Needs Support'];

const drivers = [
  {
    id: 'mike-johnson',
    initials: 'MJ',
    name: 'Mike Johnson',
    company: 'Swift Logistics',
    rating: 4.9,
    phone: '+1 (555) 234-8890',
    vehicle: 'Sleeper',
    trailer: '53ft Trailer',
    assignedSpot: 'A14',
    reservation: 'Confirmed',
    status: 'On Site',
    statusTone: 'onsite',
    lastActivity: '2 mins ago',
    lastDetail: 'Asked for Gate Code',
    note: 'High-value electronics load. Prefers text updates.',
    eta: 'Arrived',
    aiPrompt: 'Can I arrive after 11 PM tonight?',
    aiResponse: 'Yes, Mike. Your reservation at A14 is valid for 24-hour access. The gate code activates 30 minutes before your ETA.',
    timeline: [
      { time: '10:15 AM', text: 'Asked about parking', active: true },
      { time: '10:16 AM', text: 'Confirmed spot dimensions fit', active: true },
      { time: '10:20 AM', text: 'Received entry instructions', active: true },
      { time: '10:45 AM (Est)', text: 'Successfully parked', active: false }
    ]
  },
  {
    id: 'sarah-rodriguez',
    initials: 'SR',
    name: 'Sarah Rodriguez',
    company: 'FedEx Custom',
    rating: 4.8,
    phone: '+1 (555) 812-4401',
    vehicle: 'Day Cab',
    trailer: 'Box Trailer',
    assignedSpot: 'B07',
    reservation: 'Paid',
    status: 'Expected',
    statusTone: 'expected',
    lastActivity: 'ETA 14:30',
    lastDetail: 'Pre-check complete',
    note: 'Returning driver. Needs a fast gate entry on arrival.',
    eta: '14:30',
    aiPrompt: 'Can you confirm there is room for a box trailer?',
    aiResponse: 'Yes, Sarah. Your assigned space at B07 supports your trailer profile and your arrival instructions have already been sent.',
    timeline: [
      { time: '09:55 AM', text: 'Requested available parking', active: true },
      { time: '09:58 AM', text: 'Vehicle profile verified', active: true },
      { time: '10:02 AM', text: 'Reservation paid and confirmed', active: true },
      { time: '02:30 PM (Est)', text: 'Arrival window opens', active: false }
    ]
  },
  {
    id: 'brian-kim',
    initials: 'BK',
    name: 'Brian Kim',
    company: 'Independent',
    rating: 4.6,
    phone: '+1 (555) 991-2847',
    vehicle: 'Heavy Haul',
    trailer: 'Flatbed',
    assignedSpot: 'Support Review',
    reservation: 'Pending',
    status: 'Needs Support',
    statusTone: 'support',
    lastActivity: '12 mins ago',
    lastDetail: 'Fitment Inquiry',
    note: 'Waiting on human confirmation for gate clearance width.',
    eta: 'Pending dispatch',
    aiPrompt: 'Will my flatbed clear the east gate tonight?',
    aiResponse: 'A dispatcher is reviewing your clearance request now. We will text you with the exact gate recommendation before arrival.',
    timeline: [
      { time: '10:40 AM', text: 'Asked about heavy-haul access', active: true },
      { time: '10:43 AM', text: 'Shared trailer dimensions', active: true },
      { time: '10:47 AM', text: 'Escalated to support queue', active: true },
      { time: 'Pending', text: 'Waiting on dispatcher recommendation', active: false }
    ]
  },
  {
    id: 'leon-thompson',
    initials: 'LT',
    name: 'Leon Thompson',
    company: 'Knight Trans',
    rating: 4.7,
    phone: '+1 (555) 642-1108',
    vehicle: 'Sleeper',
    trailer: 'Reefer 53ft',
    assignedSpot: 'A12',
    reservation: 'Confirmed',
    status: 'On Site',
    statusTone: 'onsite',
    lastActivity: '1 hour ago',
    lastDetail: 'Parked in Spot A12',
    note: 'Cold-chain load. Prefers the north side near power access.',
    eta: 'Arrived',
    aiPrompt: 'Is there a reefer-friendly row open tonight?',
    aiResponse: 'Yes. Spot A12 is ready and positioned near the north-side power corridor for quick placement.',
    timeline: [
      { time: '08:05 AM', text: 'Checked reefer spot availability', active: true },
      { time: '08:11 AM', text: 'Confirmed reservation and pricing', active: true },
      { time: '09:00 AM', text: 'Entered the yard', active: true },
      { time: '09:12 AM', text: 'Parked in Spot A12', active: true }
    ]
  }
];

function statusClasses(tone) {
  if (tone === 'onsite') return 'bg-secondary-fixed text-on-secondary-fixed';
  if (tone === 'support') return 'bg-error-container text-on-error-container';
  return 'bg-surface-container-high text-on-surface-variant';
}

function statusDotClasses(tone) {
  if (tone === 'onsite') return 'bg-secondary';
  if (tone === 'support') return 'bg-error';
  return 'bg-outline';
}

function initialsClasses(initials) {
  if (initials === 'MJ') return 'bg-secondary/10 text-secondary';
  if (initials === 'SR') return 'bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant';
  if (initials === 'BK') return 'bg-error-container/20 text-error';
  return 'bg-primary-fixed/30 text-primary';
}

function StatusBadge({ status, tone }) {
  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 w-fit ${statusClasses(tone)}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${statusDotClasses(tone)}`} />
      {status}
    </span>
  );
}

function DriverRow({ driver, active, onSelect }) {
  return (
    <tr
      className={`cursor-pointer transition-all ${active ? 'bg-secondary/5' : 'hover:bg-surface-container-low'}`}
      onClick={() => onSelect(driver)}
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${initialsClasses(driver.initials)}`}>
            {driver.initials}
          </div>
          <div>
            <p className="font-semibold text-primary">{driver.name}</p>
            <p className="text-xs text-on-surface-variant">{driver.company}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <p className="text-sm font-medium">{driver.vehicle}</p>
        <p className="text-xs text-on-surface-variant">{driver.trailer}</p>
      </td>
      <td className="px-6 py-5">
        <StatusBadge status={driver.status} tone={driver.statusTone} />
      </td>
      <td className="px-6 py-5">
        <p className="text-sm">{driver.lastActivity}</p>
        <p className={`text-xs ${driver.statusTone === 'support' ? 'text-error font-medium' : 'text-on-surface-variant'}`}>
          {driver.lastDetail}
        </p>
      </td>
      <td className="px-6 py-5 text-right">
        <span className={`text-sm font-bold ${driver.reservation === 'Pending' ? 'text-on-surface-variant italic' : 'text-on-surface'}`}>
          {driver.reservation}
        </span>
      </td>
    </tr>
  );
}

function DriverCard({ driver, active, onSelect }) {
  return (
    <button
      className={`w-full text-left p-4 rounded-2xl border transition-all shadow-sm ${
        active
          ? 'bg-secondary/5 border-secondary/20'
          : 'bg-surface-container-lowest border-outline-variant/15 hover:border-secondary/20 hover:bg-surface-container-low'
      }`}
      onClick={() => onSelect(driver)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${initialsClasses(driver.initials)}`}>
            {driver.initials}
          </div>
          <div>
            <p className="font-semibold text-primary">{driver.name}</p>
            <p className="text-xs text-on-surface-variant">{driver.company}</p>
          </div>
        </div>
        <StatusBadge status={driver.status} tone={driver.statusTone} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-on-surface-variant text-xs uppercase font-bold mb-1">Vehicle</p>
          <p className="font-medium text-on-surface">{driver.vehicle}</p>
        </div>
        <div>
          <p className="text-on-surface-variant text-xs uppercase font-bold mb-1">Reservation</p>
          <p className="font-medium text-on-surface">{driver.reservation}</p>
        </div>
        <div className="col-span-2">
          <p className="text-on-surface-variant text-xs uppercase font-bold mb-1">Latest</p>
          <p className="text-on-surface">{driver.lastActivity} • {driver.lastDetail}</p>
        </div>
      </div>
    </button>
  );
}

function DriverDetailPanel({ driver }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold font-manrope">
            {driver.initials}
          </div>
          <div>
            <h3 className="text-xl font-bold text-primary">{driver.name}</h3>
            <p className="text-sm text-on-surface-variant">
              {driver.company} • {driver.rating}{' '}
              <span className="material-symbols-outlined text-xs text-tertiary-fixed-dim align-text-top" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl bg-surface-container-low p-4">
            <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">Current Status</p>
            <StatusBadge status={driver.status} tone={driver.statusTone} />
          </div>
          <div className="rounded-2xl bg-surface-container-low p-4">
            <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">ETA / Arrival</p>
            <p className="text-sm font-semibold text-primary">{driver.eta}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary">phone</span>
            <span className="text-on-surface font-medium">{driver.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary">local_shipping</span>
            <span className="text-on-surface font-medium">{driver.vehicle} / {driver.trailer}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary">pin_drop</span>
            <span className="text-on-surface font-medium">Assigned Spot: <span className="font-bold text-secondary">{driver.assignedSpot}</span></span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="material-symbols-outlined text-secondary pt-0.5">sticky_note_2</span>
            <span className="text-on-surface font-medium">{driver.note}</span>
          </div>
        </div>

        <div className="relative border-l-2 border-outline-variant/30 ml-2 pl-6 space-y-6 mb-8">
          {driver.timeline.map((item) => (
            <div key={`${driver.id}-${item.time}`} className="relative">
              <div className={`absolute -left-[1.85rem] top-1 w-4 h-4 rounded-full border-4 border-surface-container-lowest ${item.active ? 'bg-secondary' : 'bg-surface-container-highest'}`} />
              <p className={`text-xs font-bold uppercase ${item.active ? 'text-on-surface-variant' : 'text-outline'}`}>{item.time}</p>
              <p className={`text-sm font-semibold ${item.active ? 'text-primary' : 'text-on-surface-variant italic'}`}>{item.text}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary rounded-2xl p-4 shadow-inner">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-secondary-fixed text-sm">psychology</span>
            <p className="text-xs font-bold text-white/70 uppercase tracking-widest">AI Interaction</p>
          </div>
          <div className="space-y-3">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-white/50 mb-1">Driver</p>
              <p className="text-sm text-white">{driver.aiPrompt}</p>
            </div>
            <div className="bg-secondary/20 rounded-lg p-3">
              <p className="text-xs text-secondary-fixed mb-1">AI Response</p>
              <p className="text-sm text-white">{driver.aiResponse}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3">
          <button className="w-full py-3 bg-secondary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Mark as Arrived
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-surface-container-low text-primary font-bold rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-surface-container-high transition-all">
              <span className="material-symbols-outlined text-base">send</span>
              Resend
            </button>
            <button className="py-3 bg-surface-container-low text-primary font-bold rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-surface-container-high transition-all">
              <span className="material-symbols-outlined text-base">edit_note</span>
              Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedDriverId, setSelectedDriverId] = useState(drivers[0].id);

  const filteredDrivers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return drivers.filter((driver) => {
      const matchesFilter = activeFilter === 'All' || driver.status === activeFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          driver.name,
          driver.company,
          driver.vehicle,
          driver.trailer,
          driver.assignedSpot
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, searchQuery]);

  const selectedDriver = useMemo(() => {
    const visibleDriver = filteredDrivers.find((driver) => driver.id === selectedDriverId);
    return visibleDriver || filteredDrivers[0] || drivers[0];
  }, [filteredDrivers, selectedDriverId]);

  const supportCount = drivers.filter((driver) => driver.statusTone === 'support').length;

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <header className="bg-[#F7F9FF] backdrop-blur-xl sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 md:px-12 h-20 max-w-[1920px] mx-auto relative">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-extrabold tracking-tight text-primary font-manrope">ParkLog AI</span>
            <nav className="hidden md:flex items-center gap-8">
              <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/dashboard">Locations</Link>
              <Link className="text-secondary border-b-2 border-secondary pb-1 font-bold" to="/customer-management">Drivers</Link>
              <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/analytics">Analytics</Link>
              <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/settings">Settings</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:bg-[#F1F4FB] rounded-md transition-all" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-[#F1F4FB] rounded-md transition-all" aria-label="Help">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden ml-2">
              <img
                alt="User profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZa2E-WnDbOiXrPBQIKxAEmSnYnGbDE352CNAzt7TOkNzjg-7D551POEDUKfWc-8GpwZ-4uCB0sF2omP-CdiqCdoM3Ll1mIMhPIRIThHY8jBYa4vz3h8Ydul4WlKW1nbhob7oGDe-U93PgvWA_TqymkNOkwoGOBiLa6IGX8L6i79H5lwVgN__DSd6uAcfwtD_OsAIym2BOuN68m2vz5cd3nOLmDb4opQxYfnwuR4UD8gI8Ze0WhC_-udGBEBEP7uTNxfyquMWEAt0"
              />
            </div>
          </div>
          <div className="bg-[#F1F4FB] h-px w-full absolute bottom-0 left-0" />
        </div>
      </header>

      <main className="max-w-[1920px] mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold tracking-wider uppercase mb-4">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              Customer Management
            </div>
            <h1 className="text-4xl font-extrabold text-primary mb-2">Drivers</h1>
            <p className="text-on-surface-variant max-w-2xl">
              Track driver activity, inquiries, arrivals, and support interactions for this location.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="px-5 py-2.5 bg-surface-container-lowest text-primary font-semibold rounded-xl hover:bg-surface-container-low transition-all border border-outline-variant/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">ios_share</span>
              Export
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add_notes</span>
              Add Driver Note
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {summaryCards.map((card) => (
            <div key={card.label} className="p-6 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">{card.label}</p>
              <p className="text-3xl font-extrabold text-primary mb-2">{card.value}</p>
              <p className="text-sm text-on-surface-variant">{card.detail}</p>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-[28px] p-4 md:p-6 mb-8 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center gap-4">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                className="w-full pl-12 pr-4 py-3 bg-surface-container-highest/40 border-none rounded-xl focus:ring-2 focus:ring-secondary transition-all text-on-surface"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, company, vehicle, or assigned spot..."
                type="text"
                value={searchQuery}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0 w-full xl:w-auto">
              {driverFilters.map((filter) => (
                <button
                  key={filter}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                    activeFilter === filter
                      ? 'bg-secondary text-white'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="hidden md:block bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low">
                      <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Driver and Company</th>
                      <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Vehicle Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Last Activity</th>
                      <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Reservation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {filteredDrivers.map((driver) => (
                      <DriverRow
                        key={driver.id}
                        active={selectedDriver.id === driver.id}
                        driver={driver}
                        onSelect={(nextDriver) => setSelectedDriverId(nextDriver.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredDrivers.map((driver) => (
                <DriverCard
                  key={driver.id}
                  active={selectedDriver.id === driver.id}
                  driver={driver}
                  onSelect={(nextDriver) => setSelectedDriverId(nextDriver.id)}
                />
              ))}
            </div>

            {filteredDrivers.length === 0 && (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-10 text-center shadow-sm">
                <span className="material-symbols-outlined text-4xl text-outline mb-3">search_off</span>
                <h2 className="text-xl font-bold text-primary mb-2">No drivers match the current view</h2>
                <p className="text-on-surface-variant max-w-md mx-auto">
                  Adjust the search term or switch filters to bring a different set of drivers back into view.
                </p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <DriverDetailPanel driver={selectedDriver} />

            <div className="bg-gradient-to-br from-primary-container to-primary rounded-xl p-6 text-white border border-white/5">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-bold text-lg">Support Queue</h4>
                <span className="px-2 py-0.5 bg-error text-[10px] font-bold rounded-full animate-pulse">{supportCount} NEW</span>
              </div>
              <p className="text-sm text-white/70 mb-4">
                {supportCount > 0
                  ? 'Brian Kim is waiting for a response regarding flatbed gate clearance.'
                  : 'No active support escalations at the moment.'}
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 transition-all rounded-lg text-sm font-bold border border-white/10">
                Take Over Conversation
              </button>
            </div>
          </aside>
        </div>
      </main>

      <section className="max-w-[1920px] mx-auto px-6 md:px-12 pb-12">
        <div className="bg-surface-container rounded-3xl min-h-[400px] overflow-hidden relative shadow-inner border border-outline-variant/20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBuVtaMwJcwscTBmWAmFkoTU1hPzaGIrYnfXwPtcnwO1PZKQFdkDdRbkFrP-LLdZsLhbQ8kOOBPrCZK-EET_DJgFCVNB94CPVYlOERzKsTEtuwLjOVFQFb95OjKb3H9ChkuP-er9MA4AAOuxyy7WPaHeZS36WkpaGKqqzJ0ZkiOj6kJ3jewQfynCSKxbZRCFAgjL4nz7Ibt4ajzbeIA3wHbCqKC2y6FuftS7xcqmZPGlLof_8kOGnG6-hIgEFfqgve1IdUNMwQQtxA')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/85 via-surface/35 to-transparent" />
          <div className="absolute top-6 right-6 left-6 md:left-auto p-4 bg-white/90 backdrop-blur rounded-2xl shadow-xl max-w-xs border border-outline-variant/20">
            <h5 className="font-bold text-primary mb-1">Live Lot Occupancy</h5>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-3xl font-extrabold text-primary leading-none">84%</span>
              <span className="text-xs font-bold text-secondary mb-1">up 4% from yesterday</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[84%]" />
            </div>
          </div>
          <div className="absolute top-[40%] left-[30%] w-6 h-6 bg-secondary border-4 border-white rounded-full shadow-lg" />
          <div className="absolute top-[60%] left-[45%] w-6 h-6 bg-primary border-4 border-white rounded-full shadow-lg" />
          <div className="absolute top-[35%] left-[55%] w-6 h-6 bg-secondary border-4 border-white rounded-full shadow-lg" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-outline-variant/10">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              On Site
            </div>
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-outline-variant/10">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Reserved
            </div>
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-outline-variant/10">
              <span className="w-2 h-2 rounded-full bg-error" />
              Needs Support
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
