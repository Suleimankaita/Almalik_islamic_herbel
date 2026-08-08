interface ExpiringProduct {
  _id?: string;
  ProductName?: string;
  ExpiryDate?: string;
  daysUntilExpiry?: number;
}

interface Props {
  products?: ExpiringProduct[];
  isLoading?: boolean;
}

export default function ExpiringSoon({ products = [], isLoading = false }: Props) {
  const rows = products.length
    ? products.map((item) => ({
        id: item._id || item.ProductName || 'product',
        name: item.ProductName || 'Product',
        expiresOn: item.ExpiryDate ? `Expires on ${item.ExpiryDate}` : 'No expiry date',
        daysLeft: item.daysUntilExpiry ?? 0,
      }))
    : [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-gray-900">Expiring Soon</h3>
        <button className="text-[12.5px] font-semibold text-brand-green hover:underline">View All</button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <div className="h-10 animate-pulse rounded bg-gray-100" />
          <div className="h-10 animate-pulse rounded bg-gray-100" />
          <div className="h-10 animate-pulse rounded bg-gray-100" />
        </div>
      ) : rows.length ? (
        <ul className="divide-y divide-gray-50">
          {rows.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-base">
                🧾
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-gray-800">{item.name}</p>
                <p className="text-[11.5px] text-gray-400">{item.expiresOn}</p>
              </div>
              <span className="text-[12px] font-semibold text-amber-600">{item.daysLeft} days left</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-32 items-center justify-center text-[13px] text-gray-400">
          No products are expiring soon.
        </div>
      )}
    </div>
  );
}
