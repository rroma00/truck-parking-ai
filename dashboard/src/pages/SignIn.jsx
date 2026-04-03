import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    // Proceed to dashboard directly for now, as auth is mocked
    // Sets some draft flag if we had a real flow, but for now just navigate
    navigate('/dashboard');
  };

  return (
    <div className="bg-[#fbfcff] text-[#081b44] min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-['Inter']">
      {/* Subtle Background Ornamentation */}
      <div 
        className="absolute inset-0 opacity-40 -z-10" 
        style={{ 
          backgroundImage: 'radial-gradient(#dde6f5 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }}
      />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0c2f75]/5 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#163e90]/5 rounded-full blur-3xl -z-10" />
      
      {/* Main Container */}
      <main className="w-full max-w-[440px] z-10">
        
        {/* Branding Anchor (Logo) */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-2 hover:opacity-90 transition">
            <span className="material-symbols-outlined text-[#163e90] text-4xl" data-icon="hub">hub</span>
            <span className="text-2xl font-black tracking-tight text-[#081b44] font-['Manrope']">
              TruckPark AI
            </span>
          </Link>
          <div className="px-3 py-1 bg-[#edf2fb] text-[#163e90] font-bold text-[10px] tracking-widest rounded-full uppercase">
            Operational Excellence
          </div>
        </div>
        
        {/* Login Card */}
        <section className="bg-white rounded-2xl p-8 md:p-10 shadow-[0_12px_40px_rgba(8,27,68,0.06)] border border-[#dde6f5]">
          
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-2xl font-black font-['Manrope'] text-[#081b44] tracking-tight mb-2">Welcome Back</h1>
            <p className="text-[#5b6783] text-sm">Sign in to manage your parking lot operations</p>
          </header>
          
          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-bold text-[#10285f] tracking-wide uppercase">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#7a879f] text-[20px]" data-icon="mail">mail</span>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email"
                  required
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#fcfdff] border border-[#dde6f5] rounded-xl text-[15px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400 text-[#081b44]" 
                />
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-bold text-[#10285f] tracking-wide uppercase">Password</label>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#7a879f] text-[20px]" data-icon="lock">lock</span>
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-[#fcfdff] border border-[#dde6f5] rounded-xl text-[15px] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400 text-[#081b44]" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a879f] hover:text-[#163e90] transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[20px]" data-icon="visibility">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>
            
            {/* Utilities */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-[#dde6f5] text-primary focus:ring-primary/20 bg-white" 
                />
                <span className="text-xs font-medium text-[#5b6783] group-hover:text-[#081b44] transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-xs font-bold text-[#163e90] hover:underline transition-all">
                Forgot password?
              </button>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-4 pt-2">
              <button 
                type="submit" 
                className="w-full py-4 px-6 bg-gradient-to-r from-[#0c2f75] to-[#163e90] text-white font-bold text-[15px] rounded-xl shadow-lg shadow-[#0c2f75]/20 hover:shadow-xl hover:shadow-[#0c2f75]/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Sign In
              </button>
            </div>
          </form>
          
          {/* Footer Action */}
          <footer className="mt-8 pt-6 border-t border-[#dde6f5] text-center">
            <p className="text-sm text-[#5b6783]">
              Don't have an account? 
              <Link to="/onboarding" className="text-[#163e90] font-bold hover:underline ml-1">
                Start Your Free Trial
              </Link>
            </p>
          </footer>
        </section>
        
        {/* Global Footer */}
        <footer className="mt-8 flex justify-center gap-6">
          <Link to="/privacy" className="text-[11px] font-bold text-[#7a879f] uppercase tracking-wider hover:text-[#081b44] transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-[11px] font-bold text-[#7a879f] uppercase tracking-wider hover:text-[#081b44] transition-colors">Terms of Service</Link>
        </footer>
        <div className="mt-6 text-center">
          <p className="text-[10px] font-semibold text-[#7a879f]/80 uppercase tracking-widest">© 2026 TruckPark AI. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
}
