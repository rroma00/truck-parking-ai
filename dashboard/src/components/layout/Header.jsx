export default function Header() {
  return (
    <header className="header">
      <div className="search-container">
        <span className="material-symbols-outlined search-icon">search</span>
        <input 
          className="search-input" 
          placeholder="Search analytics, reservations, or logs..." 
          type="text"
        />
      </div>
      
      <div className="header-actions">
        <button className="btn-primary">
          <span className="material-symbols-outlined text-sm">add</span>
          New Reservation
        </button>
        <div className="header-divider"></div>
        <button className="notification-btn">
          <span className="material-symbols-outlined">notifications</span>
          <span className="notification-badge"></span>
        </button>
      </div>
    </header>
  );
}
