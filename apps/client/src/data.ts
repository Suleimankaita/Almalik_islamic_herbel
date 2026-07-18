import type {
  StatCardData,
  MiniStatData,
  SalesPoint,
  Transaction,
  Purchase,
  TopProduct,
  ExpiringItem,
  StockStatusSlice,
  PrayerTime,
} from './types';

export const statCards: StatCardData[] = [
  {
    id: 'todays-sales',
    label: "Today's Sales",
    value: '₦245,300',
    trend: { direction: 'up', value: '18.6% vs yesterday' },
    icon: 'sales',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'todays-profit',
    label: "Today's Profit",
    value: '₦86,750',
    trend: { direction: 'up', value: '21.3% vs yesterday' },
    icon: 'profit',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'inventory-value',
    label: 'Inventory Value',
    value: '₦4,820,450',
    sublabel: 'Total stock value',
    icon: 'inventory',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'products-in-stock',
    label: 'Products in Stock',
    value: '1,248',
    sublabel: 'Active products',
    icon: 'stock',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'low-stock-items',
    label: 'Low Stock Items',
    value: '23',
    sublabel: 'Requires attention',
    icon: 'lowStock',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
];

export const miniStats: MiniStatData[] = [
  {
    id: 'out-of-stock',
    label: 'Out of Stock',
    value: '8',
    sublabel: 'Products',
    icon: 'outOfStock',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    id: 'expiring-soon',
    label: 'Expiring Soon',
    value: '15',
    sublabel: 'Within 30 days',
    icon: 'expiringSoon',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    id: 'expired-products',
    label: 'Expired Products',
    value: '5',
    sublabel: 'Remove/Return',
    icon: 'expired',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    id: 'total-customers',
    label: 'Total Customers',
    value: '568',
    sublabel: 'Active customers',
    icon: 'customers',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'total-suppliers',
    label: 'Total Suppliers',
    value: '34',
    sublabel: 'Active suppliers',
    icon: 'suppliers',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
];

export const salesOverview: SalesPoint[] = [
  { date: 'May 1', sales: 180000 },
  { date: 'May 3', sales: 220000 },
  { date: 'May 5', sales: 195000 },
  { date: 'May 7', sales: 260000 },
  { date: 'May 9', sales: 230000 },
  { date: 'May 11', sales: 280000 },
  { date: 'May 13', sales: 250000 },
  { date: 'May 15', sales: 300000 },
  { date: 'May 17', sales: 270000 },
  { date: 'May 19', sales: 240000 },
  { date: 'May 21', sales: 290000 },
  { date: 'May 23', sales: 330000 },
  { date: 'May 25', sales: 310000 },
  { date: 'May 27', sales: 350000 },
  { date: 'May 29', sales: 300000 },
  { date: 'May 31', sales: 380000 },
];

export const recentTransactions: Transaction[] = [
  { id: '1', invoice: 'INV-000125', customer: 'Musa Ibrahim', amount: '₦12,500', time: '10:45 AM', status: 'Paid' },
  { id: '2', invoice: 'INV-000124', customer: 'Aisha Usman', amount: '₦8,750', time: '10:30 AM', status: 'Paid' },
  { id: '3', invoice: 'INV-000123', customer: 'Habibu Lawal', amount: '₦15,000', time: '10:15 AM', status: 'Paid' },
  { id: '4', invoice: 'INV-000122', customer: 'Fatima Muhammad', amount: '₦5,600', time: '09:50 AM', status: 'Paid' },
  { id: '5', invoice: 'INV-000121', customer: 'Salim Yusuf', amount: '₦9,200', time: '09:30 AM', status: 'Paid' },
];

export const recentPurchases: Purchase[] = [
  { id: '1', poNumber: 'PO-000045', supplier: 'Herbal Supplier Ltd', amount: '₦320,000', date: 'May 25, 2025' },
  { id: '2', poNumber: 'PO-000044', supplier: 'Kano Herbs Market', amount: '₦150,500', date: 'May 24, 2025' },
  { id: '3', poNumber: 'PO-000043', supplier: 'Zamzam Resources', amount: '₦75,000', date: 'May 23, 2025' },
  { id: '4', poNumber: 'PO-000042', supplier: 'Natural Remedies Co.', amount: '₦210,200', date: 'May 22, 2025' },
  { id: '5', poNumber: 'PO-000041', supplier: 'African Sunnah Store', amount: '₦98,600', date: 'May 21, 2025' },
];

export const topSellingProducts: TopProduct[] = [
  { rank: 1, name: 'Black Seed Oil (500ml)', unitsSold: '523 pcs', revenue: '₦523,000', emoji: '🫙' },
  { rank: 2, name: 'Sirdr Powder (100g)', unitsSold: '412 pcs', revenue: '₦206,000', emoji: '🥄' },
  { rank: 3, name: 'Honey (Pure 500g)', unitsSold: '389 pcs', revenue: '₦311,200', emoji: '🍯' },
  { rank: 4, name: 'Zamzam Water (1L)', unitsSold: '287 pcs', revenue: '₦71,750', emoji: '💧' },
  { rank: 5, name: 'Olive Oil (250ml)', unitsSold: '245 pcs', revenue: '₦122,500', emoji: '🫒' },
];

export const expiringSoon: ExpiringItem[] = [
  { name: 'Black Seed Oil (500ml)', emoji: '🫙', expiresOn: 'Expires on May 28, 2025', daysLeft: 3 },
  { name: 'Sirdr Powder (100g)', emoji: '🥄', expiresOn: 'Expires on June 2, 2025', daysLeft: 8 },
  { name: 'Honey (Pure 500g)', emoji: '🍯', expiresOn: 'Expires on June 5, 2025', daysLeft: 11 },
  { name: 'Olive Oil (250ml)', emoji: '🫒', expiresOn: 'Expires on June 7, 2025', daysLeft: 13 },
  { name: 'Zamzam Water (1L)', emoji: '💧', expiresOn: 'Expires on June 10, 2025', daysLeft: 16 },
];

export const stockStatus: StockStatusSlice[] = [
  { label: 'In Stock', value: 1248, percent: 82, color: '#22C55E' },
  { label: 'Low Stock', value: 23, percent: 15, color: '#F59E0B' },
  { label: 'Out of Stock', value: 8, percent: 3, color: '#EF4444' },
];

export const prayerTimes: PrayerTime[] = [
  { name: 'Fajr', time: '05:15 AM' },
  { name: 'Dhuhr', time: '12:32 PM' },
  { name: 'Asr', time: '03:45 PM' },
  { name: 'Maghrib', time: '06:42 PM' },
  { name: 'Isha', time: '08:02 PM' },
];
