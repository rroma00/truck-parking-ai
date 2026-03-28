import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ONBOARDING_STORAGE_KEY = 'locationSetupDraft';

const initialFormState = {
  fullName: '',
  companyName: '',
  email: '',
  phoneNumber: '',
  locationName: '',
  city: '',
  state: '',
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
  locationName: typeof draft.locationName === 'string' ? draft.locationName : '',
  city: typeof draft.city === 'string' ? draft.city : '',
  state: typeof draft.state === 'string' ? draft.state.toUpperCase().slice(0, 2) : '',
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
    locationName: form.locationName.trim().length > 0,
    city: form.city.trim().length > 0,
    state: form.state.trim().length >= 2,
    totalSpots: Number.parseInt(form.totalSpots, 10) > 0,
  };
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialFormState);
  const [restoreNoticeVisible, setRestoreNoticeVisible] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  useEffect(() => {
    const savedDraft = safeStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!savedDraft) {
      setHasLoadedDraft(true);
      return;
    }

    try {
      const parsedDraft = JSON.parse(savedDraft);
      if (!parsedDraft || typeof parsedDraft !== 'object' || Array.isArray(parsedDraft)) {
        console.warn('[Onboarding] Ignoring invalid onboarding draft payload');
        safeStorage.removeItem(ONBOARDING_STORAGE_KEY);
        setHasLoadedDraft(true);
        return;
      }

      setForm(normalizeDraft({ ...initialFormState, ...parsedDraft }));
      setRestoreNoticeVisible(true);
    } catch (error) {
      console.error('Failed to restore onboarding draft:', error);
      safeStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } finally {
      setHasLoadedDraft(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedDraft) return;
    safeStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(form));
  }, [form, hasLoadedDraft]);

  useEffect(() => {
    if (!restoreNoticeVisible) return undefined;
    if (typeof window === 'undefined') return undefined;

    const timer = window.setTimeout(() => {
      setRestoreNoticeVisible(false);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [restoreNoticeVisible]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isFormValid) return;

    const onboardingProfile = {
      ...form,
      completedAt: new Date().toISOString(),
    };

    safeStorage.setItem('onboardingComplete', 'true');
    safeStorage.setItem('parklog-owner-onboarding', JSON.stringify(onboardingProfile));
    safeStorage.removeItem(ONBOARDING_STORAGE_KEY);

    navigate('/dashboard');
  };

  const getFieldMessage = (field, fallback) => {
    if (!hasAttemptedSubmit || validation[field]) return ' ';
    return fallback;
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f4f8ff_0%,#eef3fb_48%,#f8fbff_100%)] px-6 py-8 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#4d5b78] transition-colors hover:text-[#0c2f75]"
          >
            <span className="material-symbols-outlined text-[18px]">west</span>
            Back to landing page
          </Link>
          {restoreNoticeVisible && (
            <div className="rounded-full border border-[#d6e4ff] bg-white/90 px-4 py-2 text-sm font-medium text-[#315ca8] shadow-sm backdrop-blur">
              Draft restored
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_380px]">
          <section className="rounded-[28px] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,51,112,0.12)] backdrop-blur md:p-8">
            <div className="mb-8 flex flex-col gap-4 border-b border-[#edf2fb] pb-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e7f0ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#2257aa]">
                <span className="material-symbols-outlined text-[15px]">route</span>
                Setup flow
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#081b44] md:text-4xl">
                  Get started with ParkLog AI
                </h1>
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#5b6783]">
                  Add your basic operator and lot information, then we&apos;ll route you straight into the live dashboard experience you&apos;re building.
                </p>
              </div>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#6d7b98]">
                    Customer Information
                  </h2>
                  <p className="mt-1 text-sm text-[#7a879f]">
                    Required details to set up the owner profile and first location.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#10285f]">Full Name</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#081b44] outline-none transition focus:border-[#8bb5ff] focus:ring-4 focus:ring-[#cfe1ff]"
                      maxLength={60}
                      placeholder="Jordan Carter"
                      value={form.fullName}
                      onChange={handleFieldChange('fullName')}
                    />
                    <span className="block min-h-5 text-xs text-[#b25555]">{getFieldMessage('fullName', 'Enter the account owner name.')}</span>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#10285f]">Company Name</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#081b44] outline-none transition focus:border-[#8bb5ff] focus:ring-4 focus:ring-[#cfe1ff]"
                      maxLength={80}
                      placeholder="North Yard Logistics"
                      value={form.companyName}
                      onChange={handleFieldChange('companyName')}
                    />
                    <span className="block min-h-5 text-xs text-[#b25555]">{getFieldMessage('companyName', 'Enter the operating company name.')}</span>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#10285f]">Business Email</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#081b44] outline-none transition focus:border-[#8bb5ff] focus:ring-4 focus:ring-[#cfe1ff]"
                      inputMode="email"
                      maxLength={120}
                      placeholder="ops@northyard.com"
                      value={form.email}
                      onChange={handleFieldChange('email')}
                    />
                    <span className="block min-h-5 text-xs text-[#b25555]">{getFieldMessage('email', 'Enter a valid email address.')}</span>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#10285f]">Phone Number</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-[#fbfcff] px-4 py-3 text-[15px] text-[#081b44] outline-none transition focus:border-[#8bb5ff] focus:ring-4 focus:ring-[#cfe1ff]"
                      inputMode="tel"
                      placeholder="(555) 000-0000"
                      value={form.phoneNumber}
                      onChange={handleFieldChange('phoneNumber')}
                    />
                    <span className="block min-h-5 text-xs text-[#b25555]">{getFieldMessage('phoneNumber', 'Enter a 10-digit phone number.')}</span>
                  </label>
                </div>
              </div>

              <div className="space-y-5 rounded-[24px] border border-[#edf2fb] bg-[#f8fbff] p-5 md:p-6">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#6d7b98]">
                    First Location Setup
                  </h2>
                  <p className="mt-1 text-sm text-[#7a879f]">
                    This creates the first parking location context that the internal dashboard can use right away.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-semibold text-[#10285f]">Location Name</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-white px-4 py-3 text-[15px] text-[#081b44] outline-none transition focus:border-[#8bb5ff] focus:ring-4 focus:ring-[#cfe1ff]"
                      maxLength={90}
                      placeholder="North Yard - Dallas"
                      value={form.locationName}
                      onChange={handleFieldChange('locationName')}
                    />
                    <span className="block min-h-5 text-xs text-[#b25555]">{getFieldMessage('locationName', 'Add the first location name.')}</span>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#10285f]">City</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-white px-4 py-3 text-[15px] text-[#081b44] outline-none transition focus:border-[#8bb5ff] focus:ring-4 focus:ring-[#cfe1ff]"
                      maxLength={60}
                      placeholder="Dallas"
                      value={form.city}
                      onChange={handleFieldChange('city')}
                    />
                    <span className="block min-h-5 text-xs text-[#b25555]">{getFieldMessage('city', 'Enter the location city.')}</span>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#10285f]">State</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-white px-4 py-3 text-[15px] uppercase text-[#081b44] outline-none transition focus:border-[#8bb5ff] focus:ring-4 focus:ring-[#cfe1ff]"
                      placeholder="TX"
                      value={form.state}
                      onChange={handleFieldChange('state')}
                    />
                    <span className="block min-h-5 text-xs text-[#b25555]">{getFieldMessage('state', 'Use the two-letter state code.')}</span>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-[#10285f]">Total Spots</span>
                    <input
                      className="w-full rounded-2xl border border-[#dde6f5] bg-white px-4 py-3 text-[15px] text-[#081b44] outline-none transition focus:border-[#8bb5ff] focus:ring-4 focus:ring-[#cfe1ff]"
                      inputMode="numeric"
                      placeholder="60"
                      value={form.totalSpots}
                      onChange={handleFieldChange('totalSpots')}
                    />
                    <span className="block min-h-5 text-xs text-[#b25555]">{getFieldMessage('totalSpots', 'Enter the number of available spots.')}</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#edf2fb] pt-6">
                <p className="max-w-xl text-sm leading-6 text-[#70809e]">
                  On submit, we’ll route the user into the current internal dashboard at <span className="font-semibold text-[#204b91]">/dashboard</span> so the live app flow is fully connected.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#0c2f75] px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(12,47,117,0.24)] transition hover:scale-[0.99] hover:bg-[#163e90] disabled:cursor-not-allowed disabled:bg-[#97abc9]"
                  disabled={!isFormValid && hasAttemptedSubmit}
                >
                  Continue to Dashboard
                  <span className="material-symbols-outlined text-[18px]">east</span>
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-5">
            <div className="rounded-[28px] border border-white/80 bg-[#081b44] p-6 text-white shadow-[0_20px_60px_rgba(7,24,63,0.28)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <span className="material-symbols-outlined">dashboard</span>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Connected flow</p>
                  <h2 className="text-xl font-bold">Where this sends users</h2>
                </div>
              </div>

              <div className="space-y-3 text-sm text-white/78">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-semibold text-white">1. Landing page</div>
                  <div className="mt-1">CTA buttons now route into the onboarding form.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-semibold text-white">2. Onboarding</div>
                  <div className="mt-1">Owner and first-location details are captured locally for MVP continuity.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="font-semibold text-white">3. Working app</div>
                  <div className="mt-1">Successful submit routes into the existing dashboard shell and internal pages.</div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e3ebf8] bg-white/90 p-6 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#6d7b98]">Current internal routes</h3>
              <div className="mt-4 space-y-3 text-sm text-[#4c5872]">
                <div className="flex items-center justify-between rounded-2xl bg-[#f7faff] px-4 py-3">
                  <span>Dashboard</span>
                  <span className="font-semibold text-[#0c2f75]">/dashboard</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#f7faff] px-4 py-3">
                  <span>Customers</span>
                  <span className="font-semibold text-[#0c2f75]">/customer-management</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#f7faff] px-4 py-3">
                  <span>Reservations</span>
                  <span className="font-semibold text-[#0c2f75]">/reservations</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-[#f7faff] px-4 py-3">
                  <span>Inventory</span>
                  <span className="font-semibold text-[#0c2f75]">/parking-availability</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
