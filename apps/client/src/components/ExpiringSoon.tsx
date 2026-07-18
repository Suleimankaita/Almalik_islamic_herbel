import { expiringSoon } from '../data';

export default function ExpiringSoon() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-gray-900">Expiring Soon</h3>
        <button className="text-[12.5px] font-semibold text-brand-green hover:underline">View All</button>
      </div>

      <ul className="divide-y divide-gray-50">
        {expiringSoon.map((item) => (
          <li key={item.name} className="flex items-center gap-3 py-2.5">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 text-base">
              {item.emoji}
            </span>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-gray-800">{item.name}</p>
              <p className="text-[11.5px] text-gray-400">{item.expiresOn}</p>
            </div>
            <span className="text-[12px] font-semibold text-amber-600">{item.daysLeft} days left</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
