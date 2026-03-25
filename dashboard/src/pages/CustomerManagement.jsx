import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = ['Expected', 'Checked In', 'Checked Out', 'Needs Support', 'Cancelled'];
const driverFilters = ['All', 'Expected', 'Checked In', 'Checked Out', 'Needs Support', 'Cancelled', 'Warnings'];

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

export default function CustomerManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [driverRecords, setDriverRecords] = useState(initialDrivers);
  const [selectedDriverId, setSelectedDriverId] = useState(initialDrivers[0].id);
  const [spotModalState, setSpotModalState] = useState({ isOpen: false, driverId: null, value: '' });
  const [noteModalState, setNoteModalState] = useState({ isOpen: false, driverId: null, value: '' });

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
          <button className="px-5 py-2.5 bg-primary text-white text-[14px] font-semibold rounded-2xl hover:opacity-95 transition-all flex items-center gap-2 w-fit">
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
    </div>
  );
}
