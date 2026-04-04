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
  // Custom animation styles for staggered entry
  const animationDelay = `${index * 200 + (isAi ? 400 : 200)}ms`;

  return (
    <div 
      className={`flex gap-6 relative p-5 rounded-[2rem] transition-all duration-700 animate-slide-up z-10
        ${isAi 
          ? 'bg-white border border-slate-200/50 shadow-sm hover:shadow-md hover:-translate-y-1 group hover:bg-slate-50' 
          : 'bg-white border border-slate-200/50 shadow-sm hover:shadow-md hover:-translate-y-1 group hover:bg-[#FFF9F9]'
        }`}
      style={{ animationDelay }}
    >
      <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center z-20 transition-all duration-700
        ${isAi 
          ? 'bg-secondary text-white shadow-md group-hover:scale-110 group-hover:rotate-3' 
          : 'bg-[#D04E3A] text-white shadow-md group-hover:bg-[#C03E2A] group-hover:scale-105'
        }`}
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <div className="flex-1 pt-1.5">
        <div className="flex justify-between items-center mb-1 relative">
          <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${isAi ? 'text-secondary' : 'text-[#D04E3A]'}`}>{time}</p>
        </div>
        <p className={`text-lg font-black leading-tight mb-2 font-['Manrope'] text-slate-900`}>{title}</p>
        
        <p className={`text-sm leading-relaxed font-semibold transition-colors ${isAi ? 'text-slate-500' : 'text-slate-500 group-hover:text-slate-600'}`}>
          {detail}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, colorClass, delay }) {
  return (
    <div 
      className="p-10 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] hover:-translate-y-2 group relative overflow-hidden animate-slide-up"
      style={{ animationDelay: delay }}
    >
      {/* Subtle corner accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-transparent group-hover:to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
      
      <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-lg`}>
        <span className="material-symbols-outlined text-2xl font-black">{icon}</span>
      </div>
      
      <h3 className="text-2xl font-black mb-4 font-['Manrope'] text-slate-900 leading-tight group-hover:text-primary transition-colors">
        {title}
      </h3>
      
      <p className="text-slate-500 leading-relaxed font-semibold text-sm mb-0">
        {description}
      </p>
    </div>
  );
}

function TestimonialCard({ quote, author, title, avatar, delay }) {
  return (
    <div 
      className="p-10 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl group relative animate-slide-up antialiased"
      style={{ animationDelay: delay }}
    >
      <p className="text-gray-900 text-lg leading-relaxed italic font-medium mb-10 relative z-10 antialiased">
        "{quote}"
      </p>
      
      <div className="flex items-center gap-4 border-t border-slate-200/50 pt-8 mt-auto">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-slate-100 group-hover:ring-primary/20 transition-all">
          <img src={avatar} alt={author} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-black text-slate-900 font-['Manrope'] antialiased">{author}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest antialiased">{title}</p>
        </div>
      </div>
    </div>
  );
}

function StatItem({ value, label, delay }) {
  return (
    <div className="text-center group animate-slide-up" style={{ animationDelay: delay }}>
      <p className="text-6xl font-black text-secondary mb-3 transition-transform group-hover:scale-110 duration-500">{value}</p>
      <p className="text-xs font-black text-primary uppercase tracking-[0.25em]">{label}</p>
    </div>
  );
}

function AnimatedNumber({ value, prefix = "", suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    
    const duration = 400;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(start + (end - start) * progress);
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <>{prefix}{Intl.NumberFormat('en-US').format(displayValue)}{suffix}</>;
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
            <Link to="/signin" className="text-slate-600 dark:text-slate-400 hover:text-blue-700 font-medium text-sm">Log In</Link>
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
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 flex flex-col h-full animate-slide-up shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 group relative" style={{animationDelay: '100ms'}}>
            <div className="flex items-center gap-5 mb-12">
              <span className="w-14 h-14 rounded-2xl bg-[#D04E3A] text-white flex items-center justify-center font-black shadow-lg transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined font-black">close</span>
              </span>
              <h3 className="text-2xl font-black text-[#D04E3A] uppercase tracking-[0.15em] font-['Manrope']">The Old Way</h3>
            </div>
            <div className="space-y-8 relative flex-1">
              {/* Timeline Spine */}
              <div className="absolute left-[47px] top-12 bottom-16 w-1.5 bg-[#D04E3A]/10 rounded-full z-0"></div>
              
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
            <div className="mt-12 h-28 flex items-center justify-center p-8 bg-[#D04E3A] shadow-xl rounded-[2rem] transition-all group-hover:shadow-2xl border border-white/10">
              <p className="text-white font-black text-center uppercase tracking-[0.15em] text-sm">TOTAL TIME: 6+ HOURS (LOST REVENUE)</p>
            </div>
          </div>
          
          {/* New Way Timeline */}
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 flex flex-col h-full animate-slide-up shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] hover:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 relative overflow-hidden group" style={{animationDelay: '300ms'}}>
            <div className="flex items-center gap-5 mb-12 relative z-10">
              <span className="w-14 h-14 rounded-2xl bg-secondary text-white flex items-center justify-center font-black shadow-lg transition-transform group-hover:rotate-6">
                <span className="material-symbols-outlined font-black">check</span>
              </span>
              <h3 className="text-2xl font-black text-primary uppercase tracking-[0.15em] font-['Manrope']">The ParkAI Way</h3>
              <span className="ml-auto px-4 py-1.5 bg-secondary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">The Winner</span>
            </div>
            <div className="space-y-8 relative flex-1 z-10">
              {/* Timeline Spine (Glowing Gradient) */}
              <div className="absolute left-[47px] top-12 bottom-16 w-1.5 bg-gradient-to-b from-secondary via-secondary/40 to-primary/10 rounded-full shadow-[0_0_15px_rgba(var(--color-secondary),0.1)]"></div>
              
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
            <div className="mt-12 h-28 flex items-center justify-center p-8 bg-secondary shadow-xl rounded-[2rem] relative overflow-hidden group cursor-pointer border border-white/10 transition-all group-hover:shadow-2xl">
              <p className="text-white font-black text-center uppercase tracking-[0.15em] text-sm z-10">Total Time: 30 Seconds (Booked!)</p>
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
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          <FeatureCard 
            icon="family_restroom"
            title="Answers Every Call—Even During Family Dinner"
            description="Stop letting work interrupt your life. Our AI maintains a 100% answer rate, ensuring no driver is left hanging while you're focused on what matters."
            colorClass="bg-red-50 text-[#D04E3A]"
            delay="100ms"
          />
          <FeatureCard 
            icon="speed"
            title="Books Spots in 30 Seconds—Not 3 Hours"
            description="Efficiency is the name of the game. Drivers get answers instantly, prices immediately, and a booking confirmation before they even shift gears."
            colorClass="bg-blue-50 text-secondary"
            delay="200ms"
          />
          <FeatureCard 
            icon="dashboard"
            title="See Every Booking The Second It Happens"
            description="Stay in total control with a real-time dashboard. No manual data entry, no paper logs. Just clean, accurate records of every truck entering your lot."
            colorClass="bg-indigo-50 text-indigo-600"
            delay="300ms"
          />
          <FeatureCard 
            icon="psychology"
            title="Handles 'Do You Allow Reefers?' And 20 Other Questions"
            description="Our AI doesn't just book; it knows your rules. Whether it's hazardous materials, reefer units, or height limits, the AI gives accurate answers every time."
            colorClass="bg-emerald-50 text-emerald-600"
            delay="400ms"
          />
        </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="w-full py-28 bg-[radial-gradient(circle_at_30%_40%,#0B1F3A_0%,#020617_100%)] overflow-hidden">
        <style dangerouslySetInnerHTML={{__html: `
          input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #ffffff;
            cursor: pointer;
          }
        `}} />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row gap-16 px-6">
          
          {/* LEFT: Control Side */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="font-['Manrope'] font-bold text-white tracking-tight leading-tight mb-4 text-4xl" style={{ letterSpacing: '-0.03em' }}>
              How Much Revenue Are You Losing Every Week?
            </h2>
            <p className="font-sans text-[#94A3B8] leading-relaxed max-w-[420px] text-lg mb-10">
              Every missed call is a driver choosing another lot. This is real revenue leaving your business.
            </p>

            <div className="w-full relative">
              <input 
                className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer" 
                max="50" 
                min="1" 
                type="range" 
                value={missedCalls} 
                onChange={(e) => setMissedCalls(e.target.value)} 
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(missedCalls - 1) / 49 * 100}%, #374151 ${(missedCalls - 1) / 49 * 100}%, #374151 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1</span>
                <span>10</span>
                <span>25</span>
                <span>50</span>
              </div>
              
              <div className="text-sm font-semibold text-blue-400 mt-3">
                You're losing ≈ ${Intl.NumberFormat('en-US').format(weeklyRevenueLost)} per week
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-[1px] bg-white/10 mx-4"></div>

          {/* RIGHT: Consequence Side */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="bg-gradient-to-br from-[#020617] to-[#0B1F3A] p-10 rounded-2xl border border-white/5 shadow-2xl relative">
              <div className="space-y-6 border-b border-white/10 pb-8 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-gray-400">Weekly Potential</span>
                  <span className="text-2xl font-bold text-white transition-all duration-200">
                    ${Intl.NumberFormat('en-US').format(weeklyRevenueLost)}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-400">Monthly Potential</span>
                  <span className="text-2xl font-bold text-white transition-all duration-200">
                    ${Intl.NumberFormat('en-US').format(monthlyRevenueLost)}
                  </span>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">
                  Annual Revenue Lost (Conservative Estimate)
                </div>
                <div 
                  className="text-5xl font-bold text-blue-400 transition-all duration-300" 
                  style={{ textShadow: "0 0 20px rgba(59,130,246,0.3)" }}
                >
                  ${Intl.NumberFormat('en-US').format(yearlyRevenueLost)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Social Proof */}
      <section className="relative py-48 px-6 overflow-hidden bg-white antialiased" id="social-proof">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[180px] -z-10 pointer-events-none animate-ambient-drift"></div>
        
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-primary mb-6 font-['Manrope'] tracking-tight">What Lot Owners Tell Us During Demos</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-semibold">Join dozens of lot owners who have recovered their nights and boosted their revenue with ParkAI.</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 mb-32 items-stretch">
            <TestimonialCard 
              quote="I was skeptical about AI... but this is just like having an employee who never sleeps. I can actually enjoy dinner with my family now knowing my lot is still filling up."
              author="Dave R."
              title="Logistics Lot Owner"
              avatar="https://ui-avatars.com/api/?name=Dave+R&background=0c2f75&color=fff"
              delay="100ms"
            />
            <TestimonialCard 
              quote="I used to find 5-6 missed calls every morning. Now those are 5-6 reservations waiting for me when I log in at 8 AM. It paid for itself in the first two nights."
              author="Mark S."
              title="Metro Parking Hub"
              avatar="https://ui-avatars.com/api/?name=Mark+S&background=0c2f75&color=fff"
              delay="200ms"
            />
            <TestimonialCard 
              quote="The AI knows all my rules about hazardous materials and reefer units. It's more reliable than my last night-shift hire and costs a fraction of the price."
              author="Kevin L."
              title="Interstate Truck Stop"
              avatar="https://ui-avatars.com/api/?name=Kevin+L&background=0c2f75&color=fff"
              delay="300ms"
            />
          </div>
          
          <div className="py-24 border-t border-slate-200/60 bg-slate-50/50 rounded-[4rem] group">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24 px-12">
              <StatItem value="100%" label="Call Answer Rate" delay="400ms" />
              <StatItem value="30s" label="Avg Booking Time" delay="500ms" />
              <StatItem value="24/7" label="Reliability" delay="600ms" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Clean & Integrated) */}
      <section className="relative py-36 px-6 bg-slate-50 overflow-hidden border-y border-slate-200/50" id="pricing">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-['Manrope']">Simple Pricing. No Surprises.</h2>
            <p className="text-on-surface-variant font-medium">One plan. Everything included. Professional scale.</p>
          </div>
          
          <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
            {/* Left Pricing Card (Restored) */}
            <div className="p-10 bg-white rounded-3xl shadow-xl border-2 border-secondary relative overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl">
              <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-bl-xl">Most Popular</div>
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-primary mb-4 font-['Manrope']">ParkAI Standard</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold text-primary tracking-tight">$200</span>
                  <span className="text-on-surface-variant font-semibold">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  "Unlimited calls & bookings",
                  "Real-time dashboard access",
                  "Natural-sounding AI voice",
                  "Instant setup (under 5 mins)",
                  "SMS confirmations for drivers"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/onboarding" className="block text-center w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-all shadow-md active:scale-95">
                Start Free Trial
              </Link>
              <p className="mt-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">No credit card required</p>
            </div>

            {/* Right Cost Comparison (Cleaned up) */}
            <div className="p-10 bg-white/40 rounded-3xl border border-slate-200/60 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-8">
                <span className="material-symbols-outlined text-primary text-lg">insights</span>
                <h4 className="text-xl font-bold text-primary font-['Manrope'] tracking-tight">Cost Comparison</h4>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-6 bg-white/50 border border-slate-200 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hiring Part-Time Help</span>
                    <span className="font-semibold text-slate-700 text-sm">Monthly Labor Cost</span>
                  </div>
                  <span className="text-xl font-bold text-slate-400">$1,200/mo</span>
                </div>
                
                <div className="flex justify-between items-center p-6 bg-secondary-fixed/20 border-2 border-secondary/20 rounded-2xl relative">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">The ParkAI Way</span>
                    <span className="font-bold text-slate-900 text-sm">Unlimited AI Management</span>
                  </div>
                  <span className="text-xl font-extrabold text-secondary">$200/mo</span>
                </div>
                
                <div className="pt-8 text-center border-t border-slate-200 mt-2">
                  <p className="text-3xl font-black text-primary mb-2 font-['Manrope']">83% Monthly Savings</p>
                  <p className="text-sm font-medium text-on-surface-variant max-w-[280px] mx-auto leading-relaxed">
                    No training, no sick days, no taxes. <br /> Recover your nights starting tonight.
                  </p>
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
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 py-12 border-t border-slate-100 dark:border-slate-800 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6 max-w-[1400px] mx-auto">
          <div className="col-span-1">
            <div className="text-lg font-bold text-slate-900 dark:text-white mb-4 font-['Manrope']">TruckPark AI</div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Operational Excellence for Fleet Managers and Lot Owners.</p>
          </div>
          <div>
            <p className="font-bold text-primary mb-4">Product</p>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#features">Features</a></li>
              <li><a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-primary mb-4">Legal</p>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link className="hover:text-slate-900 dark:hover:text-white transition-colors" to="/privacy">Privacy Policy</Link></li>
              <li><Link className="hover:text-slate-900 dark:hover:text-white transition-colors" to="/terms">Terms of Service</Link></li>
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
