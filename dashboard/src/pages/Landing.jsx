import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20 relative">
          <div className="text-2xl font-extrabold font-['Manrope'] text-[#050F36]">Parklio</div>
          <div className="hidden md:flex items-center space-x-8">
            <a className="text-[#45464E] font-medium hover:text-[#0058BE] transition-colors" href="#how-it-works">How It Works</a>
            <a className="text-[#45464E] font-medium hover:text-[#0058BE] transition-colors" href="#pricing">Pricing</a>
            <Link className="text-[#45464E] font-medium hover:text-[#0058BE] transition-colors" to="/login">Login</Link>
            <Link to="/onboarding" className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm hover:scale-[0.98] transition-all duration-200">
                Start Earning
            </Link>
          </div>
          {/* Mobile Menu Icon (Placeholder) */}
          <div className="md:hidden">
            <span className="material-symbols-outlined text-primary">menu</span>
          </div>
          <div className="bg-[#F1F4FB] h-[1px] w-full absolute bottom-0 opacity-10"></div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold tracking-wider uppercase">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              AI-Powered Marketplace
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight">
              Automate Your Truck Parking Operations with AI
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed max-w-xl">
              Fill your empty spaces, handle driver inquiries, and increase revenue — without extra work. Built for truck parking lot owners, yards, and logistics properties.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/onboarding" className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/10 hover:scale-[0.98] transition-all">
                Start Earning Today
              </Link>
              <button className="bg-surface-container-lowest text-primary px-8 py-4 rounded-xl font-bold text-lg border border-outline-variant/30 hover:bg-surface-container-low transition-all">
                See How It Works
              </button>
            </div>
          </div>
          {/* Hero Visual: Dashboard Mockup */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/10 to-transparent rounded-[2rem] blur-2xl"></div>
            <div className="relative bg-surface-container-lowest rounded-[2rem] shadow-2xl border border-white p-6 md:p-10 space-y-8 backdrop-blur-xl">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs font-medium text-outline">Dashboard / Fleet Overview</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low p-4 rounded-xl">
                  <div className="text-xs text-on-surface-variant font-medium">Total Spaces</div>
                  <div className="text-3xl font-extrabold text-primary">20</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <div className="text-xs text-green-700 font-medium">Available</div>
                  <div className="text-3xl font-extrabold text-green-600">8</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-on-surface-variant font-medium">Weekly Revenue</div>
                    <div className="text-4xl font-extrabold text-primary">$4,820</div>
                  </div>
                  <div className="text-green-600 font-bold text-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">trending_up</span> +12%
                  </div>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[60%] rounded-full"></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-outline tracking-widest uppercase">
                  <span>Occupied: 12</span>
                  <span>Limit: 20</span>
                </div>
              </div>
              <div className="pt-4 border-t border-surface-container">
                <div className="text-xs font-bold text-primary mb-3">Live Pricing Table</div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-surface-container-low border border-secondary/10">
                    <div className="text-[10px] uppercase font-bold text-outline">Daily</div>
                    <div className="font-bold text-primary">$25</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-surface-container-low border border-secondary/10">
                    <div className="text-[10px] uppercase font-bold text-outline">Weekly</div>
                    <div className="font-bold text-primary">$150</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-primary text-white">
                    <div className="text-[10px] uppercase font-bold opacity-70">Monthly</div>
                    <div className="font-bold">$500</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-surface-container-low py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-sm font-bold text-outline tracking-widest uppercase mb-8">Trusted by property owners nationwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale">
            <div className="text-xl font-black italic font-headline">LOGISTI-PRO</div>
            <div className="text-xl font-black italic font-headline">YARD MASTER</div>
            <div className="text-xl font-black italic font-headline">TRUCK-HUB</div>
            <div className="text-xl font-black italic font-headline">FREIGHT-SYNC</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">Stop Letting Empty Spaces Cost You Money</h2>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            Every unused parking spot is lost revenue. Most lot owners rely on word of mouth, manual coordination, or simply sit with empty capacity. Parklio changes that by turning your asset into a hands-off income stream.
          </p>
        </div>
      </section>

      {/* AI Features Section (The Bento Grid) */}
      <section className="py-24 px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold text-primary mb-4">AI That Works For You 24/7</h2>
            <p className="text-on-surface-variant">Our intelligence layer removes the friction from managing logistics property.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Feature */}
            <div className="md:col-span-2 bg-primary-container text-white p-10 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <span className="material-symbols-outlined text-4xl mb-6 text-secondary-fixed">ring_volume</span>
                  <h3 className="text-3xl font-bold mb-4">Instant Call Answers</h3>
                  <p className="text-primary-fixed-dim text-lg max-w-md">Our AI handles inbound calls and messages instantly. Drivers get prices, availability, and booking links without you lifting a finger.</p>
                </div>
                <div className="mt-8 flex gap-4">
                  <span className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">No Missed Leads</span>
                  <span className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium">24/7 Support</span>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
            </div>
            {/* Small Feature */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 p-10 rounded-3xl shadow-sm">
              <span className="material-symbols-outlined text-4xl mb-6 text-secondary">database</span>
              <h3 className="text-2xl font-bold text-primary mb-4">Automated Bookings</h3>
              <p className="text-on-surface-variant">Syncs directly with your payment processor to confirm spots and send entry codes automatically.</p>
            </div>
            {/* Another Small Feature */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 p-10 rounded-3xl shadow-sm">
              <span className="material-symbols-outlined text-4xl mb-6 text-secondary">wifi_off</span>
              <h3 className="text-2xl font-bold text-primary mb-4">Offline Logic</h3>
              <p className="text-on-surface-variant">Manage check-ins even when drivers have poor reception. Our terminal solutions ensure no truck is left behind.</p>
            </div>
            {/* Medium Feature */}
            <div className="md:col-span-2 bg-secondary text-white p-10 rounded-3xl flex flex-col md:flex-row gap-10 items-center">
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4">Real-time Pricing Info</h3>
                <p className="opacity-90 text-lg">AI monitors local demand and suggests optimal pricing for your daily, weekly, and monthly spots to maximize your lot's yield.</p>
              </div>
              <div className="flex-none bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-primary font-bold">AI</div>
                  <div className="text-sm font-bold">Suggested: +15%</div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-32 bg-white/20 rounded-full"></div>
                  <div className="h-2 w-24 bg-white/20 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-8 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="space-y-6 p-8 rounded-2xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/20 group">
              <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">1</div>
              <h3 className="text-2xl font-extrabold text-primary">List Your Parking</h3>
              <p className="text-on-surface-variant leading-relaxed">Add your lot location, total capacity, and preferred pricing in less than 5 minutes. No complex technical setup required.</p>
            </div>
            <div className="space-y-6 p-8 rounded-2xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/20 group">
              <div className="w-16 h-16 rounded-2xl bg-secondary text-white flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">2</div>
              <h3 className="text-2xl font-extrabold text-primary">AI Handles Everything</h3>
              <p className="text-on-surface-variant leading-relaxed">Our AI agent takes over communication. It answers calls, responds to texts, and qualifies drivers 24 hours a day, 7 days a week.</p>
            </div>
            <div className="space-y-6 p-8 rounded-2xl hover:bg-surface-container-low transition-all border border-transparent hover:border-outline-variant/20 group">
              <div className="w-16 h-16 rounded-2xl bg-green-600 text-white flex items-center justify-center text-2xl font-bold group-hover:scale-110 transition-transform">3</div>
              <h3 className="text-2xl font-extrabold text-primary">Get Bookings & Paid</h3>
              <p className="text-on-surface-variant leading-relaxed">Consistent income lands directly in your bank account. No more chasing payments or manual booking logs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-8 bg-surface-container-low">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary mb-6">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <h4 className="text-xl font-bold text-primary mb-3">Increase Occupancy</h4>
            <p className="text-on-surface-variant">Tap into our network of thousands of active truck drivers looking for safe, reliable parking tonight.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary mb-6">
              <span className="material-symbols-outlined">timer</span>
            </div>
            <h4 className="text-xl font-bold text-primary mb-3">Save Time</h4>
            <p className="text-on-surface-variant">Eliminate phone tag. Our system manages the administrative overhead of lot ownership so you can focus on scale.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary mb-6">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <h4 className="text-xl font-bold text-primary mb-3">Simple Setup</h4>
            <p className="text-on-surface-variant">You don't need a PhD to use Parklio. Go live in minutes and watch your dashboard update in real-time.</p>
          </div>
        </div>
      </section>

      {/* Product Preview Dashboard */}
      <section className="py-24 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl font-extrabold text-primary">Manage Everything From One Simple Dashboard</h2>
            <p className="text-on-surface-variant">Track availability, monitor revenue, and control pricing from your phone or desktop.</p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-secondary/5 blur-[120px] rounded-full"></div>
            <img alt="Parklio Dashboard" className="relative w-full rounded-3xl shadow-2xl border border-outline-variant/20 ring-1 ring-black/5" data-alt="Modern logistics software dashboard showing charts and data" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWb5ANQJ3_KResjCzvTKeLgZyKZ3ti33b3Wj_ZwzVqdvrXPaXJQvnPPYun9XLnbYMOYFwjblAlUW0bMYPH_aAUJ55UwKq1NulD6DjUA0qU3eK0hVBB0_ooplfWiFnqjB5iL1YbKGCrxtitK6j-bOZyvOGt7DkK1GSt_3gPO6y3Izc0urX4UGtp-DU2xsCENqZ__sN6z0SI059ww9pAuSN02OZJL5awx1wQsrPgPNgQKop5srcYyyMtVais_BbOC0xn1b8zwh2no_s" />
            {/* Floating Info Card */}
            <div className="absolute -bottom-10 -right-10 hidden lg:block bg-white p-6 rounded-2xl shadow-2xl border border-outline-variant/20 max-w-xs text-left animate-bounce-slow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs font-bold text-primary uppercase">New Booking Confirmed</span>
              </div>
              <div className="text-sm font-medium text-on-surface-variant mb-1">Lot 4 - Space 12A</div>
              <div className="text-lg font-bold text-primary">Driver ID: #TX-9021</div>
              <div className="mt-3 text-xs text-outline">Processed via AI Voice Agent</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto bg-primary rounded-[3rem] p-12 lg:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary blur-[150px] rounded-full"></div>
          </div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight">Start Earning From Your Parking Today</h2>
            <p className="text-xl text-primary-fixed-dim max-w-2xl mx-auto">
              No setup fees. Go live in minutes. Join hundreds of property owners who are already maximizing their yield with Parklio.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/onboarding" className="bg-secondary text-white px-10 py-5 rounded-2xl font-bold text-xl hover:scale-[1.02] transition-all shadow-xl shadow-black/20 text-center">
                Start Earning Today
              </Link>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/20 transition-all">
                Talk to an Expert
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface text-primary border-t border-outline-variant/20 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="space-y-6 max-w-xs">
              <div className="text-3xl font-extrabold font-headline">Parklio</div>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                The world's most advanced truck parking marketplace, powered by artificial intelligence.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-16">
              <div>
                <h5 className="font-bold text-primary mb-6">Product</h5>
                <ul className="space-y-4 text-sm text-on-surface-variant">
                  <li><a className="hover:text-secondary transition-colors" href="#">How It Works</a></li>
                  <li><a className="hover:text-secondary transition-colors" href="#">Pricing</a></li>
                  <li><a className="hover:text-secondary transition-colors" href="#">AI Features</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-primary mb-6">Company</h5>
                <ul className="space-y-4 text-sm text-on-surface-variant">
                  <li><a className="hover:text-secondary transition-colors" href="#">Contact</a></li>
                  <li><a className="hover:text-secondary transition-colors" href="#">About Us</a></li>
                  <li><a className="hover:text-secondary transition-colors" href="#">Careers</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-bold text-primary mb-6">Legal</h5>
                <ul className="space-y-4 text-sm text-on-surface-variant">
                  <li><a className="hover:text-secondary transition-colors" href="#">Terms</a></li>
                  <li><a className="hover:text-secondary transition-colors" href="#">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-20 pt-12 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-outline font-medium">© 2026 Parklio Logistics. All rights reserved.</div>
            <div className="flex gap-6">
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-secondary">language</span>
              <span className="material-symbols-outlined text-outline cursor-pointer hover:text-secondary">share</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
