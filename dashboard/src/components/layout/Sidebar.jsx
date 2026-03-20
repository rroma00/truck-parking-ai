import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/call-logs', label: 'Call Logs', icon: 'call' },
  { path: '/reservations', label: 'Reservations', icon: 'calendar_month' },
  { path: '/parking-availability', label: 'Parking Availability', icon: 'directions_car' },
  { path: '/pricing', label: 'Pricing', icon: 'sell' },
];

const systemItems = [
  { path: '/ai-settings', label: 'AI Settings', icon: 'memory' },
  { path: '/messages', label: 'Messages', icon: 'chat' },
  { path: '/analytics', label: 'Analytics', icon: 'bar_chart' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="material-symbols-outlined">local_parking</span>
        </div>
        <div>
          <h1 className="sidebar-title">ParkAI</h1>
          <p className="sidebar-subtitle">Botanical Suite</p>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="sidebar-section-title">System Operations</div>
        
        {systemItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAtZo9gzl6o14H9_bI6VxCoPIBml95WFyTe04jBXeLEeVvijHtVM6MZYBZfURSc-_4Y-iI86ZNyBeXiMGGOOR8zvQQjMm44hAeG9UTTgR6l13nlKNl03TUdAfcDS8jJgrjCL3sTY9ZwN02XvkACY9K4C7Y8L5ajnCu6BQ-Lm-aA5w2RtQ24MNPWbVkgP1GxR0rvHYVeb0Ciaf71SrwXQtUbBjFJY76jRvPDB9P2e-96NXV17mo4JUGJxSbhwEiXsBCB4qbNLnQW0k8')" }}></div>
          <div className="user-info">
            <p className="user-name">Alex Rivera</p>
            <p className="user-role">Facility Admin</p>
          </div>
          <span className="material-symbols-outlined text-white-40 text-sm">unfold_more</span>
        </div>
      </div>
    </aside>
  );
}
