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

  const faqs = [
    {
      q: "Will drivers know it's AI?",
      a: "Our voice technology is highly natural. Most drivers just appreciate how quickly they get an answer. If they ask, the AI can honestly state it's an automated assistant here to help them book quickly."
    },
    {
      q: "What if it makes a mistake?",
      a: "The AI follows strict logic provided by you. If it encounters a complex situation it can't handle, it politely informs the driver that a manager will call them back and instantly notifies you."
    },
    {
      q: "Do I need a new phone number?",
      a: "No. You simply set your current phone line to \"Forward on Busy\" or \"Forward on No Answer\" to your unique ParkAI number. It works seamlessly with your existing setup."
    },
    {
      q: "What if my lot is full?",
      a: "The AI has real-time access to your inventory. If you're full, it will politely inform the driver and offer to put them on a waiting list or suggest they call back later, saving you the time of answering to say \"no.\""
    }
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
      <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[90vh] flex flex-col justify-center">
        {/* Depth layers */}
        <div className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-secondary/[0.03] to-transparent pointer-events-none" aria-hidden="true"></div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 70% at 72% 50%, rgba(99,102,241,0.045) 0%, transparent 70%)' }} aria-hidden="true"></div>
        
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-8 xl:gap-16 items-center">

          {/* LEFT: Copy */}
          <div className="relative z-10 max-w-xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/10 border border-secondary/20 rounded-full text-xs font-bold tracking-widest uppercase text-secondary mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse inline-block"></span>
              AI-Powered Lot Management
            </div>

            <h1 className="font-headline font-extrabold text-primary tracking-tight mb-6 leading-[1.08]" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.625rem)' }}>
              Never Miss a Booking<br/><span className="text-primary" style={{ fontWeight: 800 }}>— </span><span className="text-secondary">Even at 3 AM</span>
            </h1>

            <p className="text-lg text-on-surface-variant leading-relaxed mb-10 max-w-[460px] font-medium">
              ParkAI answers every call, checks real-time availability, and confirms reservations automatically — so your lot keeps filling while you're off the clock.
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-10">
              <Link to="/onboarding" className="inline-flex items-center gap-2.5 px-9 py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:bg-secondary hover:shadow-xl transition-all duration-300 active:scale-95 group">
                Start Free Trial
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <button className="inline-flex items-center gap-3 px-6 py-4 text-on-surface-variant rounded-xl font-bold text-lg hover:text-primary transition-all group">
                <span className="material-symbols-outlined text-2xl text-secondary group-hover:scale-110 transition-transform">play_circle</span>
                Watch Demo
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 opacity-70">
              <span className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                No credit card
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                5 min setup
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Cancel anytime
              </span>
            </div>
          </div>

          {/* RIGHT: Product Mockup */}
          <div className="relative flex items-center justify-center lg:justify-end animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="relative w-full max-w-[540px] bg-white rounded-2xl shadow-2xl border border-slate-200/70 overflow-hidden transform hover:-translate-y-2 transition-transform duration-700">
              {/* Chrome bar */}
              <div className="flex items-center px-4 py-3 bg-slate-50 border-b border-slate-100 gap-2">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="flex-1 text-center text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">TruckPark AI — Live Dashboard</div>
              </div>

              {/* Dashboard body */}
              <div className="p-6 space-y-4">
                {/* AI Active Call Panel */}
                <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
                        <span className="material-symbols-outlined text-white text-xl">support_agent</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-primary tracking-[0.15em] uppercase">AI Answering Now</p>
                        <p className="text-xs font-bold text-on-surface-variant">+1 (312) 555-0184</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/25 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                      <span className="text-[9px] font-black text-secondary tracking-widest">LIVE</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-[11px] leading-relaxed bg-white rounded-xl px-4 py-3 border border-slate-100 shadow-inner relative z-10 font-medium">
                    <div className="flex gap-3">
                      <span className="text-slate-400 font-bold w-12 shrink-0">Driver:</span>
                      <span className="text-on-surface">"Do you have overnight spots available tonight?"</span>
                    </div>
                    <div className="flex gap-3 border-t border-slate-50 pt-2">
                      <span className="text-secondary font-black w-12 shrink-0">AI:</span>
                      <span className="text-on-surface">"Yes — 4 spots open at $65/night. Want me to book one?"</span>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-secondary/20 transition-all">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tonight's Revenue</p>
                    <p className="text-2xl font-black text-primary leading-none group-hover:text-secondary transition-colors">$3,510</p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">trending_up</span> 12% vs. last week
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Occupancy</p>
                    <p className="text-2xl font-black text-primary leading-none">27 / 32</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-2">4 spots currently open</p>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Recent AI Bookings</p>
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50/50 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center">JB</div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">John B. Trucking</p>
                        <p className="text-[10px] text-slate-400 font-medium">Spot A1 &middot; Confirmed 4m ago</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-lg">CONFIRMED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating confirmation toast */}
            <div className="absolute -bottom-6 right-0 z-30 bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-2xl border border-slate-100 animate-slide-up" style={{ animationDelay: '800ms' }}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
              </div>
              <div>
                <p className="text-xs font-black text-primary leading-none mb-1">Booking Confirmed</p>
                <p className="text-[11px] text-slate-400 font-bold">Spot A3 &middot; Just Now</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section: Integrated & Grounded */}
      <section className="bg-slate-950 pt-16 pb-36 text-white relative overflow-hidden" id="problem" style={{ background: 'linear-gradient(175deg, #0d1730 0%, #050f36 40%, #030b28 100%)' }}>
        {/* Depth layer stack */}
        
        {/* Top-edge feather */}
        <div className="absolute inset-x-0 top-0 h-16 pointer-events-none z-10" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.04) 0%, transparent 100%)' }} aria-hidden="true"></div>
        
        {/* Dot grid texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} aria-hidden="true"></div>
        
        {/* Radial focus light */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 65% 70% at 75% 50%, rgba(25, 45, 95, 0.3) 0%, transparent 70%)' }} aria-hidden="true"></div>
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.20] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} aria-hidden="true"></div>

        <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* Enhanced Content Block */}
          <div className="max-w-xl animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-bold tracking-widest uppercase text-white/80 mb-7">
              <span className="material-symbols-outlined text-[14px] text-red-400" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              Revenue Alert
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.15] font-['Manrope'] tracking-tight drop-shadow-sm">
              Every Missed Call Is a Booking Your Competitor Just Got
            </h2>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed mb-10 font-medium">
              It's 2:47 AM. A driver calls looking for overnight parking. Your phone goes to voicemail. He hangs up and books with the lot down the road. You never even knew he called—or how much money you just lost.
            </p>
            
            {/* Upgraded Premium Insight Cards */}
            <div className="space-y-3">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.12] hover:bg-white/[0.08] transition-colors duration-200" style={{ background: 'rgba(255,255,255,0.055)' }}>
                <div className="w-9 h-9 rounded-lg border border-red-500/25 flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(239,68,68,0.16)' }}>
                  <span className="material-symbols-outlined text-red-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>phone_missed</span>
                </div>
                <div>
                  <p className="font-bold text-sm mb-0.5">68% Never Call Back</p>
                  <p className="text-[13px] text-white/60 leading-relaxed">Most drivers won't leave a voicemail. They call the next lot on Google Maps — and book there instead.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.12] hover:bg-white/[0.08] transition-colors duration-200" style={{ background: 'rgba(255,255,255,0.055)' }}>
                <div className="w-9 h-9 rounded-lg border border-red-500/25 flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(239,68,68,0.16)' }}>
                  <span className="material-symbols-outlined text-red-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>dark_mode</span>
                </div>
                <div>
                  <p className="font-bold text-sm mb-0.5">Peak Hours: 8 PM — 4 AM</p>
                  <p className="text-[13px] text-white/60 leading-relaxed">That's when demand is highest — and when your phone is off. Every night is an undefended revenue opportunity.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end relative" style={{ filter: 'drop-shadow(0 32px 48px rgba(0,0,0,0.45))' }}>
            {/* 3D Phone Mockup Container */}
            <div style={{ perspective: '1200px' }}>
              <div style={{ transform: 'perspective(1200px) rotateY(-6deg) rotateX(2deg) rotateZ(-1deg)', transformStyle: 'preserve-3d' }}>
                
                {/* Phone Hardware Chassis */}
                <div className="relative rounded-[3rem] p-[6px]"
                     style={{
                       background: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)', 
                       borderTop: '1px solid rgba(255,255,255,0.35)', 
                       borderRight: '1px solid rgba(255,255,255,0.15)', 
                       borderLeft: '1px solid rgba(0,0,0,0.8)',
                       borderBottom: '1px solid rgba(0,0,0,0.9)',
                       boxShadow: '-4px 3px 0px #1e293b, -3px 6px 6px rgba(0,0,0,0.85), -10px 18px 30px rgba(0,0,0,0.60), -25px 40px 70px rgba(0,0,0,0.30)'
                     }}>

                  {/* Screen Glass */}
                  <div className="w-[17rem] rounded-[2.6rem] relative overflow-hidden flex flex-col items-center pt-10 pb-8 px-5 z-10"
                       style={{ background: 'linear-gradient(160deg, #101622 0%, #05080c 100%)', boxShadow: 'inset 0 2px 14px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.03), 0 0 0 1.5px rgba(0,0,0,1)' }}>
                  
                    {/* Top Notch Area */}
                    <div className="w-[28%] h-[5px] rounded-full mb-9 relative z-20" style={{ background: '#080d14', boxShadow: 'inset 0 1.5px 3px rgba(0,0,0,0.9), 0 1px 0 rgba(255,255,255,0.03)' }}></div>

                    <div className="text-center mb-7 relative z-20">
                      <p className="text-white/95 text-xl font-bold mb-0.5" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>2:47 AM</p>
                      <p className="text-red-400/85 text-[11px] uppercase tracking-[0.2em] font-semibold">No Answer</p>
                    </div>

                    {/* Caller avatar */}
                    <div className="text-center mb-7 relative z-20">
                      <div className="w-[4.8rem] h-[4.8rem] rounded-full mx-auto flex items-center justify-center mb-3.5" 
                           style={{ background: 'linear-gradient(180deg, #1b2436 0%, #0d121c 100%)', border: '1px solid rgba(255,255,255,0.04)', boxShadow: '0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                        <span className="material-symbols-outlined text-slate-400/80 text-[2.2rem]" style={{ fontVariationSettings: "'FILL' 0", filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>local_shipping</span>
                      </div>
                      <p className="text-white/95 text-[15.5px] font-bold leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>Unknown Driver</p>
                      <p className="text-slate-400/80 text-[11px] mt-1.5">+1 (unknown) &middot; Potential Booking</p>
                    </div>

                    {/* Missed call pill */}
                    <div className="w-full p-3.5 rounded-2xl flex items-center gap-3 relative z-20" 
                         style={{ background: 'linear-gradient(180deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.07) 100%)', border: '1px solid rgba(239,68,68,0.25)', boxShadow: '0 6px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(239,68,68,0.15)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.2)' }}>
                        <span className="material-symbols-outlined text-red-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1", filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}>phone_missed</span>
                      </div>
                      <div>
                        <p className="text-[13.5px] font-extrabold text-red-400" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>Missed Call</p>
                        <p className="text-[10px] text-red-400/60 mt-0.5">Call ended &middot; 2:48 AM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue lost card */}
                <div className="w-[16.5rem] mt-[-22px] ml-6 rounded-2xl px-5 py-4 flex items-center justify-between relative z-30"
                     style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.30)', borderTop: '1.5px solid rgba(239,68,68,0.45)', backdropFilter: 'blur(12px)', boxShadow: '-4px 12px 20px rgba(0,0,0,0.45), -1px 4px 6px rgba(0,0,0,0.7)', transform: 'translateZ(15px)' }}>
                  <div>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5">Est. Revenue Lost</p>
                    <p className="font-extrabold text-white leading-none" style={{ fontSize: '2rem' }}>$150</p>
                    <p className="text-[11px] text-white/45 mt-1.5">From this one call alone</p>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.14)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <span className="material-symbols-outlined text-red-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
                    </div>
                    <p className="text-[9px] text-red-400/60 font-semibold uppercase tracking-wide">Tonight</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-32 px-6 bg-[#f8fbff] dark:bg-slate-950 border-y border-slate-100 dark:border-slate-800" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-full text-xs font-bold tracking-widest uppercase text-primary mb-6">
              <span className="material-symbols-outlined text-xs">compare_arrows</span>
              Speed of Execution
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-4 font-headline">
              From Missed Call to Booked Spot in 30 Seconds
            </h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto font-medium text-lg">Two ways to handle a 2 AM call. Only one results in revenue.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch max-w-5xl mx-auto relative">
            <div className="hidden lg:block absolute left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent z-0"></div>

            {/* OLD WAY */}
            <div className="bg-[#fafaf9] border border-[#e8e4e3] rounded-[2.5rem] flex flex-col h-full overflow-hidden transition-all duration-500 hover:shadow-xl relative z-10 font-medium">
              <div className="px-10 py-8 border-b border-[#e8e4e3] bg-[#f5f4f2] flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-red-100/50 flex items-center justify-center border border-red-200">
                  <span className="material-symbols-outlined text-red-500/70">history</span>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-red-900/40">The Inefficient Path</p>
                  <p className="text-xl font-black text-red-950/80">The Old Way</p>
                </div>
              </div>
              <div className="p-10 flex-1 space-y-12 relative">
                <div className="absolute left-[63px] top-[74px] bottom-[74px] w-0 border-l-2 border-dashed border-red-200/50"></div>
                
                <div className="flex gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-white border border-red-100 flex items-center justify-center shrink-0 z-10 shadow-sm">
                    <span className="material-symbols-outlined text-red-400 text-xl font-bold">schedule</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">2:47 AM</p>
                    <p className="font-bold text-red-950/80 leading-tight">Driver calls. No answer.</p>
                    <p className="text-sm text-red-900/60 mt-1.5 leading-relaxed">You're asleep. Phone goes to voicemail. Driver moves to next lot immediately.</p>
                  </div>
                </div>

                <div className="flex gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-white border border-red-100 flex items-center justify-center shrink-0 z-10 shadow-sm">
                    <span className="material-symbols-outlined text-red-400 text-xl font-bold">voicemail</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">2:48 AM</p>
                    <p className="font-bold text-red-950/80 leading-tight">No message left.</p>
                    <p className="text-sm text-red-900/60 mt-1.5 leading-relaxed">Drivers don't wait. He finds a lot on Google Maps that has a booking button.</p>
                  </div>
                </div>

                <div className="flex gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-white border border-red-100 flex items-center justify-center shrink-0 z-10 shadow-sm">
                    <span className="material-symbols-outlined text-red-400 text-xl font-bold">mail</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">9:00 AM</p>
                    <p className="font-bold text-red-950/80 leading-tight">Revenue perverted.</p>
                    <p className="text-sm text-red-900/60 mt-1.5 leading-relaxed">You wake up to a missed notification, but the driver is long gone.</p>
                  </div>
                </div>
              </div>
              <div className="p-10 bg-red-50 border-t border-red-100 flex items-center gap-5">
                <span className="material-symbols-outlined text-3xl text-red-400" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
                <p className="text-red-900 font-bold leading-tight">Result: 6+ Hours wait time.<br/><span className="text-[13px] opacity-60">Revenue Lost: $150</span></p>
              </div>
            </div>

            {/* THE PARKAI WAY */}
            <div className="bg-white border-2 border-primary/20 rounded-[2.5rem] flex flex-col h-full overflow-hidden shadow-2xl scale-105 relative z-20 transform hover:-translate-y-2 transition-all duration-500">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-secondary"></div>
              <div className="px-10 py-8 border-b border-slate-100 bg-[#f8fbff] flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-secondary">The Winner</p>
                  <p className="text-xl font-black text-primary uppercase tracking-tight">The ParkAI Way</p>
                </div>
              </div>
              <div className="p-10 flex-1 space-y-12 relative">
                <div className="absolute left-[63px] top-[74px] bottom-[74px] w-[2.5px] bg-secondary/20"></div>
                
                <div className="flex gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-secondary/30 flex items-center justify-center shrink-0 z-10 shadow-md">
                    <span className="material-symbols-outlined text-secondary text-xl font-black">phone_in_talk</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1 text-on-surface-variant font-headline">2:47:00 AM</p>
                    <p className="text-lg font-black text-primary leading-tight">AI answers in 2 seconds.</p>
                    <p className="text-sm text-slate-500 font-bold mt-1.5 leading-relaxed">Driver instantly speaks to your automated lot manager. Professional & reliable.</p>
                  </div>
                </div>

                <div className="flex gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-secondary/30 flex items-center justify-center shrink-0 z-10 shadow-md">
                    <span className="material-symbols-outlined text-secondary text-xl font-black">search_check</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1 text-on-surface-variant font-headline">2:47:15 AM</p>
                    <p className="text-lg font-black text-primary leading-tight">Spots checked. Price quoted.</p>
                    <p className="text-sm text-slate-500 font-bold mt-1.5 leading-relaxed">AI checks real-time inventory and confirms the $65 rate. Secures the sale.</p>
                  </div>
                </div>

                <div className="flex gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center shrink-0 z-10 shadow-xl shadow-secondary/30 ring-4 ring-secondary/10">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1 text-on-surface-variant font-headline">2:47:30 AM</p>
                    <p className="text-lg font-black text-primary leading-tight">Spot booked. SMS sent.</p>
                    <p className="text-sm text-slate-500 font-bold mt-1.5 leading-relaxed">Payment link sent via text. Driver parks. You wake up with more money.</p>
                  </div>
                </div>
              </div>
              <div className="p-10 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-secondary/10 flex items-center gap-5">
                <span className="material-symbols-outlined text-3xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <div className="flex-1">
                  <p className="text-primary font-black text-lg">Result: 30 Seconds Total Time.</p>
                  <p className="text-[13px] text-secondary font-bold uppercase tracking-widest mt-1">Status: Earning Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hierarchical Feature Grid */}
      <section className="relative py-36 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 overflow-hidden" id="features">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-[70rem] mx-auto relative z-10 flex flex-col gap-8">
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-5 font-headline tracking-tight">Everything You Need To Automate.</h2>
            <p className="text-on-surface-variant text-lg font-medium max-w-2xl mx-auto">Enterprise-grade call management and booking logic for high-demand lots.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Primary Feature 1 */}
            <div className="p-12 lg:p-14 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
               <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-white mb-10 shadow-lg shadow-secondary/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>phone_in_talk</span>
               </div>
               <div className="flex items-center gap-2 px-3.5 py-1.5 bg-secondary/5 text-secondary border border-secondary/15 rounded-full text-[10px] font-black uppercase tracking-[0.2em] w-fit mb-6">
                  100% Coverage
               </div>
               <h3 className="text-2xl font-black text-primary mb-5 tracking-tight">AI Answers Every Single Call</h3>
               <p className="text-slate-500 font-bold leading-relaxed">No ring-outs. No waiting. Our AI handles an unlimited number of concurrent calls, so every driver gets help instantly even at peak hours.</p>
            </div>
            {/* Primary Feature 2 */}
            <div className="p-12 lg:p-14 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
               <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center text-white mb-10 shadow-lg shadow-secondary/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
               </div>
               <div className="flex items-center gap-2 px-3.5 py-1.5 bg-secondary/5 text-secondary border border-secondary/15 rounded-full text-[10px] font-black uppercase tracking-[0.2em] w-fit mb-6 text-on-surface-variant">
                  Zero Latency
               </div>
               <h3 className="text-2xl font-black text-primary mb-5 tracking-tight">30-Second Booking Cycle</h3>
               <p className="text-slate-500 font-bold leading-relaxed">Minimize driver effort. The AI verifies capacity, takes information, and sends a booking text before the driver can even pull over.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-10 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200 hover:border-secondary/20 transition-all group">
               <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-secondary mb-8 group-hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
               </div>
               <h3 className="text-lg font-black text-primary mb-3">Live Fleet Dashboard</h3>
               <p className="text-sm text-slate-500 font-bold leading-relaxed">Monitor your inventory in real-time. Know exactly who is coming, who is checked in, and how much you've earned today.</p>
            </div>
            <div className="p-10 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200 hover:border-secondary/20 transition-all group">
               <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-secondary mb-8 group-hover:bg-secondary/10 transition-colors">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
               </div>
               <h3 className="text-lg font-black text-primary mb-3">Custom Lot Knowledge</h3>
               <p className="text-sm text-slate-500 font-bold leading-relaxed">Train the AI on your specific rules. Recker permissions, hazmat restrictions, and overnight rates are handled flawlessly.</p>
            </div>
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

      {/* Social Proof (High Impact Testimonials) */}
      <section className="py-32 px-6 bg-white overflow-hidden" id="social-proof">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-primary mb-6 font-headline tracking-tight">Trusted by Independent Lot Owners.</h2>
            <div className="flex items-center justify-center gap-2 text-secondary mb-4">
               {[1,2,3,4,5].map(i => <span key={i} className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>)}
            </div>
            <p className="text-on-surface-variant text-lg font-medium leading-relaxed">Hear from those who no longer miss their nights to telephone calls.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 mb-24">
            {[
              {
                q: "I was skeptical about AI... but this is just like having an employee who never sleeps. I can actually enjoy dinner with my family now.",
                a: "Dave R.",
                t: "Logistics Lot Owner"
              },
              {
                q: "I used to find 5-6 missed calls every morning. Now those are reservations waiting for me when I log in. It paid for itself in two nights.",
                a: "Mark S.",
                t: "Metro Parking Hub"
              },
              {
                q: "The AI knows all my reefer and hazmat rules. It's more reliable than my last night-shift hire and costs a fraction of the price.",
                a: "Kevin L.",
                t: "Interstate Truck Stop"
              }
            ].map((test, idx) => (
              <div key={idx} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between hover:bg-slate-100 transition-colors duration-300">
                <p className="text-lg font-bold text-primary italic leading-relaxed mb-10">"{test.q}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary">{test.a[0]}</div>
                  <div>
                    <p className="font-black text-primary font-headline">{test.a}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{test.t}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 py-16 border-y border-slate-100">
            <div className="text-center">
              <p className="text-5xl font-black text-secondary mb-3">100%</p>
              <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Call Answer Rate</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-black text-secondary mb-3">30s</p>
              <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Avg Booking Time</p>
            </div>
            <div className="text-center col-span-2 lg:col-span-1">
              <p className="text-5xl font-black text-secondary mb-3">24/7</p>
              <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">Uptime Guaranteed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 px-6 bg-slate-50 border-t border-slate-100" id="pricing">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-black text-primary tracking-tight mb-5 font-headline">Simple Pricing. Professional Power.</h2>
               <p className="text-on-surface-variant text-lg font-medium">One plan. Everything included. Zero hidden fees.</p>
            </div>
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-stretch">
               <div className="p-12 bg-white rounded-[3rem] shadow-2xl border-2 border-secondary relative overflow-hidden flex flex-col scale-105 z-10">
                  <div className="absolute top-0 right-0 bg-secondary text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.25em] rounded-bl-2xl">Standard</div>
                  <div className="mb-10">
                     <p className="text-lg font-black text-primary mb-2">ParkAI Professional</p>
                     <div className="flex items-baseline gap-3">
                        <span className="text-6xl font-black text-primary">$200</span>
                        <span className="text-on-surface-variant font-bold">/ month</span>
                     </div>
                  </div>
                  <ul className="space-y-5 mb-12 flex-1 font-medium text-sm">
                    {[
                      "Unlimited calls answering",
                      "Full lot inventory sync",
                      "Automated SMS confirmations",
                      "Natural voice selection",
                      "Custom lot rules engine",
                      "Live dashboard access"
                    ].map((feat, i) => (
                      <li key={i} className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-secondary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Link to="/onboarding" className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xl hover:bg-secondary transition-all text-center shadow-xl shadow-primary/20 active:scale-95">
                    Start 7-Day Free Trial
                  </Link>
               </div>

               <div className="p-12 bg-surface-container-highest/30 rounded-[3rem] border border-slate-200 flex flex-col justify-center">
                  <h4 className="text-xl font-black text-primary mb-8 text-center text-on-surface-variant uppercase tracking-widest text-sm">Economic Analysis</h4>
                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center p-6 bg-red-100/50 rounded-2xl border border-red-200">
                      <span className="font-bold text-red-700">Night-Shift Temp Hire</span>
                      <span className="font-black text-red-900 opacity-60">$1,600/mo</span>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-secondary/10 rounded-2xl border-2 border-secondary/20">
                      <span className="font-black text-secondary">ParkAI Manager</span>
                      <span className="font-black text-secondary">$200/mo</span>
                    </div>
                  </div>
                  <div className="text-center relative">
                     <div className="text-4xl font-black text-primary mb-2">83% Cost Reduction</div>
                     <p className="text-sm text-slate-500 font-bold leading-relaxed">No taxes, no sick days, no breaks. Just consistent revenue capture while you sleep.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 max-w-4xl mx-auto" id="faq">
        <h2 className="text-4xl font-black text-center mb-16 font-headline tracking-tight">Operational Questions?</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FaqItem key={i} faq={faq} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto bg-[radial-gradient(circle_at_top_right,#0058be,#050f36)] p-16 md:p-24 rounded-[4rem] text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-8 font-headline tracking-tight leading-tight">Ready to Capture Every Missed Booking?</h2>
            <p className="text-xl text-white/60 mb-12 font-medium leading-relaxed">
              Join dozens of smart lot owners who have stopped leaking revenue during the night shift. Setup takes just 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/onboarding" className="px-12 py-5 bg-white text-primary rounded-2xl font-black text-2xl shadow-2xl hover:scale-105 transition-all active:scale-95">
                Get Started Free →
              </Link>
              <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-xl hover:bg-white/20 transition-all">
                Talk to Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-900 py-20 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-black text-primary dark:text-white mb-6 font-['Manrope'] tracking-tight">TruckPark AI</div>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">Empowering lot owners to recover their nights and maximize their potential through intelligent, customer-focused automation.</p>
          </div>
          <div>
            <p className="font-black text-primary mb-6 uppercase tracking-widest text-xs">Product</p>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#features" className="hover:text-primary transition-colors">Key Features</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Live Pricing</a></li>
            </ul>
          </div>
          <div>
            <p className="font-black text-primary mb-6 uppercase tracking-widest text-xs">Support</p>
            <ul className="space-y-4 text-sm font-bold text-slate-400">
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-slate-200/50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <p>© 2024 TruckPark AI. Operational Excellence.</p>
           <p>Made for hard-working lot owners</p>
        </div>
      </footer>
    </main>
  );
}
