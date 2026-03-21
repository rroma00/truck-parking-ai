import { useState, useRef, useEffect } from 'react';

const WheelColumn = ({ list, value, onChange, throttle = 250 }) => {
  const [activeIdx, setActiveIdx] = useState(list.indexOf(value));
  const trackRef = useRef(null);
  const accumTimer = useRef(null);

  useEffect(() => {
    const idx = list.indexOf(value);
    if (idx !== -1) setActiveIdx(idx);
  }, [value, list]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    
    const handleWheel = (e) => {
      e.preventDefault();
      
      if (accumTimer.current) return;
      accumTimer.current = setTimeout(() => {
        accumTimer.current = null;
      }, throttle);

      const dir = Math.sign(e.deltaY);
      if (dir === 0) return;
      
      setActiveIdx(prev => {
        const next = Math.max(0, Math.min(list.length - 1, prev + dir));
        if (next !== prev) onChange(list[next]);
        return next;
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [list, onChange]);

  return (
    <div className="flex-1 relative z-10 overflow-hidden h-[90px]" ref={trackRef}>
      <div 
        className="flex flex-col items-center w-full transition-transform duration-200 ease-out absolute top-0 left-0"
        style={{ transform: `translateY(calc(30px - ${activeIdx * 30}px))` }}
      >
        {list.map(item => (
          <button 
            key={item}
            onClick={() => onChange(item)}
            className={`w-full h-[30px] flex-shrink-0 flex items-center justify-center rounded-md text-[13px] font-bold transition-colors ${
              value === item ? 'text-white' : 'text-on-surface/50 hover:text-on-surface'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

const WheelTimePicker = ({ initialTime }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  const [h, setH] = useState(initialTime.split(':')[0]);
  const [m, setM] = useState(initialTime.split(':')[1].split(' ')[0]);
  const [p, setP] = useState(initialTime.split(' ')[1]);
  const [typed, setTyped] = useState(`${h}:${m} ${p}`);

  const hours = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  const minutes = ['00','05','10','15','20','25','30','35','40','45','50','55'];
  const periods = ['AM', 'PM'];

  useEffect(() => {
    // Only automatically sync changes backwards to the text box
    // while the component is open or updated internally.
    setTyped(`${h}:${m} ${p}`);
  }, [h, m, p]);

  const commitInput = (inputStr) => {
    // Basic catch for formats like "8:00 am", "615pm", "12 00 P"
    const mch = inputStr.match(/^(\d{1,2})[:\s]*(\d{0,2})\s*(a|p|am|pm)?$/i);
    if (mch) {
      let hh = mch[1].padStart(2, '0');
      let mmRaw = mch[2] || '00';
      
      // Round minutes strictly to nearest 5
      let mmNum = parseInt(mmRaw.padEnd(2, '0'), 10);
      if (isNaN(mmNum)) mmNum = 0;
      mmNum = Math.round(mmNum / 5) * 5;
      if (mmNum === 60) mmNum = 55;
      const mm = mmNum.toString().padStart(2, '0');
      
      let pp = (mch[3] || 'AM').toUpperCase();
      if (pp.startsWith('A')) pp = 'AM';
      else if (pp.startsWith('P')) pp = 'PM';
      else pp = 'AM'; // default fallback
      
      // Validate hour against array
      if (!hours.includes(hh)) hh = '12'; 
      
      setH(hh); setM(mm); setP(pp);
      setTyped(`${hh}:${mm} ${pp}`);
    } else {
      // Revert if entirely unparseable
      setTyped(`${h}:${m} ${p}`);
    }
  };

  const handleType = (e) => setTyped(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      commitInput(typed);
      setIsOpen(false);
    }
  };

  const handleBlur = () => commitInput(typed);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const dropdownRef = useRef(null);
  useEffect(() => {
    const el = dropdownRef.current;
    if (!el) return;
    const preventWheel = (e) => e.preventDefault();
    // Aggressive catch-all to ensure page never scrolls while interacting with the picker body
    el.addEventListener('wheel', preventWheel, { passive: false });
    return () => el.removeEventListener('wheel', preventWheel);
  }, [isOpen]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative group">
        <input 
          type="text" 
          value={typed}
          onChange={handleType}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={handleBlur}
          className="w-full border-none bg-surface-container-low hover:bg-surface-container-high rounded-xl p-3 pr-10 focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-[15px] shadow-sm tracking-wide text-on-surface"
        />
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">schedule</span>
      </div>

      {isOpen && (
        <div 
          ref={dropdownRef}
          className="time-picker-dropdown absolute top-[105%] left-0 w-[220px] bg-surface-container-lowest border border-white/5 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] z-50 outline-none overflow-hidden"
        >
          <div className="grid grid-cols-3 pt-2 pb-0.5 px-0.5 border-b border-white/5 bg-white/[0.02]">
            <div className="text-center text-[9px] font-bold text-on-surface-variant/70 tracking-tighter uppercase">Hr</div>
            <div className="text-center text-[9px] font-bold text-on-surface-variant/70 tracking-tighter uppercase">Min</div>
            <div className="text-center text-[9px] font-bold text-on-surface-variant/70 tracking-tighter uppercase">Per</div>
          </div>
          
          <div className="flex relative h-[90px] bg-white/[0.01]">
            {/* Embedded Active Focus Band directly intercepting the center */}
            <div className="absolute top-[30px] left-1 right-1 h-[30px] bg-[#5468ff] rounded-md pointer-events-none border border-white/10 shadow-inner z-0"></div>

            <WheelColumn list={hours} value={h} onChange={setH} />
            <div className="w-[1px] bg-white/5 my-2 z-10"></div>
            <WheelColumn list={minutes} value={m} onChange={setM} throttle={100} />
            <div className="w-[1px] bg-white/5 my-2 z-10"></div>
            <WheelColumn list={periods} value={p} onChange={setP} />
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

  const availableVehicleTypes = ['Tractor', 'Trailer Only', 'Tractor-Trailer', 'Bobtail', 'Box Truck'];
  const [vehicleTypes, setVehicleTypes] = useState(['Tractor', 'Trailer Only', 'Tractor-Trailer']);

  const toggleVehicleType = (type) => {
    setVehicleTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const [is53ftFriendly, setIs53ftFriendly] = useState(true);
  const [isDropTrailerAllowed, setIsDropTrailerAllowed] = useState(false);

  const [maxLength, setMaxLength] = useState('75');
  const [maxStay, setMaxStay] = useState('No Limit');
  const [isStayMenuOpen, setIsStayMenuOpen] = useState(false);
  const stayOptions = ['No Limit', '24 Hours', '48 Hours', '1 Week', 'Monthly'];
  const stayContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stayContainerRef.current && !stayContainerRef.current.contains(e.target)) setIsStayMenuOpen(false);
    };
    if (isStayMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStayMenuOpen]);

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
<label className="flex items-center gap-3 text-sm text-on-surface-variant cursor-pointer group w-fit transition-colors hover:text-on-surface">
  <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-surface-container-low border border-outline-variant/50 group-hover:border-secondary/70 transition-colors">
    <input defaultChecked={true} className="peer absolute inset-0 opacity-0 cursor-pointer" type="checkbox"/>
    <div className="absolute inset-0 rounded-full bg-secondary scale-0 peer-checked:scale-100 transition-transform"></div>
    <span className="material-symbols-outlined absolute text-[12px] text-white opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
  </div>
  <span className="font-medium">After-hours Parking Allowed</span>
</label>
<label className="flex items-center gap-3 text-sm text-on-surface-variant cursor-pointer group w-fit transition-colors hover:text-on-surface">
  <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-surface-container-low border border-outline-variant/50 group-hover:border-secondary/70 transition-colors">
    <input defaultChecked={true} className="peer absolute inset-0 opacity-0 cursor-pointer" type="checkbox"/>
    <div className="absolute inset-0 rounded-full bg-secondary scale-0 peer-checked:scale-100 transition-transform"></div>
    <span className="material-symbols-outlined absolute text-[12px] text-white opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
  </div>
  <span className="font-medium">After-hours Entry</span>
</label>
<label className="flex items-center gap-3 text-sm text-on-surface-variant cursor-pointer group w-fit transition-colors hover:text-on-surface">
  <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-surface-container-low border border-outline-variant/50 group-hover:border-secondary/70 transition-colors">
    <input defaultChecked={true} className="peer absolute inset-0 opacity-0 cursor-pointer" type="checkbox"/>
    <div className="absolute inset-0 rounded-full bg-secondary scale-0 peer-checked:scale-100 transition-transform"></div>
    <span className="material-symbols-outlined absolute text-[12px] text-white opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
  </div>
  <span className="font-medium">After-hours Exit</span>
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
  {availableVehicleTypes.map(type => (
    <button
      key={type}
      onClick={() => toggleVehicleType(type)}
      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
        vehicleTypes.includes(type)
          ? 'bg-secondary text-white shadow-md scale-100 hover:bg-secondary/90'
          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
      }`}
    >
      {type}
    </button>
  ))}
</div>
<div className="pt-4 flex flex-col gap-3">
  <label className="flex items-center justify-between cursor-pointer group p-2 -mx-2 rounded-lg hover:bg-surface-container-low transition-colors">
    <span className="text-sm font-medium text-primary group-hover:text-on-surface transition-colors">53ft Trailer Friendly?</span>
    <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-surface-container-low border border-outline-variant/50 group-hover:border-secondary/70 transition-colors flex-shrink-0">
      <input checked={is53ftFriendly} onChange={() => setIs53ftFriendly(!is53ftFriendly)} className="peer absolute inset-0 opacity-0 cursor-pointer" type="checkbox"/>
      <div className="absolute inset-0 rounded-full bg-secondary scale-0 peer-checked:scale-100 transition-transform"></div>
      <span className="material-symbols-outlined absolute text-[12px] text-white opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
    </div>
  </label>
  <label className="flex items-center justify-between cursor-pointer group p-2 -mx-2 rounded-lg hover:bg-surface-container-low transition-colors">
    <span className="text-sm font-medium text-primary group-hover:text-on-surface transition-colors">Drop Trailer Allowed?</span>
    <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-surface-container-low border border-outline-variant/50 group-hover:border-secondary/70 transition-colors flex-shrink-0">
      <input checked={isDropTrailerAllowed} onChange={() => setIsDropTrailerAllowed(!isDropTrailerAllowed)} className="peer absolute inset-0 opacity-0 cursor-pointer" type="checkbox"/>
      <div className="absolute inset-0 rounded-full bg-secondary scale-0 peer-checked:scale-100 transition-transform"></div>
      <span className="material-symbols-outlined absolute text-[12px] text-white opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
    </div>
  </label>
</div>
</div>
<div className="grid grid-cols-1 gap-4">
<div className="space-y-2">
<label className="text-[10px] font-bold text-on-surface-variant uppercase">Max Vehicle Length</label>
<div className="relative group">
  <input 
    type="text" 
    value={maxLength}
    onChange={(e) => setMaxLength(e.target.value.replace(/\D/g, ''))}
    className="w-full border-none bg-surface-container-low hover:bg-surface-container-high rounded-xl p-3 pr-8 focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-[15px] shadow-sm tracking-wide text-on-surface"
  />
  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/70 font-medium text-sm pointer-events-none">ft</span>
</div>
</div>
<div className="space-y-2" ref={stayContainerRef}>
<label className="text-[10px] font-bold text-on-surface-variant uppercase">Max Stay Duration</label>
<div className="relative w-full">
  <button 
    type="button" 
    onClick={() => setIsStayMenuOpen(!isStayMenuOpen)}
    className="w-full flex items-center justify-between border-none bg-surface-container-low hover:bg-surface-container-high rounded-xl p-3 focus:ring-2 focus:ring-secondary/20 transition-all font-medium text-[15px] shadow-sm tracking-wide text-on-surface"
  >
    <span>{maxStay}</span>
    <span className={`material-symbols-outlined text-on-surface-variant text-[18px] transition-transform duration-200 ${isStayMenuOpen ? 'rotate-180' : ''}`}>expand_more</span>
  </button>
  {isStayMenuOpen && (
    <div className="absolute top-[105%] left-0 w-full bg-surface-container-lowest border border-white/5 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] z-50 overflow-hidden transform transition-all duration-200 p-1">
      {stayOptions.map(opt => (
        <button
          key={opt}
          onClick={() => { setMaxStay(opt); setIsStayMenuOpen(false); }}
          className={`w-full flex items-center px-4 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
            maxStay === opt 
              ? 'bg-[#5468ff]/10 text-[#5468ff]' 
              : 'text-on-surface hover:bg-surface-container-low'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )}
</div>
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
<div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl relative group transition-colors hover:bg-surface-container-high cursor-help">
  <div>
    <p className="text-sm font-bold text-primary">Enable Real-time Tracking</p>
    <p className="text-xs text-on-surface-variant">Update availability automatically via AI logs.</p>
  </div>
  {/* Tooltip Disclaimer */}
  <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[280px] p-3.5 bg-surface-container-highest border border-white/5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-50 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-2 group-hover:translate-y-0">
    <div className="flex gap-2.5">
      <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">info</span>
      <p className="text-[11px] leading-[1.6] text-on-surface font-medium">
        Enabling live tracking requires all lot management activities to be handled within the system.
      </p>
    </div>
    {/* Tooltip Arrow */}
    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface-container-highest rotate-45 border-r border-b border-white/5"></div>
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
