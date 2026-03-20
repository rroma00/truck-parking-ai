import { useState, useEffect, useContext } from 'react';
import { LotContext } from '../context/LotContext';
import { availabilityService } from '../services/availabilityService';

export default function ParkingAvailability() {
  const { selectedLotId } = useContext(LotContext);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const loadData = async () => {
    if (!selectedLotId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await availabilityService.getSpots(selectedLotId);
      setSpots(data || []);
    } catch (err) {
      setError(err.message || "Failed to load parking spots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [selectedLotId]);

  const handleStatusChange = async (spotId, newStatus) => {
    try {
      if (newStatus === 'release') {
        if (window.confirm("Release this spot and complete any active reservations?")) {
          setSavingId(spotId);
          await availabilityService.releaseSpot(spotId, "Operator manual release");
          await loadData();
        }
      } else {
        setSavingId(spotId);
        await availabilityService.updateSpotStatus(spotId, newStatus, "Operator manual update");
        await loadData();
      }
    } catch (err) {
      alert("Error updating spot: " + err.message);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="bg-card-cream p-6 rounded-xl border border-text-olive/10 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text-olive">Parking Availability</h2>
        <button onClick={loadData} className="p-2 text-text-olive bg-text-olive/5 rounded-lg hover:bg-text-olive/10 transition-colors" title="Refresh">
          <span className="material-symbols-outlined text-sm">refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-text-olive/60 font-medium animate-pulse">Loading spots...</div>
      ) : error ? (
        <div className="py-8 px-6 bg-accent-warning-terracotta/10 border border-accent-warning-terracotta/30 rounded-xl text-center">
          <p className="text-text-brown mb-4 font-medium">{error}</p>
          <button onClick={loadData} className="px-4 py-2 bg-text-olive text-card-cream rounded-lg text-sm font-medium">Retry</button>
        </div>
      ) : spots.length === 0 ? (
        <div className="py-12 text-center text-text-olive/50">
          <span className="material-symbols-outlined text-4xl mb-2 opacity-50">local_parking</span>
          <p>No individual spots defined for this lot yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {spots.map(spot => {
            const isAvailable = spot.status === 'available';
            const isReserved = spot.status === 'reserved';
            const isOccupied = spot.status === 'occupied';
            
            return (
              <div 
                key={spot.id} 
                className={`p-4 rounded-xl border text-center transition-all flex flex-col justify-between h-32 ${
                  isAvailable ? 'bg-primary-botanical/5 border-primary-botanical/20 hover:border-primary-botanical/40' :
                  isReserved ? 'bg-accent-warning-terracotta/5 border-accent-warning-terracotta/20' :
                  'bg-text-olive/5 border-text-olive/20'
                }`}
              >
                <div>
                  <h3 className="text-xl font-bold text-text-brown mb-1">{spot.spot_number}</h3>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    isAvailable ? 'bg-primary-botanical/20 text-text-brown' :
                    isReserved ? 'bg-accent-warning-terracotta/20 text-accent-warning-terracotta' :
                    'bg-text-olive/20 text-text-olive'
                  }`}>
                    {spot.status}
                  </span>
                </div>
                
                <div className="mt-2">
                  <select 
                    className="w-full text-xs p-1 rounded border border-text-olive/20 bg-card-cream text-text-olive focus:outline-none disabled:opacity-50"
                    value=""
                    disabled={savingId === spot.id}
                    onChange={(e) => {
                      if (e.target.value) handleStatusChange(spot.id, e.target.value);
                    }}
                  >
                    <option value="" disabled>{savingId === spot.id ? 'Updating...' : 'Change Status'}</option>
                    {!isAvailable && <option value="release">Release Spot (Available)</option>}
                    {!isOccupied && <option value="occupied">Mark Occupied</option>}
                    {!isReserved && <option value="reserved">Mark Reserved</option>}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
