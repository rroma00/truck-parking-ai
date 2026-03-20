import { useState, useEffect, useContext } from 'react';
import { LotContext } from '../context/LotContext';
import { dashboardService } from '../services/dashboardService';
import { LineChart, BarChart } from '../components/dashboard/DailyCharts';

export default function Analytics() {
  const { selectedLotId } = useContext(LotContext);
  const [analytics, setAnalytics] = useState(null);
  const [range, setRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    if (!selectedLotId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getAnalytics(selectedLotId, range);
      setAnalytics(data);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [selectedLotId, range]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex justify-between items-center bg-card-cream p-6 rounded-xl border border-text-olive/10 shadow-sm">
        <h2 className="text-xl font-bold text-text-olive">Analytics Hub</h2>
        <select 
          className="px-4 py-2 border border-text-olive/20 rounded-lg text-sm text-text-brown bg-transparent font-medium"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="7d">Past 7 Days</option>
          <option value="30d">Past 30 Days</option>
          <option value="90d">Past 90 Days</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 bg-card-cream rounded-xl text-center text-text-olive/60 font-medium animate-pulse">Computing vectors...</div>
      ) : error ? (
        <div className="py-8 px-6 bg-accent-warning-terracotta/10 border border-accent-warning-terracotta/30 rounded-xl text-center">
          <p className="text-text-brown mb-4 font-medium">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-text-olive text-card-cream rounded-lg text-sm font-medium">Retry</button>
        </div>
      ) : analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LineChart data={analytics.calls_per_day || []} />
          <BarChart data={analytics.bookings_per_day || []} />
        </div>
      )}
    </div>
  );
}
