import { Outlet, Link } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="app-container">
      <nav className="bg-[#F7F9FF] dark:bg-slate-950/80 backdrop-blur-xl docked full-width top-0 sticky z-50">
        <div className="flex justify-between items-center w-full px-12 h-20 max-w-[1920px] mx-auto relative">
          <div className="flex items-center gap-8">
            <span className="text-2xl font-extrabold tracking-tight text-[#050F36] dark:text-white font-manrope">ParkLog AI</span>
            <div className="hidden md:flex gap-6 items-center">
              <Link to="/dashboard" className="text-[#0058BE] dark:text-[#3b82f6] border-b-2 border-[#0058BE] dark:border-[#3b82f6] pb-1 font-bold">Locations</Link>
              <Link to="/drivers" className="text-[#45464E] dark:text-slate-400 hover:text-[#050F36] dark:hover:text-white transition-colors">Drivers</Link>
              <Link to="/analytics" className="text-[#45464E] dark:text-slate-400 hover:text-[#050F36] dark:hover:text-white transition-colors">Analytics</Link>
              <Link to="/settings" className="text-[#45464E] dark:text-slate-400 hover:text-[#050F36] dark:hover:text-white transition-colors">Settings</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#F1F4FB] dark:hover:bg-slate-800 rounded-md transition-all active:scale-95 duration-150 ease-in-out">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </button>
            <button className="p-2 hover:bg-[#F1F4FB] dark:hover:bg-slate-800 rounded-md transition-all active:scale-95 duration-150 ease-in-out">
              <span className="material-symbols-outlined text-on-surface-variant">help</span>
            </button>
            <img alt="User profile photo" className="w-10 h-10 rounded-full border-2 border-white shadow-sm ml-2" data-alt="Professional male user profile portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7BZ1I28jONZaZoZ7WOY8_-DQ3QQYgoRboU2bDqWBzEa2PL1XSSQsKnggnGFE5Art95MdamrtxNhnFTwWb9Vm7dzNHFd0G3k5dHU-A65JjTVvwZvjMN5FNE2XJsF9TYXkdrqZ-uxj2iPDgu723kGasudHcqtY6bsvxnyRLJ7KuELpTUBfEJnWNRID3_NRiPFL_ktlTpN5cqgNrhDb-iWedbtmT8fPChcbPjdrX_rHSJkChoulmwueYhBxSCxnzNhV_PyKYDotkavc" />
          </div>
          <div className="bg-[#F1F4FB] dark:bg-slate-900 h-px w-full absolute bottom-0 left-0"></div>
        </div>
      </nav>
      
      <main className="page-container max-w-[1920px] mx-auto px-12 py-12">
        <Outlet />
      </main>
      
      {/* Footer Space */}
      <div className="h-24"></div>
    </div>
  );
}
