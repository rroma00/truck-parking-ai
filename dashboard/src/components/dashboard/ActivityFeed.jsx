export default function ActivityFeed({ activities = [] }) {
  const getIconStatus = (type) => {
    switch (type) {
      case 'reservation_created':
      case 'reservation_confirmed':
      case 'spot_reserved':
        return { icon: 'check_circle', bg: 'bg-accent-success-sage/10', color: 'text-accent-success-sage' };
      case 'call_inbound':
      case 'sms_inbound':
      case 'call_handled_ai':
        return { icon: 'call', bg: 'bg-primary-botanical/10', color: 'text-primary-botanical' };
      case 'reservation_cancelled':
      case 'call_missed':
        return { icon: 'error', bg: 'bg-accent-warning-terracotta/10', color: 'text-accent-warning-terracotta' };
      default:
        return { icon: 'info', bg: 'bg-text-olive/10', color: 'text-text-olive' };
    }
  };

  const getRelativeTime = (isoString) => {
    if (!isoString) return 'Just now';
    const diff = (new Date(isoString).getTime() - new Date().getTime()) / 60000;
    if (Math.abs(diff) < 1) return `Just now`;
    if (Math.abs(diff) < 60) return `${Math.abs(Math.round(diff))} mins ago`;
    return `${Math.abs(Math.round(diff / 60))} hours ago`;
  };

  if (activities.length === 0) {
    return (
      <div className="bg-card-cream p-8 rounded-xl border border-text-olive/10 shadow-sm text-center">
        <p className="text-text-olive">No recent activity found.</p>
      </div>
    );
  }

  return (
    <div className="bg-card-cream rounded-xl border border-text-olive/10 shadow-sm overflow-hidden mt-8">
      <div className="px-6 py-4 border-b border-text-olive/10 flex items-center justify-between">
        <h3 className="text-base font-bold text-text-olive">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-text-olive-5">
        {activities.map(activity => {
          const status = getIconStatus(activity.event_type);
          
          return (
            <div key={activity.id} className="px-6 py-4 flex items-center gap-4 hover:bg-accent-moss/5 transition-colors cursor-pointer">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${status.bg || 'bg-text-olive/10'}`}>
                <span className={`material-symbols-outlined text-xl ${status.color}`}>{status.icon}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-brown">{activity.message}</p>
                <p className="text-xs text-text-olive/60">{activity.phone_number ? `${activity.phone_number}` : 'System Notification'}</p>
              </div>
              
              <p className="text-xs text-text-olive/40 font-medium shrink-0">
                {getRelativeTime(activity.created_at)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
