import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";
import PrayerTimesWidget from "../components/PrayerTimes";
import { useState } from "react";
import { useSelector } from "react-redux";
import { GetToggle } from "../Features/AppSlice";

const Layout = () => {
  // const [ SetOpen] = useState(true);
  const Open=useSelector(GetToggle)
  return (
    <main className="flex h-screen bg-[#F6F7F9] overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          Open ? "w-[240px]":"w-[100px]"
        } hidden lg:flex flex-col justify-between border-r border-gray-200 bg-white`}
      >
        <Sidebar/>
        <PrayerTimesWidget/>
      </div>

      {/* Main */}
      <div className="flex flex-1 min-w-0 min-h-0 flex-col">
        <Header/>

        {/* Scrollable Outlet */}
        <div className="flex-1 overflow-y-auto ">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Layout;