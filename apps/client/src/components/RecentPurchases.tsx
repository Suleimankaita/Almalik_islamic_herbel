import { recentPurchases } from '../data';

export default function RecentPurchases() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-gray-900">Recent Purchases</h3>
        <button className="text-[12.5px] font-semibold text-brand-green hover:underline">View All</button>
      </div>

      <table className="w-full text-left">
        <tbody>
          {recentPurchases.map((p) => (
            <tr key={p.id} className="border-b border-gray-50 last:border-0">
              <td className="py-2.5 text-[13px] font-semibold text-gray-800">{p.poNumber}</td>
              <td className="py-2.5 text-[13px] text-gray-500">{p.supplier}</td>
              <td className="py-2.5 text-[13px] font-semibold text-gray-800">{p.amount}</td>
              <td className="py-2.5 text-right text-[12px] text-gray-400">{p.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
