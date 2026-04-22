import React, { useState, useRef, useEffect } from 'react';

const CustomTimePicker = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial value (expected format "HH:mm AM/PM")
  const [time, setTime] = useState(value || "06:00 AM");
  
  const [h, m, p] = time.replace(':', ' ').split(' ');
  
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
  const periods = ['AM', 'PM'];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll lock effect
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTimeChange = (newH, newM, newP) => {
    const newTime = `${newH}:${newM} ${newP}`;
    setTime(newTime);
    if (onChange) onChange(newTime);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 bg-[#E8E9F3] border-none rounded-full px-5 flex items-center justify-between group hover:bg-[#DEDFEA] transition-all outline-none"
      >
        <span className="text-sm font-medium text-slate-900">{time}</span>
        <span className="material-symbols-outlined text-slate-400 text-lg group-hover:text-slate-500 transition-colors">schedule</span>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-100 z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between gap-2">
            {/* Hours */}
            <div className="flex-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase text-center mb-2">Hrs</div>
              <div className="h-40 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleTimeChange(hour, m, p)}
                    className={`w-full py-1.5 rounded-md text-sm font-medium transition-colors ${h === hour ? 'bg-[#1E3A8A] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes */}
            <div className="flex-1 border-x border-slate-50 px-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase text-center mb-2">Min</div>
              <div className="h-40 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                {minutes.map((min) => (
                  <button
                    key={min}
                    onClick={() => handleTimeChange(h, min, p)}
                    className={`w-full py-1.5 rounded-md text-sm font-medium transition-colors ${m === min ? 'bg-[#1E3A8A] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {min}
                  </button>
                ))}
              </div>
            </div>

            {/* AM/PM */}
            <div className="flex-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase text-center mb-2">Per</div>
              <div className="space-y-1">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => handleTimeChange(h, m, period)}
                    className={`w-full py-1.5 rounded-md text-sm font-medium transition-colors ${p === period ? 'bg-[#1E3A8A] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CustomDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 bg-[#E8E9F3] border-none rounded-full px-5 flex items-center justify-between group hover:bg-[#DEDFEA] transition-all outline-none"
      >
        <span className="text-sm font-medium text-slate-900">{selectedOption.label}</span>
        <span className={`material-symbols-outlined text-slate-400 text-lg group-hover:text-slate-500 transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-100 z-50 p-1 animate-in fade-in zoom-in-95 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${value === option.value ? 'bg-[#1E3A8A] text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Settings() {
  const [showToast, setShowToast] = useState(false);
  const [isOpen247, setIsOpen247] = useState(false);
  const [timezone, setTimezone] = useState('et');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    smsArrivals: false,
    dailySummary: true
  });

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const inputClasses = "w-full h-11 bg-white border border-[#E5E7EB] rounded-md px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E3A8A] focus:ring-4 focus:ring-[#1E3A8A]/5 transition-all outline-none";

  const timezoneOptions = [
    { value: 'et', label: 'Eastern Time (ET)' },
    { value: 'ct', label: 'Central Time (CT)' },
    { value: 'mt', label: 'Mountain Time (MT)' },
    { value: 'pt', label: 'Pacific Time (PT)' }
  ];

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700 relative pb-32">
      {/* Success Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-8 z-[100] bg-white shadow-[0_12px_40px_rgba(24,28,33,0.12)] rounded-lg p-4 flex items-center gap-3 border border-slate-200 transform transition-all duration-300 animate-in slide-in-from-right-full">
          <span className="material-symbols-outlined text-green-500 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <p className="font-body text-sm font-medium text-slate-900">Settings saved successfully</p>
          <button onClick={() => setShowToast(false)} className="ml-4 text-slate-400 hover:text-slate-600">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Sticky Save Button */}
      <button 
        onClick={handleSave}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-[#050f36] to-[#1b254b] text-white rounded-lg px-8 py-3.5 font-body font-medium shadow-[0_8px_30px_rgba(5,15,54,0.2)] hover:shadow-[0_12px_40px_rgba(5,15,54,0.3)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-lg">save</span>
        Save Changes
      </button>

      {/* Page Header */}
      <div className="mb-10">
        <h1 className="font-manrope text-4xl font-extrabold text-[#050f36] tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-2 text-base leading-relaxed">Manage your account and operational preferences</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Business Profile */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <h2 className="font-manrope text-xl font-bold text-[#050f36] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-xl">store</span>
            Business Profile
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company Name</label>
              <input 
                className={inputClasses}
                type="text" 
                placeholder="Enter company name"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input 
                className={inputClasses}
                type="email" 
                placeholder="you@company.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
              <input 
                className={inputClasses}
                type="tel" 
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </section>

        {/* Section 2: Operating Hours */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="font-manrope text-xl font-bold text-[#050f36] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-xl">schedule</span>
            Operating Hours
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Open 24/7</h3>
                <p className="text-sm text-slate-500 mt-1">When disabled, you can set specific opening and closing times.</p>
              </div>
              <button 
                onClick={() => setIsOpen247(!isOpen247)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full flex-shrink-0 transition-colors ease-in-out duration-200 ${isOpen247 ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ease-in-out duration-200 shadow-sm ${isOpen247 ? 'translate-x-6' : 'translate-x-1'}`}></span>
              </button>
            </div>

            {!isOpen247 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white border border-slate-100 rounded-xl animate-in fade-in zoom-in-95 duration-300">
                <CustomTimePicker label="Opens at" value="06:00 AM" />
                <CustomTimePicker label="Closes at" value="10:00 PM" />
              </div>
            )}
            
            <CustomDropdown 
              label="Timezone" 
              options={timezoneOptions} 
              value={timezone} 
              onChange={setTimezone} 
            />
          </div>
        </section>

        {/* Section 3: Notifications */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="font-manrope text-xl font-bold text-[#050f36] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-xl">campaign</span>
            Notifications
          </h2>
          
          <div className="space-y-2">
            {[
              { id: 'emailBookings', label: 'Email notifications for new bookings' },
              { id: 'smsArrivals', label: 'SMS alerts for customer arrivals' },
              { id: 'dailySummary', label: 'Daily summary report' }
            ].map((item, idx, arr) => (
              <div key={item.id} className={`flex items-center justify-between py-4 ${idx !== arr.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <span className="font-medium text-slate-700">{item.label}</span>
                <button 
                  onClick={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id] })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full flex-shrink-0 transition-colors ease-in-out duration-200 ${notifications[item.id] ? 'bg-blue-600' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ease-in-out duration-200 shadow-sm ${notifications[item.id] ? 'translate-x-6' : 'translate-x-1'}`}></span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Password & Security */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
          <h2 className="font-manrope text-xl font-bold text-[#050f36] mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 text-xl">lock</span>
            Password & Security
          </h2>
          
          <div className="space-y-5 max-w-md">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Password</label>
              <div className="relative">
                <input 
                  className={`${inputClasses} pr-12`}
                  placeholder="Enter current password" 
                  type={showCurrentPassword ? "text" : "password"}
                />
                <button 
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showCurrentPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input 
                  className={`${inputClasses} pr-12`}
                  placeholder="Enter new password" 
                  type={showNewPassword ? "text" : "password"}
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showNewPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm New Password</label>
              <div className="relative">
                <input 
                  className={`${inputClasses} pr-12`}
                  placeholder="Confirm new password" 
                  type={showConfirmPassword ? "text" : "password"}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirmPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button className="bg-white border-2 border-[#050f36] text-[#050f36] font-bold px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
                Update Password
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
