import { useState, useEffect, useContext } from 'react';
import { LotContext } from '../context/LotContext';
import { dashboardService } from '../services/dashboardService';

export default function Pricing() {
  const { selectedLotId } = useContext(LotContext);
  const [pricing, setPricing] = useState(null);
  const [editVal, setEditVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    if (!selectedLotId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getPricing(selectedLotId);
      setPricing(data);
      setEditVal(data.overnight_price?.toString() || '');
    } catch (err) {
      setError(err.message || "Failed to load pricing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [selectedLotId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dashboardService.updatePricing(selectedLotId, parseFloat(editVal) || 0);
      alert('Pricing updated successfully!');
      loadData();
    } catch (err) {
      alert('Error updating pricing: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-card-cream p-6 rounded-xl border border-text-olive/10 shadow-sm max-w-xl">
      <h2 className="text-xl font-bold text-text-olive mb-6">Pricing Configuration</h2>

      {loading ? (
        <div className="py-12 text-center text-text-olive/60 font-medium animate-pulse">Loading pricing...</div>
      ) : error ? (
        <div className="py-8 px-6 bg-accent-warning-terracotta/10 border border-accent-warning-terracotta/30 rounded-xl text-center">
          <p className="text-text-brown mb-4 font-medium">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-text-olive text-card-cream rounded-lg text-sm font-medium">Retry</button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-text-olive mb-2">Overnight Price ($)</label>
            <input 
              required 
              type="number" 
              step="0.01" 
              className="w-full max-w-xs p-3 rounded-lg border border-text-olive/20 text-text-brown font-medium" 
              value={editVal} 
              onChange={e => setEditVal(e.target.value)} 
            />
          </div>
          <div>
            <button 
              type="submit" 
              disabled={saving}
              className={`px-6 py-3 bg-text-brown text-card-cream rounded-lg font-bold transition-colors ${saving ? 'opacity-50' : 'hover:bg-text-olive'}`}
            >
              {saving ? 'Saving...' : 'Save Pricing'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
