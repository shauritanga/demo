import { auth } from "@/auth";
import DashboardStats from "@/components/DashboardStats";
import RecentBillOfLanding from "@/components/RecentBillOfLanding";
import RecentInvoices from "@/components/RecentInvoice";
import { WorkProgress } from "@/components/WorkProgress";

export default async function Dashboard() {
  const session = await auth();

  return (
    <div className="w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="w-full mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardStats />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <WorkProgress />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <RecentInvoices />
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <RecentBillOfLanding />
        </div>
      </div>
    </div>
  );
}
