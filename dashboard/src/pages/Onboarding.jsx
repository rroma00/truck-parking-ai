import { useEffect, useMemo, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const stateOptions = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' }, { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' }, { value: 'DC', label: 'District Of Columbia' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' }, { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' }, { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' }, { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' }, { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' }, { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' }, { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' }, { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' }, { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' }, { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' }, { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
  { value: 'PR', label: 'Puerto Rico' }, { value: 'VI', label: 'Virgin Islands' }, { value: 'GU', label: 'Guam' },
  { value: 'AS', label: 'American Samoa' }, { value: 'MP', label: 'Northern Mariana Islands' }
];

const CustomStateSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = options.find(o => o.value === value);
  const inputValue = isTyping ? query : (selectedOption ? selectedOption.label : '');

  const filteredOptions = (!isTyping || query === '') 
    ? options 
    : options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()) || o.value.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setIsTyping(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen && e.key !== 'Tab') {
      setIsOpen(true);
      setFocusedIndex(filteredOptions.findIndex(o => o.value === value));
      if (e.key === 'Enter') e.preventDefault();
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          onChange(filteredOptions[focusedIndex].value);
          setIsOpen(false);
          setIsTyping(false);
          setQuery('');
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setIsTyping(false);
        setQuery('');
        break;
      default:
        break;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        className="w-full rounded-2xl border border-[#dde6f5] bg-white px-4 py-3.5 pr-10 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder-gray-400"
        placeholder="Select state"
        value={inputValue}
        onChange={(e) => {
          setIsTyping(true);
          setQuery(e.target.value);
          setIsOpen(true);
          setFocusedIndex(0);
          if (e.target.value === '') {
            onChange('');
          }
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setIsOpen(true);
          if (!isTyping) {
            setFocusedIndex(filteredOptions.findIndex(o => o.value === value));
          }
        }}
        onClick={() => {
          setIsOpen(true);
        }}
      />
      <div 
        className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#7a879f]"
      >
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full max-h-56 overflow-y-auto rounded-xl border border-[#dde6f5] bg-white py-1.5 shadow-[0_10px_40px_-10px_rgba(15,51,112,0.12)]">
          {filteredOptions.length === 0 ? (
            <div className="px-4 py-2.5 text-[14px] text-[#7a879f]">No states found</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setIsTyping(false);
                  setQuery('');
                }}
                onMouseEnter={() => setFocusedIndex(index)}
                className={`cursor-pointer px-4 py-2 text-[14px] transition-colors ${
                  option.value === value 
                    ? 'bg-primary/5 text-primary font-bold' 
                    : focusedIndex === index 
                      ? 'bg-[#edf2fb] text-[#081b44]' 
                      : 'text-[#081b44] hover:bg-[#edf2fb]'
                }`}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const ONBOARDING_STORAGE_KEY = 'locationSetupDraft';

const initialFormState = {
  fullName: '',
  companyName: '',
  email: '',
  phoneNumber: '',
  password: '',
  locationName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  lat: null,
  lng: null,
  totalSpots: '',
};

const safeStorage = {
  getItem(key) {
    if (typeof window === 'undefined') return null;

    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.error(`[Onboarding] Failed to read localStorage key "${key}"`, error);
      return null;
    }
  },
  setItem(key, value) {
    if (typeof window === 'undefined') return false;

    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`[Onboarding] Failed to write localStorage key "${key}"`, error);
      return false;
    }
  },
  removeItem(key) {
    if (typeof window === 'undefined') return false;

    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[Onboarding] Failed to remove localStorage key "${key}"`, error);
      return false;
    }
  },
};

const stripPhoneDigits = (value) => value.replace(/\D/g, '').slice(0, 10);

const formatPhoneNumber = (value) => {
  const digits = stripPhoneDigits(value);

  if (digits.length === 0) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

const normalizeDraft = (draft) => ({
  fullName: typeof draft.fullName === 'string' ? draft.fullName : '',
  companyName: typeof draft.companyName === 'string' ? draft.companyName : '',
  email: typeof draft.email === 'string' ? draft.email : '',
  phoneNumber: formatPhoneNumber(typeof draft.phoneNumber === 'string' ? draft.phoneNumber : ''),
  password: typeof draft.password === 'string' ? draft.password : '',
  locationName: typeof draft.locationName === 'string' ? draft.locationName : '',
  address: typeof draft.address === 'string' ? draft.address : '',
  city: typeof draft.city === 'string' ? draft.city : '',
  state: typeof draft.state === 'string' ? draft.state.toUpperCase().slice(0, 2) : '',
  zip: typeof draft.zip === 'string' ? draft.zip : '',
  lat: typeof draft.lat === 'number' ? draft.lat : null,
  lng: typeof draft.lng === 'number' ? draft.lng : null,
  totalSpots:
    typeof draft.totalSpots === 'string'
      ? draft.totalSpots.replace(/\D/g, '').slice(0, 4)
      : typeof draft.totalSpots === 'number'
        ? String(draft.totalSpots).replace(/\D/g, '').slice(0, 4)
        : '',
});

const validateForm = (form) => {
  const phoneDigits = stripPhoneDigits(form.phoneNumber);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return {
    fullName: form.fullName.trim().length > 0,
    companyName: form.companyName.trim().length > 0,
    email: emailPattern.test(form.email.trim()),
    phoneNumber: phoneDigits.length === 10,
    password: form.password.trim().length >= 8,
    locationName: form.locationName.trim().length > 0,
    address: form.address.trim().length > 0,
    city: form.city.trim().length > 0,
    state: form.state.trim().length >= 2,
    zip: form.zip ? form.zip.trim().length >= 5 : false,
    totalSpots: Number.parseInt(form.totalSpots, 10) > 0,
  };
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState(normalizeDraft(JSON.parse(safeStorage.getItem(ONBOARDING_STORAGE_KEY) || '{}')));
  const [restoreNoticeVisible, setRestoreNoticeVisible] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isValidatedAddress, setIsValidatedAddress] = useState(false);
  const autocompleteRef = useRef(null);

  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries,
    preventGoogleFontsLoading: true,
  });

  const showAutocomplete = isLoaded && !loadError && !!googleMapsApiKey;

  const onLoadAutocomplete = (autocomplete) => {
    autocompleteRef.current = autocomplete;
    autocomplete.setComponentRestrictions({ country: 'us' });
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (!place || !place.geometry) {
        setIsValidatedAddress(false);
        return;
      }
      
      let newAddress = '';
      let newCity = '';
      let newState = '';
      let newZip = '';

      for (const component of place.address_components || []) {
        const componentType = component.types[0];
        const valLong = component.long_name;
        const valShort = component.short_name;

        switch (componentType) {
          case 'street_number':
            newAddress = `${valLong} ${newAddress}`;
            break;
          case 'route':
            newAddress += valShort;
            break;
          case 'locality':
          case 'sublocality_level_1':
          case 'postal_town':
            if (!newCity) newCity = valLong;
            break;
          case 'administrative_area_level_1':
            newState = valShort;
            break;
          case 'postal_code':
            newZip = valLong;
            break;
        }
      }

      setForm((current) => ({
        ...current,
        address: newAddress.trim() || place.name || current.address,
        city: newCity || current.city,
        state: newState || current.state,
        zip: newZip || current.zip,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }));
      setIsValidatedAddress(true);
    }
  };

  useEffect(() => {
    const savedDraft = safeStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!savedDraft) {
      setHasLoadedDraft(true);
      return;
    }
    
    try {
      const parsedDraft = JSON.parse(savedDraft);
      if (parsedDraft && typeof parsedDraft === 'object' && !Array.isArray(parsedDraft)) {
        setRestoreNoticeVisible(true);
      }
    } catch (e) {
      // Ignore
    }
    setHasLoadedDraft(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedDraft) return;
    safeStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(form));
  }, [form, hasLoadedDraft]);

  const validation = useMemo(() => validateForm(form), [form]);
  const isFormValid = Object.values(validation).every(Boolean);

  const handleFieldChange = (field) => (event) => {
    const nextValue = event.target.value;

    if (field === 'phoneNumber') {
      setForm((current) => ({
        ...current,
        phoneNumber: formatPhoneNumber(nextValue),
      }));
      return;
    }

    if (field === 'state') {
      setForm((current) => ({
        ...current,
        state: nextValue.toUpperCase().slice(0, 2),
      }));
      return;
    }

    if (field === 'totalSpots') {
      const digitsOnly = nextValue.replace(/\D/g, '').slice(0, 4);
      setForm((current) => ({
        ...current,
        totalSpots: digitsOnly,
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      [field]: nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const onboardingProfile = {
      ...form,
      completedAt: new Date().toISOString(),
    };

    safeStorage.setItem('onboardingComplete', 'true');
    safeStorage.setItem('parklog-owner-onboarding', JSON.stringify(onboardingProfile));
    safeStorage.removeItem(ONBOARDING_STORAGE_KEY);

    navigate('/location');
  };

  const getFieldMessage = (field, fallback) => {
    if (!hasAttemptedSubmit || validation[field]) return ' ';
    return fallback;
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#eef3fb_48%,#f8fbff_100%)] px-6 py-8 md:px-8 font-['Inter'] selection:bg-primary/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#4d5b78] transition-colors hover:text-[#0c2f75]"
            aria-label="Back to landing page"
          >
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">west</span>
            Back to landing page
          </Link>
          <div className="flex items-center gap-6">
            <p className="hidden sm:block text-sm text-[#7a879f]">Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign In</Link></p>
            {restoreNoticeVisible && (
              <div className="rounded-full border border-[#d6e4ff] bg-white/90 px-4 py-2 text-sm font-medium text-[#315ca8] shadow-sm backdrop-blur">
                Draft restored
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_380px]">
          <main className="rounded-[28px] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,51,112,0.12)] backdrop-blur md:p-10 relative overflow-hidden">
            {/* Progress Bar Mock */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#edf2fb]">
              <div className="h-full bg-primary/40 w-1/3 transition-all duration-500 ease-out"></div>
            </div>

            <div className="mb-10 flex flex-col gap-4 border-b border-[#edf2fb] pb-8 pt-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                <span className="material-symbols-outlined text-[14px]">route</span>
                Setup flow 1/2
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight text-[#081b44] md:text-5xl font-['Manrope']">
                  Launch Your Command Center
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#5b6783]">
                  Enter your details to start automating your parking operations with TruckPark AI.
                </p>
              </div>
            </div>

            <form className="space-y-10" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="mb-2">
                  <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#6d7b98]">
                    Account Security & Info
                  </h2>
                  <p className="mt-1 text-sm text-[#7a879f]">
                    Owner profile registration for dashboard access.
                  </p>
                </div>

                <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-[#10285f]">Full Name</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-[#fbfcff] px-4 py-3.5 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                      maxLength={60}
                      placeholder="Jordan Carter"
                      value={form.fullName}
                      onChange={handleFieldChange('fullName')}
                      aria-required="true"
                    />
                    <span className="block min-h-5 text-xs font-medium text-[#b25555]">{getFieldMessage('fullName', 'Enter the account owner name.')}</span>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-[#10285f]">Company Name</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-[#fbfcff] px-4 py-3.5 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                      maxLength={80}
                      placeholder="North Yard Logistics"
                      value={form.companyName}
                      onChange={handleFieldChange('companyName')}
                      aria-required="true"
                    />
                    <span className="block min-h-5 text-xs font-medium text-[#b25555]">{getFieldMessage('companyName', 'Enter the operating company name.')}</span>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-[#10285f]">Business Email</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-[#fbfcff] px-4 py-3.5 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                      type="email"
                      maxLength={120}
                      placeholder="ops@northyard.com"
                      value={form.email}
                      onChange={handleFieldChange('email')}
                      aria-required="true"
                    />
                    <span className="block min-h-5 text-xs font-medium text-[#b25555]">{getFieldMessage('email', 'Enter a valid business email.')}</span>
                  </label>

                  <label className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-[#10285f]">Business Phone</span>
                      <span className="material-symbols-outlined text-primary/40 text-sm cursor-help" title="Used for booking notifications">info</span>
                    </div>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-[#fbfcff] px-4 py-3.5 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={form.phoneNumber}
                      onChange={handleFieldChange('phoneNumber')}
                      aria-required="true"
                    />
                    <span className="block min-h-5 text-xs font-medium text-[#b25555]">{getFieldMessage('phoneNumber', '10-digit number required for notifications.')}</span>
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-bold text-[#10285f]">Password (Min 8 chars)</span>
                    <div className="relative">
                      <input
                        className="w-full rounded-2xl border border-[#dde6f5] bg-[#fbfcff] px-4 py-3.5 pr-12 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleFieldChange('password')}
                        aria-required="true"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a879f] hover active:scale-95"
                      >
                        <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                    <span className="block min-h-5 text-xs font-medium text-[#b25555]">{getFieldMessage('password', 'Choose a password with at least 8 characters.')}</span>
                  </label>
                </div>
              </div>

              <div className="space-y-6 rounded-[28px] border border-[#edf2fb] bg-[#fcfdff] p-6 md:p-8">
                <div>
                  <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-[#6d7b98]">
                    Initial Asset Information
                  </h2>
                  <p className="mt-1 text-sm text-[#7a879f]">
                    Configure your first lot to enable AI-ready inventory management.
                  </p>
                </div>

                <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-bold text-[#10285f]">Asset/Location Name</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-white px-4 py-3.5 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                      maxLength={90}
                      placeholder="North Yard - Dallas Distribution"
                      value={form.locationName}
                      onChange={handleFieldChange('locationName')}
                    />
                    <span className="block min-h-5 text-xs font-medium text-[#b25555]">{getFieldMessage('locationName', 'Add a nickname for this location.')}</span>
                  </label>

                  <label className="space-y-2 md:col-span-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-bold text-[#10285f]">Lot Street Address</span>
                      {isValidatedAddress ? (
                        <span className="flex items-center gap-1 text-[10px] text-[#16a34a] font-bold uppercase tracking-widest bg-[#16a34a]/10 px-2 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-[12px]">check_circle</span>
                          Google Validated
                        </span>
                      ) : (
                        <span className="text-[10px] text-primary/40 font-bold uppercase tracking-widest">Google Validated</span>
                      )}
                    </div>
                    {showAutocomplete ? (
                      <Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
                        <input
                          className="w-full rounded-2xl border border-[#dde6f5] bg-white px-4 py-3.5 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                          placeholder="123 Industrial Way, Bldg A"
                          value={form.address}
                          onChange={(e) => {
                            handleFieldChange('address')(e);
                            setIsValidatedAddress(false);
                          }}
                        />
                      </Autocomplete>
                    ) : (
                      <input
                        className="w-full rounded-2xl border border-[#dde6f5] bg-white px-4 py-3.5 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                        placeholder="123 Industrial Way, Bldg A"
                        value={form.address}
                        onChange={(e) => {
                          handleFieldChange('address')(e);
                          setIsValidatedAddress(false);
                        }}
                      />
                    )}
                    <span className="block min-h-5 text-xs font-medium text-[#b25555]">{getFieldMessage('address', 'Full street address required.')}</span>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-[#10285f]">City</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-white px-4 py-3.5 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                      maxLength={60}
                      placeholder="Dallas"
                      value={form.city}
                      onChange={handleFieldChange('city')}
                    />
                    <span className="block min-h-5 text-xs font-medium text-[#b25555]">{getFieldMessage('city', 'Enter location city.')}</span>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-[#10285f]">State</span>
                    <CustomStateSelect 
                      options={stateOptions}
                      value={form.state}
                      onChange={(val) => setForm(current => ({ ...current, state: val }))}
                    />
                  </label>
                  
                  <label className="space-y-2">
                    <span className="text-sm font-bold text-[#10285f]">ZIP Code</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-white px-4 py-3.5 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                      placeholder="75201"
                      maxLength={10}
                      value={form.zip}
                      onChange={handleFieldChange('zip')}
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-bold text-[#10285f]">Truck Spaces</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-white px-4 py-3.5 text-[15px] text-[#081b44] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                      type="number"
                      min="1"
                      placeholder="50"
                      value={form.totalSpots}
                      onChange={handleFieldChange('totalSpots')}
                    />
                  </label>

                  <div className="md:col-span-2">
                    <span className="block min-h-5 text-xs font-medium text-[#b25555]">
                      {(!validation.state && hasAttemptedSubmit) ? 'Valid state selection required. ' : ''}
                      {(!validation.zip && hasAttemptedSubmit) ? 'Valid ZIP code required. ' : ''}
                      {(!validation.totalSpots && hasAttemptedSubmit) ? 'Lot must have at least 1 spot.' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-[#edf2fb] pt-8">
                <div className="flex flex-col gap-1">
                 <Link to="/pricing" className="text-sm font-bold text-primary flex items-center gap-1.5 hover:underline">
                    Prefer help? Book a free expert demo
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </Link>
                  <p className="text-xs text-[#a0adc2]">No credit card required for setup.</p>
                </div>
                <button
                  type="submit"
                  className="group relative inline-flex min-w-[240px] items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#0c2f75] px-8 py-4 text-sm font-black text-white shadow-[0_15px_30px_rgba(12,47,117,0.3)] transition-all hover:scale-[0.98] hover:bg-[#163e90] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#97abc9] disabled:shadow-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                  ) : (
                    <>
                      Create Account & Start Setup
                      <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">east</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </main>

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-white/80 bg-[#081b44] p-6 text-white shadow-[0_20px_60px_rgba(7,24,63,0.28)]">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <span className="material-symbols-outlined text-white">bolt</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Automation</p>
                  <h2 className="text-xl font-bold">What happens next?</h2>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                {[
                  { step: '1', title: 'Dashboard Access', text: 'You’ll be routed into your living command center immediately.' },
                  { step: '2', title: 'AI Training', text: 'Our system analyzes your lot data to train your custom voice assistant.' },
                  { step: '3', title: 'Live Testing', text: 'Receive your first automated booking test call within 24 hours.' }
                ].map(item => (
                  <div key={item.step} className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
                    <div className="flex items-center gap-2 font-bold text-white mb-1.5 text-xs uppercase tracking-wide">
                      <span className="text-secondary">{item.step}.</span> {item.title}
                    </div>
                    <div className="text-white/70 leading-relaxed text-[13px]">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e3ebf8] bg-white/90 p-8 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#6d7b98] mb-6">Trust & Reliability</h3>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <div>
                    <p className="text-sm font-bold text-[#10285f]">Enterprise Security</p>
                    <p className="text-xs text-slate-500 mt-0.5">SOC2 Type II compliant storage.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-primary">support_agent</span>
                  <div>
                    <p className="text-sm font-bold text-[#10285f]">24/7 Human Support</p>
                    <p className="text-xs text-slate-500 mt-0.5">Need help? We’re always here.</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Simplified Footer */}
        <footer className="mt-10 border-t border-[#edf2fb] pt-10 pb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-lg font-black text-[#081b44] font-['Manrope']">TruckPark AI</p>
            <p className="text-xs text-slate-500">© 2026 TruckPark AI. All rights reserved.</p>
          </div>
          <div className="flex gap-8 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Support</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

