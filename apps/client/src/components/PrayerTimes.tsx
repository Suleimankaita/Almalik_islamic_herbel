import { Settings, MapPin } from 'lucide-react';
import { prayerTimes } from '../data';
import {  useSelector } from 'react-redux';
import { GetToggle } from '../Features/AppSlice';


export default function PrayerTimesWidget() {



  const Open:boolean=useSelector(GetToggle)
  return (
    <div className={`${!Open?'hidden':'block'} px-4 pb-4`}>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[13px] font-semibold text-gray-900">Today's Prayer Times</p>
          <Settings size={14} className="text-gray-400" />
        </div>
        <div className="mb-3 flex items-center gap-1 text-[11px] text-gray-400">
          <MapPin size={11} />
          <span>Kano, Nigeria</span>
        </div>
        <ul className="space-y-1.5">
          {prayerTimes.map((p) => (
            <li key={p.name} className="flex items-center justify-between text-[12.5px]">
              <span className="text-gray-500">{p.name}</span>
              <span className="font-semibold text-gray-800">{p.time}</span>
            </li>
          ))}
        </ul>
        <button className="mt-3 text-[12px] font-semibold text-brand-green hover:underline">
          View Full Timetable →
        </button>
      </div>
    </div>
  );
}
