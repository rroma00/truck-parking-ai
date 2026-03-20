import { useState, useEffect, useContext } from 'react';
import { LotContext } from '../context/LotContext';
import { dashboardService } from '../services/dashboardService';

export default function CallLogs() {
  const { selectedLotId } = useContext(LotContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    if (!selectedLotId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getCallLogs(selectedLotId);
      setLogs(data || []);
    } catch (err) {
      setError(err.message || "Failed to load call logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedLotId]);

  return (
    <div className="bg-card-cream p-6 rounded-xl border border-text-olive/10 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text-olive">Communications & Call Logs</h2>
        <button 
          onClick={loadData}
          className="p-2 text-text-olive bg-text-olive/5 rounded-lg hover:bg-text-olive/10 transition-colors"
          title="Refresh"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-text-olive/60 font-medium animate-pulse">Loading communications...</div>
      ) : error ? (
        <div className="py-8 px-6 bg-accent-warning-terracotta/10 border border-accent-warning-terracotta/30 rounded-xl text-center">
          <p className="text-text-brown mb-4 font-medium">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-text-olive text-card-cream rounded-lg text-sm font-medium">Retry</button>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-12 text-center text-text-olive/50">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">forum</span>
          <p>No call or SMS logs recorded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-text-olive/10 text-sm text-text-olive/60">
                <th className="pb-3 px-4 font-medium">Time</th>
                <th className="pb-3 px-4 font-medium">Phone Number</th>
                <th className="pb-3 px-4 font-medium">Type</th>
                <th className="pb-3 px-4 font-medium">Message Body</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-olive/5">
              {logs.map(log => (
                <tr key={log.id} className="text-sm hover:bg-text-olive/5 transition-colors">
                  <td className="py-4 px-4 text-text-olive/70 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-text-brown font-medium">
                    {log.phone_number || 'Unknown'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                      log.event_type.includes('sms') ? 'bg-primary-botanical/10 text-primary-botanical' :
                      log.event_type.includes('missed') ? 'bg-accent-warning-terracotta/10 text-accent-warning-terracotta' :
                      'bg-text-olive/10 text-text-olive'
                    }`}>
                      {log.event_type.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-text-olive max-w-sm truncate" title={log.message}>
                    {log.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
