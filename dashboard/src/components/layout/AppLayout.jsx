import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AppLayout() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-[#f1f4fb]">
      {/* SideNavBar */}
      <aside className="bg-slate-100 dark:bg-slate-900 h-screen w-64 left-0 top-0 fixed flex flex-col p-4 border-r border-slate-200 dark:border-slate-800 hidden lg:flex z-50">
        <div className="px-3 pt-2 pb-6">
          <span className="text-[22px] font-extrabold tracking-tight text-[#050f36] dark:text-slate-50 font-manrope">ParkLog AI</span>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            to="/dashboard"
            className={`rounded-xl font-semibold flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-all duration-150 font-label ${
              isActive('/dashboard')
                ? 'bg-white dark:bg-slate-800 text-[#0058be] dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>

          <Link
            to="/location"
            className={`rounded-xl flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-all duration-150 font-label ${
              isActive('/location')
                ? 'bg-white dark:bg-slate-800 text-[#0058be] dark:text-blue-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="material-symbols-outlined">location_on</span>
            <span>Locations</span>
          </Link>

          <Link
            to="/customers"
            className={`rounded-xl flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-all duration-150 font-label ${
              isActive('/customers')
                ? 'bg-white dark:bg-slate-800 text-[#0058be] dark:text-blue-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="material-symbols-outlined">group</span>
            <span>Customers</span>
          </Link>

          <Link
            to="/spaces"
            className={`rounded-xl flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-all duration-150 font-label ${
              isActive('/spaces')
                ? 'bg-white dark:bg-slate-800 text-[#0058be] dark:text-blue-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="material-symbols-outlined">grid_view</span>
            <span>Spaces</span>
          </Link>

          <Link
            to="/settings"
            className={`rounded-xl flex items-center gap-3 px-4 py-3 hover:translate-x-1 transition-all duration-150 font-label ${
              isActive('/settings')
                ? 'bg-white dark:bg-slate-800 text-[#0058be] dark:text-blue-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </Link>
        </nav>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* TopNavBar */}
        <header className="bg-white/90 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm dark:shadow-none border-b border-slate-200/50 dark:border-slate-800/50">
          <div className="flex justify-between items-center h-16 px-4 md:px-8">
            {/* Left: Logo (mobile) + Search */}
            <div className="flex items-center gap-4">
              <div className="lg:hidden">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-manrope">ParkLog AI</span>
              </div>
            </div>

            {/* Right: actions + user */}
            <div className="flex items-center gap-2 md:gap-3">
              <button className="p-2 text-[#45464e] hover:text-[#050f36] hover:bg-slate-100 rounded-lg transition-colors duration-150">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-2 text-[#45464e] hover:text-[#050f36] hover:bg-slate-100 rounded-lg transition-colors duration-150">
                <span className="material-symbols-outlined">help_outline</span>
              </button>
              <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-slate-900 font-manrope">Mike Johnson</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-label">Manager</p>
                </div>
                <img
                  alt="Manager Profile"
                  className="w-9 h-9 rounded-full border border-slate-200 shadow-sm object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATeyC3pX6IkT5-DlkDmY6xYmUAb3UrL_yG0XnJRh3UDoD1Ty5tioKVmgN_hiwMLkD-E9bxksAny5uFlaYqzZamBy-0bTy6GQ-UN6H4YXT4Wc1WuwVfL0DgrfJny5oYxbITdePWr_56BMYZ1MhUr_7EOcryYAJRkh4fUnzAiLYzhumV0KvEf31m3X5mivVPkRgmhjXMCh35kUniJ9ZnhBN4Va6F_Kj8LN1lVNJNkhD5kA5zBmf4558ONFGZExE1hMS-8pKBahHkGr8"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-10 lg:p-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
