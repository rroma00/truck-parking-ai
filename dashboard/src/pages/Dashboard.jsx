import { useState, useRef, useEffect } from 'react';

const WheelTimePicker = ({ initialTime }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const [h, setH] = useState(initialTime.split(':')[0]);
  const [m, setM] = useState(initialTime.split(':')[1].split(' ')[0]);
  const [p, setP] = useState(initialTime.split(' ')[1]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const hours = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  const minutes = ['00','05','10','15','20','25','30','35','40','45','50','55'];
  const periods = ['AM', 'PM'];

  return (
    <div className="relative w-full" ref={containerRef}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border-none bg-surface-container-low hover:bg-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-[15px] shadow-sm tracking-wide text-on-surface"
      >
        <span>{h}:{m} {p}</span>
        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">schedule</span>
      </button>

      {isOpen && (
        <div className="absolute top-[110%] left-0 w-[240px] bg-surface-container-lowest border border-white/5 rounded-[14px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-50 overflow-hidden transform transition-all duration-200">
          <div className="grid grid-cols-3 pt-2.5 pb-1 px-1 border-b border-white/5 flex-shrink-0 bg-white/[0.02]">
            <div className="text-center text-[10px] font-bold text-on-surface-variant/80 tracking-widest uppercase">Hours</div>
            <div className="text-center text-[10px] font-bold text-on-surface-variant/80 tracking-widest uppercase">Mins</div>
            <div className="text-center text-[10px] font-bold text-on-surface-variant/80 tracking-widest uppercase">Mode</div>
          </div>
          
          <div className="flex relative h-[155px] bg-white/[0.01]">
            <style>{`.no-sc::-webkit-scrollbar { display: none; }`}</style>
            
            {/* Soft Focus Band behind lists to simulate scroll wheel center */}
            <div className="absolute top-1/2 left-2 right-2 -translate-y-1/2 h-8 bg-white/[0.03] rounded-lg pointer-events-none"></div>

            <div className="flex-1 overflow-y-auto no-sc scroll-smooth relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
               <div className="flex flex-col items-center gap-1 py-[62px] px-1">
                 {hours.map(hr => (
                   <button 
                     key={`h-${hr}`} 
                     onClick={() => setH(hr)}
                     className={`w-full py-1.5 text-center rounded-lg text-[14px] transition-all font-semibold ${
                       h === hr ? 'bg-[#5468ff] text-white shadow-md' : 'text-on-surface hover:bg-white/5 opacity-50'
                     }`}
                   >
                     {hr}
                   </button>
                 ))}
               </div>
            </div>
            
            <div className="w-[1px] bg-white/5 my-4 z-10"></div>
            
            <div className="flex-1 overflow-y-auto no-sc scroll-smooth relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
               <div className="flex flex-col items-center gap-1 py-[62px] px-1">
                 {minutes.map(mn => (
                   <button 
                     key={`m-${mn}`} 
                     onClick={() => setM(mn)}
                     className={`w-full py-1.5 text-center rounded-lg text-[14px] transition-all font-semibold ${
                       m === mn ? 'bg-[#5468ff] text-white shadow-md' : 'text-on-surface hover:bg-white/5 opacity-50'
                     }`}
                   >
                     {mn}
                   </button>
                 ))}
               </div>
            </div>
            
            <div className="w-[1px] bg-white/5 my-4 z-10"></div>
            
            <div className="flex-1 overflow-y-auto no-sc scroll-smooth relative z-10" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
               <div className="flex flex-col items-center gap-1 py-[62px] px-1">
                 {periods.map(pr => (
                   <button 
                     key={`p-${pr}`} 
                     onClick={() => setP(pr)}
                     className={`w-full py-1.5 text-center rounded-lg text-[13px] transition-all font-bold tracking-wide ${
                       p === pr ? 'bg-[#5468ff] text-white shadow-md' : 'text-on-surface hover:bg-white/5 opacity-50'
                     }`}
                   >
                     {pr}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const [isSurfaceMenuOpen, setIsSurfaceMenuOpen] = useState(false);
  const [selectedSurface, setSelectedSurface] = useState('Dirt');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [afterHoursPhone, setAfterHoursPhone] = useState('');

  const handlePhoneFormat = (val, setter) => {
    let coreVal = val;
    if (coreVal.startsWith('+1 ')) coreVal = coreVal.substring(3);
    else if (coreVal.startsWith('+1')) coreVal = coreVal.substring(2);
    
    let nums = coreVal.replace(/\D/g, '');
    
    if (nums.length === 11 && nums.startsWith('1')) nums = nums.substring(1);
    nums = nums.substring(0, 10);
    
    if (nums.length === 0) {
      setter('');
      return;
    }
    
    if (nums.length <= 3) setter(`(${nums}`);
    else if (nums.length <= 6) setter(`(${nums.slice(0, 3)}) ${nums.slice(3)}`);
    else setter(`(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6, 10)}`);
  };
  
  return (
    <>

{/* Header Section */}
<header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
<div className="flex-1">
<h1 className="text-5xl font-extrabold text-primary font-manrope tracking-tight mb-2">Location Setup</h1>
<p className="text-on-surface-variant text-lg">Enter the key details to train your parking assistant for this yard.</p>
<div className="mt-6 flex items-center gap-4 max-w-md">
<div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
<div className="w-[20%] h-full bg-secondary"></div>
</div>
<span className="text-sm font-semibold text-secondary">20% Complete</span>
</div>
</div>
<div className="flex gap-3">
<button className="px-6 py-3 rounded-xl font-semibold bg-surface-container-low text-primary hover:bg-surface-container-high transition-all active:scale-95">Save Draft</button>
<button className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-primary-container text-white shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-95">Publish Location</button>
</div>
</header>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
{/* Left Column: Main Form */}
<div className="lg:col-span-8 space-y-10">
{/* AI Quick Setup Card */}
<section className="bg-primary-container text-white p-8 rounded-xl relative overflow-hidden">
<div className="relative z-10">
<div className="flex items-center gap-2 mb-6">
<span className="material-symbols-outlined text-secondary-fixed">psychology</span>
<h2 className="text-xl font-bold font-manrope">Most Asked Driver Questions</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="space-y-4">
{[
  'After-hours parking?',
  'Gated Access?',
  'Security Cameras?',
  '53ft Trailer Friendly?'
].map((question, idx) => (
  <label key={idx} className="flex items-center justify-between p-3.5 bg-white/[0.06] rounded-[14px] cursor-pointer hover:bg-white/[0.12] transition-colors border border-transparent hover:border-white/5 group shadow-sm">
    <span className="text-sm text-slate-200 group-hover:text-white transition-colors font-medium">{question}</span>
    <div className="relative flex items-center justify-center w-[22px] h-[22px] rounded-full bg-white/10 group-hover:bg-white/20 transition-all">
      <input defaultChecked={idx === 0} className="peer absolute inset-0 opacity-0 cursor-pointer" type="checkbox"/>
      <div className="absolute inset-0 rounded-full bg-[#2563eb] scale-0 peer-checked:scale-100 transition-transform duration-200 ease-out flex items-center justify-center shadow-[0_2px_8px_rgba(37,99,235,0.5)]">
        <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
      </div>
    </div>
  </label>
))}
</div>
<div className="grid grid-cols-2 gap-4">
<div className="space-y-1.5 relative z-50">
<label className="text-[10px] uppercase tracking-wider text-on-primary-container font-bold px-1">Surface Type</label>
<div className="relative">
<div 
  onClick={() => setIsSurfaceMenuOpen(!isSurfaceMenuOpen)}
  className="w-full bg-white/10 border border-transparent rounded-[14px] text-sm flex items-center justify-between px-3.5 py-2.5 cursor-pointer text-slate-200 hover:bg-white/[0.12] transition-colors shadow-sm relative z-50"
>
<span>{selectedSurface}</span>
<span className="material-symbols-outlined text-[18px] text-white/50">
  {isSurfaceMenuOpen ? 'expand_less' : 'expand_more'}
</span>
</div>

{isSurfaceMenuOpen && (
  <>
    <div className="fixed inset-0 z-40" onClick={() => setIsSurfaceMenuOpen(false)}></div>
    <div className="absolute top-[calc(100%+6px)] left-0 w-full bg-[#0a1020]/40 backdrop-blur-2xl border border-white/10 rounded-[16px] shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden p-1.5 z-[60]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="flex flex-col gap-0.5 mt-1 relative z-10">
        {['Asphalt', 'Concrete', 'Gravel', 'Dirt'].map((option) => (
          <div 
            key={option}
            onClick={() => {
              setSelectedSurface(option);
              setIsSurfaceMenuOpen(false);
            }}
            className={`px-3 py-2 text-sm rounded-[10px] cursor-pointer transition-colors ${
              selectedSurface === option 
                ? 'bg-[#2563eb] text-white font-medium shadow-md' 
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  </>
)}
</div>
</div>
<div className="space-y-1">
<label className="text-[10px] uppercase tracking-wider text-on-primary-container font-bold">Overnight Price</label>
<div className="relative flex items-center">
<span className="absolute left-3.5 text-white/50 text-sm pointer-events-none">$</span>
<input className="w-full bg-white/10 border-transparent rounded-lg text-sm pl-7 focus:ring-secondary focus:border-secondary placeholder:text-white/40" placeholder="25.00" type="text" inputMode="decimal"/>
</div>
</div>
<div className="space-y-1">
<label className="text-[10px] uppercase tracking-wider text-on-primary-container font-bold">Available Spaces</label>
<input className="w-full bg-white/10 border-transparent rounded-lg text-sm focus:ring-secondary focus:border-secondary placeholder:text-white/40" placeholder="45" type="text" inputMode="numeric" pattern="[0-9]*"/>
</div>
<div className="space-y-1">
<label className="text-[10px] uppercase tracking-wider text-on-primary-container font-bold">Late Arrival Info</label>
<input className="w-full bg-white/10 border-transparent rounded-lg text-sm focus:ring-secondary focus:border-secondary" placeholder="Gate Code: 1234" type="text"/>
</div>
</div>
</div>
</div>
<div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
</section>
{/* Section 1: BASIC INFO */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(24,28,33,0.04)]">
<h3 className="text-lg font-bold font-manrope text-primary mb-6 flex items-center gap-2">
<span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary font-bold text-sm">01</span>
                        BASIC INFO
                    </h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2 col-span-2">
<label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Location Name</label>
<input className="w-full border-none bg-surface-container-low rounded-lg p-3 focus:ring-2 focus:ring-secondary/20 transition-all" placeholder="North Houston Logistics Center" type="text"/>
</div>
<div className="space-y-2 col-span-2">
<label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Address</label>
<div className="relative">
<input className="w-full border-none bg-surface-container-low rounded-lg p-3 pl-10 focus:ring-2 focus:ring-secondary/20 transition-all" placeholder="Search for address..." type="text"/>
<span className="material-symbols-outlined absolute left-3 top-3 text-outline text-sm">location_on</span>
</div>
</div>
<div className="space-y-2">
<label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Phone Number</label>
<div className="relative flex items-center">
<span className="absolute left-3 text-white/50 text-[15px] pointer-events-none">+1</span>
<input 
  value={phoneNumber}
  onChange={(e) => handlePhoneFormat(e.target.value, setPhoneNumber)}
  className="w-full border-none bg-surface-container-low rounded-lg py-3 pr-3 pl-[34px] focus:ring-2 focus:ring-secondary/20" 
  placeholder="(555) 000-0000" 
  type="tel"
/>
</div>
</div>
<div className="space-y-2">
<label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">After-Hours Support</label>
<div className="relative flex items-center">
<span className="absolute left-3 text-white/50 text-[15px] pointer-events-none">+1</span>
<input 
  value={afterHoursPhone}
  onChange={(e) => handlePhoneFormat(e.target.value, setAfterHoursPhone)}
  className="w-full border-none bg-surface-container-low rounded-lg py-3 pr-3 pl-[34px] focus:ring-2 focus:ring-secondary/20" 
  placeholder="(555) 000-0000" 
  type="tel"
/>
</div>
</div>
<div className="col-span-2 flex flex-wrap items-center gap-6 p-4 bg-surface-container-low rounded-xl">
<span className="text-sm font-medium text-primary">Booking Type:</span>
<label className="flex items-center gap-2.5 cursor-pointer group">
<div className="relative flex items-center justify-center w-5 h-5">
<input defaultChecked={true} className="peer absolute inset-0 opacity-0 cursor-pointer z-10" name="booking" type="radio"/>
<div className="absolute inset-0 rounded-full border-2 border-on-surface-variant/30 peer-checked:border-secondary peer-checked:bg-secondary/10 transition-colors group-hover:border-secondary/60"></div>
<div className="absolute inset-[4px] rounded-full bg-secondary scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
</div>
<span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">Reservation Required</span>
</label>
<label className="flex items-center gap-2.5 cursor-pointer group">
<div className="relative flex items-center justify-center w-5 h-5">
<input className="peer absolute inset-0 opacity-0 cursor-pointer z-10" name="booking" type="radio"/>
<div className="absolute inset-0 rounded-full border-2 border-on-surface-variant/30 peer-checked:border-secondary peer-checked:bg-secondary/10 transition-colors group-hover:border-secondary/60"></div>
<div className="absolute inset-[4px] rounded-full bg-secondary scale-0 peer-checked:scale-100 transition-transform duration-200"></div>
</div>
<span className="text-sm font-medium text-on-surface-variant group-hover:text-primary transition-colors">First Come, First Served (FCFS)</span>
</label>
</div>
</div>
</div>
{/* Section 2: HOURS & ACCESS */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(24,28,33,0.04)]">
<div className="flex justify-between items-center mb-6">
<h3 className="text-lg font-bold font-manrope text-primary flex items-center gap-2">
<span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary font-bold text-sm">02</span>
                            HOURS &amp; ACCESS
                        </h3>
<label className="flex items-center gap-3 cursor-pointer group">
<span className="text-sm font-semibold text-primary">Open 24/7</span>
<div className="relative inline-flex items-center">
<input defaultChecked={true} className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-surface-container-high border border-outline-variant/30 rounded-full peer peer-checked:bg-secondary peer-checked:border-secondary transition-all duration-200 ease-in-out"></div>
<div className="absolute left-[2px] top-[2px] bg-white border border-gray-300 rounded-full h-[20px] w-[20px] transition-transform duration-200 ease-in-out peer-checked:translate-x-full peer-checked:border-transparent shadow-sm"></div>
</div>
</label>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="space-y-4">
<label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Office Hours</label>
<div className="grid grid-cols-2 gap-3 relative z-40">
<WheelTimePicker initialTime="08:00 AM" />
<WheelTimePicker initialTime="06:00 PM" />
</div>
<div className="pt-4 space-y-3">
<p className="text-sm font-semibold text-primary">After-hours capabilities:</p>
<label className="flex items-center gap-3 text-sm text-on-surface-variant">
<input checked="" className="rounded text-secondary" type="checkbox"/> After-hours Parking Allowed
                                </label>
<label className="flex items-center gap-3 text-sm text-on-surface-variant">
<input checked="" className="rounded text-secondary" type="checkbox"/> After-hours Entry
                                </label>
<label className="flex items-center gap-3 text-sm text-on-surface-variant">
<input checked="" className="rounded text-secondary" type="checkbox"/> After-hours Exit
                                </label>
</div>
</div>
<div className="space-y-4 p-6 bg-surface-container-low rounded-xl">
<div className="flex items-center gap-2 mb-2">
<span className="material-symbols-outlined text-secondary text-lg">door_front</span>
<span className="text-sm font-bold text-primary">Gate Controls</span>
</div>
<label className="flex items-center gap-3 text-sm text-on-surface-variant font-medium cursor-pointer group w-fit">
<div className="relative flex items-center justify-center w-5 h-5 rounded bg-surface-container-low border border-outline-variant/50 group-hover:border-secondary/70 transition-colors">
<input defaultChecked={true} className="peer absolute inset-0 opacity-0 cursor-pointer" type="checkbox"/>
<div className="absolute inset-0 rounded bg-secondary scale-0 peer-checked:scale-100 transition-transform duration-200 flex items-center justify-center shadow-[0_2px_8px_rgba(37,99,235,0.4)]">
<span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>
</div>
</div>
<span className="group-hover:text-primary transition-colors">Automatic Gate</span>
</label>
<div className="space-y-2">
<label className="text-[10px] font-bold text-on-surface-variant uppercase">Default Gate Code</label>
<input className="w-full border-none bg-white rounded-lg p-3 focus:ring-2 focus:ring-secondary/20" placeholder="1234#" type="text"/>
</div>
<div className="space-y-2">
<label className="text-[10px] font-bold text-on-surface-variant uppercase">Gate Instructions</label>
<textarea className="w-full border-none bg-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-secondary/20" placeholder="Pull up close to the sensor..." rows="2"></textarea>
</div>
</div>
</div>
</div>
{/* Section 3: PARKING FIT */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(24,28,33,0.04)]">
<h3 className="text-lg font-bold font-manrope text-primary mb-6 flex items-center gap-2">
<span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary font-bold text-sm">03</span>
                        PARKING FIT
                    </h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="space-y-4">
<label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Permitted Vehicle Types</label>
<div className="flex flex-wrap gap-2">
<button className="px-4 py-2 bg-secondary text-white rounded-full text-xs font-semibold">Tractor</button>
<button className="px-4 py-2 bg-secondary text-white rounded-full text-xs font-semibold">Trailer Only</button>
<button className="px-4 py-2 bg-secondary text-white rounded-full text-xs font-semibold">Tractor-Trailer</button>
<button className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-full text-xs font-semibold hover:bg-surface-container-high transition-colors">Bobtail</button>
<button className="px-4 py-2 bg-surface-container-low text-on-surface-variant rounded-full text-xs font-semibold hover:bg-surface-container-high transition-colors">Box Truck</button>
</div>
<div className="pt-4 flex items-center justify-between">
<span className="text-sm font-medium text-primary">53ft Trailer Friendly?</span>
<input checked="" className="w-5 h-5 rounded text-secondary border-outline-variant" type="checkbox"/>
</div>
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-primary">Drop Trailer Allowed?</span>
<input className="w-5 h-5 rounded text-secondary border-outline-variant" type="checkbox"/>
</div>
</div>
<div className="grid grid-cols-1 gap-4">
<div className="space-y-2">
<label className="text-[10px] font-bold text-on-surface-variant uppercase">Max Vehicle Length (ft)</label>
<input className="w-full border-none bg-surface-container-low rounded-lg p-3 focus:ring-2 focus:ring-secondary/20" type="number" value="75"/>
</div>
<div className="space-y-2">
<label className="text-[10px] font-bold text-on-surface-variant uppercase">Max Stay Duration</label>
<select className="w-full border-none bg-surface-container-low rounded-lg p-3 focus:ring-2 focus:ring-secondary/20 text-sm">
<option>No Limit</option>
<option>24 Hours</option>
<option>48 Hours</option>
<option>1 Week</option>
<option>Monthly</option>
</select>
</div>
</div>
</div>
</div>
{/* Section 4: LOT & SAFETY */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(24,28,33,0.04)]">
<h3 className="text-lg font-bold font-manrope text-primary mb-6 flex items-center gap-2">
<span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary font-bold text-sm">04</span>
                        LOT &amp; SAFETY
                    </h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="space-y-4 col-span-1">
<label className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Surface Type</label>
<div className="space-y-2">
<label className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer">
<input checked="" className="text-secondary" name="surface" type="radio"/>
<span className="text-sm">Asphalt</span>
</label>
<label className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer">
<input className="text-secondary" name="surface" type="radio"/>
<span className="text-sm">Concrete</span>
</label>
<label className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg cursor-pointer">
<input className="text-secondary" name="surface" type="radio"/>
<span className="text-sm">Gravel</span>
</label>
</div>
</div>
<div className="md:col-span-2 grid grid-cols-2 gap-4">
<div className="p-4 border-2 border-surface-container-high rounded-xl space-y-4">
<p className="text-xs font-bold text-primary uppercase">Security Features</p>
<label className="flex items-center justify-between text-sm">
<span>Gated &amp; Fenced</span>
<input checked="" className="rounded text-secondary" type="checkbox"/>
</label>
<label className="flex items-center justify-between text-sm">
<span>Security Cameras</span>
<input checked="" className="rounded text-secondary" type="checkbox"/>
</label>
<label className="flex items-center justify-between text-sm">
<span>Well-Lit Lot</span>
<input checked="" className="rounded text-secondary" type="checkbox"/>
</label>
<label className="flex items-center justify-between text-sm">
<span>On-site Security</span>
<input className="rounded text-secondary" type="checkbox"/>
</label>
</div>
<div className="space-y-2">
<label className="text-xs font-bold text-on-surface-variant uppercase">Security Notes</label>
<textarea className="w-full border-none bg-surface-container-low rounded-lg p-3 text-sm focus:ring-2 focus:ring-secondary/20" placeholder="Mention roving patrols or keycard access details..." rows="6"></textarea>
</div>
</div>
</div>
</div>
{/* Section 5: PRICING & AVAILABILITY */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(24,28,33,0.04)]">
<h3 className="text-lg font-bold font-manrope text-primary mb-6 flex items-center gap-2">
<span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary font-bold text-sm">05</span>
                        PRICING &amp; AVAILABILITY
                    </h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<div className="space-y-4">
<div className="space-y-2">
<label className="text-[10px] font-bold text-on-surface-variant uppercase">Overnight Rate</label>
<div className="relative">
<span className="absolute left-3 top-3 text-outline">$</span>
<input className="w-full border-none bg-surface-container-low rounded-lg p-3 pl-8 focus:ring-2 focus:ring-secondary/20" type="text" value="25.00"/>
</div>
</div>
<div className="space-y-2">
<label className="text-[10px] font-bold text-on-surface-variant uppercase">Daily Rate</label>
<div className="relative">
<span className="absolute left-3 top-3 text-outline">$</span>
<input className="w-full border-none bg-surface-container-low rounded-lg p-3 pl-8 focus:ring-2 focus:ring-secondary/20" type="text" value="15.00"/>
</div>
</div>
<div className="space-y-2">
<label className="text-[10px] font-bold text-on-surface-variant uppercase">Weekly Rate</label>
<div className="relative">
<span className="absolute left-3 top-3 text-outline">$</span>
<input className="w-full border-none bg-surface-container-low rounded-lg p-3 pl-8 focus:ring-2 focus:ring-secondary/20" type="text" value="140.00"/>
</div>
</div>
</div>
<div className="md:col-span-2 space-y-6">
<div className="grid grid-cols-2 gap-4">
<div className="p-6 bg-secondary-container/5 rounded-xl border border-secondary/10">
<label className="text-[10px] font-bold text-secondary uppercase block mb-1">Total Spaces</label>
<input className="w-full bg-transparent border-none text-2xl font-bold text-primary p-0 focus:ring-0" type="number" value="100"/>
</div>
<div className="p-6 bg-secondary/5 rounded-xl border border-secondary/10">
<label className="text-[10px] font-bold text-secondary uppercase block mb-1">Available Now</label>
<input className="w-full bg-transparent border-none text-2xl font-bold text-primary p-0 focus:ring-0" type="number" value="45"/>
</div>
</div>
<div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
<div>
<p className="text-sm font-bold text-primary">Enable Real-time Tracking</p>
<p className="text-xs text-on-surface-variant">Update availability automatically via AI logs.</p>
</div>
<div className="relative inline-flex items-center cursor-pointer">
<input checked="" className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
</div>
</div>
</div>
</div>
</div>
{/* Section 6: ARRIVAL INSTRUCTIONS */}
<div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_40px_rgba(24,28,33,0.04)]">
<h3 className="text-lg font-bold font-manrope text-primary mb-6 flex items-center gap-2">
<span className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary font-bold text-sm">06</span>
                        ARRIVAL INSTRUCTIONS
                    </h3>
<div className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="text-xs font-bold text-on-surface-variant uppercase">Arrival Directions</label>
<textarea className="w-full border-none bg-surface-container-low rounded-lg p-3 text-sm focus:ring-2 focus:ring-secondary/20" placeholder="Take Exit 45, turn right at the Texaco..." rows="4"></textarea>
</div>
<div className="space-y-2">
<label className="text-xs font-bold text-on-surface-variant uppercase">Where to Park</label>
<textarea className="w-full border-none bg-surface-container-low rounded-lg p-3 text-sm focus:ring-2 focus:ring-secondary/20" placeholder="Park in rows 5-10 against the back fence..." rows="4"></textarea>
</div>
</div>
<div className="p-6 bg-tertiary-container/5 border border-tertiary/10 rounded-xl flex items-start gap-4">
<span className="material-symbols-outlined text-on-tertiary-container">info</span>
<div className="space-y-2 flex-1">
<label className="text-xs font-bold text-on-tertiary-container uppercase">Late Arrival/After-Hours Contact</label>
<p className="text-xs text-on-surface-variant mb-2">Instructions for drivers arriving when the office is closed.</p>
<input className="w-full border-none bg-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-secondary/20" placeholder="Call (555) 123-4567 for gate override or use the AI chat." type="text"/>
</div>
</div>
</div>
</div>
</div>
{/* Right Column: Sticky Sidebar */}
<div className="lg:col-span-4 space-y-6 sticky top-28">
{/* Sidebar Component Implementation */}
<div className="flex flex-col gap-6 shrink-0">
{/* Card 1: QUICK SUMMARY */}
<div className="bg-surface-container-low dark:bg-slate-900 rounded-xl p-6 shadow-sm">
<div className="flex items-center gap-2 mb-6">
<span className="material-symbols-outlined text-secondary">dashboard_customize</span>
<h2 className="text-lg font-bold font-manrope text-primary">Quick Summary</h2>
</div>
<div className="space-y-4">
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
<span className="text-xs font-medium text-on-surface-variant">Hours</span>
<span className="text-xs font-bold text-primary">Open 24/7</span>
</div>
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
<span className="text-xs font-medium text-on-surface-variant">After-hours</span>
<span className="text-xs font-bold text-secondary">Allowed</span>
</div>
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
<span className="text-xs font-medium text-on-surface-variant">Surface</span>
<span className="text-xs font-bold text-primary">Asphalt</span>
</div>
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
<span className="text-xs font-medium text-on-surface-variant">53ft Trailer</span>
<span className="text-xs font-bold text-secondary">Supported</span>
</div>
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
<span className="text-xs font-medium text-on-surface-variant">Security</span>
<span className="flex gap-2">
<span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold">Gated</span>
<span className="text-[10px] bg-white px-2 py-0.5 rounded font-bold">Cameras</span>
</span>
</div>
<div className="flex items-center justify-between pt-2">
<div className="flex flex-col">
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Price</span>
<span className="text-xl font-extrabold text-primary font-manrope">$25.00</span>
</div>
<div className="flex flex-col items-end">
<span className="text-[10px] text-on-surface-variant font-bold uppercase">Open Spaces</span>
<span className="text-xl font-extrabold text-secondary font-manrope">45</span>
</div>
</div><div className="pt-4 border-t border-outline-variant/20">
<p className="text-[10px] font-bold text-on-surface-variant uppercase mb-3">AI Activity</p>
<div className="space-y-3">
<div className="flex items-center justify-between">
<span className="text-xs font-medium text-on-surface-variant">AI-Handled Calls</span>
<span className="text-xs font-bold text-primary">124</span>
</div>
<div className="flex items-center justify-between">
<span className="text-xs font-medium text-on-surface-variant">Questions Answered</span>
<span className="text-xs font-bold text-primary">342</span>
</div>
</div>
<a className="mt-4 flex items-center gap-1 text-[11px] font-bold text-secondary hover:underline transition-all" href="#">
        View Detailed Analytics
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
</a>
</div>
</div>
</div>
{/* Card 2: AI RESPONSE PREVIEW */}
<div className="bg-surface-container-low dark:bg-slate-900 rounded-xl p-6 shadow-sm overflow-hidden relative">
<div className="flex items-center gap-2 mb-6">
<span className="material-symbols-outlined text-secondary">psychology</span>
<h2 className="text-lg font-bold font-manrope text-primary">AI Response Preview</h2>
</div>
<div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
{/* Question 1 */}
<div className="space-y-2">
<div className="flex items-center gap-2">
<span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-on-surface-variant">person</span>
</span>
<p className="text-[11px] font-bold text-on-surface-variant uppercase">Driver Question</p>
</div>
<div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
<p className="text-xs italic text-on-surface">"Can I park after 11 PM? My load is running late."</p>
</div>
<div className="flex items-center gap-2 justify-end">
<p className="text-[11px] font-bold text-secondary uppercase text-right">ParkLog AI</p>
<span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-white">smart_toy</span>
</span>
</div>
<div className="bg-secondary text-white p-3 rounded-lg rounded-tr-none shadow-sm ml-6">
<p className="text-xs">"Yes, you can park after hours. Just use the gate code 1234# and proceed to rows 5-10. Safe travels!"</p>
</div>
</div>
{/* Question 2 */}
<div className="space-y-2">
<div className="flex items-center gap-2">
<span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-on-surface-variant">person</span>
</span>
<p className="text-[11px] font-bold text-on-surface-variant uppercase">Driver Question</p>
</div>
<div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
<p className="text-xs italic text-on-surface">"Is the lot safe for high-value loads?"</p>
</div>
<div className="flex items-center gap-2 justify-end">
<p className="text-[11px] font-bold text-secondary uppercase text-right">ParkLog AI</p>
<span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-white">smart_toy</span>
</span>
</div>
<div className="bg-secondary text-white p-3 rounded-lg rounded-tr-none shadow-sm ml-6">
<p className="text-xs">"Definitely. We have 24/7 camera surveillance and a fully fenced/gated perimeter. Your cargo will be secure here."</p>
</div>
</div>
{/* Question 3 */}
<div className="space-y-2">
<div className="flex items-center gap-2">
<span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-on-surface-variant">person</span>
</span>
<p className="text-[11px] font-bold text-on-surface-variant uppercase">Driver Question</p>
</div>
<div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm">
<p className="text-xs italic text-on-surface">"What's the surface type? Worried about mud."</p>
</div>
<div className="flex items-center gap-2 justify-end">
<p className="text-[11px] font-bold text-secondary uppercase text-right">ParkLog AI</p>
<span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[14px] text-white">smart_toy</span>
</span>
</div>
<div className="bg-secondary text-white p-3 rounded-lg rounded-tr-none shadow-sm ml-6">
<p className="text-xs">"No need to worry! Our lot is paved with high-quality asphalt, so you'll have a clean and stable surface for your rig."</p>
</div>
</div>
</div>
<div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-surface-container-low to-transparent pointer-events-none"></div>
</div>
<button className="w-full py-4 bg-primary text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2">
<span className="material-symbols-outlined">save</span>
                        Save &amp; Publish
                    </button>
</div>
</div>
</div>

    </>
  );
}
