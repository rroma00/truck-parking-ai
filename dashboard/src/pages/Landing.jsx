import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F7F9FF] text-[#050F36] selection:bg-[#2170e4] selection:text-white font-inter">
      {/* 1. Top Navigation */}
      <nav className="w-full flex items-center justify-between px-6 py-4 max-w-[1440px] mx-auto bg-[#F7F9FF]">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight font-manrope">ParkLog AI</span>
        </div>
        <div className="hidden md:flex gap-8 items-center font-medium text-sm text-[#45464E]">
          <a href="#product" className="text-[#0058be] border-b-2 border-[#0058be] pb-1">Product</a>
          <a href="#features" className="hover:text-[#050F36] transition-colors pb-1 border-b-2 border-transparent hover:border-[#050F36]">Features</a>
          <a href="#how-it-works" className="hover:text-[#050F36] transition-colors pb-1 border-b-2 border-transparent hover:border-[#050F36]">How It Works</a>
          <a href="#pricing" className="hover:text-[#050F36] transition-colors pb-1 border-b-2 border-transparent hover:border-[#050F36]">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-[#45464E] hover:text-[#050F36] hidden sm:block">Login</Link>
          <Link to="/onboarding" className="bg-[#050F36] hover:bg-[#0a1b5c] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm">Get Started</Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <div className="pt-16 pb-24 md:pt-24 md:pb-32 px-6 max-w-[1440px] mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="w-full md:w-1/2">
          <div className="inline-block bg-[#E5E8EF] text-[#050F36] text-xs font-bold tracking-widest px-3 py-1.5 rounded-full mb-6 uppercase">
            Precision Logistics
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold leading-[1.05] mb-6 font-manrope tracking-tight text-[#050F36]">
            Automate Your<br/>Truck Parking<br/>Operations with AI
          </h1>
          <p className="text-[#45464E] text-lg font-inter mb-10 max-w-lg leading-relaxed">
            Reduce calls by 80% and handle driver questions 24/7 with an AI assistant that knows your lot inside and out.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
            <Link to="/onboarding" className="bg-[#050F36] hover:bg-[#0a1b5c] text-white text-base px-8 py-3.5 rounded-lg font-semibold transition-all shadow-md w-full sm:w-auto text-center">
              Get Started
            </Link>
            <button className="bg-white hover:bg-gray-50 text-[#050F36] border border-gray-200 text-base px-8 py-3.5 rounded-lg font-semibold transition-all w-full sm:w-auto flex items-center justify-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-lg">play_circle</span>
              Watch Demo
            </button>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 relative bg-white p-2 rounded-2xl shadow-xl border border-gray-100 mt-12 md:mt-0">
          <img src="https://images.unsplash.com/photo-1586864387789-628af9feed72?q=80&w=2670&auto=format&fit=crop" className="w-full h-auto rounded-xl object-cover aspect-[4/3]" alt="Truck parking lot top down" />
          
          {/* Floating stat card */}
          <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-gray-100 p-4 flex items-center gap-4 pr-8">
            <div className="w-10 h-10 rounded-full bg-[#E5E8EF] flex items-center justify-center text-[#2170e4]">
              <span className="material-symbols-outlined text-xl">play_arrow</span>
            </div>
            <div>
              <div className="text-xl font-bold font-manrope">80%</div>
              <div className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Call Reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The Operations Logjam */}
      <div className="py-24 bg-white/50 border-y border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-5/12">
            <h2 className="text-3xl md:text-4xl font-bold font-manrope mb-6">The Operations Logjam</h2>
            <p className="text-[#45464E] text-base leading-relaxed mb-8">
              Managing a lot used to mean being on-call 24/7. Late-night arrivals, lost gate codes, and constant routine questions keep owners chained to their phones.
            </p>
            
            <div className="space-y-3">
              <div className="bg-[#FFF1F0] border border-[#FFCCC7] p-4 rounded-xl flex items-center gap-4 text-[#A8071A]">
                <span className="material-symbols-outlined rounded-full p-1 bg-[#FFA39E]/30 text-sm">phone_missed</span>
                <span className="font-medium text-sm">2 AM phone calls for gate code recovery</span>
              </div>
              <div className="bg-[#FFF1F0] border border-[#FFCCC7] p-4 rounded-xl flex items-center gap-4 text-[#A8071A]">
                <span className="material-symbols-outlined rounded-full p-1 bg-[#FFA39E]/30 text-sm">error</span>
                <span className="font-medium text-sm">Manual tracking of arrival delays</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-7/12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold font-manrope text-lg">Live Fleet Overview</h3>
                <span className="text-[10px] sm:text-xs font-bold text-[#0058be] bg-[#0058be]/10 px-2 py-1 rounded tracking-wide uppercase">System Active</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex border-l-4 border-[#0058be] bg-[#F7F9FF] p-4 rounded-r-lg justify-between items-center">
                  <div>
                    <div className="font-bold text-sm text-[#050F36]">Arrival: Unit 4492</div>
                    <div className="text-xs text-gray-500 mt-1">Gate Code Issued Automatically</div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">10:42 AM</div>
                </div>
                
                <div className="flex border-l-4 border-gray-300 bg-gray-50 p-4 rounded-r-lg justify-between items-center">
                  <div>
                    <div className="font-bold text-sm text-[#050F36]">Primary AI Action State</div>
                    <div className="text-xs text-gray-500 mt-1">Handling Incident</div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">08:15 AM</div>
                </div>
                
                <div className="flex border-l-4 border-[#0058be] bg-[#F7F9FF] p-4 rounded-r-lg justify-between items-center">
                  <div>
                    <div className="font-bold text-sm text-[#050F36]">Arrival: Unit 9921</div>
                    <div className="text-xs text-gray-500 mt-1">Space 2B Assigned</div>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">04:30 AM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Designed for Peak Efficiency */}
      <div className="py-24 max-w-[1440px] mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-manrope mb-4">Designed for Peak Efficiency</h2>
          <p className="text-[#45464E] text-base">Modernize your logistics hub with tools built for the realities of the road.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#F0F4FA] flex items-center justify-center text-[#050F36] mb-6">
              <span className="material-symbols-outlined text-xl">support_agent</span>
            </div>
            <h3 className="font-bold text-xl mb-3 font-manrope text-[#050F36]">24/7 Driver Support</h3>
            <p className="text-[#45464E] text-sm leading-relaxed">
              AI answers every question, even at 3 AM. No more missed calls or frustrated drivers waiting for a response.
            </p>
          </div>
          
          {/* Card 2 (Dark) */}
          <div className="bg-[#050F36] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-white">
            <div className="w-12 h-12 rounded-full bg-[#1b254b] flex items-center justify-center text-[#bbc4f4] mb-6 border border-white/10">
              <span className="material-symbols-outlined text-xl">login</span>
            </div>
            <h3 className="font-bold text-xl mb-3 font-manrope">Automated Arrival</h3>
            <p className="text-[#bbc4f4] text-sm leading-relaxed">
              Delivers pin gate codes and parking instructions instantly via SMS or app, ensuring a smooth, touchless entry every time.
            </p>
          </div>
          
          {/* Card 3 (Light Blue) */}
          <div className="bg-[#EAF1FF] rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#050F36] flex items-center justify-center text-white mb-6">
              <span className="material-symbols-outlined text-xl">phone_disabled</span>
            </div>
            <h3 className="font-bold text-xl mb-3 font-manrope text-[#050F36]">Call Reduction</h3>
            <p className="text-[#050F36]/80 text-sm leading-relaxed">
              Owners save hours every week by deflecting routine inquiries to the AI. Focus on scaling your business, not repeating your gate code.
            </p>
          </div>
          
          {/* Card 4 */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-[#FFF3E0] flex items-center justify-center text-[#E65100] mb-6">
              <span className="material-symbols-outlined text-xl">workspace_premium</span>
            </div>
            <h3 className="font-bold text-xl mb-3 font-manrope text-[#050F36]">Professional Experience</h3>
            <p className="text-[#45464E] text-sm leading-relaxed">
              Give your lot a modern, high-tech edge that drivers love. Build loyalty through reliability and tech-forward convenience.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Intelligence on Autopilot */}
      <div className="py-24 bg-[#050F36] text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold font-manrope mb-6">Intelligence on Autopilot</h2>
            <p className="text-[#bbc4f4] text-lg mb-8 leading-relaxed max-w-lg">
              Watch how ParkLog AI handles driver communications with precision and speed, 24 hours a day.
            </p>
            
            <ul className="space-y-5">
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white bg-white/20 rounded-full p-1 text-sm font-bold">check</span>
                <span className="font-medium">Instant natural language responses</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white bg-white/20 rounded-full p-1 text-sm font-bold">check</span>
                <span className="font-medium">Context-aware lot knowledge</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white bg-white/20 rounded-full p-1 text-sm font-bold">check</span>
                <span className="font-medium">Seamless escalation to human if needed</span>
              </li>
            </ul>
          </div>
          
          {/* Phone Mockup */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="w-full max-w-[320px] bg-white rounded-[40px] p-2 shadow-2xl relative border-4 border-gray-200">
              <div className="bg-white rounded-[32px] overflow-hidden flex flex-col h-[550px] border border-gray-100 relative">
                
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#050F36] text-white flex items-center justify-center text-xs">
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#050F36] leading-tight">ParkLog Assistant</div>
                      <div className="text-[10px] text-green-500 font-medium">● Online</div>
                    </div>
                  </div>
                </div>
                
                {/* Chat Area */}
                <div className="flex-1 bg-[#F7F9FF] p-4 flex flex-col gap-4 overflow-y-auto w-full">
                  
                  {/* Driver Msg */}
                  <div className="self-end bg-[#050F36] text-white text-xs p-3 rounded-2xl rounded-tr-sm max-w-[85%]">
                    Can I park there tonight after 11 PM?
                  </div>
                  
                  {/* AI Msg */}
                  <div className="self-start bg-white border border-gray-200 text-[#050F36] text-xs p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                    Yes, Mike! Your reservation at <span className="font-bold">Lot A</span> is valid for 24-hour access. Your gate code <span className="font-mono bg-gray-100 px-1 rounded">5678#</span> will be active starting at 10:45 PM. Drive safely!
                  </div>
                  
                  {/* Driver Msg */}
                  <div className="self-end bg-[#050F36] text-white text-xs p-3 rounded-2xl rounded-tr-sm max-w-[85%]">
                    Thanks! Where is the shower located?
                  </div>
                  
                  {/* AI Msg */}
                  <div className="self-start bg-white border border-gray-200 text-[#050F36] text-xs p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                    The showers are located in the Main Office building on the east side of the lot, right next to the driver lounge.
                  </div>
                  
                </div>
                
                {/* Input Area */}
                <div className="bg-white p-3 border-t border-gray-100">
                  <div className="bg-gray-100 rounded-full flex items-center px-4 py-2 border border-gray-200">
                    <span className="text-gray-400 text-xs flex-1">Type a message...</span>
                    <span className="material-symbols-outlined text-[#0058be] text-lg">send</span>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Simple Onboarding */}
      <div className="py-24 max-w-[1440px] mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-manrope mb-4">Simple Onboarding, Powerful Results</h2>
        <p className="text-[#45464E] text-base mb-16">Go from chaos to complete automation in three easy steps.</p>
        
        <div className="flex flex-col md:flex-row justify-between items-start relative max-w-4xl mx-auto gap-12 md:gap-4">
          
          {/* Connecting Line (Desktop only) */}
          <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-gray-200 -z-10"></div>
          
          {/* Step 1 */}
          <div className="flex flex-col items-center bg-white z-10 w-full md:w-1/3 px-4">
            <div className="w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center font-bold text-lg mb-6 shadow-sm">
              1
            </div>
            <h3 className="font-bold font-manrope text-lg mb-3">Setup Your Lot</h3>
            <p className="text-sm text-[#45464E] leading-relaxed">
              Enter basic lot details, location, and amenity information into our intuitive dashboard.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center bg-white z-10 w-full md:w-1/3 px-4">
            <div className="w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center font-bold text-lg mb-6 shadow-sm">
              2
            </div>
            <h3 className="font-bold font-manrope text-lg mb-3">Train the AI</h3>
            <p className="text-sm text-[#45464E] leading-relaxed">
              Toggle safety, access rules, and parking protocols. Our AI learns your specific operational style.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center bg-white z-10 w-full md:w-1/3 px-4">
            <div className="w-12 h-12 rounded-full border border-[#050F36] bg-[#050F36] text-white flex items-center justify-center font-bold text-lg mb-6 shadow-sm">
              3
            </div>
            <h3 className="font-bold font-manrope text-lg mb-3">Go Live</h3>
            <p className="text-sm text-[#45464E] leading-relaxed">
              The AI handles your drivers automatically via SMS and web chat. Enjoy your reclaimed time.
            </p>
          </div>
          
        </div>
      </div>

      {/* 7. Final CTA */}
      <div className="py-12 px-6 max-w-[1440px] mx-auto mb-16">
        <div className="bg-[#050F36] rounded-[32px] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Abstract background elements */}
          <div className="absolute top-0 left-0 w-full h-full text-white/5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 150%, currentColor 2px, transparent 2.5px)', backgroundSize: '40px 40px' }}></div>
          
          <h2 className="text-3xl md:text-5xl font-bold font-manrope mb-6 relative z-10">Ready to Automate?</h2>
          <p className="text-[#bbc4f4] text-lg mb-10 max-w-lg mx-auto relative z-10">
            Join the future of truck parking management and start saving hours today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link to="/onboarding" className="bg-[#0058be] hover:bg-[#2170e4] text-white text-base px-8 py-3.5 rounded-lg font-bold transition-all w-full sm:w-auto text-center shadow-lg">
              Get Started Now
            </Link>
            <button className="bg-transparent hover:bg-white/10 text-white border border-white/20 text-base px-8 py-3.5 rounded-lg font-bold transition-all w-full sm:w-auto text-center">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>

      {/* 8. Footer */}
      <footer className="w-full bg-[#f8fafc] border-t border-gray-200 py-12 px-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-extrabold tracking-tight font-manrope text-[#050F36]">ParkLog AI</span>
            </div>
            <p className="text-xs text-gray-500 max-w-xs">
              &copy; {new Date().getFullYear()} ParkLog AI. All rights reserved.<br/>
              Precision Logistics Automation.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            <div className="flex flex-col gap-2">
              <a href="#privacy" className="text-xs font-semibold text-gray-500 hover:text-[#050F36] uppercase tracking-wider">Privacy Policy</a>
              <a href="#terms" className="text-xs font-semibold text-gray-500 hover:text-[#050F36] uppercase tracking-wider">Terms of Service</a>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#docs" className="text-xs font-semibold text-gray-500 hover:text-[#050F36] uppercase tracking-wider">Documentation</a>
              <a href="#support" className="text-xs font-semibold text-gray-500 hover:text-[#050F36] uppercase tracking-wider">Support</a>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#contact" className="text-xs font-semibold text-gray-500 hover:text-[#050F36] uppercase tracking-wider">Contact Sales</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
