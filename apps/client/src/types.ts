export interface StatCardData {
  id: string;
  label: string;
  value: string;
  sublabel?: string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
  icon: 'sales' | 'profit' | 'inventory' | 'stock' | 'lowStock';
  iconBg: string;
  iconColor: string;
}

export interface MiniStatData {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  icon: 'outOfStock' | 'expiringSoon' | 'expired' | 'customers' | 'suppliers';
  iconBg: string;
  iconColor: string;
}

export interface SalesPoint {
  date: string;
  sales: number;
}

export interface Transaction {
  id: string;
  invoice: string;
  customer: string;
  amount: string;
  time: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Purchase {
  id: string;
  poNumber: string;
  supplier: string;
  amount: string;
  date: string;
}

export interface TopProduct {
  rank: number;
  name: string;
  unitsSold: string;
  revenue: string;
  emoji: string;
}

export interface ExpiringItem {
  name: string;
  emoji: string;
  expiresOn: string;
  daysLeft: number;
}

export interface StockStatusSlice {
  label: string;
  value: number;
  percent: number;
  color: string;
}

export interface PrayerTime {
  name: string;
  time: string;
}


export interface productsDatas{
    id: number, 
    image: string, 
    name: string, 
    sku: string, 
    category: string, 
    supplier: string,
    stock: number, 
    price: number,
    status: string,
    batch: string,
    expiry: string,
    desc: string
}