import { GreyCloudAdminDashboardView } from "./_components/grey-cloud-admin/GreyCloudAdminDashboardView";
import { CompanyUserDashboardView } from "./_components/company-client/company-users/CompanyUsersDashboardView";
import { getIronSessionData } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import TableSkeletonList from "./_components/company-client/loaders/TableSkeletonList";

const Dashboard = async () => {
  const session = await getIronSessionData();

  if (!session.isLoggedIn) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-col grow gap-2 items-center justify-center">
      {/* <p> Click on the sidebar links to interact with the Dashboard.</p> */}

      <Suspense fallback={<TableSkeletonList />}>
        <GreyCloudAdminDashboardView />
      </Suspense>

      {session.role !== "GreyCloud_Admin" && (
        <Suspense fallback={<TableSkeletonList />}>
          <CompanyUserDashboardView />
        </Suspense>
      )}
    </div>
  );
};

export default Dashboard;
