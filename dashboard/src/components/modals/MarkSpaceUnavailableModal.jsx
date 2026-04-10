import { useState, useEffect, useRef } from 'react';

function CustomSelect({ options, value, onChange, placeholder, hasError, disabled }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        setFocusedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && focusedIndex >= 0 && isOpen) {
      e.preventDefault();
      const option = options[focusedIndex];
      onChange(option.value || option);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) setFocusedIndex(-1);
  }, [isOpen]);

  const selectedOption = options.find(o => (o.value || o) === value);
  const displayLabel = selectedOption ? (selectedOption.label || selectedOption) : placeholder;

  return (
    <div className="relative" ref={containerRef} onKeyDown={handleKeyDown}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-[48px] w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all outline-none 
          ${isOpen ? 'border-[#0058be] ring-[3px] ring-[#0058be]/15' : 'border-[#c6c5cf]/40'}
          ${hasError ? 'border-red-400 ring-[3px] ring-red-400/10 bg-red-50/30' : 'bg-white'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#0058be]/60 cursor-pointer'}
        `}
      >
        <span className={value ? 'text-[#050f36]' : 'text-[#9ca3af]'}>{displayLabel}</span>
        <span className={`material-symbols-outlined text-[#45464e] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-[14px] border border-[#c6c5cf]/20 bg-white shadow-[0_14px_50px_rgba(5,15,54,0.15)] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[220px] overflow-y-auto py-1.5 custom-scrollbar">
            {options.map((option, index) => {
              const optValue = option.value || option;
              const optLabel = option.label || option;
              const isSelected = value === optValue;
              const isFocused = focusedIndex === index;
              
              return (
                <button
                  key={optValue}
                  type="button"
                  onMouseEnter={() => setFocusedIndex(index)}
                  onClick={() => handleSelect(optValue)}
                  className={`flex w-full px-4 py-2.5 text-left text-sm font-medium transition-colors
                    ${isSelected ? 'bg-[#0058be] text-white' : isFocused ? 'bg-[#f1f4fb] text-[#050f36]' : 'text-[#050f36] hover:bg-[#f1f4fb]'}
                  `}
                >
                  {optLabel}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c6c5cf;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  );
}

export default function MarkSpaceUnavailableModal({ isOpen, onClose, availableSpaces, onMarkUnavailable }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  
  const [space, setSpace] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setSpace('');
      setReason('');
      setNotes('');
      setErrors({});
      setSuccess(false);
      const frameId = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frameId);
    }
    setIsVisible(false);
    const timeoutId = window.setTimeout(() => setShouldRender(false), 150);
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

  const handleSubmit = (e) => {
    e?.preventDefault();
    const newErrors = {};
    if (!space) newErrors.space = true;
    if (!reason) newErrors.reason = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    // Simulate API save
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onMarkUnavailable({ space, reason, notes });
      }, 1000);
    }, 1000);
  };

  const reasonOptions = [
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Damaged Surface', label: 'Damaged Surface' },
    { value: 'Reserved for Special Use', label: 'Reserved for Special Use' },
    { value: 'Weather Related', label: 'Weather Related' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div
      aria-modal="true"
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-[#000000]/40 px-3 py-3 sm:px-4 sm:py-4 backdrop-blur-[2px] transition-opacity duration-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
      role="dialog"
    >
      <div
        className={`flex w-full max-w-[500px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white shadow-2xl transition-all duration-150 ${isVisible ? 'scale-100 translate-y-0' : 'scale-[0.98] translate-y-2'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#ebeef5] px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-[#050f36] font-manrope">Mark Space Unavailable</h2>
            <p className="text-sm text-[#45464e] mt-1">Temporarily disable a parking space</p>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f4fb] text-[#45464e] transition-colors hover:bg-[#e5e8ef]"
            onClick={onClose}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6">
          {availableSpaces.length === 0 ? (
// ... existing UI ...

            <div className="flex flex-col items-center justify-center py-8 text-center bg-[#f1f4fb]/50 rounded-xl">
              <span className="material-symbols-outlined text-5xl text-[#9ca3af] mb-4">local_parking</span>
              <h3 className="text-lg font-black text-[#050f36] font-manrope">No available spaces</h3>
              <p className="text-sm text-[#45464e] mt-2 mb-6 max-w-[280px]">All parking spaces are currently occupied or unavailable</p>
              <button
                className="border border-[#c6c5cf]/40 bg-white hover:bg-[#f1f4fb] text-[#45464e] px-5 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer"
                onClick={onClose}
              >
                View Spaces
              </button>
            </div>
          ) : success ? (
            <div className="flex items-center justify-center py-10 flex-col animate-in fade-in">
              <span className="material-symbols-outlined text-green-500 text-6xl mb-4">check_circle</span>
              <p className="text-lg font-bold text-[#050f36]">Space {space} marked unavailable</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {Object.keys(errors).length > 0 && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600 text-[18px]">error</span>
                  Please select a space and reason
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[#45464e] mb-2">
                  Select Space <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  options={availableSpaces}
                  value={space}
                  placeholder="Choose a space..."
                  hasError={errors.space}
                  onChange={(val) => {
                    setSpace(val);
                    if (errors.space) setErrors({ ...errors, space: false });
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#45464e] mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <CustomSelect
                  options={reasonOptions}
                  value={reason}
                  placeholder="Select reason..."
                  hasError={errors.reason}
                  onChange={(val) => {
                    setReason(val);
                    if (errors.reason) setErrors({ ...errors, reason: false });
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#45464e] mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full rounded-xl border border-[#c6c5cf]/40 bg-white px-4 py-3 text-sm text-[#050f36] outline-none transition-all focus:border-[#0058be] focus:ring-2 focus:ring-[#0058be]/20 resize-none font-medium placeholder-[#9ca3af]"
                  rows="3"
                  maxLength="500"
                  placeholder="Add any additional details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </form>
          )}
        </div>

        <div className="border-t border-[#ebeef5] px-6 py-4 flex justify-between bg-[#f1f4fb]/30 mt-auto">
          <button
            className="border border-[#c6c5cf]/40 bg-white hover:bg-[#e5e8ef] text-[#45464e] px-6 py-2 rounded-lg font-bold text-sm transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          {!success && availableSpaces.length > 0 && (
            <button
              className="bg-[#0058be] text-white hover:bg-blue-600 px-6 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-70 flex items-center justify-center min-w-[150px]"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>progress_activity</span>
              ) : (
                'Mark Unavailable'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
