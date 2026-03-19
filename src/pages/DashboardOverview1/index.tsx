import _ from "lodash";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { TinySliderElement } from "@/components/Base/TinySlider";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import ReportLineChart from "@/components/ReportLineChart";
import { DashboardResponse, HandleGetDashboardData } from "@/API/dashboard";

function Main() {

  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);

  const getDashboardData = async () => {
    setLoading(true);
    try {
      const res = await HandleGetDashboardData();
      if (res) {
        setDashboardData(res);
      }
    } catch (err) {
      console.error("Dashboard data fetch failed", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-12">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
          <div className="col-span-12 mt-8">
            <div className="flex items-center h-10 intro-y">
              <h2 className="mr-5 text-lg font-medium truncate">
                General Report
              </h2>
            </div>
            <div className="grid grid-cols-10 gap-6 mt-5">
              <div className="col-span-6 sm:col-span-4 xl:col-span-2 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="Users" className="w-[28px] h-[28px] text-primary" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {dashboardData?.usersStats?.totalUsers || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Total Users
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-4 xl:col-span-2 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="UserCheck" className="w-[28px] h-[28px] text-success" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {dashboardData?.usersStats?.totalVerifedUsers || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Verified Users
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-4 xl:col-span-2 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="UserX" className="w-[28px] h-[28px] text-danger" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {dashboardData?.usersStats?.totalUnverifedUsers || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Unverified Users
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-4 xl:col-span-2 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="ShoppingCart" className="w-[28px] h-[28px] text-primary" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {dashboardData?.ordersStats?.totalOrders || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Total Orders
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-4 xl:col-span-2 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="Clock" className="w-[28px] h-[28px] text-pending" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {dashboardData?.ordersStats?.totalPendingOrders || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Pending Orders
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-4 xl:col-span-2 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="CheckCircle" className="w-[28px] h-[28px] text-success" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {dashboardData?.ordersStats?.totalFilledOrders || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Filled Orders
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-4 xl:col-span-2 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="XCircle" className="w-[28px] h-[28px] text-danger" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {dashboardData?.ordersStats?.totalRejectedOrders || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Rejected Orders
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-4 xl:col-span-2 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="X" className="w-[28px] h-[28px] text-warning" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {dashboardData?.ordersStats?.totalCancelledOrders || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Cancelled Orders
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-4 xl:col-span-2 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="TrendingUp" className="w-[28px] h-[28px] text-success" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {dashboardData?.ordersStats?.totalBuyOrders || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Buy Orders
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-6 sm:col-span-4 xl:col-span-2 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="TrendingDown" className="w-[28px] h-[28px] text-danger" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {dashboardData?.ordersStats?.totalSellOrders || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Sell Orders
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="ArrowDownCircle" className="w-[28px] h-[28px] text-success" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      ${dashboardData?.walletStats?.totalDeposit || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Total Deposit
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                <div className={clsx(["relative zoom-in", "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']"])}>
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide icon="ArrowUpCircle" className="w-[28px] h-[28px] text-warning" />
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      ${dashboardData?.walletStats?.totalWithdrawal || 0}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Total Withdraw
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: General Report */}
          {/* BEGIN: Sales Report */}
          <div className="col-span-12 mt-8 lg:col-span-12">
            <div className="p-5 mt-12 intro-y box sm:mt-5">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex">
                  <div>
                    <div className="text-lg font-medium text-primary dark:text-slate-300 xl:text-xl">
                      ${dashboardData?.walletStats?.totalDeposit || "0"}
                    </div>
                    <div className="mt-0.5 text-slate-500">Deposit</div>
                  </div>
                  <div className="w-px h-12 mx-4 border border-r border-dashed border-slate-200 dark:border-darkmode-300 xl:mx-5"></div>
                  <div>
                    <div className="text-lg font-medium text-slate-500 xl:text-xl">
                      ${dashboardData?.walletStats?.totalWithdrawal || "0"}
                    </div>
                    <div className="mt-0.5 text-slate-500">Withdraw</div>
                  </div>
                </div>
              </div>
              <div
                className={clsx([
                  "relative",
                  "before:content-[''] before:block before:absolute before:w-16 before:left-0 before:top-0 before:bottom-0 before:ml-10 before:mb-7 before:bg-gradient-to-r before:from-white before:via-white/80 before:to-transparent before:dark:from-darkmode-600",
                  "after:content-[''] after:block after:absolute after:w-16 after:right-0 after:top-0 after:bottom-0 after:mb-7 after:bg-gradient-to-l after:from-white after:via-white/80 after:to-transparent after:dark:from-darkmode-600",
                ])}
              >
                <ReportLineChart height={275} className="mt-6 -mb-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
