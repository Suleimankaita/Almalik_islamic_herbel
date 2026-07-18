import { useState } from 'react';
import { recentTransactions } from '../data';

const tabs = ['Sales', 'Purchases', 'Stock Movements'] as const;
type Tab = (typeof tabs)[number];

export default function RecentTransactions() {
  const [activeTab, setActiveTab] = useState<Tab>('Sales');

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-gray-900">Recent Transactions</h3>
        <button className="text-[12.5px] font-semibold text-brand-green hover:underline">View All</button>
      </div>

      <div className="mb-4 flex gap-1 border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-[13px] font-semibold transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-brand-green text-brand-green'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Sales' ? (
        <table className="w-full text-left">
          <tbody>
            {recentTransactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5 text-[13px] font-semibold text-gray-800">{tx.invoice}</td>
                <td className="py-2.5 text-[13px] text-gray-500">{tx.customer}</td>
                <td className="py-2.5 text-[13px] font-semibold text-gray-800">{tx.amount}</td>
                <td className="py-2.5 text-[12px] text-gray-400">{tx.time}</td>
                <td className="py-2.5 text-right">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex h-40 items-center justify-center text-[13px] text-gray-400">
          No {activeTab.toLowerCase()} to display yet.
        </div>
      )}
    </div>
  );
}
