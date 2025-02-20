import { Suspense } from "react";
import CompanyUserSkeletonList from "../../../_components/company-client/loaders/CompanyUserSkeletonList";
import ManageCompanyUsersView from "../../_components/ManageCompanyUsersView";

export default function ManageCompanyUsersContainer() {
  debugger;
  return (
    <div className="overflow-y-scroll rounded-md bg-slate-50 dark:bg-slate-900/40 p-4">
      <Suspense fallback={<CompanyUserSkeletonList />}>
        <ManageCompanyUsersView />
      </Suspense>
    </div>
  );
}
