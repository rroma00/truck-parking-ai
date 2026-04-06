import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function FaqItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const number = (index + 1).toString().padStart(2, '0');

  return (
    <div
      className={`group border-2 rounded-xl transition-all duration-300 overflow-hidden ${isOpen
          ? 'border-blue-400 bg-white shadow-md'
          : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-blue-300'
        }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      >
        <div className="flex items-center gap-4">
          <span className="font-['Inter'] font-[600] text-gray-400 text-[14px] shrink-0">{number}</span>
          <p className="font-['Inter'] font-[600] text-[#0A1628] text-[18px] leading-[1.4]">
            {faq.q}
          </p>
        </div>
        <span className={`material-symbols-outlined text-blue-600 text-[24px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-0 ml-[34px]">
            <p className="font-['Inter'] font-[400] text-gray-700 text-[16px] leading-[1.7] max-w-[720px]">
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
  const [missedCalls, setMissedCalls] = useState(25);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Calculation parameters from prompt
  const bookingValue = 65;
  const conversionRate = 0.8;
  const weeklyRevenueLost = Math.round(missedCalls * bookingValue * conversionRate);
  const monthlyRevenueLost = weeklyRevenueLost * 4;
  const yearlyRevenueLost = weeklyRevenueLost * 52;

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
      setIsScrolled(window.scrollY > 50);
      if (window.scrollY < 50) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

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
    },
    {
      q: "Can the AI handle special requests?",
      a: "Yes. The AI can answer questions about reefer hookups, hazmat restrictions, overnight vs. short-term rates, and any custom rules you configure. If a request is outside its parameters, it escalates to you."
    },
    {
      q: "What happens if my internet goes down?",
      a: "ParkAI runs on cloud infrastructure with 99.9% uptime. If your local internet is down, the AI continues answering calls and taking bookings. You can access your dashboard from any device once you're back online."
    }
  ];

  return (
    <main className="bg-surface text-on-surface selection:bg-secondary-fixed min-h-screen relative overflow-hidden">
      {/* Ambient Edge Vignette (Ultra-wide screens) */}
      <div className="pointer-events-none fixed inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.02)] dark:shadow-[inset_0_0_150px_rgba(0,0,0,0.3)] z-[100] hidden 2xl:block"></div>

      <style dangerouslySetInnerHTML={{
        __html: `
        html, body {
          overflow-x: hidden;
          margin: 0;
          padding: 0;
          width: 100%;
          position: relative;
          scroll-behavior: smooth;
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
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200' : 'bg-white border-b border-gray-200'
          }`}
      >
        <div className="max-w-[1280px] mx-auto px-8 h-[80px] flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="font-['Manrope'] font-bold text-[26px] tracking-[-.01em] text-[#0A1628] flex items-center">
            TruckPark<span className="font-normal text-[#0066CC] ml-1">AI</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 h-full">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative h-full flex items-center font-sans font-[500] text-[15px] transition-colors duration-200
                    ${isActive
                      ? 'text-[#0A1628]'
                      : 'text-gray-600 hover:text-[#0066CC] focus:outline-none focus:ring-4 focus:ring-blue-100 rounded-sm'
                    }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0066CC]" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/signin"
              className="font-sans font-[500] text-[15px] text-gray-700 hover:text-[#0066CC] px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 rounded-md"
            >
              Log In
            </Link>
            <Link
              to="/onboarding"
              className="bg-[#0A1628] hover:bg-[#0F203B] text-white font-semibold text-[15px] px-6 py-2.5 rounded-lg shadow-lg shadow-[#0A1628]/20 hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Get Demo
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-100 rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden absolute top-[80px] left-0 w-full bg-white shadow-xl transition-all duration-300 ease-in-out border-t border-gray-100 overflow-hidden ${isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="flex flex-col p-6 gap-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-sans font-[500] text-[15px] py-2 transition-colors duration-200
                  ${activeSection === item.id ? 'text-[#0066CC]' : 'text-gray-600 hover:text-[#0066CC]'}
                `}
              >
                {item.label}
              </a>
            ))}
            <div className="h-px w-full bg-gray-100 my-2"></div>
            <Link
              to="/signin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-sans font-[500] text-[15px] text-gray-700 hover:text-[#0066CC] py-2"
            >
              Log In
            </Link>
            <Link
              to="/onboarding"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 bg-[#0A1628] text-white font-semibold text-[15px] px-6 py-3 rounded-lg text-center shadow-lg hover:bg-[#0F203B] transition-colors"
            >
              Get Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative pt-[176px] pb-[96px] px-8 overflow-hidden bg-gradient-to-b from-gray-50 to-white min-h-[90vh] flex flex-col justify-center">

        {/* Very subtle dot pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }} aria-hidden="true"></div>

        <div className="relative max-w-[1280px] mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* LEFT COLUMN - Content (55%) */}
            <div className="w-full lg:w-[55%] relative z-10">

              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-6 shadow-sm border border-blue-100">
                <span className="text-[14px] leading-none">🤖</span>
                <span className="text-blue-600 font-['Inter'] font-semibold text-[13px] uppercase tracking-[0.08em]">AI-Powered Lot Management</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-['Manrope'] font-[800] text-[#0A1628] leading-[1.1] tracking-[-0.025em] text-[40px] md:text-[58px] mb-[24px] max-w-[600px] drop-shadow-sm">
                Never Miss a Booking — Even at <span className="text-[#0066CC]">3 AM</span>
              </h1>

              {/* Subheadline */}
              <p className="font-['Inter'] font-normal text-[#334155] text-[18px] lg:text-[20px] leading-[1.6] mb-[40px] max-w-[560px]">
                ParkAI answers every call, checks real-time availability, and confirms reservations automatically — so your lot keeps filling while you're off the clock.
              </p>

              {/* CTA Button Row */}
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/onboarding" className="inline-flex items-center justify-center bg-[#0A1628] hover:bg-[#0F203B] text-white font-[600] text-[17px] px-8 py-4 rounded-lg shadow-lg shadow-[#0A1628]/25 hover:shadow-xl hover:-translate-y-[2px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100">
                  Start Free Trial
                  <span className="material-symbols-outlined text-[18px] ml-2 text-white">arrow_forward</span>
                </Link>
                <button className="inline-flex items-center justify-center bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-blue-600 text-[#0A1628] font-[600] text-[17px] px-8 py-4 rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100">
                  <span className="material-symbols-outlined text-[#0066CC] text-[18px] mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                  Watch Demo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-[24px] mt-[32px]">
                <span className="flex items-center gap-[6px] text-gray-600 font-['Inter'] font-[500] text-[14px] uppercase tracking-[0.05em]">
                  <span className="text-[#0066CC] font-bold text-[18px]">✓</span> No credit card
                </span>
                <span className="flex items-center gap-[6px] text-gray-600 font-['Inter'] font-[500] text-[14px] uppercase tracking-[0.05em]">
                  <span className="text-[#0066CC] font-bold text-[18px]">✓</span> 5 min setup
                </span>
                <span className="flex items-center gap-[6px] text-gray-600 font-['Inter'] font-[500] text-[14px] uppercase tracking-[0.05em]">
                  <span className="text-[#0066CC] font-bold text-[18px]">✓</span> Cancel anytime
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN - Dashboard Mockup (45%) */}
            <div className="w-full lg:w-[45%] relative mt-8 lg:mt-0 lg:flex lg:justify-end">

              <style dangerouslySetInnerHTML={{
                __html: `
                @media (min-width: 1024px) {
                  .mockup-3d {
                    transform: perspective(1200px) rotateY(-8deg) rotateX(2deg);
                    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
                  }
                  .mockup-3d:hover {
                    transform: perspective(1200px) rotateY(-6deg) rotateX(1deg) translateY(-8px);
                    box-shadow: 0 25px 50px rgba(0,0,0,0.15), 0 0 40px 10px rgba(0,102,204,0.1);
                  }
                }
                @keyframes floatToast {
                  0%, 100% { transform: translateY(0px) scale(0.85); }
                  50% { transform: translateY(-10px) scale(0.85); }
                }
                .animate-float-toast {
                  animation: floatToast 3s ease-in-out infinite;
                  transform-origin: bottom right;
                }
                @media (max-width: 1023px) {
                  @keyframes floatToastMobile {
                    0%, 100% { transform: translateY(0px) scale(0.9); }
                    50% { transform: translateY(-10px) scale(0.9); }
                  }
                  .animate-float-toast {
                    animation: floatToastMobile 3s ease-in-out infinite;
                  }
                }
              `}} />

              {/* Background Glow */}
              <div className="absolute inset-x-0 inset-y-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,102,204,0.08)_0%,_transparent_70%)] blur-[80px] pointer-events-none -z-10 scale-150"></div>

              {/* Main Mockup Container - 3D Hover & Dimensional Shadowing */}
              <div className="mockup-3d relative w-full max-w-[540px] bg-white rounded-2xl border border-black/5 overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.15)] mx-auto lg:mx-0">

                {/* Chrome bar */}
                <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-100 gap-2">
                  <div className="flex gap-1.5 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 text-center text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">TruckPark AI — Live Dashboard</div>
                </div>

                {/* Dashboard body */}
                <div className="p-6 space-y-4">
                  {/* AI Active Call Panel */}
                  <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0066CC] rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                          <span className="material-symbols-outlined text-white text-xl">support_agent</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-[#0A1628] tracking-[0.15em] uppercase">AI Answering Now</p>
                          <p className="text-xs font-bold text-gray-600">+1 (312) 555-0184</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 border border-blue-200 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0066CC] animate-pulse"></span>
                        <span className="text-[9px] font-black text-[#0066CC] tracking-widest">LIVE</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-[11px] leading-relaxed bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm relative z-10 font-medium">
                      <div className="flex gap-3">
                        <span className="text-gray-400 font-bold w-12 shrink-0">Driver:</span>
                        <span className="text-gray-800">"Do you have overnight spots available tonight?"</span>
                      </div>
                      <div className="flex gap-3 border-t border-gray-50 pt-2">
                        <span className="text-[#0066CC] font-black w-12 shrink-0">AI:</span>
                        <span className="text-gray-800">"Yes — 4 spots open at $65/night. Want me to book one?"</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-blue-200 transition-all">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Tonight's Revenue</p>
                      <p className="text-2xl font-black text-[#0A1628] leading-none group-hover:text-[#0066CC] transition-colors">$3,510</p>
                      <p className="text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">trending_up</span> 12% vs. last week
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Occupancy</p>
                      <p className="text-2xl font-black text-[#0A1628] leading-none">27 / 32</p>
                      <p className="text-[10px] text-gray-500 font-medium mt-2">4 spots currently open</p>
                    </div>
                  </div>

                  {/* Recent Bookings */}
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 flex justify-between">
                      <span>Recent AI Bookings</span>
                    </p>
                    <div className="flex items-center justify-between px-3 py-2 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black flex items-center justify-center">JB</div>
                        <div>
                          <p className="text-xs font-bold text-gray-800">John B. Trucking</p>
                          <p className="text-[10px] text-gray-500 font-medium">Spot A1 &middot; Confirmed 4m ago</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[9px] font-black rounded-md">CONFIRMED</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating confirmation toast - Absolute bottom-right overlapping */}
              <div className="absolute -bottom-6 right-0 max-w-[85%] sm:max-w-max z-30 bg-white rounded-xl p-4 flex items-center gap-4 shadow-xl shadow-green-500/20 border border-gray-100 animate-float-toast">
                <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-green-500/20">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
                </div>
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-black text-[#0A1628] leading-tight mb-0.5 whitespace-nowrap">Booking Confirmed</p>
                  <p className="text-[11px] text-gray-500 font-bold whitespace-nowrap">Spot A3 &middot; Just Now</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Problem Section: Integrated & Grounded */}
      {/* Problem Section: Integrated & Grounded */}
      <section className="bg-gradient-to-b from-[#0F1F3A] to-[#1E293B] py-24 px-8 text-white relative overflow-hidden" id="problem">
        {/* Depth layer stack */}

        {/* Dot grid texture */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', backgroundSize: '32px 32px' }} aria-hidden="true"></div>

        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full">

          {/* Enhanced Content Block */}
          <div className="w-full">
            <div className="inline-flex items-center gap-2 bg-red-500/10 rounded-full px-4 py-2 mb-6">
              <span className="text-[14px] leading-none">⚠️</span>
              <span className="font-['Inter'] font-[600] text-red-400 text-[13px] uppercase tracking-[0.08em]">Revenue Alert</span>
            </div>

            <h2 className="font-['Manrope'] font-bold text-white text-[36px] md:text-[44px] leading-[1.15] tracking-[-0.02em] mb-8 max-w-[540px]">
              Every Missed Call Is a Booking Your Competitor Just Got
            </h2>

            <p className="font-['Inter'] font-normal text-gray-300 text-[18px] leading-[1.7] mb-10 max-w-[520px]">
              It's 2:47 AM. A driver calls looking for overnight parking. Your phone goes to voicemail. He hangs up and books with the lot down the road. You never even knew he called—or how much money you just lost.
            </p>

            {/* Upgraded Premium Insight Cards */}
            <div className="flex flex-col gap-4 w-full">
              <div className="bg-[#1E293B]/60 border border-[#64748B] backdrop-blur-[8px] p-6 rounded-xl flex flex-row items-center gap-4">
                <div className="bg-red-500/15 rounded-full p-3 flex shrink-0 items-center justify-center border border-red-500/10">
                  <span className="material-symbols-outlined text-red-400 text-[34px]" style={{ fontVariationSettings: "'FILL' 1" }}>phone_disabled</span>
                </div>
                <div>
                  <p className="font-['Manrope'] font-[600] text-[20px] text-white">66% Never Call Back</p>
                  <p className="font-['Inter'] font-normal text-[14px] text-gray-400 leading-[1.5]">Most drivers won't leave a voicemail. They call the next lot on Google Maps—and book there instead.</p>
                </div>
              </div>

              <div className="bg-[#1E293B]/60 border border-[#64748B] backdrop-blur-[8px] p-6 rounded-xl flex flex-row items-center gap-4">
                <div className="bg-orange-500/15 rounded-full p-3 flex shrink-0 items-center justify-center border border-orange-500/10">
                  <span className="material-symbols-outlined text-orange-400 text-[34px]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                </div>
                <div>
                  <p className="font-['Manrope'] font-[600] text-[20px] text-white">Peak Hours: 8 PM — 4 AM</p>
                  <p className="font-['Inter'] font-normal text-[14px] text-gray-400 leading-[1.5]">That's when demand is highest—and when your phone is off. Every night is an undefended revenue opportunity.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full relative flex justify-center lg:justify-end lg:pr-8">

            <style dangerouslySetInnerHTML={{
              __html: `
              @keyframes phoneFloat {
                0%, 100% { transform: perspective(1000px) rotateY(-12deg) rotateX(3deg) translateY(0px); }
                50% { transform: perspective(1000px) rotateY(-12deg) rotateX(3deg) translateY(-8px); }
              }
              .phone-container-3d {
                animation: phoneFloat 6s ease-in-out infinite;
                transform-style: preserve-3d;
              }
              @keyframes pulseDot {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
              }
              .animate-pulse-dot {
                animation: pulseDot 2s ease-in-out infinite;
              }
            `}} />

            {/* Red Glow Background Behind Phone */}
            <div
              className="absolute z-0 pointer-events-none"
              style={{
                width: '150%',
                height: '150%',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) translate(20px, 20px)',
                background: 'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, transparent 70%)',
                filter: 'blur(100px)'
              }}
            ></div>

            {/* Phone Hardware Container + 3D Transform */}
            <div
              className="phone-container-3d relative z-10 w-full max-w-[320px] bg-[#1A1A1A] rounded-[40px]"
              style={{
                padding: '12px 8px',
                boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.25), inset 0 0 0 1px rgba(0,0,0,0.3), 0 30px 60px -12px rgba(0, 0, 0, 0.5), 0 18px 36px -18px rgba(220, 38, 38, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1)'
              }}
            >

              {/* iPhone Hardware Buttons */}
              <div className="absolute left-[-3px] top-[25%] w-[3px] h-[30px] bg-[#2A2A2A] rounded-l-sm border-l border-white/20"></div>
              <div className="absolute left-[-3px] top-[32%] w-[3px] h-[30px] bg-[#2A2A2A] rounded-l-sm border-l border-white/20"></div>
              <div className="absolute right-[-3px] top-[30%] w-[3px] h-[50px] bg-[#2A2A2A] rounded-r-sm border-r border-white/20"></div>

              {/* Screen Content Container */}
              <div
                className="rounded-[32px] bg-[#0D0D0D] overflow-hidden flex flex-col pt-14 pb-10 px-5 relative h-full min-h-[650px] aspect-[9/19.5]"
                style={{
                  boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)'
                }}
              >

                {/* Subtle Glass Reflection */}
                <div
                  className="absolute inset-0 z-30 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%)',
                    mixBlendMode: 'overlay'
                  }}
                ></div>

                {/* iPhone Status Bar */}
                <div className="absolute top-[10px] inset-x-0 flex justify-between items-center px-6 z-40 pointer-events-none">
                  <span className="text-white text-[11px] font-[600] tracking-wide" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>9:41</span>
                  <div className="flex items-center gap-1.5 text-white/90">
                    <span className="material-symbols-outlined text-[12px]">signal_cellular_4_bar</span>
                    <span className="material-symbols-outlined text-[12px]">wifi</span>
                    <span className="material-symbols-outlined text-[13px]">battery_full_alt</span>
                  </div>
                </div>

                {/* Dynamic Island / Notch */}
                <div className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-[20px] z-50 shadow-[inset_0_-1px_1px_rgba(255,255,255,0.1)]"></div>

                {/* Glowing Notification Dot */}
                <div
                  className="absolute animate-pulse-dot z-20 rounded-full"
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#EF4444',
                    border: '2px solid white',
                    top: '12px',
                    right: '12px'
                  }}
                ></div>

                <div className="text-center mb-6 mt-6 relative z-20">
                  <p className="text-white text-xl font-medium mb-1 tracking-wide">2:47 AM</p>
                  <p className="text-red-400 text-[11px] uppercase tracking-[0.2em] font-semibold">No Answer</p>
                </div>

                {/* Caller avatar */}
                <div className="text-center mb-8 relative z-20">
                  <div className="w-[80px] h-[80px] rounded-full mx-auto flex items-center justify-center mb-4 bg-gray-900 border border-gray-800">
                    <span className="material-symbols-outlined text-gray-400 text-[36px]" style={{ fontVariationSettings: "'FILL' 0" }}>local_shipping</span>
                  </div>
                  <p className="text-white text-[16px] font-medium leading-tight mb-1">Unknown Driver</p>
                  <p className="text-gray-400 text-[12px]">+1 (unknown) &middot; Potential Booking</p>
                </div>

                {/* Missed call pill */}
                <div className="w-full bg-red-500/10 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-3 relative z-20 mb-3">
                  <span className="material-symbols-outlined text-red-400 text-[24px]">phone_missed</span>
                  <div>
                    <p className="text-[14px] font-semibold text-red-400">Missed Call</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">Call ended - 2:47 AM</p>
                  </div>
                </div>

                {/* Revenue lost card */}
                <div className="w-full bg-gradient-to-b from-red-900/30 to-red-800/20 border border-red-500/30 rounded-xl px-4 py-3 relative z-20 flex items-center justify-between">
                  <div>
                    <p className="text-red-400 text-[11px] uppercase tracking-widest font-bold mb-1">Est. Revenue Lost</p>
                    <p className="font-['Manrope'] font-[700] text-white text-[32px] leading-tight">$150</p>
                    <p className="text-[13px] text-gray-400 mt-1 leading-snug">Truck is going one mile<br />down the road</p>
                  </div>
                  <div className="flex flex-col items-center shrink-0">
                    <span className="material-symbols-outlined text-red-500 text-[24px]">arrow_downward</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Comparison Section */}
      <section className="bg-gray-50 py-24 px-8" id="how-it-works">
        <div className="max-w-[1280px] mx-auto">

          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <span className="text-[14px] leading-none">⚡</span>
              <span className="font-['Inter'] font-[600] text-blue-600 text-[13px] uppercase tracking-[0.08em]">Speed of Execution</span>
            </div>
            <h2 className="font-['Manrope'] font-[700] text-[#0A1628] text-[36px] md:text-[44px] leading-[1.2] tracking-[-0.02em] mb-4">
              From Missed Call to Booked Spot in 30 Seconds
            </h2>
            <p className="font-['Inter'] font-[400] text-gray-600 text-[18px]">
              Two ways to handle a 2 AM call. Only one results in revenue.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-12 relative w-full">

            {/* LEFT COLUMN - THE OLD WAY */}
            <div className="w-full max-w-[520px] mx-auto lg:mx-0 bg-[#FFF9F9] border-2 border-red-100 rounded-2xl p-8 shadow-lg flex flex-col h-full relative z-10">

              <div className="mb-8">
                <div className="bg-red-100 rounded-lg p-3 inline-flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-red-500 text-[40px]">cancel</span>
                </div>
                <p className="text-red-400 font-['Inter'] font-[600] text-[11px] uppercase tracking-wider mb-1">The Inefficient Path</p>
                <h3 className="text-[#0A1628] font-['Manrope'] font-[600] text-[24px]">The Old Way</h3>
              </div>

              <div className="relative flex-1 flex flex-col gap-6">
                {/* Vertical Dashed Line (6px dash, 4px gap) */}
                <div className="absolute left-[27px] top-[28px] bottom-[28px] w-[2px] z-0" style={{ backgroundImage: 'linear-gradient(to bottom, #fca5a5 60%, transparent 60%)', backgroundSize: '100% 10px', backgroundRepeat: 'repeat-y' }}></div>

                {/* Step 1 */}
                <div className="flex flex-row items-start gap-4 relative z-10 w-full">
                  <div className="w-[56px] h-[56px] rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-white">
                    <span className="material-symbols-outlined text-red-400 text-[32px]">phone_disabled</span>
                  </div>
                  <div className="pt-2.5 align-top">
                    <p className="text-red-500 font-['Inter'] font-[600] text-[13px] mb-1">2:47 AM</p>
                    <p className="text-[#0A1628] font-['Manrope'] font-[600] text-[19px] mb-1">Driver calls. No answer.</p>
                    <p className="text-gray-700 font-['Inter'] font-[400] text-[15px]">You're asleep. Phone goes to voicemail. Driver moves to next lot immediately.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-row items-start gap-4 relative z-10 w-full">
                  <div className="w-[56px] h-[56px] rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-white">
                    <span className="material-symbols-outlined text-red-400 text-[32px]">voicemail</span>
                  </div>
                  <div className="pt-2.5 align-top">
                    <p className="text-red-500 font-['Inter'] font-[600] text-[13px] mb-1">2:48 AM</p>
                    <p className="text-[#0A1628] font-['Manrope'] font-[600] text-[19px] mb-1">No message left.</p>
                    <p className="text-gray-700 font-['Inter'] font-[400] text-[15px]">Drivers don't wait. He finds a lot on Google Maps that has a booking button.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-row items-start gap-4 relative z-10 w-full">
                  <div className="w-[56px] h-[56px] rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-white">
                    <span className="material-symbols-outlined text-red-400 text-[32px]">money_off</span>
                  </div>
                  <div className="pt-2.5 align-top">
                    <p className="text-red-500 font-['Inter'] font-[600] text-[13px] mb-1">8:00 AM</p>
                    <p className="text-[#0A1628] font-['Manrope'] font-[600] text-[19px] mb-1">Revenue prevented.</p>
                    <p className="text-gray-700 font-['Inter'] font-[400] text-[15px]">You wake up to a missed notification, but the driver is long gone.</p>
                  </div>
                </div>
              </div>

              {/* Result Box */}
              <div className="mt-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-center gap-4">
                <span className="material-symbols-outlined text-red-500 text-[32px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
                <div>
                  <p className="text-red-700 font-['Manrope'] font-[600] text-[16px]">Result: 6+ Hours wait time.</p>
                  <p className="text-red-600 font-['Inter'] font-[500] text-[14px]">Revenue Lost: $150</p>
                </div>
              </div>

            </div>

            {/* VS Divider Overlay */}
            <div className="flex items-center justify-center lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-30 my-4 lg:my-0 rotate-90 lg:rotate-0">
              <div className="w-[64px] h-[64px] rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-md transition-transform hover:rotate-3 duration-300">
                <span className="font-['Manrope'] font-[700] text-[18px] text-gray-500">VS</span>
              </div>
            </div>

            {/* RIGHT COLUMN - THE PARKAI WAY */}
            <div
              className="w-full max-w-[520px] mx-auto lg:mx-0 bg-[#F8FBFF] border-2 border-blue-200 rounded-2xl p-8 flex flex-col h-full transform transition-transform duration-500 hover:-translate-y-1 relative z-20"
              style={{ boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1), 0 20px 40px rgba(59, 130, 246, 0.08)' }}
            >

              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 rounded-lg p-3 inline-flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600 text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  </div>
                  <span className="bg-blue-600 text-white rounded-full px-3 py-1 font-['Inter'] font-[600] text-[11px] uppercase tracking-wider">The Winner</span>
                </div>
                <h3 className="text-[#0A1628] font-['Manrope'] font-[600] text-[24px]">THE PARKAI WAY</h3>
              </div>

              <div className="relative flex-1 flex flex-col gap-6">
                {/* Vertical Solid Line */}
                <div className="absolute left-[26px] top-[28px] bottom-[28px] w-[3px] bg-blue-400 z-0"></div>

                {/* Step 1 */}
                <div className="flex flex-row items-start gap-4 relative z-10 w-full">
                  <div className="w-[56px] h-[56px] rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-white">
                    <span className="material-symbols-outlined text-blue-600 text-[32px]">phone_in_talk</span>
                  </div>
                  <div className="pt-2.5 align-top">
                    <p className="text-blue-600 font-['Inter'] font-[600] text-[13px] mb-1">2:47:05 AM</p>
                    <p className="text-[#0A1628] font-['Manrope'] font-[600] text-[19px] mb-1">AI answers in 2 seconds.</p>
                    <p className="text-gray-700 font-['Inter'] font-[400] text-[15px]">Driver instantly speaks to your automated lot manager. Professional & reliable.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-row items-start gap-4 relative z-10 w-full">
                  <div className="w-[56px] h-[56px] rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-white">
                    <span className="material-symbols-outlined text-blue-600 text-[32px]">search_check</span>
                  </div>
                  <div className="pt-2.5 align-top">
                    <p className="text-blue-600 font-['Inter'] font-[600] text-[13px] mb-1">2:47:15 AM</p>
                    <p className="text-[#0A1628] font-['Manrope'] font-[600] text-[19px] mb-1">Spots checked. Price quoted.</p>
                    <p className="text-gray-700 font-['Inter'] font-[400] text-[15px]">AI checks real-time inventory and confirms the $65 rate. Secures the sale.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-row items-start gap-4 relative z-10 w-full">
                  <div className="w-[56px] h-[56px] rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-white">
                    <span className="material-symbols-outlined text-blue-600 text-[32px]">check_circle</span>
                  </div>
                  <div className="pt-2.5 align-top">
                    <p className="text-blue-600 font-['Inter'] font-[600] text-[13px] mb-1">2:47:30 AM</p>
                    <p className="text-[#0A1628] font-['Manrope'] font-[600] text-[19px] mb-1">Spot booked. SMS sent.</p>
                    <p className="text-gray-700 font-['Inter'] font-[400] text-[15px]">Payment link sent via text. Driver parks. You wake up with more money.</p>
                  </div>
                </div>
              </div>

              <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes subtlePulse {
                  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2); }
                  50% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0); }
                }
                .animate-pulse-glow {
                  animation: subtlePulse 3s ease-in-out infinite;
                }
              `}} />

              {/* Result Box */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-blue-100/50 border-[3px] border-blue-500 p-5 rounded-xl flex items-center gap-4 animate-pulse-glow">
                <span className="material-symbols-outlined text-blue-600 text-[32px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                <div>
                  <p className="text-blue-700 font-['Manrope'] font-[700] text-[19px]">Result: 30 Seconds Total Time.</p>
                  <p className="text-blue-600 font-['Inter'] font-[600] text-[13px] uppercase mt-0.5">STATUS: EARNING REVENUE</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Hierarchical Feature Grid */}
      <section className="bg-white py-24 px-8" id="features">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center">

          {/* Header Area */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 mb-6">
              <span className="text-[14px] leading-none">🎯</span>
              <span className="font-['Inter'] font-[600] text-slate-700 text-[13px] uppercase tracking-[0.08em]">Complete Platform</span>
            </div>
            <h2 className="font-['Manrope'] font-[700] text-[#0A1628] text-[36px] md:text-[44px] leading-[1.2] tracking-[-0.02em] mb-4">
              Everything You Need To Automate.
            </h2>
            <p className="font-['Inter'] font-[400] text-gray-600 text-[18px] max-w-2xl mx-auto">
              Enterprise-grade call management and booking logic for high-demand lots.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

            {/* Feature 1 */}
            <div
              className="bg-white border-2 border-gray-300 rounded-2xl p-8 shadow-md hover:border-blue-400 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1.5 overflow-hidden relative group focus-within:ring-4 focus-within:ring-blue-100 outline-none"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
              tabIndex="0"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:bg-blue-100/50"></div>
              <div className="absolute top-8 right-8 font-['Inter'] font-[600] text-[14px] text-gray-400 opacity-40">01</div>

              <div
                className="w-[64px] h-[64px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-[5deg]"
                style={{ boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1), 0 4px 6px -1px rgba(0,0,0,0.1)' }}
              >
                <span className="material-symbols-outlined text-white text-[32px]">headset_mic</span>
              </div>
              <p className="font-['Inter'] font-[600] text-[12px] uppercase text-blue-600 tracking-[0.1em] mb-3">
                100% Coverage
              </p>
              <h3 className="font-['Manrope'] font-[600] text-[20px] md:text-[22px] text-[#0A1628] leading-[1.3] mb-4">
                AI Answers Every Single Call
              </h3>
              <p className="font-['Inter'] font-[400] text-gray-600 text-[15px] md:text-[16px] leading-[1.7]">
                No ring-outs. No waiting. Our AI handles an unlimited number of concurrent calls, so every driver gets help instantly even at peak hours.
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="bg-white border-2 border-gray-300 rounded-2xl p-8 shadow-md hover:border-blue-400 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1.5 overflow-hidden relative group focus-within:ring-4 focus-within:ring-blue-100 outline-none"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
              tabIndex="0"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:bg-blue-100/50"></div>
              <div className="absolute top-8 right-8 font-['Inter'] font-[600] text-[14px] text-gray-400 opacity-40">02</div>

              <div
                className="w-[64px] h-[64px] bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-6 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-[5deg]"
                style={{ boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1), 0 4px 6px -1px rgba(0,0,0,0.1)' }}
              >
                <span className="material-symbols-outlined text-white text-[32px]">bolt</span>
              </div>
              <p className="font-['Inter'] font-[600] text-[12px] uppercase text-blue-600 tracking-[0.1em] mb-3">
                Zero Latency
              </p>
              <h3 className="font-['Manrope'] font-[600] text-[20px] md:text-[22px] text-[#0A1628] leading-[1.3] mb-4">
                30-Second Booking Cycle
              </h3>
              <p className="font-['Inter'] font-[400] text-gray-600 text-[15px] md:text-[16px] leading-[1.7]">
                Minimize driver effort. The AI verifies capacity, takes information, and sends a booking text before the driver can even pull over.
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="bg-white border-2 border-gray-300 rounded-2xl p-8 shadow-md hover:border-blue-400 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1.5 overflow-hidden relative group focus-within:ring-4 focus-within:ring-blue-100 outline-none"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
              tabIndex="0"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:bg-blue-100/50"></div>
              <div className="absolute top-8 right-8 font-['Inter'] font-[600] text-[14px] text-gray-400 opacity-40">03</div>

              <div
                className="w-[64px] h-[64px] bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-[5deg]"
                style={{ boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1), 0 4px 6px -1px rgba(0,0,0,0.1)' }}
              >
                <span className="material-symbols-outlined text-white text-[32px]">dashboard</span>
              </div>
              <p className="font-['Inter'] font-[600] text-[12px] uppercase text-blue-600 tracking-[0.1em] mb-3">
                Real-Time Sync
              </p>
              <h3 className="font-['Manrope'] font-[600] text-[20px] md:text-[22px] text-[#0A1628] leading-[1.3] mb-4">
                Live Fleet Dashboard
              </h3>
              <p className="font-['Inter'] font-[400] text-gray-600 text-[15px] md:text-[16px] leading-[1.7]">
                Monitor your inventory in real-time. Know exactly who is coming, who is checked in, and how much you've earned today.
              </p>
            </div>

            {/* Feature 4 */}
            <div
              className="bg-white border-2 border-gray-300 rounded-2xl p-8 shadow-md hover:border-blue-400 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1.5 overflow-hidden relative group focus-within:ring-4 focus-within:ring-blue-100 outline-none"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
              tabIndex="0"
            >
              {/* Decorative Accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-bl-full -mr-8 -mt-8 transition-colors group-hover:bg-blue-100/50"></div>
              <div className="absolute top-8 right-8 font-['Inter'] font-[600] text-[14px] text-gray-400 opacity-40">04</div>

              <div
                className="w-[64px] h-[64px] bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-[5deg]"
                style={{ boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.1), 0 4px 6px -1px rgba(0,0,0,0.1)' }}
              >
                <span className="material-symbols-outlined text-white text-[32px]">psychology</span>
              </div>
              <p className="font-['Inter'] font-[600] text-[12px] uppercase text-blue-600 tracking-[0.1em] mb-3">
                Custom Logic
              </p>
              <h3 className="font-['Manrope'] font-[600] text-[20px] md:text-[22px] text-[#0A1628] leading-[1.3] mb-4">
                Custom Lot Knowledge
              </h3>
              <p className="font-['Inter'] font-[400] text-gray-600 text-[15px] md:text-[16px] leading-[1.7]">
                Train the AI on your specific rules. Reefer permissions, hazmat restrictions, and overnight rates are handled flawlessly.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="w-full py-24 bg-[#0F1F3A] overflow-hidden relative" id="calculator">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#60A5FA 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-[1140px] mx-auto relative z-10 flex flex-col lg:flex-row gap-16 px-8 items-center">

          {/* LEFT: Headline & Calculator */}
          <div className="w-full lg:w-[55%] flex flex-col">
            <h2 className="font-['Manrope'] font-[700] text-white text-[32px] md:text-[40px] leading-[1.2] tracking-[-0.02em] mb-4">
              How Much Revenue Are You Losing Every Week?
            </h2>
            <p className="font-['Inter'] font-[400] text-gray-300 text-[18px] leading-[1.6] mb-10 max-w-[540px]">
              Every missed call is a driver choosing another lot. This is real revenue leaving your business.
            </p>

            <div className="w-full bg-[#1e293b]/50 border border-[#334155] backdrop-blur-md p-8 rounded-xl shadow-lg shadow-blue-900/10">
              <p className="font-['Inter'] font-[500] text-gray-400 text-[14px] mb-4 uppercase tracking-wider">Average missed calls per week</p>

              <div className="relative group">
                <style dangerouslySetInnerHTML={{
                  __html: `
                  input[type=range].custom-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 24px;
                    height: 24px;
                    background: #ffffff;
                    border: 4px solid #3b82f6;
                    border-radius: 50%;
                    cursor: grab;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    margin-top: -8px;
                  }
                  input[type=range].custom-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.5);
                  }
                  input[type=range].custom-slider::-webkit-slider-thumb:active {
                    cursor: grabbing;
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
                  }
                  input[type=range].custom-slider::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 8px;
                    background: #334155;
                    border-radius: 4px;
                  }
                `}} />
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={missedCalls}
                  onChange={(e) => setMissedCalls(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer bg-transparent relative z-20 custom-slider mb-2"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #2563eb ${(missedCalls - 5) / (50 - 5) * 100}%, transparent ${(missedCalls - 5) / (50 - 5) * 100}%, transparent 100%)`
                  }}
                />

                <div className="flex justify-between mt-2">
                  <span className="font-['Inter'] font-[500] text-gray-500 text-[13px]">5</span>
                  <span className="font-['Inter'] font-[500] text-gray-500 text-[13px]">50</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 text-blue-400 font-['Inter'] font-[600] text-[16px]">
                <span className="material-symbols-outlined text-red-400 text-[20px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
                <span>You're losing ≈ <AnimatedNumber value={weeklyRevenueLost} prefix="$" /> per week</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Results Card */}
          <div className="w-full lg:w-[45%] relative">
            {/* Glow effect behind card */}
            <div className="absolute -inset-10 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none"></div>

            <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-2 border-blue-400/40 p-10 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)] relative z-10 transition-shadow duration-300">

              <div className="mb-6">
                <p className="font-['Inter'] font-[500] text-gray-400 text-[12px] md:text-[13px] uppercase tracking-wider mb-2">Weekly Potential</p>
                <p className="font-['Manrope'] font-[700] text-white text-[32px]">
                  <AnimatedNumber value={weeklyRevenueLost} prefix="$" />
                </p>
              </div>

              <div className="border-t border-[#334155] my-6 opacity-30"></div>

              <div className="mb-6">
                <p className="font-['Inter'] font-[500] text-gray-400 text-[12px] md:text-[13px] uppercase tracking-wider mb-2">Monthly Potential</p>
                <p className="font-['Manrope'] font-[700] text-white text-[32px]">
                  <AnimatedNumber value={monthlyRevenueLost} prefix="$" />
                </p>
              </div>

              <div className="border-t border-[#334155] my-8 opacity-30"></div>

              <div>
                <p className="font-['Inter'] font-[600] text-red-400 text-[11px] uppercase tracking-[0.08em] mb-3">
                  Annual Revenue Lost (Conservative Estimate)
                </p>
                <p className="font-['Manrope'] font-[800] text-[#60a5fa] text-[48px] md:text-[56px] leading-none tracking-tighter" style={{ textShadow: '0 0 30px rgba(96, 165, 250, 0.3)' }}>
                  <AnimatedNumber value={yearlyRevenueLost} prefix="$" />
                </p>
              </div>

              <p className="font-['Inter'] font-[400] text-gray-500 text-[12px] italic mt-6 leading-relaxed">
                *Based on $65 average booking value and 80% conversion rate on answered calls
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Social Proof (High Impact Testimonials) */}
      <section className="py-24 px-8 bg-white overflow-hidden relative" id="social-proof">
        <div className="max-w-[1280px] mx-auto">
          {/* Header Area */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <span className="text-[13px]">⭐</span>
              <span className="text-blue-600 font-['Inter'] font-[600] text-[13px] uppercase tracking-[0.08em]">Customer Results</span>
            </div>
            <h2 className="font-['Manrope'] font-[700] text-[#0A1628] text-[32px] md:text-[40px] leading-[1.2] tracking-[-0.02em] mb-4">
              Trusted by Independent Lot Owners Across the U.S.
            </h2>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="material-symbols-outlined text-blue-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-['Inter'] font-[600] text-[16px] text-[#0A1628]">4.9/5 average operator satisfaction</span>
            </div>
            <p className="font-['Inter'] font-[400] text-gray-600 text-[18px] max-w-[600px] mx-auto">
              Hear from those who no longer miss their nights to telephone calls.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch mb-16">
            {[
              {
                q: "I was skeptical about AI... but this is just like having an employee who never sleeps. I can actually enjoy dinner with my family now.",
                a: "Dave R.",
                t: "Logistics Lot Owner",
                l: "Texas",
                initial: "D"
              },
              {
                q: "I used to find 5-6 missed calls every morning. Now those are reservations waiting for me when I log in. It paid for itself in two nights.",
                a: "Mark S.",
                t: "Metro Parking Hub",
                l: "Georgia",
                initial: "M"
              },
              {
                q: "The AI knows all my reefer and hazmat rules. It's more reliable than my last night-shift hire and costs a fraction of the price.",
                a: "Kevin L.",
                t: "Interstate Truck Stop",
                l: "Illinois",
                initial: "K"
              }
            ].map((test, idx) => (
              <div key={idx} className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-lg hover:border-blue-200 transform transition-all duration-300 hover:-translate-y-1 flex flex-col relative group">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md">
                    <span className="material-symbols-outlined text-[14px]">shield_with_heart</span>
                    <span className="font-['Inter'] font-[600] text-[11px] uppercase tracking-[0.05em]">Verified Lot Owner</span>
                  </div>
                </div>

                <div className="relative mb-8">
                  <span className="absolute -top-4 -left-2 text-[48px] text-blue-100 font-serif leading-none select-none">"</span>
                  <p className="font-['Inter'] font-[400] text-gray-700 text-[16px] leading-[1.7] italic relative z-10">
                    {test.q}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-[56px] h-[56px] bg-gradient-to-br from-[#1e293b] to-[#2563eb] rounded-full flex items-center justify-center text-white font-['Manrope'] font-[600] text-[24px]">
                    {test.initial}
                  </div>
                  <div>
                    <p className="font-['Manrope'] font-[600] text-[17px] text-[#0A1628] leading-tight">{test.a}</p>
                    <p className="font-['Inter'] font-[400] text-gray-600 text-[14px]">{test.t}</p>
                    <p className="font-['Inter'] font-[400] text-gray-500 text-[13px]">{test.l}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="mt-16 pt-16 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12 md:gap-0">
              <div className="flex-1 text-center">
                <p className="font-['Manrope'] font-[700] text-[#0A1628] text-[64px] leading-none mb-2">
                  <AnimatedNumber value={100} suffix="%" />
                </p>
                <p className="font-['Inter'] font-[500] text-gray-600 text-[14px] uppercase tracking-[0.05em]">Call Answer Rate</p>
              </div>

              <div className="hidden md:block w-[1px] h-[60px] bg-gray-200"></div>

              <div className="flex-1 text-center">
                <p className="font-['Manrope'] font-[700] text-[#0A1628] text-[64px] leading-none mb-2">
                  <AnimatedNumber value={30} suffix="s" />
                </p>
                <p className="font-['Inter'] font-[500] text-gray-600 text-[14px] uppercase tracking-[0.05em]">Avg Booking Time</p>
              </div>

              <div className="hidden md:block w-[1px] h-[60px] bg-gray-200"></div>

              <div className="flex-1 text-center">
                <p className="font-['Manrope'] font-[700] text-[#0A1628] text-[64px] leading-none mb-2">
                  24/7
                </p>
                <p className="font-['Inter'] font-[500] text-gray-600 text-[14px] uppercase tracking-[0.05em]">Uptime Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-8 bg-gray-50 border-t border-gray-100" id="pricing">
        <div className="max-w-[1200px] mx-auto">
          {/* Header Area */}
          <div className="text-center mb-16">
            <h2 className="font-['Manrope'] font-[700] text-[#0A1628] text-[36px] md:text-[44px] leading-[1.2] tracking-[-0.02em] mb-4">
              Simple Pricing. Professional Power.
            </h2>
            <p className="font-['Inter'] font-[400] text-gray-600 text-[18px]">
              One plan. Everything included. Zero hidden fees.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* LEFT: Pricing Card */}
            <div className="bg-white border-[3px] border-blue-500 rounded-[24px] p-10 shadow-xl shadow-blue-500/10 relative max-w-[520px] mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full mb-6">
                <span className="material-symbols-outlined text-[14px]">star</span>
                <span className="font-['Inter'] font-[700] text-[12px] uppercase tracking-[0.08em]">Standard Plan</span>
              </div>

              <h3 className="font-['Manrope'] font-[600] text-[20px] text-[#0A1628] mb-4">ParkAI Professional</h3>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="font-['Manrope'] font-[800] text-[#0A1628] text-[72px] leading-none">$200</span>
                <span className="font-['Manrope'] font-[400] text-gray-600 text-[24px]">/month</span>
              </div>

              <div className="border-t border-gray-100 my-8"></div>

              <ul className="space-y-4 mb-10">
                {[
                  "Unlimited calls answering",
                  "Full lot inventory sync",
                  "Automated SMS confirmations",
                  "Natural voice selection",
                  "Custom lot rules engine",
                  "Live dashboard access"
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="bg-blue-50 rounded-full p-1 mt-0.5">
                      <span className="material-symbols-outlined text-blue-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                    <span className="font-['Inter'] font-[400] text-[#0A1628] text-[16px] leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>

              <Link to="/onboarding" className="w-full py-4 px-10 bg-[#0A1628] text-white rounded-xl font-['Inter'] font-[600] text-[18px] transition-all duration-200 shadow-lg shadow-navy-900/20 hover:bg-[#1A2638] hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02] flex items-center justify-center gap-2 mb-6">
                Start 7-Day Free Trial
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  <span className="font-['Inter'] font-[500] text-gray-600 text-[14px]">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  <span className="font-['Inter'] font-[500] text-gray-600 text-[14px]">Cancel anytime</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  <span className="font-['Inter'] font-[500] text-gray-600 text-[14px]">5-min setup</span>
                </div>
              </div>
            </div>

            {/* RIGHT: Economic Analysis */}
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-[16px] p-8 shadow-md max-w-[520px] mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 bg-[#F0F2F5] border border-gray-200 rounded-full px-4 py-2 mb-6">
                <span className="text-[12px]">💰</span>
                <span className="text-[#0A1628] font-['Inter'] font-[600] text-[12px] uppercase tracking-wider">ROI Breakdown</span>
              </div>

              <h3 className="font-['Manrope'] font-[700] text-[#0A1628] text-[20px] uppercase tracking-[0.05em] mb-8">Economic Analysis</h3>

              <div className="space-y-4 mb-6">
                {/* Alternative */}
                <div className="bg-red-50/50 border-2 border-red-100 rounded-xl p-5 flex items-center gap-5">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-red-500">person_remove</span>
                  </div>
                  <div>
                    <p className="font-['Inter'] font-[600] text-red-700 text-[15px]">Night-Shift Temp Hire</p>
                    <p className="font-['Manrope'] font-[700] text-red-700 text-[28px] leading-tight">$1,600/mo</p>
                    <p className="font-['Inter'] font-[400] text-red-600 text-[13px] mt-1">+ Payroll taxes, training, turnover</p>
                  </div>
                </div>

                {/* ParkAI Solution */}
                <div className="bg-blue-50/50 border-2 border-blue-500 rounded-xl p-5 flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-600">auto_awesome</span>
                  </div>
                  <div>
                    <p className="font-['Inter'] font-[600] text-blue-700 text-[15px]">ParkAI Manager</p>
                    <p className="font-['Manrope'] font-[700] text-blue-700 text-[28px] leading-tight">$200/mo</p>
                    <p className="font-['Inter'] font-[400] text-blue-600 text-[13px] mt-1">Zero overhead. Zero sick days.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 text-center shadow-lg shadow-blue-500/20 mb-6">
                <p className="font-['Manrope'] font-[800] text-[36px] leading-none">83% Cost Reduction</p>
              </div>

              <p className="font-['Inter'] font-[400] text-gray-700 text-[15px] leading-[1.6] text-center max-w-[400px] mx-auto">
                No taxes, no sick days, no breaks. Just consistent revenue capture while you sleep.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-8 bg-white" id="faq">
        <div className="max-w-[900px] mx-auto">
          {/* Header Area */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#F0F2F5] border border-gray-200 rounded-full px-4 py-2 mb-6">
              <span className="text-[13px]">❓</span>
              <span className="text-[#0A1628] font-['Inter'] font-[600] text-[13px] uppercase tracking-[0.08em]">Common Questions</span>
            </div>
            <h2 className="font-['Manrope'] font-[700] text-[#0A1628] text-[32px] md:text-[40px] leading-[1.2] tracking-[-0.02em] mb-4">
              Operational Questions?
            </h2>
            <p className="font-['Inter'] font-[400] text-gray-600 text-[18px]">
              Everything you need to know about running ParkAI at your lot.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-8 bg-[#0A1628] relative overflow-hidden">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/30 rounded-full px-4 py-2 mb-6">
            <span className="text-blue-400 text-[14px]">⚡</span>
            <span className="text-blue-400 font-['Inter'] font-[600] text-[12px] uppercase tracking-[0.08em]">Get Started Today</span>
          </div>

          <h2 className="font-['Manrope'] font-[700] text-white text-[32px] md:text-[44px] leading-[1.2] tracking-[-0.02em] mb-4">
            Ready to Capture Every Booking?
          </h2>
          <p className="font-['Inter'] font-[400] text-gray-300 text-[20px] leading-[1.5] mb-10 max-w-[600px] mx-auto">
            Join 50+ lot owners who never miss a call—even at 3 AM.
          </p>

          <div className="relative group inline-block">
            {/* Radial glow behind button */}
            <div className="absolute -inset-4 bg-blue-500/10 blur-[30px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="flex flex-col sm:flex-row gap-5 items-center justify-center relative z-10">
              <Link to="/onboarding" className="py-4 px-10 bg-blue-600 text-white rounded-xl font-['Inter'] font-[600] text-[18px] shadow-lg shadow-blue-600/30 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 hover:scale-[1.02] flex items-center gap-2">
                Start Free Trial
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>

              <button className="py-4 px-10 bg-transparent border-2 border-blue-400 text-blue-400 rounded-xl font-['Inter'] font-[600] text-[18px] transition-all duration-200 hover:bg-blue-500/10">
                Talk to Sales
              </button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-['Inter'] font-[500] text-gray-400 text-[15px]">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-['Inter'] font-[500] text-gray-400 text-[15px]">5-min setup</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span className="font-['Inter'] font-[500] text-gray-400 text-[15px]">Cancel anytime</span>
            </div>
          </div>

          {/* Inline stats row */}
          <div className="mt-8 pt-8 border-t border-white/5 flex justify-center items-center gap-4 text-gray-400 font-['Inter'] font-[500] text-[14px]">
            <span>⭐ 4.9/5 satisfaction</span>
            <span className="text-gray-600">•</span>
            <span>📞 10,000+ calls answered</span>
            <span className="text-gray-600">•</span>
            <span>💰 $2M+ revenue captured</span>
          </div>
        </div>
      </section>

      {/* Visual Separator */}
      <div className="bg-[#0A1628] flex items-center justify-center relative">
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      </div>

      {/* Footer */}
      {/* Footer */}
      <footer className="bg-[#0F1F3A] pt-20 pb-8 relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 items-start">
            {/* Column 1: Brand */}
            <div className="flex flex-col">
              <div className="text-[22px] font-['Manrope'] font-[700] text-white tracking-tight mb-3">
                TruckPark AI
              </div>
              <p className="font-['Inter'] font-[400] text-gray-400 text-[15px] leading-[1.6]">
                Never miss a booking. Even at 3 AM. Recover your nights with intelligent lot automation.
              </p>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="font-['Inter'] font-[600] text-gray-500 text-[12px] uppercase tracking-[0.05em] mb-4">Product</h4>
              <ul className="flex flex-col gap-[10px]">
                <li><a href="#features" className="font-['Inter'] font-[400] text-gray-400 text-[15px] hover:text-blue-400 transition-colors duration-200">Features</a></li>
                <li><a href="#pricing" className="font-['Inter'] font-[400] text-gray-400 text-[15px] hover:text-blue-400 transition-colors duration-200">Pricing</a></li>
                <li><a href="#how-it-works" className="font-['Inter'] font-[400] text-gray-400 text-[15px] hover:text-blue-400 transition-colors duration-200">How It Works</a></li>
                <li><a href="#social-proof" className="font-['Inter'] font-[400] text-gray-400 text-[15px] hover:text-blue-400 transition-colors duration-200">Testimonials</a></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h4 className="font-['Inter'] font-[600] text-gray-500 text-[12px] uppercase tracking-[0.05em] mb-4">Company</h4>
              <ul className="flex flex-col gap-[10px]">
                <li><Link to="/about" className="font-['Inter'] font-[400] text-gray-400 text-[15px] hover:text-blue-400 transition-colors duration-200">About Us</Link></li>
                <li><a href="#faq" className="font-['Inter'] font-[400] text-gray-400 text-[15px] hover:text-blue-400 transition-colors duration-200">Support & FAQ</a></li>
                <li><Link to="/contact" className="font-['Inter'] font-[400] text-gray-400 text-[15px] hover:text-blue-400 transition-colors duration-200">Contact</Link></li>
                <li><Link to="/blog" className="font-['Inter'] font-[400] text-gray-400 text-[15px] hover:text-blue-400 transition-colors duration-200">Operations Blog</Link></li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div>
              <h4 className="font-['Inter'] font-[600] text-gray-500 text-[12px] uppercase tracking-[0.05em] mb-4">Legal</h4>
              <ul className="flex flex-col gap-[10px]">
                <li><Link to="/privacy" className="font-['Inter'] font-[400] text-gray-400 text-[15px] hover:text-blue-400 transition-colors duration-200">Privacy Policy</Link></li>
                <li><Link to="/terms" className="font-['Inter'] font-[400] text-gray-400 text-[15px] hover:text-blue-400 transition-colors duration-200">Terms of Service</Link></li>
                <li><Link to="/security" className="font-['Inter'] font-[400] text-gray-400 text-[15px] hover:text-blue-400 transition-colors duration-200">Security</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t border-navy-800 pt-6 mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="font-['Inter'] font-[400] text-gray-500 text-[14px]">
              © 2026 TruckPark AI. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-gray-500 font-['Inter'] font-[400] text-[14px]">
              <span>Made with ❤️ for independent lot owners</span>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 ml-4">
                <span className="material-symbols-outlined text-[20px] align-middle">public</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
