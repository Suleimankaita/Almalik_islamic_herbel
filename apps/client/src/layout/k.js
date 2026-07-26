import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";
import PrayerTimesWidget from "../components/PrayerTimes";
import { useDispatch, useSelector } from "react-redux";
import { GetToggle, SetToggle } from "../Features/AppSlice";

const Layout = () => {
  const Open = useSelector(GetToggle);
  const dispatch = useDispatch();

  return (
    <main className="flex h-screen overflow-hidden bg-[#F6F7F9]">
      <div
        className={`fixed inset-y-0 left-0 z-30 w-[85vw] max-w-[280px] transform border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 lg:static lg:w-[240px] lg:translate-x-0 lg:shadow-none ${
          Open ? "w-[240px] translate-x-0" : "-translate-x-full w-[100px]"
        } overflow-auto transition-all duration-300 `}
      >
        <div className="flex h-full flex-col">
          <Sidebar />
          <div className="border-t border-gray-100">
            <PrayerTimesWidget />
          </div>
        </div>
      </div>

      {Open && <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={() => dispatch(SetToggle(false))} />}

      <div className="flex min-h-0 flex-1 flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default Layout;