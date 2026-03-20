export function LineChart({ data = [] }) {
  const safeData = data && data.length > 0 ? data : [0,0,0,0,0,0,0];
  const max = Math.max(...safeData, 10);
  const total = safeData.reduce((acc, val) => acc + val, 0);
  
  // Custom simple SVG path generator based on 400x120 viewing area
  // We have 7 points (0 to 6)
  const xStep = 400 / (safeData.length - 1 || 1);
  const points = safeData.map((val, i) => {
    const x = i * xStep;
    const y = 120 - (val / max) * 90; // scale to 90 leaving 30px padding at top
    return `${x},${y}`;
  });

  const pathStr = `M0,120 L${points.map(p => p).join(' L')} L400,120 Z`;
  const lineStr = `M${points.map(p => p).join(' L')}`;

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <div className="bg-card-cream p-6 rounded-xl border border-text-olive/10 shadow-sm flex flex-col justify-between" style={{ height: '300px' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-text-olive">Calls per Day</h3>
          <p className="text-text-olive/60 text-sm">Daily call volume tracking</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-text-brown">{total}</p>
          <p className="text-text-olive/40 text-xs">Past 7 days</p>
        </div>
      </div>
      
      <div className="flex-1 w-full relative">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 120">
          <defs>
            <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2F4F4F" stopOpacity="0.15"></stop>
              <stop offset="100%" stopColor="#2F4F4F" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
          <path d={pathStr} fill="url(#lineGradient)"></path>
          <path d={lineStr} fill="none" stroke="#2F4F4F" strokeLinecap="round" strokeWidth="3"></path>
        </svg>
        <div className="flex justify-between mt-4">
          {days.map((day, i) => (
            <span key={i} className="text-[10px] font-bold text-text-olive/50 uppercase" style={{fontSize:'10px', color: 'rgba(85, 107, 47, 0.5)'}}>{day}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BarChart({ data = [] }) {
  const safeData = data && data.length > 0 ? data : [0,0,0,0,0,0,0];
  const max = Math.max(...safeData, 10);
  const total = safeData.reduce((acc, val) => acc + val, 0);
  const days = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

  const bars = safeData.map((val, i) => ({
    day: days[i],
    height: `${Math.max(5, (val / max) * 100)}%`, // min 5% height visually
    active: val > (max * 0.7) // arbitrarily high values styled 'active'
  }));

  return (
    <div className="bg-card-cream p-6 rounded-xl border border-text-olive/10 shadow-sm flex flex-col justify-between" style={{ height: '300px' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-text-olive">Bookings per Day</h3>
          <p className="text-text-olive/60 text-sm">Conversion of calls to reservations</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-text-brown">{total}</p>
          <p className="text-text-olive/40 text-xs">Past 7 days</p>
        </div>
      </div>
      
      <div className="flex items-end justify-between flex-1 gap-4 px-2" style={{height: '180px'}}>
        {bars.map((bar, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 gap-2 h-full justify-end" title={`Bookings: ${safeData[idx]}`}>
            <div className="w-full relative group overflow-hidden" style={{height: bar.height, backgroundColor: 'rgba(85, 107, 47, 0.05)', borderRadius: '8px 8px 0 0'}}>
              <div className="absolute bottom-0 left-0 right-0 h-full transition-all" style={{backgroundColor: bar.active ? 'var(--text-olive)' : 'rgba(85, 107, 47, 0.2)'}}></div>
            </div>
            <span style={{fontSize:'10px', fontWeight: 'bold', color: 'rgba(85, 107, 47, 0.5)'}}>{bar.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
