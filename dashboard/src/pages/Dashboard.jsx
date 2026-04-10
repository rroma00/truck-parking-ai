import { useEffect, useState, useRef } from 'react';
import ManualCheckInModal from '../components/modals/ManualCheckInModal';
import MarkSpaceUnavailableModal from '../components/modals/MarkSpaceUnavailableModal';
import { BookingModal, createInitialBookingForm } from './CustomerManagement';

// Toast Notification component
function Toast({ show, message, subMessage, linkText, onClose }) {
  if (!show) return null;
  return (
    <div className="fixed top-4 right-4 z-[200] w-full max-w-[400px] animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="bg-white rounded-xl shadow-lg border-l-4 border-[#22C55E] p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-[#22C55E] mt-0.5">check_circle</span>
        <div className="flex-1">
          <p className="font-bold text-[#050f36] text-sm leading-tight mb-1">{message}</p>
          <p className="text-[#45464e] text-sm leading-tight">{subMessage}</p>
          {linkText && (
            <button className="text-[#0058be] text-sm font-medium mt-2 hover:underline">
              {linkText}
            </button>
          )}
        </div>
        <button onClick={onClose} className="text-[#9ca3af] hover:text-[#45464e] transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
    </div>
  );
}

// Reservation source badge component
function SourceBadge({ source }) {
  const styles = {
    ai: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'AI', icon: 'smart_toy' },
    manual: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Manual', icon: 'edit_note' },
    web: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Web', icon: 'language' },
  };
  const s = styles[source] || styles.manual;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${s.bg} ${s.text} ml-2`}>
      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{s.icon}</span>
      {s.label}
    </span>
  );
}

export default function Dashboard() {
  const [occupancyCount, setOccupancyCount] = useState(42);
  const [arrivingCount, setArrivingCount] = useState(8);
  const [arrivingList, setArrivingList] = useState([
    { id: '1', time: '11:15 AM', name: 'Global Logistics S.A.', company: 'Global Logistics S.A.', source: 'ai', vehicleIcon: 'local_shipping', vehicle: 'Freightliner Cascadia #902', space: 'A-12', status: 'ON TIME', bgClass: 'bg-green-100 text-green-700', dotClass: 'bg-green-600', expectedWait: false },
    { id: '2', time: '11:45 AM', name: 'Inter-State Carriers', company: 'Inter-State Carriers', source: 'manual', vehicleIcon: 'local_shipping', vehicle: 'Kenworth T680 #44', space: 'B-05', status: 'EARLY', bgClass: 'bg-blue-100 text-blue-700', dotClass: 'bg-blue-600', expectedWait: false },
    { id: '3', time: '12:30 PM', name: 'Road-Ready Transit', company: 'Road-Ready Transit', source: 'web', vehicleIcon: 'local_shipping', vehicle: 'Volvo VNL 860 #211', space: 'C-09', status: 'LATE (15m)', bgClass: 'bg-red-100 text-red-700', dotClass: 'bg-red-600', expectedWait: true }
  ]);

  const [activeModal, setActiveModal] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', subMessage: '', linkText: '' });

  const [bookingForm, setBookingForm] = useState(createInitialBookingForm() || {});
  const phoneInputRef = useRef(null);

  useEffect(() => {
    // keep component refreshing every minute for live data
    const timer = setInterval(() => {}, 60000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message, subMessage, linkText) => {
    setToast({ show: true, message, subMessage, linkText });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleCheckIn = (customer) => {
    setOccupancyCount(prev => prev + 1);
    setArrivingCount(prev => prev - 1);
    setArrivingList(prev => prev.filter(c => c.id !== customer.id));
    setActiveModal(null);
    showToast('Check-in Complete', `${customer.name} checked in to Space ${customer.space}`, 'View in Customers →');
  };

  const handleMarkUnavailable = ({ space, reason }) => {
    setActiveModal(null);
    showToast('Space Marked Unavailable', `Space ${space} - Reason: ${reason}`, 'View Spaces →');
  };

  const handleBookingSave = () => {
    // Only simple mock save for the dashboard overlay
    if (!bookingForm.fullName) return;
    
    setArrivingCount(prev => prev + 1);
    const newArrival = {
      id: Date.now().toString(),
      time: bookingForm.arrivalTime || 'TBD',
      name: bookingForm.fullName,
      company: bookingForm.companyName || bookingForm.fullName,
      source: 'manual',
      vehicleIcon: 'local_shipping',
      vehicle: bookingForm.vehicleType || 'Unknown',
      space: bookingForm.assignedSpot || 'Unassigned',
      status: 'EXPECTED',
      bgClass: 'bg-slate-100 text-slate-700',
      dotClass: 'bg-slate-500',
      expectedWait: false
    };
    
    setArrivingList(prev => {
      const newList = [...prev, newArrival];
      return newList;
    });
    
    setActiveModal(null);
    setBookingForm(createInitialBookingForm?.() || {});
    showToast('Reservation Created', `${bookingForm.fullName} - Space ${bookingForm.assignedSpot || 'Unassigned'}`, 'View Details →');
  };

  return (
    <div className="w-full">
      <Toast show={toast.show} message={toast.message} subMessage={toast.subMessage} linkText={toast.linkText} onClose={() => setToast(prev => ({ ...prev, show: false }))} />
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <span className="inline-block px-3 py-1 bg-[#050f36] text-white text-[10px] font-black tracking-widest rounded-full mb-3 uppercase">LOT OPERATIONS</span>
          <h1 className="text-4xl md:text-5xl font-black text-[#050f36] leading-tight flex items-center group font-manrope">
            Dashboard - Jacksonville Lot
          </h1>
          <p className="text-[#45464e] font-medium mt-1">Real-time overview of your parking operations</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg flex items-center gap-2 font-bold text-xs uppercase tracking-wide">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
            Live
          </div>
          <div className="bg-[#f1f4fb] px-4 py-2 rounded-lg flex items-center gap-3 border border-transparent cursor-pointer hover:bg-[#e5e8ef] transition-colors duration-150">
            <span className="material-symbols-outlined text-[#0058be]">calendar_today</span>
            <span className="font-semibold text-sm">Today</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">

        {/* Occupancy */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c6c5cf]/10 hover:shadow-md transition-shadow duration-150">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#45464e] text-xs font-black uppercase tracking-widest">Occupancy</span>
            <div className="bg-[#0058be]/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#0058be]">pie_chart</span>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-[#050f36]">{occupancyCount} / 60</span>
            <span className="text-lg font-bold text-[#0058be]">{Math.round((occupancyCount / 60) * 100)}%</span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-green-600 font-bold text-sm">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            ↑ 12% vs yesterday
          </div>
        </div>

        {/* Arriving Today */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c6c5cf]/10 hover:shadow-md transition-shadow duration-150">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#45464e] text-xs font-black uppercase tracking-widest">Arriving Today</span>
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="material-symbols-outlined text-blue-700">login</span>
            </div>
          </div>
          <div className="text-4xl font-black text-[#050f36]">{arrivingCount}</div>
          <div className="mt-2 text-[#45464e] text-xs font-medium">reservations arriving today</div>
          <div className="mt-1 text-[#45464e] text-xs font-medium">{arrivingList.length} in next 4 hours</div>
          <div className="mt-3 text-[#45464e] text-sm leading-tight">
            <div className="font-bold text-[#050f36]">Next: 2:30 PM</div>
            <div className="text-xs">Space 23 - Global Logistics</div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c6c5cf]/10 hover:shadow-md transition-shadow duration-150">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#45464e] text-xs font-black uppercase tracking-widest">Revenue</span>
            <div className="bg-green-100 p-2 rounded-lg">
              <span className="material-symbols-outlined text-green-700">payments</span>
            </div>
          </div>
          <div className="text-4xl font-black text-[#050f36]">$2,480</div>
          <div className="mt-2 text-[#45464e] text-xs font-medium">Confirmed payments today</div>
          <div className="mt-1 flex items-center gap-1 text-green-600 font-bold text-sm">
            <span className="material-symbols-outlined text-sm">arrow_upward</span>
            ↑ $340 vs typical Wednesday
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#c6c5cf]/10 ring-1 ring-[#3c2100]/10 transition-all duration-150 hover:shadow-md hover:bg-[#f1f4fb] cursor-pointer group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[#45464e] text-xs font-black uppercase tracking-widest">Pending Actions</span>
            <div className="bg-[#ffdcbc] p-2 rounded-lg">
              <span className="material-symbols-outlined text-[#61401a]">priority_high</span>
            </div>
          </div>
          <div className="text-4xl font-black text-[#3c2100]">3</div>
          <div className="mt-4 flex justify-between items-end">
            <span className="text-[#45464e] text-sm font-medium">2 check-ins, 1 support request</span>
            <span className="text-[#0058be] text-sm font-bold group-hover:translate-x-1 transition-transform duration-150">View Details →</span>
          </div>
        </div>

      </section>

      {/* Quick Actions */}
      <section className="bg-[#050f36] p-4 rounded-xl flex flex-wrap gap-4 items-center mb-10 shadow-lg">
        <span className="text-white/60 text-[10px] font-black uppercase tracking-widest px-4 mr-2 border-r border-white/20 font-label">Quick Actions</span>
        <button 
          className="bg-[#0058be] hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all duration-150 flex items-center gap-2 font-label cursor-pointer active:scale-95"
          onClick={() => setActiveModal('check-in')}
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          Manual Check-In
        </button>
        <button 
          className="bg-[#0058be] hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-all duration-150 flex items-center gap-2 font-label cursor-pointer active:scale-95"
          onClick={() => setActiveModal('reservation')}
        >
          <span className="material-symbols-outlined text-sm">calendar_month</span>
          New Reservation
        </button>
        <button 
          className="bg-transparent hover:bg-white/10 text-white/80 px-6 py-2 rounded-lg font-bold text-sm transition-all duration-150 flex items-center gap-2 border border-white/20 font-label cursor-pointer active:scale-95"
          onClick={() => setActiveModal('unavailable')}
        >
          <span className="material-symbols-outlined text-sm">block</span>
          Mark Space Unavailable
        </button>
      </section>

      {/* Arriving Table */}
      <section className="bg-white rounded-xl shadow-sm mb-10 overflow-hidden border border-[#c6c5cf]/10">
        <div className="px-8 py-6 border-b border-[#ebeef5]">
          <h2 className="text-xl font-black text-[#050f36] font-manrope">Arriving in Next 4 Hours</h2>
        </div>
        <div className="overflow-x-auto">
          {arrivingList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-[#f1f4fb]/30 border-t border-[#ebeef5]">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 text-slate-400 shadow-sm">
                <span className="material-symbols-outlined text-3xl">event_busy</span>
              </div>
              <h3 className="text-lg font-black text-[#050f36] font-manrope">No arrivals in the next 4 hours</h3>
              <p className="text-sm text-[#45464e] mt-1 mb-6">All clear for now</p>
              <button className="text-sm font-bold text-[#45464e] border border-slate-300 bg-white px-5 py-2 rounded-lg hover:bg-slate-50 transition-all duration-150 shadow-sm font-label cursor-pointer">
                View Full Day Schedule →
              </button>
            </div>
          ) : (
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-[#f1f4fb] text-[#45464e] text-[10px] font-black uppercase tracking-widest font-label">
                  <th className="px-8 py-4">Time</th>
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Vehicle</th>
                  <th className="px-8 py-4">Space</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebeef5]">
                {arrivingList.map(customer => (
                  <tr key={customer.id} className="hover:bg-[#f1f4fb]/60 transition-colors duration-150 cursor-pointer">
                    <td className="px-8 py-4 font-bold text-[#050f36]">{customer.time}</td>
                    <td className="px-8 py-4 text-sm font-medium">
                      {customer.name}
                      <SourceBadge source={customer.source} />
                    </td>
                    <td className="px-8 py-4 text-sm text-[#45464e]">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400 text-lg">{customer.vehicleIcon}</span>
                        {customer.vehicle}
                      </div>
                    </td>
                    <td className="px-8 py-4 text-sm font-bold text-[#0058be]">{customer.space}</td>
                    <td className="px-8 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black rounded-full ${customer.bgClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${customer.dotClass}`}></span>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      {customer.expectedWait ? (
                        <button className="bg-[#e5e8ef] text-[#45464e] text-xs font-black px-4 py-2 rounded-lg cursor-not-allowed font-label">WAITING</button>
                      ) : (
                        <button 
                          className="bg-[#0058be] text-white text-xs font-black px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 font-label cursor-pointer"
                          onClick={(e) => { e.stopPropagation(); handleCheckIn(customer); }}
                        >
                          CHECK IN
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

    <ManualCheckInModal 
        isOpen={activeModal === 'check-in'} 
        onClose={() => setActiveModal(null)} 
        expectedArrivals={arrivingList} 
        onCheckIn={handleCheckIn} 
      />

      <MarkSpaceUnavailableModal 
        isOpen={activeModal === 'unavailable'} 
        onClose={() => setActiveModal(null)} 
        availableSpaces={['A-01', 'A-02', 'B-10', 'C-05', 'D-11']} 
        onMarkUnavailable={handleMarkUnavailable} 
      />

      <BookingModal
        bookingForm={bookingForm}
        isOpen={activeModal === 'reservation'}
        isSaveDisabled={!bookingForm.fullName || !bookingForm.phoneNumber}
        onClose={() => setActiveModal(null)}
        onFieldChange={(field, val) => setBookingForm(prev => ({...prev, [field]: val}))}
        onPhoneChange={(e) => setBookingForm(prev => ({...prev, phoneNumber: e.target.value}))}
        onSpotChange={(val) => setBookingForm(prev => ({ ...prev, assignedSpot: val, assignedSpotId: '' }))}
        onSave={handleBookingSave}
        onClearDraft={() => setBookingForm(createInitialBookingForm?.() || {})}
        onDiscardDraft={() => setActiveModal(null)}
        phoneInputRef={phoneInputRef}
        lotDetails={{ is_24_7: true }}
        spotOptions={[]}
        notesLength={bookingForm.customerNotes?.length || 0}
        totalDue="$0.00"
        estimatedTotal="$0.00"
      />
    </div>
  );
}
