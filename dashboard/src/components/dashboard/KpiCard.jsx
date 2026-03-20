export default function KpiCard({ title, value, trend, trendIcon }) {
  const isUp = trendIcon === 'trending_up';
  const trendClass = isUp ? 'text-accent-success-sage' : 'text-accent-warning-terracotta';

  return (
    <div className="bg-card-cream p-5 rounded-xl border border-text-olive/10 shadow-sm transition-colors hover:shadow-md">
      <p className="text-text-olive/60 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-text-brown">{value}</h3>
        <span className={`${trendClass} text-xs font-bold flex items-center gap-1`}>
          {trend} <span className="material-symbols-outlined text-sm">{trendIcon}</span>
        </span>
      </div>
    </div>
  );
}
