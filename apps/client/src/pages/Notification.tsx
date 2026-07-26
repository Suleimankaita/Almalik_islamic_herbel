import { useState } from 'react';
import {
  Bell, Check, Trash2, ShoppingBag, PackageX,
  ShieldAlert, Sparkles, CheckCircle2,
  Filter, Clock, ArrowRight
} from 'lucide-react';

// --- Types & Initial Data ---
type NotifType = 'order' | 'inventory' | 'system' | 'alert';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Online Order Received',
    message: 'Order #ALM-8892 for 3x Black Seed Oil & 1x Sidr Honey has been paid and requires fulfillment.',
    timestamp: '2 mins ago',
    isRead: false,
    link: '#view-order'
  },
  {
    id: '2',
    type: 'inventory',
    title: 'Critical Stock Alert',
    message: 'Nigella Sativa Powder has dropped below the minimum threshold (Only 6 units remaining).',
    timestamp: '1 hour ago',
    isRead: false,
    link: '#restock'
  },
  {
    id: '3',
    type: 'alert',
    title: 'Failed Payment Attempt',
    message: 'A customer attempted to pay ₦45,000 via card, but the transaction was declined by the gateway.',
    timestamp: '3 hours ago',
    isRead: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update Completed',
    message: 'Your POS dashboard has been successfully updated to version 2.4.0. Enjoy the new reporting features!',
    timestamp: 'Yesterday, 10:00 AM',
    isRead: true,
  },
  {
    id: '5',
    type: 'order',
    title: 'Large Wholesale Order',
    message: 'Al Barakah Clinic just placed a wholesale order for 50x Olive Oil (250ml).',
    timestamp: 'Yesterday, 2:30 PM',
    isRead: true,
    link: '#view-order'
  }
];

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'order' | 'inventory' | 'system'>('all');

  // --- Active Functionalities ---
  
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.isRead));
  };

  // --- Derived State & Filtering ---
  
  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getFilterCount = (filterType: string) => {
    if (filterType === 'all') return notifications.length;
    if (filterType === 'unread') return unreadCount;
    return notifications.filter(n => n.type === filterType).length;
  };

  // --- UI Helpers ---
  const getIcon = (type: NotifType) => {
    switch (type) {
      case 'order': return <ShoppingBag size={20} className="text-emerald-600" />;
      case 'inventory': return <PackageX size={20} className="text-amber-600" />;
      case 'system': return <Sparkles size={20} className="text-blue-600" />;
      case 'alert': return <ShieldAlert size={20} className="text-red-600" />;
    }
  };

  const getIconBg = (type: NotifType) => {
    switch (type) {
      case 'order': return 'bg-emerald-100 border-emerald-200';
      case 'inventory': return 'bg-amber-100 border-amber-200';
      case 'system': return 'bg-blue-100 border-blue-200';
      case 'alert': return 'bg-red-100 border-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 font-sans text-slate-800">
      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* ================= LEFT SIDEBAR (Filters) ================= */}
        <div className="w-full lg:w-[280px] flex-none space-y-6">
          
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
              <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-700 shadow-inner">
                <Bell size={24} className={unreadCount > 0 ? "animate-bounce" : ""} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium relative z-10">
              You have <span className="font-bold text-emerald-600">{unreadCount} unread</span> messages today.
            </p>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-1">
            {[
              { id: 'all', label: 'All Notifications', icon: Filter },
              { id: 'unread', label: 'Unread', icon: Clock },
              { id: 'order', label: 'Orders & Sales', icon: ShoppingBag },
              { id: 'inventory', label: 'Inventory Alerts', icon: PackageX },
              { id: 'system', label: 'System Updates', icon: Sparkles },
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActiveFilter(nav.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-sm ${
                  activeFilter === nav.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <nav.icon size={18} className={activeFilter === nav.id ? 'text-emerald-400' : 'text-slate-400'} />
                  {nav.label}
                </div>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs ${
                  activeFilter === nav.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {getFilterCount(nav.id)}
                </span>
              </button>
            ))}
          </div>

        </div>

        {/* ================= MAIN FEED ================= */}
        <div className="flex-1 flex flex-col gap-4">
          
          {/* Feed Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:px-6 sm:py-4 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-black text-slate-900 capitalize flex items-center gap-2">
              {activeFilter} Feed
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button 
                onClick={clearAllRead}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:bg-slate-50 hover:text-red-600 transition-colors shadow-sm"
              >
                Clear Read
              </button>
              <button 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-slate-900 disabled:bg-slate-300 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-slate-900/20 active:scale-95 disabled:active:scale-100 disabled:shadow-none"
              >
                <CheckCircle2 size={16} /> Mark all read
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              // Empty State
              <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <Check size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900">You're all caught up!</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  There are no {activeFilter !== 'all' ? activeFilter : ''} notifications to review at this time.
                </p>
              </div>
            ) : (
              // Active Feed
              filteredNotifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`group relative flex flex-col sm:flex-row gap-4 p-5 rounded-3xl transition-all duration-300 border ${
                    !notif.isRead 
                      ? 'bg-white border-emerald-500/30 shadow-md shadow-emerald-500/5' 
                      : 'bg-white/60 border-slate-200 shadow-sm hover:bg-white'
                  }`}
                >
                  {/* Unread Indicator Pill */}
                  {!notif.isRead && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-emerald-500 rounded-r-full"></div>
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex-none flex items-center justify-center border ${getIconBg(notif.type)}`}>
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pr-10 sm:pr-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className={`text-sm font-black ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${!notif.isRead ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                    
                    {/* Action Link (Optional) */}
                    {notif.link && (
                      <button className="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                        Take Action <ArrowRight size={14} />
                      </button>
                    )}
                  </div>

                  {/* Quick Actions (Hover Reveal) */}
                  <div className="absolute right-4 top-4 sm:relative sm:right-0 sm:top-0 flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    {!notif.isRead && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700 transition-colors tooltip-trigger"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notif.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-700 transition-colors tooltip-trigger"
                      title="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}