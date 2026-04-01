import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function FaqItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div 
      className={`group border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary bg-surface-container-low shadow-md' : 'border-outline-variant hover:border-primary/50 bg-white'}`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex justify-between items-center gap-4 transition-colors group-hover:bg-primary-container/5"
      >
        <p className={`font-bold text-lg transition-colors ${isOpen ? 'text-primary' : 'text-slate-900 group-hover:text-primary'}`}>
          {faq.q}
        </p>
        <span className={`material-symbols-outlined transition-transform duration-300 text-primary ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-0 border-t border-outline-variant/30 mt-1">
            <p className="text-on-surface-variant leading-relaxed py-4 text-sm md:text-base">
              {faq.a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ time, title, detail, icon, isAi, index }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Custom animation styles for staggered entry
  const animationDelay = `${index * 200 + (isAi ? 400 : 200)}ms`;

  return (
    <div 
      className={`flex gap-6 relative p-3 -mx-3 rounded-xl transition-all duration-300 cursor-pointer animate-slide-up
        ${isAi 
          ? 'hover:bg-secondary/5 hover:border-secondary/30 hover:shadow-[0_4px_20px_rgba(var(--color-secondary),0.1)] hover:-translate-y-1 group' 
          : 'hover:bg-surface-container-highest hover:-translate-y-1 group'
        }`}
      style={{ animationDelay }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center z-10 transition-colors duration-300
        ${isAi 
          ? 'bg-secondary text-white shadow-[0_0_15px_rgba(var(--color-secondary),0.4)] group-hover:bg-secondary-fixed group-hover:text-on-secondary-fixed' 
          : 'bg-surface-container-highest border border-outline-variant text-on-surface-variant group-hover:border-error/30'
        }`}
      >
        <span className="material-symbols-outlined text-sm" style={isAi ? { fontVariationSettings: "'FILL' 1" } : {}}>{icon}</span>
      </div>
      <div className="flex-1 pt-1.5">
        <div className="flex justify-between items-center mb-1 relative pr-4">
          <p className={`font-bold ${isAi ? 'text-secondary' : 'text-on-surface'}`}>{time}</p>
          <span className={`material-symbols-outlined text-sm transition-transform duration-300 absolute right-0 top-1/2 -translate-y-1/2 ${isOpen ? 'rotate-180' : ''} ${isAi ? 'text-secondary/70' : 'text-on-surface-variant'}`}>
            expand_more
          </span>
        </div>
        <p className={`text-sm font-medium ${isAi ? 'text-on-surface' : (index === 1 ? 'text-error line-through decoration-error/50' : 'text-on-surface-variant')}`}>{title}</p>
        
        {/* Expandable Detail */}
        <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <p className={`text-[13px] leading-relaxed pb-2 pt-1 ${isAi ? 'text-on-surface-variant' : 'text-on-surface-variant/80'}`}>
              {detail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [missedCalls, setMissedCalls] = useState(10);
  const [activeSection, setActiveSection] = useState('');
  
  // Weekly revenue calculation based on $150 per omitted call
  const weeklyRevenueLost = missedCalls * 150;
  const monthlyRevenueLost = weeklyRevenueLost * 4;
  const yearlyRevenueLost = monthlyRevenueLost * 12;

  // Intersection Observer for Active Section Tracking
  useEffect(() => {
    const sectionIds = ['problem', 'how-it-works', 'features', 'pricing', 'faq'];
    const observerOptions = {
      root: null,
      rootMargin: '-15% 0px -75% 0px', // Trigger earlier when section enters the top zone
      threshold: 0
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // Special case for hero (top of page)
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { label: 'Problem', id: 'problem' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Features', id: 'features' },
    { label: 'Pricing', id: 'pricing' },
    { label: 'FAQ', id: 'faq' }
  ];

  return (
    <main className="bg-surface text-on-surface selection:bg-secondary-fixed min-h-screen relative overflow-hidden">
      {/* Ambient Edge Vignette (Ultra-wide screens) */}
      <div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_0_150px_rgba(0,0,0,0.3)] z-[100] hidden 2xl:block"></div>
      
      <style dangerouslySetInnerHTML={{__html: `
        html, body {
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          width: 100%;
          position: relative;
        }
        @keyframes ambientDrift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(2%, 3%) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-ambient-drift {
          animation: ambientDrift 20s ease-in-out infinite;
        }
      `}} />

      {/* Top Navigation */}
      <nav className="bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm fixed top-0 w-full z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-[1400px] mx-auto relative z-10">
          <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-['Manrope']">TruckPark AI</div>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`}
                className={`transition-all duration-300 text-sm font-medium relative py-1 group
                  ${activeSection === item.id 
                    ? 'text-primary' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary'
                  }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300
                  ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'}`} 
                />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-600 dark:text-slate-400 hover:text-blue-700 font-medium text-sm">Log In</Link>
            <Link to="/onboarding" className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95">Get Demo</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 px-6 overflow-hidden">
        {/* Clean, Solid Section Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 -z-20"></div>
        {/* Soft Radial Highlight behind mockup - Positioned to prevent overflow */}
        <div className="absolute top-1/2 -right-24 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[140px] -z-10 pointer-events-none animate-ambient-drift"></div>
        
        <div className="max-w-[1400px] w-full mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Column 1: Text Content */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-bold tracking-wide uppercase mb-6 shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-default group">
              <span className="material-symbols-outlined text-[16px] text-secondary animate-pulse">auto_awesome</span>
              <span className="text-slate-800 dark:text-slate-200">24/7 AI ANSWERS EVERY DRIVER CALL</span>
            </span>
            <h1 className="text-5xl md:text-6xl font-black text-primary leading-tight mb-5 font-['Manrope'] drop-shadow-sm">
              Never Miss Another Booking—Even at 2 AM
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-9 max-w-xl leading-relaxed font-medium">
              AI answers every call in seconds, checks availability, and books spots automatically—so you can focus on running your lot, not your phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/onboarding" className="px-8 py-4 bg-gradient-to-br from-primary hover:from-primary-fixed to-primary-container text-white rounded-xl font-bold text-lg shadow-[0_4px_20px_rgba(var(--color-primary),0.25)] hover:shadow-[0_8px_30px_rgba(var(--color-primary),0.35)] hover:scale-[1.03] transition-all flex items-center justify-center gap-2 group">
                Start Free Trial <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <button className="px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-primary dark:text-white rounded-xl font-bold text-lg shadow-sm hover:shadow-md hover:border-primary/30 hover:scale-[1.02] transition-all z-10 relative">
                Watch 60-Second Demo
              </button>
            </div>
            <div className="flex items-center text-sm text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <span className="material-symbols-outlined text-secondary text-lg">check_circle</span> 
                Setup in 5 minutes
              </span>
            </div>
          </div>

          {/* Column 2: Visual Mockup */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full max-w-2xl">
              {/* Floating Notification - Clearly separated with depth */}
              <div className="absolute -top-[37px] left-[60%] -translate-x-1/2 z-40 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15),0_5px_15px_rgba(0,0,0,0.1)] border border-white/50 dark:border-slate-800 flex items-center gap-4 w-[260px] animate-bounce-slow hover:scale-105 transition-transform cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-white shadow-sm">support_agent</span>
                </div>
                <div>
                  <p className="text-xs font-black text-primary dark:text-white tracking-tight">New AI Booking</p>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Reservation from Mike T.</p>
                </div>
              </div>
              
              {/* Main Dashboard Mockup Card */}
              <div className="relative w-full bg-surface-container-lowest rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1),_0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden p-6 z-20 border border-outline-variant/20">
                <div className="flex items-center justify-between mb-6 border-b border-surface-container pb-4">
                  <h3 className="font-bold text-primary text-lg">Customer Management</h3>
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-error/40 transition-colors"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-tertiary-fixed-dim transition-colors"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-secondary-fixed-dim transition-colors"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-5 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl border border-outline-variant/10">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Daily Revenue</p>
                    <p className="text-3xl font-black text-primary drop-shadow-sm">$4,820.00</p>
                  </div>
                  <div className="p-5 bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl border border-outline-variant/10">
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Active Bookings</p>
                    <p className="text-3xl font-black text-secondary drop-shadow-sm">32</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/20 shadow-sm rounded-xl hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary group-hover:scale-110 transition-transform">JB</div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">John B. Trucking</p>
                        <p className="text-xs font-medium text-on-surface-variant">Confirmed 12m ago</p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-black tracking-widest rounded-lg">CHECKED IN</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant/20 shadow-sm rounded-xl hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center font-bold text-tertiary group-hover:scale-110 transition-transform">MT</div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">Mike T. Logistics</p>
                        <p className="text-xs font-medium text-on-surface-variant">Arrival: 10:45 PM</p>
                      </div>
                    </div>
                    <span className="px-3 py-1.5 bg-surface-container-highest text-on-surface-variant text-[10px] font-black tracking-widest rounded-lg">EXPECTED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-20">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary dark:text-white text-xl">keyboard_arrow_down</span>
          </div>
        </div>
      </section>

      {/* Problem Section: Integrated & Grounded */}
      <section className="bg-slate-950 pt-16 pb-36 text-white relative overflow-hidden" id="problem">
        {/* Ambient Dark Background Depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-950 to-black pointer-events-none"></div>
        {/* Radial Danger Glow behind phone */}
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[600px] h-[600px] bg-error/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* Enhanced Content Block */}
          <div className="max-w-xl animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.15] font-['Manrope'] tracking-tight drop-shadow-sm">
              Every Missed Call Is a Booking Your Competitor Just Got
            </h2>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 font-medium">
              It's 2:47 AM. A driver calls looking for overnight parking. Your phone goes to voicemail. He hangs up and books with the lot down the road. You never even knew he called—or how much money you just lost.
            </p>
            
            {/* Upgraded Premium Warning Card */}
            <div className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl group hover:bg-white/10 transition-colors duration-300">
              {/* Subtle Red Edge Accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error/80 shadow-[0_0_15px_rgba(var(--color-error),0.8)]"></div>
              
              <div className="flex gap-5 relative z-10">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center border border-error/20 shadow-inner group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-error text-[24px]">phone_missed</span>
                  </div>
                </div>
                <div>
                  <p className="font-extrabold text-white uppercase tracking-widest text-xs mb-2 opacity-80">The Silent Killer</p>
                  <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed">
                    <strong className="text-white font-bold">68% of drivers won't leave a voicemail.</strong> They just call the next number on Google Maps.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end relative">
            {/* 3D Phone Mockup Container */}
            <div className="relative w-[300px] h-[600px] rounded-[3.5rem] bg-slate-900 p-2 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_4px_4px_rgba(255,255,255,0.1),inset_0_-4px_4px_rgba(0,0,0,0.5)] transform lg:-rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-700 ease-out z-10">
              
              {/* Outer Metallic Bezel Outline */}
              <div className="absolute inset-0 rounded-[3.5rem] border border-slate-700/50 pointer-events-none"></div>
              
              {/* Hardware Buttons */}
              <div className="absolute left-[-2px] top-32 w-1 h-12 bg-slate-800 rounded-l-md border-y border-l border-slate-700 shadow-md"></div>
              <div className="absolute left-[-2px] top-48 w-1 h-12 bg-slate-800 rounded-l-md border-y border-l border-slate-700 shadow-md"></div>
              <div className="absolute right-[-2px] top-40 w-1 h-16 bg-slate-800 rounded-r-md border-y border-r border-slate-700 shadow-md"></div>

              {/* Screen Bezel & Display area */}
              <div className="w-full h-full rounded-[3rem] bg-slate-950 overflow-hidden relative border-[6px] border-black/90 shadow-[inset_0_0_20px_rgba(0,0,0,1)] flex flex-col items-center">
                
                {/* Dynamic Camera Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex justify-end items-center pr-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)] border border-white/5">
                  <div className="w-3 h-3 rounded-full bg-slate-800/80 shadow-[inset_0_0_2px_rgba(0,0,0,1)] flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-500/30"></div>
                  </div>
                </div>

                {/* Subtle Screen Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none z-30"></div>

                {/* Screen UI Content */}
                <div className="relative z-10 w-full h-full flex flex-col pt-14 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black">
                  
                  {/* Status Bar */}
                  <div className="flex justify-between items-center w-full px-2 mb-16 text-white/90">
                    <span className="text-[11px] font-bold tracking-wide">2:47</span>
                    <div className="flex gap-1.5 items-center">
                      <span className="material-symbols-outlined text-[14px]">signal_cellular_4_bar</span>
                      <span className="material-symbols-outlined text-[14px]">wifi</span>
                      <span className="material-symbols-outlined text-[14px]">battery_full</span>
                    </div>
                  </div>

                  {/* Caller ID Area */}
                  <div className="flex-1 flex flex-col items-center">
                    {/* Glowing Avatar */}
                    <div className="relative mb-8">
                       <div className="absolute inset-0 bg-error/20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                       <div className="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center border-2 border-slate-600/50 shadow-2xl relative z-10">
                          <span className="material-symbols-outlined text-slate-300 text-5xl drop-shadow-lg">person</span>
                       </div>
                    </div>
                    
                    <p className="text-2xl font-extrabold text-white mb-1 tracking-tight drop-shadow-md">Unknown Driver</p>
                    <p className="text-slate-400 text-sm font-medium">Potential Booking</p>
                  </div>

                  {/* Missed Call Banner inside screen */}
                  <div className="w-full bg-error/10 border border-error/30 p-4 rounded-xl flex items-center gap-4 backdrop-blur-md shadow-2xl mb-8 transform -translate-y-2">
                    <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center text-error border border-error/20 shadow-inner">
                      <span className="material-symbols-outlined text-lg">phone_missed</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-error drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">Missed Call</p>
                      <p className="text-[11px] text-error/80 font-medium">Call ended at 2:48 AM</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-36 px-6 overflow-hidden bg-white dark:bg-slate-950" id="how-it-works">
        {/* Immersive Section Background Features */}
        <div className="absolute top-0 left-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none animate-ambient-drift" style={{animationDelay: '-10s'}}></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none animate-ambient-drift" style={{animationDelay: '-5s'}}></div>
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideFadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up {
            opacity: 0;
            animation: slideFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        `}} />
        
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl font-bold text-primary mb-4 font-['Manrope']">From Missed Call to Booked Spot in 30 Seconds</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto italic">High-performance booking flow comparison</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Old Way Timeline */}
          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 flex flex-col h-full animate-slide-up" style={{animationDelay: '100ms'}}>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center font-bold">X</span>
              <h3 className="text-xl font-bold text-primary uppercase tracking-tight font-['Manrope']">The Old Way</h3>
            </div>
            <div className="space-y-2 relative flex-1">
              {/* Timeline Spine */}
              <div className="absolute left-[19px] top-4 bottom-8 w-0.5 bg-outline-variant/30"></div>
              
              <TimelineStep 
                time="2:47 AM" 
                title="Driver calls. You're asleep." 
                detail="The phone goes to your generic voicemail. The driver is looking for an immediate answer and moves on." 
                icon="schedule" 
                isAi={false} 
                index={0} 
              />
              <TimelineStep 
                time="4:00 AM" 
                title="Driver books across town instead." 
                detail="Drivers rarely wait for business hours. They call the next lot on Google Maps and give them the revenue instead." 
                icon="voicemail" 
                isAi={false} 
                index={1} 
              />
              <TimelineStep 
                time="9:00 AM" 
                title="Booking permanently lost." 
                detail="You wake up, check your voicemail, and try calling back. It's too late to recover the customer." 
                icon="mail" 
                isAi={false} 
                index={2} 
              />
            </div>
            <div className="mt-8 p-4 bg-error-container/30 border border-error/20 rounded-xl hover:bg-error-container/50 transition-colors">
              <p className="text-error font-extrabold text-center tracking-wide text-sm">TOTAL TIME: 6+ HOURS (LOST REVENUE)</p>
            </div>
          </div>
          
          {/* New Way Timeline */}
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-xl border-2 border-secondary/20 flex flex-col h-full animate-slide-up" style={{animationDelay: '300ms'}}>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(var(--color-secondary),0.5)]">✓</span>
              <h3 className="text-xl font-bold text-primary uppercase tracking-tight font-['Manrope']">The ParkAI Way</h3>
            </div>
            <div className="space-y-2 relative flex-1">
              {/* Timeline Spine (Glowing) */}
              <div className="absolute left-[19px] top-4 bottom-8 w-0.5 bg-gradient-to-b from-secondary/50 to-primary/20"></div>
              
              <TimelineStep 
                time="2:47:00 AM" 
                title="Driver calls. AI answers instantly." 
                detail="Within two seconds, ParkAI picks up the phone with a natural voice, fully aware of your lot's current capacity and pricing." 
                icon="phone_in_talk" 
                isAi={true} 
                index={0} 
              />
              <TimelineStep 
                time="2:47:15 AM" 
                title="AI checks rules & quotes price." 
                detail="The driver asks about reefer parking. The AI confirms it's permitted, quotes the overnight rate, and secures the booking automatically." 
                icon="check_circle" 
                isAi={true} 
                index={1} 
              />
              <TimelineStep 
                time="2:47:30 AM" 
                title="Spot confirmed. Dashboard updated." 
                detail="The spot is logged in your system immediately. You wake up the next morning with another paid reservation already on the books." 
                icon="notifications_active" 
                isAi={true} 
                index={2} 
              />
            </div>
            <div className="mt-8 p-6 bg-gradient-to-r from-secondary-fixed/50 to-primary-fixed/50 border-2 border-secondary/30 rounded-xl shadow-[0_0_30px_rgba(var(--color-secondary),0.15)] relative overflow-hidden group cursor-default">
              <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s] ease-in-out"></div>
              <p className="text-secondary font-black text-center uppercase tracking-widest drop-shadow-sm text-lg">Total Time: 30 Seconds (Booked!)</p>
            </div>
          </div>
          
          </div>
          
        </div>
      </section>

      {/* Key Features */}
      <section className="relative py-36 px-6 bg-slate-50 dark:bg-slate-900/50 overflow-hidden border-t border-slate-200 dark:border-slate-800 shadow-[inset_0_4px_40px_rgba(0,0,0,0.02)]" id="features">
        {/* Soft framing via pseudo-edge gradients */}
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-surface to-transparent -z-10"></div>
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-surface to-transparent -z-10"></div>
        
        <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-primary mb-4 font-['Manrope'] pr-1.5">Everything You Need to Run Your Lot on Autopilot</h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto font-medium">Enterprise-grade AI calls management, inventory tracking, and driver support.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="p-12 bg-surface-container-low rounded-xl group hover:bg-surface-container-lowest transition-all hover:shadow-xl border border-transparent hover:border-outline-variant/20">
            <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">family_restroom</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-['Manrope']">Answers Every Call—Even During Family Dinner</h3>
            <p className="text-on-surface-variant leading-relaxed">Stop letting work interrupt your life. Our AI maintains a 100% answer rate, ensuring no driver is left hanging while you're focused on what matters.</p>
          </div>
          <div className="p-12 bg-surface-container-low rounded-xl group hover:bg-surface-container-lowest transition-all hover:shadow-xl border border-transparent hover:border-outline-variant/20">
            <div className="w-12 h-12 bg-secondary text-white rounded-lg flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">speed</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-['Manrope']">Books Spots in 30 Seconds—Not 3 Hours</h3>
            <p className="text-on-surface-variant leading-relaxed">Efficiency is the name of the game. Drivers get answers instantly, prices immediately, and a booking confirmation before they even shift gears.</p>
          </div>
          <div className="p-12 bg-surface-container-low rounded-xl group hover:bg-surface-container-lowest transition-all hover:shadow-xl border border-transparent hover:border-outline-variant/20">
            <div className="w-12 h-12 bg-tertiary-container text-tertiary-fixed rounded-lg flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">dashboard</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-['Manrope']">See Every Booking The Second It Happens</h3>
            <p className="text-on-surface-variant leading-relaxed">Stay in total control with a real-time dashboard. No manual data entry, no paper logs. Just clean, accurate records of every truck entering your lot.</p>
          </div>
          <div className="p-12 bg-surface-container-low rounded-xl group hover:bg-surface-container-lowest transition-all hover:shadow-xl border border-transparent hover:border-outline-variant/20">
            <div className="w-12 h-12 bg-outline text-white rounded-lg flex items-center justify-center mb-6">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-['Manrope']">Handles "Do You Allow Reefers?" And 20 Other Questions</h3>
            <p className="text-on-surface-variant leading-relaxed">Our AI doesn't just book; it knows your rules. Whether it's hazardous materials, reefer units, or height limits, the AI gives accurate answers every time.</p>
          </div>
        </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-36 px-6 bg-surface-container-low border-y border-outline-variant/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto bg-surface-container-lowest p-12 rounded-3xl shadow-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-2 font-['Manrope']">How Many Bookings Are You Missing?</h2>
            <p className="text-on-surface-variant">The numbers might surprise you. Calculate your potential growth.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-primary mb-4">How many calls do you typically miss per week?</label>
                <input 
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary" 
                  max="50" 
                  min="1" 
                  type="range" 
                  value={missedCalls} 
                  onChange={(e) => setMissedCalls(e.target.value)} 
                />
                <div className="flex justify-between mt-2 text-xs font-bold text-on-surface-variant">
                  <span>1 CALL</span>
                  <span className="bg-secondary text-white px-2 py-1 rounded">{missedCalls} CALLS</span>
                  <span>50 CALLS</span>
                </div>
              </div>
              <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant/20">
                <p className="text-xs font-bold text-on-surface-variant uppercase mb-2">Industry Average</p>
                <p className="text-sm">Each missed truck parking booking represents roughly <span className="font-bold">$150</span> in immediate revenue.</p>
              </div>
            </div>
            <div className="bg-primary p-8 rounded-2xl text-white">
              <p className="text-sm font-medium text-on-primary-container mb-6">POTENTIAL BOOKINGS LOST</p>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-sm text-on-primary-container">Weekly</span>
                  <span className="text-3xl font-bold">${Intl.NumberFormat('en-US').format(weeklyRevenueLost)}</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-sm text-on-primary-container">Monthly</span>
                  <span className="text-3xl font-bold">${Intl.NumberFormat('en-US').format(monthlyRevenueLost)}</span>
                </div>
                <div className="flex justify-between items-end pb-4">
                  <span className="text-sm text-on-primary-container">Yearly</span>
                  <span className="text-4xl font-extrabold text-secondary-fixed">${Intl.NumberFormat('en-US').format(yearlyRevenueLost)}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-8 text-xs text-on-surface-variant text-center">
            Disclaimer: This calculator shows potential bookings based on industry averages... ParkAI helps you answer more calls—revenue depends on your lot's demand.
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative py-36 px-6 overflow-hidden">
        {/* Deep background ambient shift */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none animate-ambient-drift"></div>
        <div className="max-w-[1400px] mx-auto relative z-10">
        <h2 className="text-center text-3xl font-bold text-primary mb-16 font-['Manrope']">What Lot Owners Tell Us During Demos</h2>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-24">
          <div className="p-8 border border-outline-variant rounded-xl italic text-on-surface">
            "I was skeptical about AI... but this is just like having an employee who never sleeps. I can actually enjoy dinner with my family now knowing my lot is still filling up."
            <div className="mt-6 flex items-center gap-3 not-italic">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest"></div>
              <div>
                <p className="font-bold text-sm">Dave R.</p>
                <p className="text-xs text-on-surface-variant">Logistics Lot Owner</p>
              </div>
            </div>
          </div>
          <div className="p-8 border border-outline-variant rounded-xl italic text-on-surface">
            "I used to find 5-6 missed calls every morning. Now those are 5-6 reservations waiting for me when I log in at 8 AM. It paid for itself in the first two nights."
            <div className="mt-6 flex items-center gap-3 not-italic">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest"></div>
              <div>
                <p className="font-bold text-sm">Mark S.</p>
                <p className="text-xs text-on-surface-variant">Metro Parking Hub</p>
              </div>
            </div>
          </div>
          <div className="p-8 border border-outline-variant rounded-xl italic text-on-surface">
            "The AI knows all my rules about hazardous materials and reefer units. It's more reliable than my last night-shift hire and costs a fraction of the price."
            <div className="mt-6 flex items-center gap-3 not-italic">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest"></div>
              <div>
                <p className="font-bold text-sm">Kevin L.</p>
                <p className="text-xs text-on-surface-variant">Interstate Truck Stop</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 py-16 border-y border-outline-variant/20">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-secondary mb-2">100%</p>
            <p className="text-sm font-bold text-primary uppercase">Call Answer Rate</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-secondary mb-2">30s</p>
            <p className="text-sm font-bold text-primary uppercase">Avg Booking Time</p>
          </div>
          <div className="text-center col-span-2 md:col-span-1">
            <p className="text-4xl font-extrabold text-secondary mb-2">24/7</p>
            <p className="text-sm font-bold text-primary uppercase">Uptime Guaranteed</p>
          </div>
        </div>
        </div>
      </section>

      {/* Pricing Section (Clean & Integrated) */}
      <section className="relative py-36 px-6 bg-slate-50 dark:bg-slate-900/40 overflow-hidden border-y border-slate-200/50 dark:border-slate-800" id="pricing">
        {/* Complex pricing background ambiance */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-gradient-to-r from-primary/5 via-secondary/5 to-tertiary/5 rounded-full blur-[140px] -z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[120px] -z-10 pointer-events-none animate-ambient-drift" style={{animationDelay: '-8s'}}></div>
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-['Manrope']">Simple Pricing. No Surprises.</h2>
            <p className="text-on-surface-variant">One plan. Everything included. Professional scale.</p>
          </div>
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            <div className="p-10 bg-white rounded-2xl shadow-xl border-2 border-secondary relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-bl-lg">Most Popular</div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-primary mb-4 font-['Manrope']">ParkAI Standard</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-primary">$200</span>
                  <span className="text-on-surface-variant">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Unlimited calls &amp; bookings</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Real-time dashboard access</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Natural-sounding AI voice</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Instant setup (under 5 mins)</li>
                <li className="flex items-center gap-3"><span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> SMS confirmations for drivers</li>
              </ul>
              <Link to="/onboarding" className="block text-center w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-colors">Start Free Trial</Link>
            </div>
            <div className="p-10 bg-surface-container-highest/50 rounded-2xl border border-outline-variant/30 flex flex-col justify-center">
              <h4 className="text-xl font-bold text-primary mb-6 text-center font-['Manrope']">Cost Comparison</h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-error-container/20 rounded-lg">
                  <span className="font-medium text-error">Hiring Part-Time Help</span>
                  <span className="font-bold text-error">$1,200/mo</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-secondary-fixed/30 rounded-lg border-2 border-secondary/20">
                  <span className="font-bold text-secondary">ParkAI (Unlimited)</span>
                  <span className="font-extrabold text-secondary">$200/mo</span>
                </div>
                <div className="text-center pt-4">
                  <p className="text-2xl font-extrabold text-primary">83% Monthly Savings</p>
                  <p className="text-sm text-on-surface-variant">No training, no sick days, no taxes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-36 px-6 max-w-3xl mx-auto" id="faq">
        <h2 className="text-3xl font-bold text-center mb-12 font-['Manrope']">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              id: 'ai-voice',
              q: "Will drivers know it's AI?",
              a: "Our voice technology is highly natural. Most drivers just appreciate how quickly they get an answer. If they ask, the AI can honestly state it's an automated assistant here to help them book quickly."
            },
            {
              id: 'mistake',
              q: "What if it makes a mistake?",
              a: "The AI follows strict logic provided by you. If it encounters a complex situation it can't handle, it politely informs the driver that a manager will call them back and instantly notifies you."
            },
            {
              id: 'number',
              q: "Do I need a new phone number?",
              a: "No. You simply set your current phone line to \"Forward on Busy\" or \"Forward on No Answer\" to your unique ParkAI number. It works seamlessly with your existing setup."
            },
            {
              id: 'full-lot',
              q: "What if my lot is full?",
              a: "The AI has real-time access to your inventory. If you're full, it will politely inform the driver and offer to put them on a waiting list or suggest they call back later, saving you the time of answering to say \"no.\""
            }
          ].map((faq) => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </div>
      </section>

      {/* Final CTA (Restored Flow) */}
      <section className="py-36 px-6 relative">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-primary via-primary-container to-secondary p-12 rounded-[2.5rem] text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 font-['Manrope']">Ready to Answer Every Call?</h2>
            <p className="text-xl text-on-primary-container mb-10 max-w-2xl mx-auto">
              Join lot owners who never miss a booking—even at 2 AM, even on Christmas morning.
            </p>
            <Link to="/onboarding" className="inline-block px-10 py-5 bg-white text-primary rounded-xl font-extrabold text-xl shadow-2xl hover:scale-105 transition-all mb-8">
              Start Earning in 5 Minutes →
            </Link>
            <div className="max-w-md mx-auto p-4 bg-white/10 backdrop-blur rounded-lg border border-white/20">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary-fixed mb-1">Our Risk-Free Guarantee</p>
              <p className="text-sm leading-relaxed">If ParkAI doesn't answer at least one call you would have missed in 14 days, we'll refund your first month and send you $50.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 py-12 border-t border-slate-100 dark:border-slate-800 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 max-w-[1400px] mx-auto">
          <div className="col-span-1 md:col-span-1">
            <div className="text-lg font-bold text-slate-900 dark:text-white mb-4 font-['Manrope']">TruckPark AI</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Operational Excellence for Fleet Managers and Lot Owners.</p>
          </div>
          <div>
            <p className="font-bold text-primary mb-4">Product</p>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#features">Features</a></li>
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#pricing">Pricing</a></li>
              <li><Link className="hover:text-slate-900 dark:hover:text-white transition-colors" to="/onboarding">Demo</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-primary mb-4">Support</p>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Contact Support</a></li>
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">System Status</a></li>
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Help Center</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-primary mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-8">
          © 2026 TruckPark AI. Operational Excellence for Fleet Managers.
        </div>
      </footer>
    </main>
  );
}
