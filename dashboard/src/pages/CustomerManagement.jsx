import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LotContext } from '../context/LotContext';
import { availabilityService } from '../services/availabilityService';

const STATUS_OPTIONS = ['Expected', 'Checked In', 'Checked Out', 'Needs Support', 'Cancelled'];
const driverFilters = ['All', 'Expected', 'Checked In', 'Checked Out', 'Needs Support', 'Cancelled', 'Warnings'];
const VEHICLE_OPTIONS = ['Sedan', 'Pickup', 'Semi Truck', 'Trailer', 'RV', 'Other'];
const BOOKING_STATUS_OPTIONS = ['Expected', 'Checked In', 'Reserved'];
const DURATION_TYPE_OPTIONS = ['Daily', 'Weekly', 'Monthly'];
const TIME_OPTIONS = Array.from({ length: 24 * 12 }, (_, index) => {
  const hour = String(Math.floor(index / 12)).padStart(2, '0');
  const minute = String((index % 12) * 5).padStart(2, '0');
  return `${hour}:${minute}`;
});
const GROUPED_TIME_OPTIONS = [
  { label: 'Morning', times: ['06:00', '07:00', '08:00', '09:00'] },
  { label: 'Midday', times: ['10:00', '11:00', '12:00', '13:00'] },
  { label: 'Afternoon', times: ['14:00', '15:00', '16:00'] },
  { label: 'Evening', times: ['17:00', '18:00', '19:00'] },
  { label: 'Night', times: ['20:00', '21:00', '22:00'] }
];
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2
});

const initialDrivers = [
  {
    id: 'mike-johnson',
    initials: 'MJ',
    name: 'Mike Johnson',
    company: 'Swift Logistics',
    rating: 4.9,
    phone: '+1 (555) 234-8890',
    vehicle: 'Sleeper',
    trailer: '53ft Trailer',
    assignedSpot: 'A14',
    reservation: 'Confirmed',
    status: 'Checked In',
    lastActivity: '10:48 AM',
    lastDetail: 'Staff confirmed arrival at north gate',
    note: 'High-value electronics load. Prefers text updates.',
    scheduledArrival: '2026-03-24T10:30:00-04:00',
    expectedCheckout: '2026-03-25T08:00:00-04:00',
    contactSummary: 'Driver called ahead to confirm late-morning access and assigned spot details.',
    followUp: 'Confirm departure during morning rounds if the truck leaves before 8:00 AM.',
    timeline: [
      { time: '09:55 AM', text: 'Reservation confirmed by staff', confirmed: true },
      { time: '10:20 AM', text: 'Arrival instructions resent by text', confirmed: true },
      { time: '10:48 AM', text: 'Checked in manually at north gate', confirmed: true }
    ]
  },
  {
    id: 'sarah-rodriguez',
    initials: 'SR',
    name: 'Sarah Rodriguez',
    company: 'FedEx Custom',
    rating: 4.8,
    phone: '+1 (555) 812-4401',
    vehicle: 'Day Cab',
    trailer: 'Box Trailer',
    assignedSpot: 'B07',
    reservation: 'Paid',
    status: 'Expected',
    lastActivity: '2:30 PM ETA',
    lastDetail: 'Pre-arrival instructions sent',
    note: 'Returning driver. Staff should confirm arrival at the office or by phone.',
    scheduledArrival: '2026-03-24T14:30:00-04:00',
    expectedCheckout: '2026-03-25T06:30:00-04:00',
    contactSummary: 'Driver verified box trailer dimensions and requested the quickest check-in path.',
    followUp: 'If not checked in after the ETA window, call to confirm updated arrival plans.',
    timeline: [
      { time: '09:55 AM', text: 'Requested available parking', confirmed: true },
      { time: '10:02 AM', text: 'Reservation paid and confirmed', confirmed: true },
      { time: '2:30 PM', text: 'Arrival window scheduled', confirmed: false }
    ]
  },
  {
    id: 'brian-kim',
    initials: 'BK',
    name: 'Brian Kim',
    company: 'Independent',
    rating: 4.6,
    phone: '+1 (555) 991-2847',
    vehicle: 'Heavy Haul',
    trailer: 'Flatbed',
    assignedSpot: 'Support Review',
    reservation: 'Pending',
    status: 'Needs Support',
    lastActivity: '12 mins ago',
    lastDetail: 'Waiting on clearance review',
    note: 'Waiting on human confirmation for gate clearance width before staff check-in.',
    scheduledArrival: '2026-03-24T21:00:00-04:00',
    expectedCheckout: '2026-03-25T07:00:00-04:00',
    contactSummary: 'Driver asked whether the east gate can handle the flatbed width tonight.',
    followUp: 'Dispatch or lot staff needs to reply with a gate recommendation before arrival.',
    timeline: [
      { time: '10:40 AM', text: 'Heavy-haul access question received', confirmed: true },
      { time: '10:47 AM', text: 'Moved to support queue for manual review', confirmed: true },
      { time: 'Pending', text: 'Waiting on dispatcher recommendation', confirmed: false }
    ]
  },
  {
    id: 'leon-thompson',
    initials: 'LT',
    name: 'Leon Thompson',
    company: 'Knight Trans',
    rating: 4.7,
    phone: '+1 (555) 642-1108',
    vehicle: 'Sleeper',
    trailer: 'Reefer 53ft',
    assignedSpot: 'A12',
    reservation: 'Confirmed',
    status: 'Checked Out',
    lastActivity: '7:12 AM',
    lastDetail: 'Staff marked departure complete',
    note: 'Cold-chain load. Parked overnight near power access.',
    scheduledArrival: '2026-03-23T20:30:00-04:00',
    expectedCheckout: '2026-03-24T07:00:00-04:00',
    contactSummary: 'Driver requested reefer-friendly placement and overnight power access.',
    followUp: 'No further action needed unless billing follow-up is required.',
    timeline: [
      { time: '08:11 PM', text: 'Reservation confirmed and assigned to A12', confirmed: true },
      { time: '08:54 PM', text: 'Checked in manually by staff', confirmed: true },
      { time: '07:12 AM', text: 'Checked out manually during departure', confirmed: true }
    ]
  },
  {
    id: 'tasha-green',
    initials: 'TG',
    name: 'Tasha Green',
    company: 'JB Hunt',
    rating: 4.7,
    phone: '+1 (555) 403-1228',
    vehicle: 'Sleeper',
    trailer: 'Dry Van',
    assignedSpot: 'C03',
    reservation: 'Confirmed',
    status: 'Cancelled',
    lastActivity: '11:40 AM',
    lastDetail: 'Driver cancelled by phone',
    note: 'Cancelled before arrival after load plan changed.',
    scheduledArrival: '2026-03-24T15:00:00-04:00',
    expectedCheckout: '2026-03-25T05:30:00-04:00',
    contactSummary: 'Dispatch called to cancel the stay after a route reassignment.',
    followUp: 'Release the hold on C03 if it is still blocked in operations.',
    timeline: [
      { time: '09:20 AM', text: 'Reservation confirmed', confirmed: true },
      { time: '11:40 AM', text: 'Cancellation logged by staff', confirmed: true }
    ]
  }
];

function createInitialBookingForm() {
  return {
    fullName: '',
    phoneNumber: '',
    companyName: '',
    vehicleType: '',
    licensePlate: '',
    arrivalDate: '',
    arrivalTime: '',
    durationType: 'Daily',
    durationValue: '1',
    assignedSpotId: '',
    assignedSpot: '',
    bookingStatus: 'Expected',
    dailyRate: '$45.00',
    manualOverride: false,
    manualTotal: '',
    customerNotes: ''
  };
}

function getBookingDraftStorageKey(lotId) {
  return `parklog-booking-draft:${lotId || 'default'}`;
}

function formatDateTime(dateString) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(dateString));
}

function createWarnings(driver, now) {
  const warnings = [];
  const arrivalTime = new Date(driver.scheduledArrival).getTime();
  const checkoutTime = new Date(driver.expectedCheckout).getTime();
  const currentTime = now.getTime();
  const arrivalConfirmed = driver.status === 'Checked In' || driver.status === 'Checked Out' || driver.status === 'Cancelled';
  const checkoutConfirmed = driver.status === 'Checked Out' || driver.status === 'Cancelled';

  if (!arrivalConfirmed && currentTime > arrivalTime) {
    warnings.push('Past ETA');
  }

  if (!checkoutConfirmed && currentTime > checkoutTime) {
    warnings.push('Past Checkout');
  }

  return warnings;
}

function getStatusTone(status) {
  if (status === 'Checked In') return 'checked-in';
  if (status === 'Needs Support') return 'support';
  if (status === 'Cancelled') return 'cancelled';
  if (status === 'Checked Out') return 'checked-out';
  return 'expected';
}

function statusClasses(tone) {
  if (tone === 'checked-in') return 'bg-secondary-fixed text-on-secondary-fixed';
  if (tone === 'support') return 'bg-error-container text-on-error-container';
  if (tone === 'checked-out') return 'bg-[#FFE7C2] text-[#A35200]';
  if (tone === 'cancelled') return 'bg-surface-container-high text-on-surface-variant';
  return 'bg-surface-container-high text-on-surface-variant';
}

function statusDotClasses(tone) {
  if (tone === 'checked-in') return 'bg-secondary';
  if (tone === 'support') return 'bg-error';
  if (tone === 'checked-out') return 'bg-[#E47A00]';
  if (tone === 'cancelled') return 'bg-outline';
  return 'bg-outline';
}

function warningClasses(warning) {
  if (warning === 'Past ETA') return 'bg-[#FFF0C9] text-[#A35200]';
  return 'bg-[#FFF0C9] text-[#A35200]';
}

function formatCurrency(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function parseCurrencyInput(value) {
  const cleanedValue = String(value ?? '').replace(/[^0-9.]/g, '');
  const [whole = '', decimal = ''] = cleanedValue.split('.');
  const normalizedValue = decimal.length > 0 ? `${whole}.${decimal.slice(0, 2)}` : whole;
  const parsedValue = Number.parseFloat(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function normalizeUsPhoneDigits(value) {
  const rawDigits = String(value ?? '').replace(/\D/g, '').slice(0, 11);
  return rawDigits.startsWith('1') ? rawDigits.slice(1, 11) : rawDigits.slice(0, 10);
}

function formatLocalPhoneNumber(value) {
  const digits = normalizeUsPhoneDigits(value);

  if (digits.length === 0) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatPhoneNumber(value) {
  const localValue = formatLocalPhoneNumber(value);
  return localValue ? `+1 ${localValue}` : '+1';
}

function countPhoneDigitsBeforeCursor(value, cursorPosition) {
  return String(value ?? '')
    .slice(0, cursorPosition ?? 0)
    .replace(/\D/g, '').length;
}

function getPhoneCursorPosition(formattedValue, digitCount) {
  if (digitCount <= 0) {
    return 0;
  }

  let seenDigits = 0;

  for (let index = 0; index < formattedValue.length; index += 1) {
    if (/\d/.test(formattedValue[index])) {
      seenDigits += 1;
      if (seenDigits === digitCount) {
        return index + 1;
      }
    }
  }

  return formattedValue.length;
}

function getDurationMultiplier(durationType) {
  if (durationType === 'Weekly') return 7;
  if (durationType === 'Monthly') return 30;
  return 1;
}

function formatDurationLabel(durationValue, durationType) {
  const normalizedValue = Number.parseInt(durationValue, 10);

  if (!Number.isFinite(normalizedValue) || normalizedValue <= 0) {
    return 'Duration pending';
  }

  const unitByType = {
    Daily: normalizedValue === 1 ? 'day' : 'days',
    Weekly: normalizedValue === 1 ? 'week' : 'weeks',
    Monthly: normalizedValue === 1 ? 'month' : 'months'
  };

  return `${normalizedValue} ${unitByType[durationType] || 'days'}`;
}

function combineDateAndTime(dateValue, timeValue) {
  if (!dateValue || !timeValue) {
    return null;
  }

  const combinedDate = new Date(`${dateValue}T${timeValue}:00`);
  return Number.isNaN(combinedDate.getTime()) ? null : combinedDate;
}

function formatPreviewDateTime(dateValue, timeValue) {
  const combinedDate = combineDateAndTime(dateValue, timeValue);

  if (!combinedDate) {
    return 'Not scheduled';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(combinedDate);
}

function formatTimeLabel(timeValue) {
  if (!timeValue) {
    return 'Select time';
  }

  const [hourString = '00', minuteString = '00'] = timeValue.split(':');
  const hours = Number.parseInt(hourString, 10);
  const minutes = Number.parseInt(minuteString, 10);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 'Select time';
  }

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(2026, 0, 1, hours, minutes));
}

function roundDateToFiveMinutes(date, offsetMinutes = 0) {
  const nextDate = new Date(date);
  nextDate.setSeconds(0, 0);
  nextDate.setMinutes(nextDate.getMinutes() + offsetMinutes);

  const remainder = nextDate.getMinutes() % 5;
  if (remainder !== 0) {
    nextDate.setMinutes(nextDate.getMinutes() + (5 - remainder));
  }

  return `${String(nextDate.getHours()).padStart(2, '0')}:${String(nextDate.getMinutes()).padStart(2, '0')}`;
}

function parseConfiguredTimeToMinutes(timeValue) {
  if (!timeValue) {
    return null;
  }

  const normalizedValue = String(timeValue).trim();

  if (/^\d{2}:\d{2}$/.test(normalizedValue)) {
    const [hours, minutes] = normalizedValue.split(':').map((part) => Number.parseInt(part, 10));
    return hours * 60 + minutes;
  }

  const match = normalizedValue.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return null;
  }

  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const meridiem = match[3].toUpperCase();

  if (meridiem === 'PM' && hours !== 12) {
    hours += 12;
  }

  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

function formatOperatingHoursLabel(lotDetails) {
  if (!lotDetails) {
    return 'Hours unavailable';
  }

  if (lotDetails.is_24_7) {
    return 'Open 24/7';
  }

  const startTime = lotDetails.office_hours_start;
  const endTime = lotDetails.office_hours_end;

  if (!startTime || !endTime) {
    return 'Hours unavailable';
  }

  return `${startTime} - ${endTime}`;
}

function isTimeAllowedForLocation(timeValue, lotDetails) {
  if (!timeValue) {
    return true;
  }

  if (!lotDetails || lotDetails.is_24_7) {
    return true;
  }

  const targetMinutes = parseConfiguredTimeToMinutes(timeValue);
  const openingMinutes = parseConfiguredTimeToMinutes(lotDetails.office_hours_start);
  const closingMinutes = parseConfiguredTimeToMinutes(lotDetails.office_hours_end);

  if (targetMinutes == null || openingMinutes == null || closingMinutes == null) {
    return true;
  }

  if (openingMinutes <= closingMinutes) {
    return targetMinutes >= openingMinutes && targetMinutes <= closingMinutes;
  }

  return targetMinutes >= openingMinutes || targetMinutes <= closingMinutes;
}

function parseIsoDate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map((part) => Number.parseInt(part, 10));
  return new Date(year, month - 1, day);
}

function formatDateTriggerLabel(value) {
  const parsedDate = parseIsoDate(value);

  if (!parsedDate) {
    return 'Select date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(parsedDate);
}

function formatCalendarMonthLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function getCalendarDays(visibleMonthDate) {
  const monthStart = new Date(visibleMonthDate.getFullYear(), visibleMonthDate.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(gridStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const nextDate = new Date(gridStart);
    nextDate.setDate(gridStart.getDate() + index);

    return {
      date: nextDate,
      iso: `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`,
      isCurrentMonth: nextDate.getMonth() === visibleMonthDate.getMonth()
    };
  });
}

function buildFallbackSpotRecords(totalSpaces) {
  return Array.from({ length: Math.max(Number(totalSpaces) || 0, 0) }, (_, index) => ({
    id: `spot_${String(index + 1).padStart(3, '0')}`,
    displayLabel: `Spot ${index + 1}`,
    fallbackLabel: `Spot ${index + 1}`,
    description: '',
    searchText: `spot ${index + 1}`
  }));
}

function buildSpotRecords(apiSpots, totalSpaces) {
  if (Array.isArray(apiSpots) && apiSpots.length > 0) {
    return apiSpots.map((spot, index) => {
      const fallbackLabel = `Spot ${index + 1}`;
      const displayLabel = String(spot.display_label || spot.spot_number || fallbackLabel).trim() || fallbackLabel;
      const description = String(spot.zone || spot.notes || '').trim();

      return {
        id: String(spot.id || `spot_${String(index + 1).padStart(3, '0')}`),
        displayLabel,
        fallbackLabel,
        description,
        searchText: [displayLabel, fallbackLabel, description].filter(Boolean).join(' ').toLowerCase()
      };
    });
  }

  return buildFallbackSpotRecords(totalSpaces);
}

function getResolvedSpotsForLocation(location, savedSpots) {
  if (Array.isArray(location?.spots) && location.spots.length > 0) {
    return buildSpotRecords(location.spots, location?.total_spaces ?? location?.capacity);
  }

  if (Array.isArray(savedSpots) && savedSpots.length > 0) {
    return buildSpotRecords(savedSpots, location?.total_spaces ?? location?.capacity);
  }

  const capacity = location?.total_spaces ?? location?.capacity ?? 0;
  return buildFallbackSpotRecords(capacity);
}

function buildSpotOptions(spotRecords) {
  return spotRecords.map((spot) => ({
    ...spot,
    value: spot.displayLabel,
    helperText: spot.description || spot.fallbackLabel
  }));
}

function resolveSpotSelection(spotOptions, rawValue) {
  const trimmedValue = rawValue.trim();
  const matchedSpot = spotOptions.find((spot) => spot.displayLabel.toLowerCase() === trimmedValue.toLowerCase());

  return {
    assignedSpot: trimmedValue,
    assignedSpotId: matchedSpot?.id || ''
  };
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'NC';
}

function getLocationRateValue(lotDetails, durationType) {
  if (!lotDetails) {
    return null;
  }

  if (durationType === 'Weekly') {
    return lotDetails.weekly_rate ?? lotDetails.weeklyRate ?? null;
  }

  if (durationType === 'Monthly') {
    return lotDetails.monthly_rate ?? lotDetails.monthlyRate ?? null;
  }

  return lotDetails.daily_rate ?? lotDetails.dailyRate ?? lotDetails.overnight_price ?? null;
}

function initialsClasses(initials) {
  if (initials === 'MJ') return 'bg-secondary/10 text-secondary';
  if (initials === 'SR') return 'bg-tertiary-fixed-dim/20 text-on-tertiary-fixed-variant';
  if (initials === 'BK') return 'bg-error-container/20 text-error';
  if (initials === 'TG') return 'bg-surface-container-high text-on-surface';
  return 'bg-primary-fixed/30 text-primary';
}

function StatusBadge({ status, tone }) {
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full flex items-center gap-1 w-fit leading-none ${statusClasses(tone)}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${statusDotClasses(tone)}`} />
      {status}
    </span>
  );
}

function WarningBadge({ warning }) {
  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full leading-none ${warningClasses(warning)}`}>
      {warning}
    </span>
  );
}

function summaryCardClasses(label) {
  if (label === 'Checked In') {
    return {
      card: 'bg-secondary/5 border-secondary/15',
      value: 'text-secondary',
      accent: 'bg-secondary'
    };
  }

  if (label === 'Expected') {
    return {
      card: 'bg-surface-container-low border-outline-variant/20',
      value: 'text-primary',
      accent: 'bg-outline'
    };
  }

  if (label === 'Needs Support') {
    return {
      card: 'bg-error-container/25 border-error/10',
      value: 'text-error',
      accent: 'bg-error'
    };
  }

  if (label === 'Warnings') {
    return {
      card: 'bg-[#FFF6E0] border-[#E9A63A]/25',
      value: 'text-[#C26B00]',
      accent: 'bg-[#E9A63A]'
    };
  }

  return {
    card: 'bg-surface-container-lowest border-outline-variant/10',
    value: 'text-primary',
    accent: 'bg-outline-variant'
  };
}

function ActionModal({
  actionLabel,
  cancelLabel = 'Cancel',
  children,
  description,
  isOpen,
  onClose,
  onSubmit,
  submitDisabled,
  submitLabel,
  title
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    const firstFocusable = panelRef.current?.querySelector('[data-autofocus="true"], input, textarea, button');
    firstFocusable?.focus();
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050F36]/35 px-4 py-6 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
    >
      <div
        className="w-full max-w-[460px] rounded-[24px] border border-outline-variant/10 bg-surface-container-lowest shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        ref={panelRef}
      >
        <div className="flex items-start justify-between gap-4 p-5 pb-3.5">
          <div>
            <p className="text-[22px] leading-7 font-bold text-primary">{title}</p>
            <p className="mt-1 text-[13px] leading-5 text-on-surface-variant">{description}</p>
          </div>
          <button
            aria-label={`Close ${actionLabel} modal`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-all hover:bg-surface-container-high"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="px-5 pb-5">
          {children}

          <div className="mt-5 flex items-center justify-end gap-2.5">
            <button
              className="min-h-[40px] rounded-lg border border-outline-variant/15 bg-surface px-4 py-2 text-[13px] font-semibold text-primary transition-all hover:bg-surface-container-low"
              onClick={onClose}
              type="button"
            >
              {cancelLabel}
            </button>
            <button
              className="min-h-[40px] rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={submitDisabled}
              onClick={onSubmit}
              type="button"
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriverRow({ driver, active, onSelect }) {
  return (
    <tr
      className={`cursor-pointer transition-all ${active ? 'bg-secondary/5' : 'hover:bg-surface-container-low'}`}
      onClick={() => onSelect(driver)}
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${initialsClasses(driver.initials)}`}>
            {driver.initials}
          </div>
          <div>
            <p className="font-semibold text-[15px] leading-5 text-primary">{driver.name}</p>
            <p className="text-[11px] leading-4 text-on-surface-variant">{driver.company}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <p className="text-[14px] font-medium leading-5">{driver.vehicle}</p>
        <p className="text-[11px] leading-4 text-on-surface-variant">{driver.trailer}</p>
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-col gap-1.5">
          <StatusBadge status={driver.status} tone={driver.statusTone} />
          <div className="flex flex-wrap gap-1.5">
            {driver.warnings.map((warning) => (
              <WarningBadge key={`${driver.id}-${warning}`} warning={warning} />
            ))}
          </div>
        </div>
      </td>
      <td className="px-5 py-4">
        <p className="text-[14px] leading-5">{driver.lastActivity}</p>
        <p className={`text-[11px] leading-4 ${driver.statusTone === 'support' ? 'text-error font-medium' : 'text-on-surface-variant'}`}>
          {driver.lastDetail}
        </p>
      </td>
      <td className="px-5 py-4 text-right">
        <span className={`text-[14px] font-bold ${driver.reservation === 'Pending' ? 'text-on-surface-variant italic' : 'text-on-surface'}`}>
          {driver.reservation}
        </span>
      </td>
    </tr>
  );
}

function DriverCard({ driver, active, onSelect }) {
  return (
    <button
      className={`w-full text-left p-3.5 rounded-2xl border transition-all shadow-sm ${
        active
          ? 'bg-secondary/5 border-secondary/20'
          : 'bg-surface-container-lowest border-outline-variant/15 hover:border-secondary/20 hover:bg-surface-container-low'
      }`}
      onClick={() => onSelect(driver)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${initialsClasses(driver.initials)}`}>
            {driver.initials}
          </div>
          <div>
            <p className="font-semibold text-[15px] text-primary">{driver.name}</p>
            <p className="text-[11px] text-on-surface-variant">{driver.company}</p>
          </div>
        </div>
        <StatusBadge status={driver.status} tone={driver.statusTone} />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {driver.warnings.map((warning) => (
          <WarningBadge key={`${driver.id}-${warning}`} warning={warning} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5 text-sm">
        <div>
          <p className="text-on-surface-variant text-xs uppercase font-bold mb-1">Vehicle</p>
          <p className="font-medium text-on-surface">{driver.vehicle}</p>
        </div>
        <div>
          <p className="text-on-surface-variant text-xs uppercase font-bold mb-1">Reservation</p>
          <p className="font-medium text-on-surface">{driver.reservation}</p>
        </div>
        <div className="col-span-2">
          <p className="text-on-surface-variant text-xs uppercase font-bold mb-1">Latest</p>
          <p className="text-on-surface">{driver.lastActivity} • {driver.lastDetail}</p>
        </div>
      </div>
    </button>
  );
}

function DriverDetailPanel({ driver, onAddNote, onAssignSpot, onStatusChange }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
      <div className="p-4 xl:p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center text-xl font-bold font-manrope">
            {driver.initials}
          </div>
          <div>
            <h3 className="text-[22px] leading-7 font-bold text-primary">{driver.name}</h3>
            <p className="text-[13px] text-on-surface-variant">
              {driver.company} • {driver.rating}{' '}
              <span className="material-symbols-outlined text-xs text-tertiary-fixed-dim align-text-top" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div className="rounded-2xl bg-surface-container-low p-3.5">
            <p className="text-xs font-bold uppercase text-on-surface-variant mb-2">Confirmed Status</p>
            <StatusBadge status={driver.status} tone={driver.statusTone} />
          </div>
          <div className="rounded-2xl bg-surface-container-low p-3.5">
            <p className="text-xs font-bold uppercase text-on-surface-variant mb-2">Warnings</p>
            <div className="flex flex-wrap gap-2">
              {driver.warnings.length > 0 ? (
                driver.warnings.map((warning) => <WarningBadge key={`${driver.id}-${warning}`} warning={warning} />)
              ) : (
                <span className="text-sm font-medium text-on-surface-variant">No time-based warnings</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div className="rounded-2xl bg-surface-container-low p-3.5">
            <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">Scheduled Arrival</p>
            <p className="text-sm font-semibold text-primary">{formatDateTime(driver.scheduledArrival)}</p>
          </div>
          <div className="rounded-2xl bg-surface-container-low p-3.5">
            <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">Expected Checkout</p>
            <p className="text-sm font-semibold text-primary">{formatDateTime(driver.expectedCheckout)}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2.5 text-[14px]">
            <span className="material-symbols-outlined text-secondary">phone</span>
            <span className="text-on-surface font-medium">{driver.phone}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[14px]">
            <span className="material-symbols-outlined text-secondary">local_shipping</span>
            <span className="text-on-surface font-medium">{driver.vehicle} / {driver.trailer}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[14px]">
            <span className="material-symbols-outlined text-secondary">pin_drop</span>
            <span className="text-on-surface font-medium">Assigned Spot: <span className="font-bold text-secondary">{driver.assignedSpot}</span></span>
          </div>
          <div className="flex items-start gap-2.5 text-[14px]">
            <span className="material-symbols-outlined text-secondary pt-0.5">sticky_note_2</span>
            <span className="text-on-surface font-medium">{driver.note}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          <div className="rounded-2xl bg-surface-container-low p-3.5">
            <p className="text-xs font-bold uppercase text-on-surface-variant mb-2">Recent Contact</p>
            <p className="text-sm text-on-surface">{driver.contactSummary}</p>
          </div>
          <div className="rounded-2xl bg-surface-container-low p-3.5">
            <p className="text-xs font-bold uppercase text-on-surface-variant mb-2">Staff Follow-Up</p>
            <p className="text-sm text-on-surface">{driver.followUp}</p>
          </div>
        </div>

        <div className="relative ml-1.5 mb-6">
          {driver.timeline.map((item) => (
            <div key={`${driver.id}-${item.time}-${item.text}`} className="grid grid-cols-[18px_108px_minmax(0,1fr)] gap-3 items-center min-h-[38px]">
              <div className="relative flex justify-center self-stretch">
                <div className={`absolute top-1/2 z-10 w-3.5 h-3.5 -translate-y-1/2 rounded-full border-[3px] border-surface-container-lowest ${item.confirmed ? 'bg-secondary' : 'bg-surface-container-highest'}`} />
                {item !== driver.timeline[driver.timeline.length - 1] && (
                  <div className="absolute top-1/2 bottom-[-10px] left-1/2 w-[2px] -translate-x-1/2 bg-outline-variant/30" />
                )}
              </div>
              <p className={`text-[13px] font-bold uppercase leading-4 self-center ${item.confirmed ? 'text-on-surface-variant' : 'text-outline'}`}>{item.time}</p>
              <p className={`text-sm leading-[1.35] font-semibold ${item.confirmed ? 'text-primary' : 'text-on-surface-variant italic'}`}>{item.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-outline-variant/10 bg-surface p-3.5 mb-4">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="material-symbols-outlined text-secondary text-[16px]">fact_check</span>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Manual Status Updates</p>
          </div>
          <p className="text-[12px] leading-[1.45] text-on-surface-variant mb-3.5">
            Update arrival and departure only when staff has confirmed the change by phone, at the gate, or on site.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="min-h-[38px] px-3 py-2 bg-secondary text-white text-[13px] font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:bg-secondary/90 transition-all"
              onClick={() => onStatusChange(driver.id, 'Checked In')}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              Mark Checked In
            </button>
            <button
              className="min-h-[38px] px-3 py-2 bg-[#FFE7C2] text-[#A35200] text-[13px] font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:opacity-90 transition-all"
              onClick={() => onStatusChange(driver.id, 'Checked Out')}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Mark Checked Out
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-2.5">
            <button
              className="min-h-[38px] px-3 py-2 bg-surface-container-low text-primary text-[13px] font-semibold rounded-lg border border-outline-variant/15 flex items-center justify-center gap-1.5 hover:bg-surface-container-high transition-all"
              onClick={() => onAssignSpot(driver.id)}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              Assign / Change Spot
            </button>
            <button
              className="min-h-[38px] px-3 py-2 bg-primary text-white text-[13px] font-semibold rounded-lg flex items-center justify-center gap-1.5 hover:opacity-95 transition-all"
              onClick={() => onAddNote(driver.id)}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              Add Customer Note
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
            <button
              className="min-h-[34px] px-2.5 py-2 bg-error-container text-on-error-container text-[12px] font-medium rounded-lg hover:opacity-90 transition-all"
              onClick={() => onStatusChange(driver.id, 'Needs Support')}
              type="button"
            >
              Needs Support
            </button>
            <button
              className="min-h-[34px] px-2.5 py-2 bg-surface-container-high text-on-surface-variant text-[12px] font-medium rounded-lg hover:bg-surface-container-highest transition-all"
              onClick={() => onStatusChange(driver.id, 'Expected')}
              type="button"
            >
              Mark Expected
            </button>
            <button
              className="min-h-[34px] px-2.5 py-2 bg-surface-container-high text-on-surface-variant text-[12px] font-medium rounded-lg hover:bg-surface-container-highest transition-all"
              onClick={() => onStatusChange(driver.id, 'Cancelled')}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmationModal({
  confirmLabel,
  description,
  isOpen,
  onCancel,
  onConfirm,
  title
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onCancel();
      }
    }

    const firstFocusable = panelRef.current?.querySelector('[data-autofocus="true"], button');
    document.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-[140] flex items-center justify-center bg-[#04112F]/50 px-4 py-6 backdrop-blur-[3px]"
      onClick={onCancel}
      role="dialog"
    >
      <div
        className="w-full max-w-[420px] rounded-[24px] border border-white/10 bg-surface-container-lowest p-5 shadow-[0_24px_70px_rgba(4,17,47,0.22)] transition-all duration-150"
        onClick={(event) => event.stopPropagation()}
        ref={panelRef}
      >
        <div className="mb-5">
          <h3 className="text-[24px] font-extrabold leading-7 text-primary">{title}</h3>
          <p className="mt-2 text-[13px] leading-5 text-on-surface-variant">{description}</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            className="min-h-[40px] rounded-xl border border-outline-variant/15 bg-surface px-4 py-2 text-[13px] font-semibold text-primary transition-all hover:bg-surface-container-low"
            data-autofocus="true"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="min-h-[40px] rounded-xl bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-all hover:opacity-95"
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({
  bookingForm,
  draftRestoredMessage,
  estimatedTotal,
  isManualTotalInvalid,
  missingRateMessage,
  notesLength,
  noSpotsAvailableMessage,
  isOpen,
  isSaveDisabled,
  invalidArrivalTimeMessage,
  lotDetails,
  locationHoursLabel,
  onClearDraft,
  onClose,
  onDiscardDraft,
  onFieldChange,
  onPhoneChange,
  onSpotChange,
  onSave,
  phoneInputRef,
  selectedRateLabel,
  selectedRateValue,
  spotOptions,
  totalDue
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [isVehicleTypePickerOpen, setIsVehicleTypePickerOpen] = useState(false);
  const [isArrivalDatePickerOpen, setIsArrivalDatePickerOpen] = useState(false);
  const [isArrivalTimePickerOpen, setIsArrivalTimePickerOpen] = useState(false);
  const [isExactTimeOpen, setIsExactTimeOpen] = useState(false);
  const modalPanelRef = useRef(null);
  const vehicleTypePickerRef = useRef(null);
  const arrivalDatePickerRef = useRef(null);
  const arrivalTimePickerRef = useRef(null);
  const latestOnCloseRef = useRef(onClose);
  const todayDate = new Date();
  const initialVisibleMonth = parseIsoDate(bookingForm.arrivalDate) || todayDate;
  const [visibleCalendarMonth, setVisibleCalendarMonth] = useState(
    new Date(initialVisibleMonth.getFullYear(), initialVisibleMonth.getMonth(), 1)
  );

  latestOnCloseRef.current = onClose;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);

      const frameId = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frameId);
    }

    setIsVisible(false);

    const timeoutId = window.setTimeout(() => setShouldRender(false), 150);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        latestOnCloseRef.current();
      }
    }

    const originalOverflow = document.body.style.overflow;
    const firstFocusable = modalPanelRef.current?.querySelector('[data-autofocus="true"], input, select, textarea, button');

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!isVehicleTypePickerOpen && !isArrivalDatePickerOpen && !isArrivalTimePickerOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!vehicleTypePickerRef.current?.contains(event.target)) {
        setIsVehicleTypePickerOpen(false);
      }

      if (arrivalDatePickerRef.current?.contains(event.target)) {
        return;
      }

      if (!arrivalTimePickerRef.current?.contains(event.target)) {
        setIsArrivalTimePickerOpen(false);
      }

      if (!arrivalDatePickerRef.current?.contains(event.target)) {
        setIsArrivalDatePickerOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isArrivalDatePickerOpen, isArrivalTimePickerOpen, isVehicleTypePickerOpen]);

  if (!shouldRender) {
    return null;
  }

  const statusTone = getStatusTone(bookingForm.bookingStatus);
  const phoneDigits = normalizeUsPhoneDigits(bookingForm.phoneNumber);
  const localPhoneNumber = formatLocalPhoneNumber(bookingForm.phoneNumber);
  const arrivalDateLabel = formatDateTriggerLabel(bookingForm.arrivalDate);
  const arrivalLabel = formatPreviewDateTime(bookingForm.arrivalDate, bookingForm.arrivalTime);
  const formattedArrivalTime = formatTimeLabel(bookingForm.arrivalTime);
  const calendarDays = getCalendarDays(visibleCalendarMonth);
  const todayIso = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
  const durationLabel = formatDurationLabel(bookingForm.durationValue, bookingForm.durationType);
  const validTimeOptions = TIME_OPTIONS.filter((timeOption) => isTimeAllowedForLocation(timeOption, lotDetails));
  const groupedTimeOptions = GROUPED_TIME_OPTIONS
    .map((group) => ({
      ...group,
      times: group.times.filter((timeOption) => isTimeAllowedForLocation(timeOption, lotDetails))
    }))
    .filter((group) => group.times.length > 0);
  const quickTimeOptions = [
    { label: 'Now', value: roundDateToFiveMinutes(new Date()), dynamic: true },
    { label: '+15 min', value: roundDateToFiveMinutes(new Date(), 15), dynamic: true },
    { label: '+30 min', value: roundDateToFiveMinutes(new Date(), 30), dynamic: true },
    { label: '08:00 AM', value: '08:00' },
    { label: '09:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '05:00 PM', value: '17:00' }
  ]
    .map((option) => ({
      ...option,
      isAllowed: isTimeAllowedForLocation(option.value, lotDetails)
    }))
    .filter((option) => option.dynamic || option.isAllowed);
  const exactTimeBase = (bookingForm.arrivalTime && isTimeAllowedForLocation(bookingForm.arrivalTime, lotDetails))
    ? bookingForm.arrivalTime
    : validTimeOptions[0] || roundDateToFiveMinutes(new Date());
  const [exactHour = '08'] = exactTimeBase.split(':');
  const exactTimeOptions = Array.from({ length: 12 }, (_, index) => `${exactHour}:${String(index * 5).padStart(2, '0')}`)
    .filter((timeOption) => isTimeAllowedForLocation(timeOption, lotDetails));

  function handleArrivalTimeSelection(timeValue) {
    onFieldChange('arrivalTime', timeValue);
    setIsArrivalTimePickerOpen(false);
    setIsExactTimeOpen(false);
  }

  function handleArrivalDateSelection(dateValue) {
    onFieldChange('arrivalDate', dateValue);
    setVisibleCalendarMonth(() => {
      const parsedDate = parseIsoDate(dateValue);
      return parsedDate
        ? new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1)
        : new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    });
    setIsArrivalDatePickerOpen(false);
  }

  function handleVehicleTypeSelection(vehicleType) {
    onFieldChange('vehicleType', vehicleType);
    setIsVehicleTypePickerOpen(false);
  }

  return (
    <div
      aria-modal="true"
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-[#04112F]/55 px-3 py-3 sm:px-4 sm:py-4 backdrop-blur-[3px] transition-opacity duration-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
      role="dialog"
    >
      <div
        className={`flex h-[min(90vh,860px)] w-[min(1180px,92vw)] max-w-[1180px] flex-col overflow-hidden rounded-[24px] border border-white/10 bg-surface-container-lowest shadow-[0_28px_90px_rgba(4,17,47,0.28)] transition-all duration-150 ${isVisible ? 'scale-100 translate-y-0' : 'scale-[0.98] translate-y-2'}`}
        onClick={(event) => event.stopPropagation()}
        ref={modalPanelRef}
      >
        <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-outline-variant/10 bg-surface-container-lowest px-4 py-3 md:flex-row md:items-start md:justify-between md:px-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
              <span className="material-symbols-outlined text-[22px]">person_add</span>
            </div>
            <div>
              <h2 className="text-[24px] font-extrabold leading-7 text-primary md:text-[26px]">New Customer Booking</h2>
              <p className="mt-1 text-[12px] leading-5 text-on-surface-variant">Create and assign a new parking reservation</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              className="min-h-[38px] rounded-xl border border-outline-variant/15 bg-surface px-3.5 py-2 text-[13px] font-semibold text-primary transition-all hover:bg-surface-container-low"
              onClick={onClearDraft}
              type="button"
            >
              Clear Draft
            </button>
            <button
              className="min-h-[38px] rounded-xl border border-outline-variant/15 bg-surface px-3.5 py-2 text-[13px] font-semibold text-primary transition-all hover:bg-surface-container-low"
              onClick={onDiscardDraft}
              type="button"
            >
              Discard Draft
            </button>
            <button
              className="min-h-[38px] rounded-xl bg-primary px-3.5 py-2 text-[13px] font-semibold text-white transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSaveDisabled}
              onClick={onSave}
              type="button"
            >
              Save Booking
            </button>
            <button
              aria-label="Close new booking modal"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-all hover:bg-surface-container-high"
              onClick={onClose}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto px-4 py-4 md:px-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.72fr)]">
            <div className="space-y-3.5">
              {draftRestoredMessage && (
                <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low px-3.5 py-2.5 text-[12px] text-on-surface-variant">
                  {draftRestoredMessage}
                </div>
              )}
              <section className="rounded-[22px] border border-outline-variant/10 bg-surface p-3.5 shadow-sm md:p-4">
                <div className="mb-3">
                  <h3 className="text-[17px] font-bold text-primary">Customer Information</h3>
                  <p className="mt-1 text-[12px] text-on-surface-variant">Add the customer contact and vehicle profile for this reservation.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Full Name</span>
                    <input className="w-full rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-3.5 py-3 text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20" data-autofocus="true" maxLength={60} onChange={(event) => onFieldChange('fullName', event.target.value.slice(0, 60))} placeholder="Customer full name" type="text" value={bookingForm.fullName} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Phone Number</span>
                    <div className="flex min-h-[48px] items-center overflow-hidden rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-3.5 transition-all focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/20">
                      <div className="flex shrink-0 items-center pr-3 text-[14px] font-semibold text-on-surface">
                        +1
                      </div>
                      <div className="h-5 w-px shrink-0 bg-outline-variant/20" />
                      <input
                        className="min-h-[48px] w-full appearance-none border-0 bg-transparent pl-3 pr-0 py-3 text-[14px] text-on-surface outline-none ring-0 shadow-none focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none placeholder:text-on-surface-variant/60"
                        maxLength={14}
                        onChange={onPhoneChange}
                        placeholder="(555) 000-0000"
                        ref={phoneInputRef}
                        type="text"
                        value={localPhoneNumber}
                      />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Company Name</span>
                    <input className="w-full rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-3.5 py-3 text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20" maxLength={80} onChange={(event) => onFieldChange('companyName', event.target.value.slice(0, 80))} placeholder="Optional company or fleet" type="text" value={bookingForm.companyName} />
                  </label>
                  <label className="block relative" ref={vehicleTypePickerRef}>
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Vehicle Type</span>
                    <button
                      aria-expanded={isVehicleTypePickerOpen}
                      className="flex min-h-[48px] w-full items-center justify-between rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-3.5 py-3 text-left text-[14px] text-on-surface transition-all hover:bg-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                      onClick={() => setIsVehicleTypePickerOpen((currentValue) => !currentValue)}
                      type="button"
                    >
                      <span className={bookingForm.vehicleType ? 'text-on-surface' : 'text-on-surface-variant/60'}>
                        {bookingForm.vehicleType || 'Select vehicle type'}
                      </span>
                      <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform ${isVehicleTypePickerOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>

                    {isVehicleTypePickerOpen && (
                      <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-full overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface shadow-[0_18px_40px_rgba(4,17,47,0.18)]">
                        <div className="px-2 py-2">
                          {VEHICLE_OPTIONS.map((vehicleOption) => (
                            <button
                              key={vehicleOption}
                              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-[13px] font-medium transition-all ${bookingForm.vehicleType === vehicleOption ? 'bg-secondary/8 text-primary' : 'text-on-surface hover:bg-surface-container-low'}`}
                              onClick={() => handleVehicleTypeSelection(vehicleOption)}
                              type="button"
                            >
                              <span>{vehicleOption}</span>
                              {bookingForm.vehicleType === vehicleOption && (
                                <span className="material-symbols-outlined text-[16px] text-secondary">check</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">License Plate</span>
                    <input className="w-full rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-3.5 py-3 text-[14px] uppercase text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20" maxLength={12} onChange={(event) => onFieldChange('licensePlate', event.target.value.toUpperCase().slice(0, 12))} placeholder="Optional plate number" type="text" value={bookingForm.licensePlate} />
                  </label>
                </div>
              </section>

              <section className="rounded-[22px] border border-outline-variant/10 bg-surface p-3.5 shadow-sm md:p-4">
                <div className="mb-3">
                  <h3 className="text-[17px] font-bold text-primary">Reservation Details</h3>
                  <p className="mt-1 text-[12px] text-on-surface-variant">Configure arrival timing, duration, and the assigned parking spot.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block relative" ref={arrivalDatePickerRef}>
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Arrival Date</span>
                    <button
                      aria-expanded={isArrivalDatePickerOpen}
                      className="flex min-h-[48px] w-full items-center justify-between rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-3.5 py-3 text-left text-[14px] text-on-surface transition-all hover:bg-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                      onClick={() => setIsArrivalDatePickerOpen((currentValue) => !currentValue)}
                      type="button"
                    >
                      <span className={bookingForm.arrivalDate ? 'text-on-surface' : 'text-on-surface-variant/60'}>{arrivalDateLabel}</span>
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">calendar_month</span>
                    </button>

                    {isArrivalDatePickerOpen && (
                      <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-[320px] max-w-full rounded-[24px] border border-outline-variant/10 bg-surface p-3 shadow-[0_18px_40px_rgba(4,17,47,0.16)]">
                        <div className="flex items-center justify-between px-1 pb-3 pt-1">
                          <button
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-all hover:bg-surface-container-high"
                            onClick={() => setVisibleCalendarMonth((currentValue) => new Date(currentValue.getFullYear(), currentValue.getMonth() - 1, 1))}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                          </button>
                          <p className="text-[18px] font-bold text-primary">{formatCalendarMonthLabel(visibleCalendarMonth)}</p>
                          <button
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-all hover:bg-surface-container-high"
                            onClick={() => setVisibleCalendarMonth((currentValue) => new Date(currentValue.getFullYear(), currentValue.getMonth() + 1, 1))}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 px-1 pb-2">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((weekday) => (
                            <div key={weekday} className="flex h-8 items-center justify-center text-[11px] font-medium uppercase tracking-[0.08em] text-on-surface-variant/70">
                              {weekday}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 px-1">
                          {calendarDays.map((day) => {
                            const isSelected = bookingForm.arrivalDate === day.iso;
                            const isToday = day.iso === todayIso;

                            return (
                              <button
                                key={day.iso}
                                className={`flex h-10 items-center justify-center rounded-[14px] text-[13px] font-medium transition-all ${
                                  isSelected
                                    ? 'bg-secondary text-white shadow-sm'
                                    : isToday
                                      ? 'border border-secondary/25 bg-secondary/5 text-primary'
                                      : day.isCurrentMonth
                                        ? 'text-on-surface hover:bg-surface-container-low'
                                        : 'text-on-surface-variant/40 hover:bg-surface-container-low'
                                }`}
                                onClick={() => handleArrivalDateSelection(day.iso)}
                                type="button"
                              >
                                {day.date.getDate()}
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-3 flex items-center justify-end px-1">
                          <button
                            className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-secondary transition-all hover:bg-secondary/8"
                            onClick={() => handleArrivalDateSelection(todayIso)}
                            type="button"
                          >
                            Today
                          </button>
                        </div>
                      </div>
                    )}
                  </label>
                  <label className="block relative" ref={arrivalTimePickerRef}>
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Arrival Time</span>
                    <button
                      aria-expanded={isArrivalTimePickerOpen}
                      className="flex min-h-[48px] w-full items-center justify-between rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-3.5 py-3 text-left text-[14px] text-on-surface transition-all hover:bg-surface focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                      onClick={() => setIsArrivalTimePickerOpen((currentValue) => !currentValue)}
                      type="button"
                    >
                      <span className={bookingForm.arrivalTime ? 'text-on-surface' : 'text-on-surface-variant/60'}>{formattedArrivalTime}</span>
                      <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform ${isArrivalTimePickerOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-on-surface-variant">{locationHoursLabel}</span>
                      {invalidArrivalTimeMessage && (
                        <span className="text-[11px] text-error">{invalidArrivalTimeMessage}</span>
                      )}
                    </div>

                    {isArrivalTimePickerOpen && (
                      <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-full overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface shadow-[0_18px_40px_rgba(4,17,47,0.18)]">
                        <div className="border-b border-outline-variant/10 px-3.5 py-3">
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Quick Picks</p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {quickTimeOptions.map((quickOption) => (
                              <button
                                key={quickOption.label}
                                className={`rounded-xl px-3 py-2 text-[12px] font-semibold transition-all ${quickOption.isAllowed ? bookingForm.arrivalTime === quickOption.value ? 'bg-secondary text-white' : 'bg-surface-container-low text-primary hover:bg-surface-container-high' : 'cursor-not-allowed bg-surface-container-low text-on-surface-variant/50'}`}
                                disabled={!quickOption.isAllowed}
                                onClick={() => quickOption.isAllowed && handleArrivalTimeSelection(quickOption.value)}
                                title={!quickOption.isAllowed ? 'Outside location operating hours' : undefined}
                                type="button"
                              >
                                {quickOption.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="px-3.5 py-3">
                          <div className="flex items-center justify-between pb-2">
                            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Time Blocks</p>
                            <button
                              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all ${isExactTimeOpen ? 'bg-secondary text-white' : 'bg-surface-container-low text-primary hover:bg-surface-container-high'}`}
                              onClick={() => setIsExactTimeOpen((currentValue) => !currentValue)}
                              type="button"
                            >
                              Select exact time
                            </button>
                          </div>

                          <div className="space-y-3">
                            {groupedTimeOptions.map((group) => (
                              <div key={group.label}>
                                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">{group.label}</p>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                  {group.times.map((timeOption) => (
                                    <button
                                      key={timeOption}
                                      className={`rounded-xl px-3 py-2 text-[12px] font-semibold transition-all ${bookingForm.arrivalTime === timeOption ? 'bg-secondary text-white' : 'bg-surface-container-low text-primary hover:bg-surface-container-high'}`}
                                      onClick={() => handleArrivalTimeSelection(timeOption)}
                                      type="button"
                                    >
                                      {formatTimeLabel(timeOption)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          {isExactTimeOpen && (
                            <div className="mt-3 rounded-2xl border border-outline-variant/10 bg-surface-container-low px-3 py-3">
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Exact time</p>
                                  <p className="mt-1 text-[12px] text-on-surface-variant">5-minute options for {formatTimeLabel(`${exactHour}:00`)}</p>
                                </div>
                              </div>
                              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {exactTimeOptions.map((timeOption) => (
                                  <button
                                    key={timeOption}
                                    className={`rounded-xl px-3 py-2 text-[12px] font-semibold transition-all ${bookingForm.arrivalTime === timeOption ? 'bg-secondary text-white' : 'bg-surface text-primary hover:bg-surface-container-high'}`}
                                    onClick={() => handleArrivalTimeSelection(timeOption)}
                                    type="button"
                                  >
                                    {formatTimeLabel(timeOption)}
                                  </button>
                                ))}
                              </div>
                              {exactTimeOptions.length === 0 && (
                                <p className="mt-3 text-[12px] text-on-surface-variant">No exact-time slots are available for this hour within the location's operating hours.</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </label>
                  <div className="block">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Duration Type</span>
                    <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface-container-low p-1">
                      {DURATION_TYPE_OPTIONS.map((durationType) => (
                        <button key={durationType} className={`rounded-xl px-3 py-2 text-[13px] font-semibold transition-all ${bookingForm.durationType === durationType ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}`} onClick={() => onFieldChange('durationType', durationType)} type="button">{durationType}</button>
                      ))}
                    </div>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Duration</span>
                    <input className="w-full rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-3.5 py-3 text-[14px] text-on-surface outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/20" inputMode="numeric" min="1" onChange={(event) => onFieldChange('durationValue', event.target.value.replace(/\D/g, '').slice(0, 3))} type="text" value={bookingForm.durationValue} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Assigned Spot</span>
                    <input className="w-full rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-3.5 py-3 text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20" list="booking-spot-options" maxLength={30} onChange={(event) => onSpotChange(event.target.value)} placeholder="Search spot label" type="text" value={bookingForm.assignedSpot} />
                    <datalist id="booking-spot-options">
                      {spotOptions.map((spotOption) => (
                        <option key={spotOption.id} label={spotOption.helperText} value={spotOption.value} />
                      ))}
                    </datalist>
                    <p className={`mt-2 text-[12px] ${noSpotsAvailableMessage || (bookingForm.assignedSpot.length > 0 && !bookingForm.assignedSpotId) ? 'text-error' : 'text-on-surface-variant'}`}>
                      {noSpotsAvailableMessage || (bookingForm.assignedSpot.length > 0 && !bookingForm.assignedSpotId
                        ? 'Select a saved spot from this location.'
                        : 'Uses resolved location spots first, then falls back to generated labels like Spot 1, Spot 2, Spot 3.')}
                    </p>
                  </label>
                  <div className="space-y-2">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Spot Tools</span>
                    <button className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-secondary/30 bg-secondary/5 px-3.5 py-3 text-[13px] font-semibold text-secondary transition-all hover:bg-secondary/10" type="button">
                      <span className="material-symbols-outlined text-[18px]">map</span>
                      Select Spot on Map
                    </button>
                  </div>
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Booking Status</span>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {BOOKING_STATUS_OPTIONS.map((statusOption) => (
                        <button key={statusOption} className={`flex items-center justify-between rounded-2xl border px-3.5 py-3 text-left transition-all ${bookingForm.bookingStatus === statusOption ? 'border-secondary/30 bg-secondary/5' : 'border-outline-variant/10 bg-surface-container-lowest hover:border-secondary/20 hover:bg-surface-container-low'}`} onClick={() => onFieldChange('bookingStatus', statusOption)} type="button">
                          <div>
                            <p className="text-[13px] font-semibold text-primary">{statusOption}</p>
                            <p className="mt-1 text-[11px] text-on-surface-variant">Set the arrival workflow state</p>
                          </div>
                          <StatusBadge status={statusOption} tone={getStatusTone(statusOption)} />
                        </button>
                      ))}
                    </div>
                  </label>
                </div>
              </section>

              <section className="rounded-[22px] border border-outline-variant/10 bg-surface p-3.5 shadow-sm md:p-4">
                <div className="mb-3">
                  <h3 className="text-[17px] font-bold text-primary">Pricing</h3>
                  <p className="mt-1 text-[12px] text-on-surface-variant">Use the daily rate to auto-calculate the total, or override it manually when needed.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">{selectedRateLabel}</span>
                    <input className={`w-full rounded-xl border px-3.5 py-3 text-[14px] outline-none transition-all ${missingRateMessage ? 'border-error/25 bg-error-container/25 text-error placeholder:text-error/70' : 'border-outline-variant/15 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60'}`} placeholder={missingRateMessage ? 'Rate unavailable' : '$0.00'} readOnly type="text" value={selectedRateValue} />
                  </label>
                  <div className={`rounded-2xl border px-4 py-3 ${isManualTotalInvalid ? 'border-outline-variant/15 bg-surface' : 'border-outline-variant/10 bg-surface-container-low'}`}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Estimated Total</p>
                    <p className="mt-2 text-[28px] font-extrabold leading-none text-primary">
                      {isManualTotalInvalid ? 'Manual total required' : formatCurrency(estimatedTotal)}
                    </p>
                    <p className="mt-2 text-[12px] text-on-surface-variant">
                      {bookingForm.manualOverride
                        ? isManualTotalInvalid
                          ? 'Please enter a manual total to continue.'
                          : 'Using manually overridden total.'
                        : 'Calculated from the selected location’s rate.'}
                    </p>
                  </div>
                  <label className="md:col-span-2 flex items-center justify-between rounded-2xl border border-outline-variant/10 bg-surface-container-low px-4 py-3">
                    <div>
                      <p className="text-[13px] font-semibold text-primary">Manual override</p>
                      <p className="mt-1 text-[12px] text-on-surface-variant">Use a custom total instead of the auto-calculated amount.</p>
                    </div>
                    <button aria-pressed={bookingForm.manualOverride} className={`relative h-7 w-12 rounded-full transition-all ${bookingForm.manualOverride ? 'bg-primary' : 'bg-surface-container-high'}`} onClick={() => onFieldChange('manualOverride', !bookingForm.manualOverride)} type="button">
                      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${bookingForm.manualOverride ? 'left-6' : 'left-1'}`} />
                    </button>
                  </label>
                  {bookingForm.manualOverride && (
                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Manual Total</span>
                      <input className="w-full rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-3.5 py-3 text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20" inputMode="decimal" maxLength={10} onBlur={() => onFieldChange('manualTotal', formatCurrency(parseCurrencyInput(bookingForm.manualTotal)))} onChange={(event) => onFieldChange('manualTotal', event.target.value.replace(/[^0-9.]/g, '').slice(0, 10))} placeholder="$0.00" type="text" value={bookingForm.manualTotal} />
                    </label>
                  )}
                  {missingRateMessage && !bookingForm.manualOverride && (
                    <div className="md:col-span-2 rounded-2xl border border-error/20 bg-error-container/25 px-4 py-3 text-[12px] text-error">
                      {missingRateMessage}
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[22px] border border-outline-variant/10 bg-surface p-3.5 shadow-sm md:p-4">
                <div className="mb-3">
                  <h3 className="text-[17px] font-bold text-primary">Customer Notes</h3>
                  <p className="mt-1 text-[12px] text-on-surface-variant">Capture special instructions for access, arrival, or staff handoff.</p>
                </div>
                <label className="block">
                  <textarea className="min-h-[88px] w-full resize-y rounded-2xl border border-outline-variant/15 bg-surface-container-lowest px-3.5 py-3 text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20" maxLength={300} onChange={(event) => onFieldChange('customerNotes', event.target.value.slice(0, 300))} placeholder="Special instructions, driver notes, gate access, etc." value={bookingForm.customerNotes} />
                </label>
                <div className="mt-2 flex justify-end">
                  <span className={`text-[11px] ${notesLength >= 300 ? 'text-error' : 'text-on-surface-variant'}`}>{notesLength}/300</span>
                </div>
              </section>
            </div>

            <aside className="space-y-3 xl:sticky xl:top-0 self-start">
              <div className="rounded-[22px] border border-outline-variant/10 bg-[#F8FAFF] p-3.5 shadow-sm md:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">Booking Preview</p>
                    <h3 className="mt-1.5 text-[22px] font-extrabold leading-7 text-primary">{bookingForm.fullName.trim() || 'New Customer'}</h3>
                    <p className="mt-1 text-[13px] text-on-surface-variant">{bookingForm.companyName.trim() || 'Company not added yet'}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-[14px] font-bold ${initialsClasses(getInitials(bookingForm.fullName))}`}>{getInitials(bookingForm.fullName)}</div>
                </div>
                <div className="mt-3">
                  <StatusBadge status={bookingForm.bookingStatus} tone={statusTone} />
                  <p className="mt-2.5 text-[13px] font-medium text-on-surface">{phoneDigits.length > 0 ? bookingForm.phoneNumber : '+1'}</p>
                </div>
                <div className="mt-3.5 space-y-2.5">
                  <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Customer</p>
                    <p className="mt-1.5 text-[14px] font-semibold text-primary">{bookingForm.fullName.trim() || 'Awaiting customer name'}</p>
                    <p className="mt-1 text-[12px] text-on-surface-variant">{bookingForm.companyName.trim() || 'Independent / walk-in'}</p>
                  </div>
                  <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Vehicle</p>
                    <p className="mt-1.5 text-[14px] font-semibold text-primary">{bookingForm.vehicleType || 'Vehicle type pending'}</p>
                    <p className="mt-1 text-[12px] text-on-surface-variant">{bookingForm.licensePlate || 'License plate not provided'}</p>
                  </div>
                  <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Spot Assignment</p>
                    <p className="mt-1.5 text-[14px] font-semibold text-primary">{bookingForm.assignedSpot || 'Spot not assigned'}</p>
                    <p className="mt-1 text-[12px] text-on-surface-variant">Use spot search or the map shortcut to place the booking.</p>
                  </div>
                  <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Arrival</p>
                    <p className="mt-1.5 text-[14px] font-semibold text-primary">{arrivalLabel}</p>
                  </div>
                  <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-lowest p-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Duration</p>
                    <p className="mt-1.5 text-[14px] font-semibold text-primary">{durationLabel}</p>
                  </div>
                </div>
                <div className="mt-3.5 rounded-[22px] bg-primary p-3.5 text-white shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Total Due</p>
                  <p className="mt-1.5 text-[30px] font-extrabold leading-none">{formatCurrency(totalDue)}</p>
                  <p className="mt-1.5 text-[12px] text-white/75">{bookingForm.manualOverride ? 'Manual override applied to this booking total.' : 'Auto-calculated from the configured pricing inputs.'}</p>
                </div>
                <p className="mt-3 text-[12px] leading-5 text-on-surface-variant">Complete all required fields to enable Save Booking action.</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerManagement() {
  const { lotDetails, selectedLotId } = useContext(LotContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [driverRecords, setDriverRecords] = useState(initialDrivers);
  const [selectedDriverId, setSelectedDriverId] = useState(initialDrivers[0].id);
  const [spotModalState, setSpotModalState] = useState({ isOpen: false, driverId: null, value: '' });
  const [noteModalState, setNoteModalState] = useState({ isOpen: false, driverId: null, value: '' });
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState(createInitialBookingForm);
  const [lotSpotRecords, setLotSpotRecords] = useState([]);
  const [draftRestoredMessage, setDraftRestoredMessage] = useState('');
  const [confirmationState, setConfirmationState] = useState({ isOpen: false, action: null });
  const bookingPhoneInputRef = useRef(null);
  const pendingPhoneCaretRef = useRef(null);
  const bookingDraftKey = getBookingDraftStorageKey(selectedLotId);

  const drivers = useMemo(() => {
    const now = new Date();

    return driverRecords.map((driver) => ({
      ...driver,
      statusTone: getStatusTone(driver.status),
      warnings: createWarnings(driver, now),
      timeline: driver.timeline.map((item) => ({
        ...item,
        confirmed: item.confirmed ?? item.active ?? false
      }))
    }));
  }, [driverRecords]);

  const filteredDrivers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return drivers.filter((driver) => {
      const matchesFilter =
        activeFilter === 'All' ||
        driver.status === activeFilter ||
        (activeFilter === 'Warnings' && driver.warnings.length > 0);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          driver.name,
          driver.company,
          driver.vehicle,
          driver.trailer,
          driver.assignedSpot
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, drivers, searchQuery]);

  const selectedDriver = useMemo(() => {
    const visibleDriver = filteredDrivers.find((driver) => driver.id === selectedDriverId);
    return visibleDriver || filteredDrivers[0] || drivers[0];
  }, [drivers, filteredDrivers, selectedDriverId]);
  const bookingSpotOptions = useMemo(() => buildSpotOptions(lotSpotRecords), [lotSpotRecords]);
  const bookingDurationCount = Number.parseInt(bookingForm.durationValue, 10) || 0;
  const configuredRate = getLocationRateValue(lotDetails, bookingForm.durationType);
  const normalizedConfiguredRate = configuredRate == null ? null : Number(configuredRate);
  const bookingTierRate = Number.isFinite(normalizedConfiguredRate) && normalizedConfiguredRate >= 0
    ? normalizedConfiguredRate
    : null;
  const selectedRateLabel = `${bookingForm.durationType} Rate`;
  const selectedRateValue = bookingTierRate == null ? '' : formatCurrency(bookingTierRate);
  const missingRateMessage = bookingTierRate == null
    ? `${bookingForm.durationType} rate is not configured for this location.`
    : '';
  const invalidArrivalTimeMessage = bookingForm.arrivalTime && !isTimeAllowedForLocation(bookingForm.arrivalTime, lotDetails)
    ? `Selected time is outside this location's operating hours.`
    : '';
  const locationHoursLabel = formatOperatingHoursLabel(lotDetails);
  const bookingLocalPhoneNumber = formatLocalPhoneNumber(bookingForm.phoneNumber);
  const noSpotsAvailableMessage = bookingSpotOptions.length === 0 ? 'No spots available for this location.' : '';
  const estimatedBookingTotal = bookingTierRate == null ? 0 : bookingTierRate * bookingDurationCount;
  const manualBookingTotal = parseCurrencyInput(bookingForm.manualTotal);
  const isManualTotalInvalid = bookingForm.manualOverride && manualBookingTotal <= 0;
  const bookingTotalDue = bookingForm.manualOverride ? manualBookingTotal : estimatedBookingTotal;
  const isBookingSaveDisabled =
    bookingForm.fullName.trim().length === 0 ||
    bookingForm.phoneNumber.replace(/\D/g, '').length !== 10 ||
    bookingForm.vehicleType.length === 0 ||
    bookingForm.arrivalDate.length === 0 ||
    bookingForm.arrivalTime.length === 0 ||
    invalidArrivalTimeMessage.length > 0 ||
    bookingDurationCount <= 0 ||
    noSpotsAvailableMessage.length > 0 ||
    bookingForm.assignedSpotId.length === 0 ||
    (!bookingForm.manualOverride && (bookingTierRate == null || bookingTierRate <= 0)) ||
    isManualTotalInvalid;

  useLayoutEffect(() => {
    if (pendingPhoneCaretRef.current == null || !bookingPhoneInputRef.current) {
      return;
    }

    const nextCaret = Math.min(pendingPhoneCaretRef.current, bookingLocalPhoneNumber.length);
    bookingPhoneInputRef.current.setSelectionRange(nextCaret, nextCaret);
    pendingPhoneCaretRef.current = null;
  }, [bookingLocalPhoneNumber]);

  useEffect(() => {
    let isMounted = true;

    async function loadSpotRecords() {
      if (!selectedLotId) {
        if (isMounted) {
          setLotSpotRecords([]);
        }
        return;
      }

      try {
        const spots = await availabilityService.getSpots(selectedLotId);
        if (!isMounted) {
          return;
        }

        setLotSpotRecords(getResolvedSpotsForLocation(lotDetails, spots));
      } catch (_) {
        if (!isMounted) {
          return;
        }

        setLotSpotRecords(getResolvedSpotsForLocation(lotDetails, []));
      }
    }

    loadSpotRecords();

    return () => {
      isMounted = false;
    };
  }, [lotDetails, selectedLotId]);

  useEffect(() => {
    if (!isBookingModalOpen) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      const hasMeaningfulDraft = Object.entries(bookingForm).some(([field, value]) => {
        if (field === 'durationType' || field === 'durationValue' || field === 'dailyRate' || field === 'manualOverride') {
          return false;
        }

        if (typeof value === 'string') {
          return value.trim().length > 0;
        }

        return Boolean(value);
      });

      if (hasMeaningfulDraft) {
        window.localStorage.setItem(bookingDraftKey, JSON.stringify(bookingForm));
      } else {
        window.localStorage.removeItem(bookingDraftKey);
      }
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [bookingDraftKey, bookingForm, isBookingModalOpen]);

  const checkedInCount = drivers.filter((driver) => driver.status === 'Checked In').length;
  const expectedCount = drivers.filter((driver) => driver.status === 'Expected').length;
  const warningCount = drivers.filter((driver) => driver.warnings.length > 0).length;
  const supportCount = drivers.filter((driver) => driver.status === 'Needs Support').length;
  const occupiedSpots = 42;
  const totalSpots = 60;
  const revenueToday = 2480;

  function handleStatusChange(driverId, nextStatus) {
    const timeStamp = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date());

    const statusDetails = {
      Expected: 'Staff reset reservation to expected arrival',
      'Checked In': 'Staff confirmed arrival on site',
      'Checked Out': 'Staff confirmed departure',
      'Needs Support': 'Staff flagged this reservation for follow-up',
      Cancelled: 'Staff logged a cancellation'
    };

    setDriverRecords((currentDrivers) =>
      currentDrivers.map((driver) => {
        if (driver.id !== driverId) {
          return driver;
        }

        return {
          ...driver,
          status: nextStatus,
          lastActivity: timeStamp,
          lastDetail: statusDetails[nextStatus],
          timeline: [
            ...driver.timeline.map((item) => ({
              ...item,
              confirmed: item.confirmed ?? item.active ?? false
            })),
            { time: timeStamp, text: statusDetails[nextStatus], confirmed: true }
          ]
        };
      })
    );
  }

  function openAssignSpotModal(driverId) {
    const currentDriver = drivers.find((driver) => driver.id === driverId);

    setSpotModalState({
      isOpen: true,
      driverId,
      value: currentDriver?.assignedSpot === 'Support Review' ? '' : currentDriver?.assignedSpot ?? ''
    });
  }

  function closeAssignSpotModal() {
    setSpotModalState({ isOpen: false, driverId: null, value: '' });
  }

  function saveAssignedSpot() {
    if (!spotModalState.driverId || spotModalState.value.trim().length === 0) {
      return;
    }

    const cleanSpot = spotModalState.value.trim();
    const timeStamp = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date());

    setDriverRecords((currentDrivers) =>
      currentDrivers.map((driver) =>
        driver.id === spotModalState.driverId
          ? {
              ...driver,
              assignedSpot: cleanSpot,
              lastActivity: timeStamp,
              lastDetail: `Spot updated to ${cleanSpot}`,
              timeline: [...driver.timeline, { time: timeStamp, text: `Assigned spot updated to ${cleanSpot}`, confirmed: true }]
            }
          : driver
      )
    );

    closeAssignSpotModal();
  }

  function openAddNoteModal(driverId) {
    setNoteModalState({
      isOpen: true,
      driverId,
      value: ''
    });
  }

  function closeAddNoteModal() {
    setNoteModalState({ isOpen: false, driverId: null, value: '' });
  }

  function openBookingModal() {
    const storedDraft = window.localStorage.getItem(bookingDraftKey);

    if (storedDraft) {
      try {
        const parsedDraft = JSON.parse(storedDraft);
        setBookingForm((currentForm) => ({ ...currentForm, ...parsedDraft }));
        setDraftRestoredMessage('Draft restored');
      } catch (_) {
        window.localStorage.removeItem(bookingDraftKey);
        setDraftRestoredMessage('');
      }
    } else {
      setDraftRestoredMessage('');
    }

    setIsBookingModalOpen(true);
  }

  function closeBookingModal() {
    setIsBookingModalOpen(false);
  }

  function resetBookingDraft() {
    setBookingForm(createInitialBookingForm());
    setDraftRestoredMessage('');
    window.localStorage.removeItem(bookingDraftKey);
  }

  function openDraftConfirmation(action) {
    setConfirmationState({ isOpen: true, action });
  }

  function closeDraftConfirmation() {
    setConfirmationState({ isOpen: false, action: null });
  }

  function confirmDraftAction() {
    if (confirmationState.action === 'discard') {
      resetBookingDraft();
      setIsBookingModalOpen(false);
    }

    if (confirmationState.action === 'clear') {
      resetBookingDraft();
    }

    closeDraftConfirmation();
  }

  function handleBookingFieldChange(field, value) {
    setBookingForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));
  }

  function handleAssignedSpotChange(rawValue) {
    const nextSelection = resolveSpotSelection(bookingSpotOptions, rawValue.slice(0, 30));

    setBookingForm((currentForm) => ({
      ...currentForm,
      assignedSpot: nextSelection.assignedSpot,
      assignedSpotId: nextSelection.assignedSpotId
    }));
  }

  function handleBookingPhoneChange(event) {
    const digitCountBeforeCursor = countPhoneDigitsBeforeCursor(event.target.value, event.target.selectionStart);
    const formattedValue = formatPhoneNumber(event.target.value);
    const localFormattedValue = formatLocalPhoneNumber(event.target.value);

    pendingPhoneCaretRef.current = getPhoneCursorPosition(localFormattedValue, digitCountBeforeCursor);
    handleBookingFieldChange('phoneNumber', formattedValue);
  }

  function saveCustomerNote() {
    if (!noteModalState.driverId || noteModalState.value.trim().length === 0) {
      return;
    }

    const cleanNote = noteModalState.value.trim();
    const timeStamp = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date());

    setDriverRecords((currentDrivers) =>
      currentDrivers.map((driver) =>
        driver.id === noteModalState.driverId
          ? {
              ...driver,
              note: cleanNote,
              lastActivity: timeStamp,
              lastDetail: 'Staff note added',
              timeline: [...driver.timeline, { time: timeStamp, text: `Staff note: ${cleanNote}`, confirmed: true }]
            }
          : driver
      )
    );

    closeAddNoteModal();
  }

  function saveBooking() {
    if (isBookingSaveDisabled) {
      return;
    }

    const arrivalDate = combineDateAndTime(bookingForm.arrivalDate, bookingForm.arrivalTime);

    if (!arrivalDate) {
      return;
    }

    const expectedCheckout = new Date(arrivalDate);
    expectedCheckout.setDate(expectedCheckout.getDate() + bookingDurationCount * getDurationMultiplier(bookingForm.durationType));

    const cleanName = bookingForm.fullName.trim();
    const cleanCompanyName = bookingForm.companyName.trim();
    const selectedSpot = bookingSpotOptions.find((spot) => spot.id === bookingForm.assignedSpotId);
    const cleanSpot = selectedSpot?.displayLabel || bookingForm.assignedSpot.trim();
    const cleanNotes = bookingForm.customerNotes.trim();
    const normalizedStatus = bookingForm.bookingStatus === 'Reserved' ? 'Expected' : bookingForm.bookingStatus;
    const timeStamp = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date());
    const estimatedOrManualTotal = formatCurrency(bookingTotalDue);
    const newDriverRecord = {
      id: `${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      initials: getInitials(cleanName),
      name: cleanName,
      company: cleanCompanyName || 'Independent',
      rating: 4.8,
      phone: bookingForm.phoneNumber,
      vehicle: bookingForm.vehicleType,
      trailer: bookingForm.licensePlate.trim() || 'Plate pending',
      assignedSpotId: bookingForm.assignedSpotId,
      assignedSpot: cleanSpot,
      reservation: bookingForm.bookingStatus === 'Reserved' ? 'Reserved' : 'Confirmed',
      status: normalizedStatus,
      lastActivity: timeStamp,
      lastDetail: bookingForm.bookingStatus === 'Checked In' ? 'Customer created and checked in from booking modal' : 'New booking created from customer management',
      note: cleanNotes || 'No additional customer notes.',
      scheduledArrival: arrivalDate.toISOString(),
      expectedCheckout: expectedCheckout.toISOString(),
      contactSummary: `Booking created for ${cleanName}${cleanCompanyName ? ` with ${cleanCompanyName}` : ''}. Quoted total ${estimatedOrManualTotal}.`,
      followUp: `Confirm ${cleanSpot} availability before arrival and review any customer notes.`,
      timeline: [
        { time: timeStamp, text: `Booking created with ${formatDurationLabel(bookingDurationCount, bookingForm.durationType)}`, confirmed: true },
        { time: timeStamp, text: `Assigned spot ${cleanSpot} with total due ${estimatedOrManualTotal}`, confirmed: true },
        cleanNotes ? { time: timeStamp, text: `Customer note added: ${cleanNotes}`, confirmed: true } : null
      ].filter(Boolean)
    };

    setDriverRecords((currentDrivers) => [newDriverRecord, ...currentDrivers]);
    setSelectedDriverId(newDriverRecord.id);
    setActiveFilter('All');
    setSearchQuery('');
    resetBookingDraft();
    setIsBookingModalOpen(false);
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <header className="bg-[#F7F9FF] backdrop-blur-xl sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 md:px-8 xl:px-10 h-[72px] max-w-[1480px] mx-auto relative">
          <div className="flex items-center gap-10">
            <span className="text-[30px] font-extrabold tracking-tight text-primary font-manrope">ParkLog AI</span>
            <nav className="hidden md:flex items-center gap-7 text-[14px]">
              <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/dashboard">Locations</Link>
              <Link className="text-secondary border-b-2 border-secondary pb-1 font-bold" to="/customer-management">Customers</Link>
              <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/parking-availability">Inventory</Link>
              <Link className="text-on-surface-variant hover:text-primary transition-colors" to="/settings">Settings</Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-on-surface-variant hover:bg-[#F1F4FB] rounded-md transition-all" aria-label="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-[#F1F4FB] rounded-md transition-all" aria-label="Help">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden ml-2">
              <img
                alt="User profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZa2E-WnDbOiXrPBQIKxAEmSnYnGbDE352CNAzt7TOkNzjg-7D551POEDUKfWc-8GpwZ-4uCB0sF2omP-CdiqCdoM3Ll1mIMhPIRIThHY8jBYa4vz3h8Ydul4WlKW1nbhob7oGDe-U93PgvWA_TqymkNOkwoGOBiLa6IGX8L6i79H5lwVgN__DSd6uAcfwtD_OsAIym2BOuN68m2vz5cd3nOLmDb4opQxYfnwuR4UD8gI8Ze0WhC_-udGBEBEP7uTNxfyquMWEAt0"
              />
            </div>
          </div>
          <div className="bg-[#F1F4FB] h-px w-full absolute bottom-0 left-0" />
        </div>
      </header>

      <main className="max-w-[1480px] mx-auto px-6 md:px-8 xl:px-10 py-6">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold tracking-wider uppercase mb-3">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
              Lot Operations
            </div>
            <h1 className="text-[44px] leading-[1.05] font-extrabold text-primary mb-1.5">Customers</h1>
            <p className="text-[14px] text-on-surface-variant max-w-xl">
              Manage arrivals, check-ins, departures, support issues, and manual follow-up for this location.
            </p>
          </div>
          <button
            className="px-5 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-2xl hover:opacity-95 transition-all flex items-center gap-2 w-fit"
            onClick={openBookingModal}
            type="button"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            New Customer Booking
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3 mb-5">
          {[
            { label: 'Expected', value: expectedCount, detail: 'Reservations still awaiting staff-confirmed arrival' },
            { label: 'Checked In', value: checkedInCount, detail: 'Customers currently marked on site by staff' },
            { label: 'Needs Support', value: supportCount, detail: 'Reservations waiting on a manual follow-up' },
            { label: 'Warnings', value: warningCount, detail: 'Time-based reminders that need staff review' },
            { label: 'Occupancy', value: `${occupiedSpots} / ${totalSpots}`, detail: 'Occupied customer parking spots right now' },
            { label: 'Revenue Today', value: `$${revenueToday.toLocaleString()}`, detail: 'Confirmed payments collected today' }
          ].map((card) => (
            <div
              key={card.label}
              className={`relative overflow-hidden p-4 rounded-2xl shadow-sm border min-h-[104px] ${summaryCardClasses(card.label).card}`}
            >
              <div className={`absolute inset-y-0 left-0 w-[3px] ${summaryCardClasses(card.label).accent}`} />
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.18em] mb-2">{card.label}</p>
              <p className={`text-[34px] leading-none font-extrabold mb-2 ${summaryCardClasses(card.label).value}`}>{card.value}</p>
              <p className="text-[12px] leading-4 text-on-surface-variant">{card.detail}</p>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-[24px] p-3.5 md:p-4 mb-5 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center gap-3">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
              <input
                className="w-full pl-11 pr-4 py-2.5 bg-surface-container-highest/40 border-none rounded-xl focus:ring-2 focus:ring-secondary transition-all text-[14px] text-on-surface"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search customer, company, vehicle, or spot..."
                type="text"
                value={searchQuery}
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 w-full xl:w-auto">
              {driverFilters.map((filter) => (
                <button
                  key={filter}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all ${
                    activeFilter === filter
                      ? 'bg-secondary text-white'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="hidden md:block bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low">
                      <th className="px-5 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.16em]">Customer and Company</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.16em]">Vehicle Details</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.16em]">Confirmed Status</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.16em]">Latest Staff Note</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.16em] text-right">Reservation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {filteredDrivers.map((driver) => (
                      <DriverRow
                        key={driver.id}
                        active={selectedDriver?.id === driver.id}
                        driver={driver}
                        onSelect={(nextDriver) => setSelectedDriverId(nextDriver.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:hidden">
              {filteredDrivers.map((driver) => (
                <DriverCard
                  key={driver.id}
                  active={selectedDriver?.id === driver.id}
                  driver={driver}
                  onSelect={(nextDriver) => setSelectedDriverId(nextDriver.id)}
                />
              ))}
            </div>

            {filteredDrivers.length === 0 && (
              <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-8 text-center shadow-sm">
                <span className="material-symbols-outlined text-4xl text-outline mb-3">search_off</span>
                <h2 className="text-xl font-bold text-primary mb-2">No customers match the current view</h2>
                <p className="text-on-surface-variant max-w-md mx-auto">
                  Adjust the search term or switch filters to bring a different set of customers back into view.
                </p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
            {selectedDriver && (
              <DriverDetailPanel
                driver={selectedDriver}
                onAddNote={openAddNoteModal}
                onAssignSpot={openAssignSpotModal}
                onStatusChange={handleStatusChange}
              />
            )}

            <div className="bg-gradient-to-br from-primary-container to-primary rounded-xl p-4 text-white border border-white/5">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-[22px]">Support Queue</h4>
                <span className="px-2 py-0.5 bg-error text-[10px] font-bold rounded-full">{supportCount} OPEN</span>
              </div>
              <p className="text-[13px] text-white/70 mb-3.5">
                {supportCount > 0
                  ? 'Manual follow-up is still needed for customers with support issues or unresolved arrival questions.'
                  : 'No active support escalations at the moment.'}
              </p>
              <button className="w-full py-2 bg-white/10 hover:bg-white/20 transition-all rounded-lg text-[13px] font-bold border border-white/10">
                Take Over Inquiry
              </button>
            </div>
          </aside>
        </div>
      </main>

      <ActionModal
        actionLabel="assign spot"
        description="Assign a parking spot or update the current spot for this customer."
        isOpen={spotModalState.isOpen}
        onClose={closeAssignSpotModal}
        onSubmit={saveAssignedSpot}
        submitDisabled={spotModalState.value.trim().length === 0}
        submitLabel="Save Spot"
        title="Assign / Change Spot"
      >
        <label className="block">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Parking Spot</span>
          <input
            className="w-full rounded-xl border border-outline-variant/15 bg-surface px-3.5 py-3 text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            data-autofocus="true"
            onChange={(event) => setSpotModalState((current) => ({ ...current, value: event.target.value }))}
            placeholder="Example: A14"
            type="text"
            value={spotModalState.value}
          />
          <span className="mt-2 block text-[12px] text-on-surface-variant">Example: A14</span>
        </label>
      </ActionModal>

      <ActionModal
        actionLabel="add note"
        description="Add a staff note that will appear in the customer detail view and activity history."
        isOpen={noteModalState.isOpen}
        onClose={closeAddNoteModal}
        onSubmit={saveCustomerNote}
        submitDisabled={noteModalState.value.trim().length === 0}
        submitLabel="Save Note"
        title="Add Customer Note"
      >
        <label className="block">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.16em] text-on-surface-variant">Staff Note</span>
          <textarea
            className="min-h-[140px] w-full resize-none rounded-xl border border-outline-variant/15 bg-surface px-3.5 py-3 text-[14px] text-on-surface outline-none transition-all placeholder:text-on-surface-variant/60 focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            data-autofocus="true"
            onChange={(event) => setNoteModalState((current) => ({ ...current, value: event.target.value }))}
            placeholder="Enter a staff note for this customer..."
            value={noteModalState.value}
          />
        </label>
      </ActionModal>

      <BookingModal
        bookingForm={bookingForm}
        draftRestoredMessage={draftRestoredMessage}
        estimatedTotal={bookingTotalDue}
        isOpen={isBookingModalOpen}
        isSaveDisabled={isBookingSaveDisabled}
        isManualTotalInvalid={isManualTotalInvalid}
        missingRateMessage={missingRateMessage}
        notesLength={bookingForm.customerNotes.length}
        noSpotsAvailableMessage={noSpotsAvailableMessage}
        invalidArrivalTimeMessage={invalidArrivalTimeMessage}
        locationHoursLabel={locationHoursLabel}
        lotDetails={lotDetails}
        onClearDraft={() => openDraftConfirmation('clear')}
        onClose={closeBookingModal}
        onDiscardDraft={() => openDraftConfirmation('discard')}
        onFieldChange={handleBookingFieldChange}
        onPhoneChange={handleBookingPhoneChange}
        onSpotChange={handleAssignedSpotChange}
        onSave={saveBooking}
        phoneInputRef={bookingPhoneInputRef}
        selectedRateLabel={selectedRateLabel}
        selectedRateValue={selectedRateValue}
        spotOptions={bookingSpotOptions}
        totalDue={bookingTotalDue}
      />

      <ConfirmationModal
        confirmLabel={confirmationState.action === 'clear' ? 'Clear' : 'Discard'}
        description="All entered information will be removed."
        isOpen={confirmationState.isOpen}
        onCancel={closeDraftConfirmation}
        onConfirm={confirmDraftAction}
        title={confirmationState.action === 'clear' ? 'Clear draft?' : 'Discard this draft?'}
      />
    </div>
  );
}

