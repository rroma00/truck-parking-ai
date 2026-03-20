import { useState, useEffect, useContext } from 'react';
import { LotContext } from '../context/LotContext';
import { reservationsService } from '../services/reservationsService';
import { availabilityService } from '../services/availabilityService';

export default function Reservations() {
  const { selectedLotId } = useContext(LotContext);
  const [reservations, setReservations] = useState([]);
  const [availableSpots, setAvailableSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ spot_id: '', phone_number: '', customer_name: '', price: '' });

  const loadData = async () => {
    if (!selectedLotId) return;
    setLoading(true);
    setError(null);
    try {
      const [data, spotsData] = await Promise.all([
        reservationsService.getReservations(selectedLotId),
        availabilityService.getSpots(selectedLotId, { status: 'available' })
      ]);
      setReservations(data || []);
      setAvailableSpots(spotsData || []);
    } catch (err) {
      setError(err.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [selectedLotId]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (saving) return;
    
    setSaving(true);
    try {
      await reservationsService.createReservation({
        lot_id: selectedLotId,
        spot_id: formData.spot_id,
        phone_number: formData.phone_number,
        customer_name: formData.customer_name,
        vehicle_type: 'truck',
        status: 'confirmed',
        source: 'manual_dashboard',
        price: parseFloat(formData.price) || 0,
        notes: 'Created manually by operator'
      });
      setShowForm(false);
      setFormData({ spot_id: '', phone_number: '', customer_name: '', price: '' });
      loadData();
    } catch (err) {
      alert("Error creating reservation: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await reservationsService.cancelReservation(id, "Cancelled by operator");
        loadData();
      } catch (err) {
        alert("Error cancelling: " + err.message);
      }
    }
  };

  return (
    <div className="bg-card-cream p-6 rounded-xl border border-text-olive/10 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text-olive">Reservations</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-text-olive text-card-cream rounded-lg text-sm font-medium hover:bg-text-brown transition-colors">
            {showForm ? 'Close Form' : 'New Reservation'}
          </button>
          <button onClick={loadData} className="p-2 text-text-olive bg-text-olive/5 rounded-lg hover:bg-text-olive/10 transition-colors" title="Refresh">
            <span className="material-symbols-outlined text-sm">refresh</span>
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 p-4 bg-text-olive/5 rounded-lg grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-text-olive mb-1">Spot Number</label>
            <select 
              required 
              className="w-full p-2 rounded border border-text-olive/20 bg-card-cream" 
              value={formData.spot_id} 
              onChange={e => setFormData({...formData, spot_id: e.target.value})}
              disabled={saving}
            >
              <option value="" disabled>Select a spot</option>
              {availableSpots.map(s => (
                <option key={s.id} value={s.id}>Spot {s.spot_number}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-olive mb-1">Customer Name</label>
            <input required type="text" className="w-full p-2 rounded border border-text-olive/20" value={formData.customer_name} onChange={e => setFormData({...formData, customer_name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-olive mb-1">Phone</label>
            <input required type="text" className="w-full p-2 rounded border border-text-olive/20" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-olive mb-1">Price</label>
            <input required type="number" step="0.01" className="w-full p-2 rounded border border-text-olive/20" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <button type="submit" disabled={saving} className={`px-4 py-2 bg-text-brown text-card-cream rounded-lg text-sm font-medium transition-colors h-[42px] ${saving ? 'opacity-50' : 'hover:bg-text-olive'}`}>
            {saving ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="py-12 text-center text-text-olive/60 font-medium animate-pulse">Loading reservations...</div>
      ) : error ? (
        <div className="py-8 px-6 bg-accent-warning-terracotta/10 border border-accent-warning-terracotta/30 rounded-xl text-center">
          <p className="text-text-brown mb-4 font-medium">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-text-olive text-card-cream rounded-lg text-sm font-medium">Retry</button>
        </div>
      ) : reservations.length === 0 ? (
        <div className="py-12 text-center text-text-olive/50">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">calendar_month</span>
          <p>No reservations found for this lot.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-text-olive/10 text-sm text-text-olive/60">
                <th className="pb-3 px-4 font-medium">Customer</th>
                <th className="pb-3 px-4 font-medium">Phone</th>
                <th className="pb-3 px-4 font-medium">Spot ID</th>
                <th className="pb-3 px-4 font-medium">Status</th>
                <th className="pb-3 px-4 font-medium">Source</th>
                <th className="pb-3 px-4 font-medium text-right">Price</th>
                <th className="pb-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-olive/5">
              {reservations.map(r => (
                <tr key={r.id} className="text-sm hover:bg-text-olive/5 transition-colors">
                  <td className="py-3 px-4 text-text-brown font-medium">{r.customer_name || 'Unknown'}</td>
                  <td className="py-3 px-4 text-text-olive">{r.phone_number || '-'}</td>
                  <td className="py-3 px-4 text-text-olive">#{r.spot_id}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      r.status === 'cancelled' ? 'bg-accent-warning-terracotta/10 text-accent-warning-terracotta' :
                      r.status === 'completed' ? 'bg-text-olive/10 text-text-olive' :
                      r.status === 'confirmed' ? 'bg-accent-success-sage/10 text-accent-success-sage' :
                      'bg-text-olive/10 text-text-olive'
                    }`}>
                      {r.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-olive/70">{r.source}</td>
                  <td className="py-3 px-4 text-right font-medium text-text-brown">${Number(r.price).toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">
                    {['pending', 'confirmed', 'checked_in'].includes(r.status) && (
                      <button onClick={() => handleCancel(r.id)} className="text-xs font-bold text-accent-warning-terracotta hover:underline">Cancel</button>
                    )}
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
