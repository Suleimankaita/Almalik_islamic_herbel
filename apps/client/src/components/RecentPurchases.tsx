interface PurchaseRow {
  _id?: string;
  id?: string;
  poNumber?: string;
  supplier?: string;
  amount?: string | number;
  date?: string;
  createdAt?: string;
  ProductName?: string;
}

interface Props {
  purchases?: PurchaseRow[];
  isLoading?: boolean;
}

export default function RecentPurchases({ purchases = [], isLoading = false }: Props) {
  const rows = purchases.length
    ? purchases.map((p) => ({
        id: p.id || p._id || 'purchase',
        poNumber: p.poNumber || p.ProductName || 'Purchase',
        supplier: p.supplier || 'Supplier',
        amount: p.amount ? `₦${Number(p.amount).toLocaleString()}` : '₦0',
        date: p.date || p.createdAt || '—',
      }))
    : [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-gray-900">Recent Purchases</h3>
        <button className="text-[12.5px] font-semibold text-brand-green hover:underline">View All</button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-10 animate-pulse rounded bg-gray-100" />
          <div className="h-10 animate-pulse rounded bg-gray-100" />
          <div className="h-10 animate-pulse rounded bg-gray-100" />
        </div>
      ) : rows.length ? (
        <table className="w-full text-left">
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5 text-[13px] font-semibold text-gray-800">{p.poNumber}</td>
                <td className="py-2.5 text-[13px] text-gray-500">{p.supplier}</td>
                <td className="py-2.5 text-[13px] font-semibold text-gray-800">{p.amount}</td>
                <td className="py-2.5 text-right text-[12px] text-gray-400">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex h-32 items-center justify-center text-[13px] text-gray-400">
          No purchases to show yet.
        </div>
      )}
    </div>
  );
}
