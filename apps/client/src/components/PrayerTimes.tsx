import { useEffect, useMemo, useState } from 'react';
import {
  Clock3,
  Compass,
  MapPin,
  RefreshCw,
  Settings,
  Sun,
  X,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { GetToggle } from '../Features/AppSlice';

interface PrayerLocation {
  city: string;
  country: string;
  method: number;
}

interface PrayerSchedule {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

interface PrayerApiResponse {
  code: number;
  status: string;
  data?: {
    timings?: PrayerSchedule;
    meta?: { timezone?: string };
  };
}

const LOCATION_STORAGE_KEY = 'almalik-prayer-location';
const defaultLocation: PrayerLocation = {
  city: 'Kano',
  country: 'Nigeria',
  method: 3,
};

const calculationMethods = [
  { id: 0, name: 'Shia Ithna-Ansari' },
  { id: 1, name: 'University of Islamic Sciences, Karachi' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 3, name: 'Muslim World League' },
  { id: 4, name: 'Umm Al-Qura University, Makkah' },
  { id: 5, name: 'Egyptian General Authority of Survey' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran' },
  { id: 8, name: 'Gulf Region' },
  { id: 9, name: 'Kuwait' },
  { id: 10, name: 'Qatar' },
  { id: 11, name: 'Majlis Ugama Islam Singapura' },
  { id: 12, name: 'Union Organization Islamic de France' },
  { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey' },
  { id: 14, name: 'Spiritual Administration of Muslims of Russia' },
];

const prayerNames = [
  { key: 'Fajr', label: 'Fajr' },
  { key: 'Sunrise', label: 'Sunrise' },
  { key: 'Dhuhr', label: 'Dhuhr' },
  { key: 'Asr', label: 'Asr' },
  { key: 'Maghrib', label: 'Maghrib' },
  { key: 'Isha', label: 'Isha' },
] as const;

function readSavedLocation(): PrayerLocation {
  try {
    const saved = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!saved) return defaultLocation;
    const parsed: unknown = JSON.parse(saved);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'city' in parsed &&
      'country' in parsed &&
      'method' in parsed &&
      typeof parsed.city === 'string' &&
      typeof parsed.country === 'string' &&
      typeof parsed.method === 'number' &&
      parsed.city.trim() &&
      parsed.country.trim()
    ) {
      return {
        city: parsed.city,
        country: parsed.country,
        method: parsed.method,
      };
    }
  } catch (error) {
    console.error('Unable to read saved prayer-time location.', error);
  }
  return defaultLocation;
}

function formatDateForApi(date: Date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}-${month}-${date.getFullYear()}`;
}

function getPrayerDate(time: string, dayOffset = 0) {
  const match = time.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(Number(match[1]), Number(match[2]), 0, 0);
  return date;
}

function formatCountdown(milliseconds: number) {
  const totalMinutes = Math.max(0, Math.floor(milliseconds / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
}

export default function PrayerTimesWidget() {
  const open = useSelector(GetToggle);
  const [location, setLocation] = useState(readSavedLocation);
  const [draftLocation, setDraftLocation] = useState(location);
  const [schedule, setSchedule] = useState<PrayerSchedule | null>(null);
  const [timezone, setTimezone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'timetable' | 'settings'>('timetable');
  const [refreshCount, setRefreshCount] = useState(0);
  const [clock, setClock] = useState(0);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const date = formatDateForApi(new Date());
    const url = new URL(`https://api.aladhan.com/v1/timingsByCity/${date}`);
    url.searchParams.set('city', location.city);
    url.searchParams.set('country', location.country);
    url.searchParams.set('method', String(location.method));

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Prayer timetable request failed (${response.status}).`);
        }
        const result = (await response.json()) as PrayerApiResponse;
        const timings = result.data?.timings;
        if (result.code !== 200 || !timings) {
          throw new Error('The prayer timetable service returned no prayer times.');
        }
        setSchedule(timings);
        setTimezone(result.data?.meta?.timezone ?? '');
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load prayer times. Please try again.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [location, refreshCount]);

  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  useEffect(() => {
    const initialTick = window.setTimeout(() => setClock(new Date().getTime()), 0);
    const timer = window.setInterval(() => setClock(new Date().getTime()), 60_000);
    return () => {
      window.clearTimeout(initialTick);
      window.clearInterval(timer);
    };
  }, []);

  const nextPrayer = useMemo(() => {
    if (!schedule) return null;
    const now = new Date(clock);
    const upcoming = prayerNames
      .filter(({ key }) => key !== 'Sunrise')
      .map(({ key, label }) => ({
        label,
        date: getPrayerDate(schedule[key]),
      }))
      .filter((prayer): prayer is { label: string; date: Date } => prayer.date !== null)
      .find((prayer) => prayer.date.getTime() > now.getTime());

    if (upcoming) return upcoming;
    const fajr = schedule.Fajr ? getPrayerDate(schedule.Fajr, 1) : null;
    return fajr ? { label: 'Fajr', date: fajr } : null;
  }, [clock, schedule]);

  const openModal = (tab: 'timetable' | 'settings') => {
    setDraftLocation(location);
    setSaveError('');
    setActiveTab(tab);
    setModalOpen(true);
  };

  const refreshPrayerTimes = () => {
    setLoading(true);
    setError('');
    setRefreshCount((count) => count + 1);
  };

  const saveLocation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextLocation = {
      ...draftLocation,
      city: draftLocation.city.trim(),
      country: draftLocation.country.trim(),
    };
    if (!nextLocation.city || !nextLocation.country) {
      setError('Enter both a city and country to update prayer times.');
      return;
    }
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(nextLocation));
      setLoading(true);
      setError('');
      setSaveError('');
      setSchedule(null);
      setLocation(nextLocation);
      setModalOpen(false);
    } catch (storageError) {
      console.error('Unable to save prayer-time location.', storageError);
      setSaveError('Your browser could not save this location. Check its storage settings and try again.');
    }
  };

  const dateLabel = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date(clock));

  return (
    <>
      <div className={`${open ? 'block' : 'hidden'} px-4 pb-4`}>
        <section className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-white shadow-sm">
          <div className="flex items-start justify-between gap-2 px-4 pt-4">
            <div>
              <p className="text-[13px] font-bold text-gray-900">Prayer times</p>
              <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                <MapPin size={12} />
                <span>{location.city}, {location.country}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openModal('settings')}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-white hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Prayer time settings"
              title="Prayer time settings"
            >
              <Settings size={16} />
            </button>
          </div>

          <div className="mx-4 my-3 rounded-xl bg-emerald-800 px-3 py-3 text-white">
            <div className="flex items-center gap-2 text-emerald-100">
              <Clock3 size={14} />
              <span className="text-[11px] font-medium">
                {nextPrayer ? `Next prayer · ${nextPrayer.label}` : 'Next prayer'}
              </span>
            </div>
            <div className="mt-1 flex items-end justify-between gap-2">
              <span className="text-xl font-bold tabular-nums">
                {nextPrayer
                  ? nextPrayer.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '--:--'}
              </span>
              <span className="pb-0.5 text-[11px] text-emerald-100">
                {nextPrayer ? `in ${formatCountdown(nextPrayer.date.getTime() - clock)}` : 'Times unavailable'}
              </span>
            </div>
          </div>

          <div className="space-y-1 px-4 pb-1">
            {loading && !schedule ? (
              <p className="py-2 text-center text-xs text-gray-500">Loading today&apos;s prayer times…</p>
            ) : error && !schedule ? (
              <div className="py-2 text-center">
                <p className="text-xs text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={refreshPrayerTimes}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  <RefreshCw size={12} /> Try again
                </button>
              </div>
            ) : (
              prayerNames
                .filter(({ key }) => key !== 'Sunrise')
                .map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between rounded-lg px-2 py-1.5 text-[12px]">
                    <span className={nextPrayer?.label === label ? 'font-semibold text-emerald-800' : 'text-gray-500'}>
                      {label}
                    </span>
                    <span className="font-semibold tabular-nums text-gray-800">{schedule?.[key] ?? '--:--'}</span>
                  </div>
                ))
            )}
          </div>

          <div className="flex items-center justify-between border-t border-emerald-100 px-4 py-3">
            <span className="text-[10px] text-gray-400">{timezone || 'Local prayer timetable'}</span>
            <button
              type="button"
              onClick={() => openModal('timetable')}
              className="text-[11px] font-bold text-emerald-700 transition hover:text-emerald-900"
            >
              Full timetable <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/55 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="prayer-modal-title"
            className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 px-6 pb-6 pt-6 text-white">
              <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full border border-white/10" />
              <div className="absolute -right-1 -top-6 h-28 w-28 rounded-full border border-white/10" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-emerald-100">
                    <Sun size={16} />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">Daily worship</span>
                  </div>
                  <h2 id="prayer-modal-title" className="text-2xl font-bold">Prayer times</h2>
                  <p className="mt-1 text-sm text-emerald-100">
                    {dateLabel} · {location.city}, {location.country}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close prayer times"
                  className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="relative mt-5 flex gap-2 rounded-xl bg-black/15 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('timetable')}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === 'timetable' ? 'bg-white text-emerald-900 shadow' : 'text-emerald-50 hover:bg-white/10'}`}
                >
                  Today&apos;s timetable
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDraftLocation(location);
                    setActiveTab('settings');
                  }}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${activeTab === 'settings' ? 'bg-white text-emerald-900 shadow' : 'text-emerald-50 hover:bg-white/10'}`}
                >
                  Location & method
                </button>
              </div>
            </div>

            {activeTab === 'timetable' ? (
              <div className="p-6">
                {error && (
                  <div role="alert" className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                {loading && !schedule ? (
                  <div className="py-12 text-center text-sm text-gray-500">Loading prayer timetable…</div>
                ) : schedule ? (
                  <div className="space-y-2">
                    {prayerNames.map(({ key, label }) => {
                      const active = nextPrayer?.label === label;
                      return (
                        <div
                          key={key}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 transition ${active ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-white'}`}
                        >
                          <span className={`flex items-center gap-3 text-sm font-semibold ${active ? 'text-emerald-900' : 'text-gray-700'}`}>
                            <span className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-600' : 'bg-gray-300'}`} />
                            {label}
                            {active && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">NEXT</span>}
                          </span>
                          <span className="text-sm font-bold tabular-nums text-gray-900">{schedule[key] ?? '--:--'}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-sm text-gray-600">Prayer times could not be loaded.</p>
                    <button
                      type="button"
                      onClick={refreshPrayerTimes}
                      className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                    >
                      <RefreshCw size={15} /> Retry
                    </button>
                  </div>
                )}
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500">Times provided by AlAdhan</p>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={refreshPrayerTimes}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh times
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={saveLocation} className="space-y-5 p-6">
                {saveError && (
                  <div role="alert" className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {saveError}
                  </div>
                )}
                <div className="rounded-xl bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">
                  <div className="mb-1 flex items-center gap-2 font-bold">
                    <Compass size={16} /> Set your prayer location
                  </div>
                  Prayer times are calculated for this city using your selected calculation method.
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    City
                    <input
                      value={draftLocation.city}
                      onChange={(event) => setDraftLocation({ ...draftLocation, city: event.target.value })}
                      required
                      autoComplete="address-level2"
                      className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 font-normal outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                      placeholder="e.g. Kano"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-gray-700">
                    Country
                    <input
                      value={draftLocation.country}
                      onChange={(event) => setDraftLocation({ ...draftLocation, country: event.target.value })}
                      required
                      autoComplete="country-name"
                      className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 font-normal outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                      placeholder="e.g. Nigeria"
                    />
                  </label>
                </div>
                <label className="block text-sm font-semibold text-gray-700">
                  Calculation method
                  <select
                    value={draftLocation.method}
                    onChange={(event) => setDraftLocation({ ...draftLocation, method: Number(event.target.value) })}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-normal outline-none transition focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100"
                  >
                    {calculationMethods.map((method) => (
                      <option key={method.id} value={method.id}>{method.name}</option>
                    ))}
                  </select>
                </label>
                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
                  >
                    Save & update
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
