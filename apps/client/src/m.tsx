import Sidebar from './components/Sidebar';
import PrayerTimesWidget from './components/PrayerTimes';
import Header from './components/Header';
import { StatCard, MiniStatCard } from './components/StatCard';
import SalesOverview from './components/SalesOverview';
import StockStatus from './components/StockStatus';
import RecentTransactions from './components/RecentTransactions';
import RecentPurchases from './components/RecentPurchases';
import TopSellingProducts from './components/TopSellingProducts';
import ExpiringSoon from './components/ExpiringSoon';
import QuoteBanner from './components/QuoteBanner';
import { statCards, miniStats } from './data';

export default function App() {

  return (
    <div className="flex bg-[#F6F7F9]">
   
      <div className="flex min-w-0 flex-1 flex-col">

        <main className="flex-1 space-y-5 p-6"> 
          {/* Greeting */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-[22px] font-extrabold text-gray-900">
                Assalamu Alaikum, Abdullahi <span>👋</span>
              </h1>
              <p className="text-[13px] text-gray-500">Here's what's happening with your business today.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] font-medium text-gray-700">
                May 25, 2025
              </button>
              <button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] font-medium text-gray-700">
                Today
              </button>
            </div>
          </div>

          {/* Primary stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {statCards.map((card) => (
              <StatCard key={card.id} data={card} />
            ))}
          </div>

          {/* Secondary mini stat cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {miniStats.map((stat) => (
              <MiniStatCard key={stat.id} data={stat} />
            ))}
          </div>

          {/* Sales Overview + Recent Transactions + Stock Status */}
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1.1fr_0.8fr]">
            <SalesOverview />
            <RecentTransactions />
            <StockStatus />
          </div>

           {/* Top Selling Products + Recent Purchases + Expiring Soon  */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <TopSellingProducts />
            <RecentPurchases />
            <ExpiringSoon />
          </div> 

          {/* Quote banner */}
          <QuoteBanner />
        </main>
      </div>
    </div>
  );
}
