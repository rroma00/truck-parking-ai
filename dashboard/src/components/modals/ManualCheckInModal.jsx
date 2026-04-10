import { useState, useEffect } from 'react';

export default function ManualCheckInModal({ isOpen, onClose, expectedArrivals, onCheckIn }) {
  const [loadingId, setLoadingId] = useState(null);
  const [successId, setSuccessId] = useState(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const frameId = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frameId);
    }
    setIsVisible(false);
    const timeoutId = window.setTimeout(() => {
      setShouldRender(false);
      setSuccessId(null); // Reset success state when closing
    }, 150);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender) return null;

  const handleCheckIn = (customer) => {
    setLoadingId(customer.id);
    // Simulate API Call
    setTimeout(() => {
      setLoadingId(null);
      setSuccessId(customer.id);
      setTimeout(() => {
        onCheckIn(customer);
        // Modal will close or stay based on parent logic, but UI will show success until parent removes it
      }, 1000);
    }, 1000);
  };

  return (
    <div
      aria-modal="true"
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-[#000000]/40 px-3 py-3 sm:px-4 sm:py-4 backdrop-blur-[2px] transition-opacity duration-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
      role="dialog"
    >
      <div
        className={`flex max-h-[80vh] w-full max-w-[600px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white shadow-2xl transition-all duration-150 ${isVisible ? 'scale-100 translate-y-0' : 'scale-[0.98] translate-y-2'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#ebeef5] px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-[#050f36] font-manrope">Manual Check-In</h2>
            <p className="text-sm text-[#45464e] mt-1">Select customer to check in</p>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f4fb] text-[#45464e] transition-colors hover:bg-[#e5e8ef]"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4 bg-[#f1f4fb]/50 flex-1">
          {expectedArrivals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="material-symbols-outlined text-5xl text-[#9ca3af] mb-4">event_busy</span>
              <h3 className="text-lg font-black text-[#050f36] font-manrope">No expected arrivals to check in</h3>
              <p className="text-sm text-[#45464e] mt-2 mb-6">All arrivals for today have been checked in or are not yet due</p>
              <button
                className="text-sm font-bold text-[#0058be] hover:underline cursor-pointer"
                onClick={onClose} /* Assuming we don't navigate actually as requested */
              >
                View All Reservations →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {expectedArrivals.map((customer) => (
                <div key={customer.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#c6c5cf]/20 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {successId === customer.id ? (
                    <div className="w-full flex items-center gap-2 text-green-700 font-bold justify-center py-2 animate-pulse">
                      <span className="material-symbols-outlined">check_circle</span>
                      {customer.name} checked in to Space {customer.space}
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center justify-between sm:justify-start sm:gap-6 mb-1">
                          <p className="font-bold text-[#050f36] truncate">{customer.name}</p>
                          <div className="flex items-center gap-1.5 text-sm font-medium text-[#0058be]">
                            <span className="material-symbols-outlined text-lg">local_shipping</span>
                            {customer.space}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#45464e] mt-1.5">
                          <span className="truncate">{customer.company || customer.vehicle}</span>
                          <span className="bg-[#f1f4fb] px-2 py-0.5 rounded font-bold text-[#45464e]">Expected: {customer.time}</span>
                        </div>
                      </div>
                      <button
                        className="bg-[#0058be] text-white hover:bg-blue-600 px-5 py-2 rounded-lg font-bold text-sm transition-colors flex items-center justify-center min-w-[110px] disabled:opacity-70"
                        onClick={() => handleCheckIn(customer)}
                        disabled={loadingId === customer.id}
                      >
                        {loadingId === customer.id ? (
                          <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>progress_activity</span>
                        ) : (
                          'CHECK IN'
                        )}
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#ebeef5] px-6 py-4 flex justify-end bg-white">
          <button
            className="border border-[#c6c5cf]/40 bg-white hover:bg-[#f1f4fb] text-[#45464e] px-5 py-2 rounded-lg font-bold text-sm transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
