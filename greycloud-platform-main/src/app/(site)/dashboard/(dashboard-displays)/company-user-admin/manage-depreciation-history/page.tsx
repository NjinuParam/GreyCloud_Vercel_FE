
import React, { Suspense } from "react";
import ViewDepreciationHistoryView from "../../_components/ViewDepreciationHistoryView";
import TableSkeletonList from "../../../_components/company-client/loaders/TableSkeletonList";

import { SAGE_ONE_DEPRECIATION } from "../../../../../../lib/api-endpoints/sage-one-company-depreciation";
import { getIronSessionData } from "../../../../../../lib/auth/auth";
import DepreciationRedirectHandler from "../../../_components/company-client/depreciation-groups/DepreciationRedirectHandler";

export default async function ManageDepreciationHistoryContainer() {
  const payload = await getIronSessionData();
  const user = payload.companyProfile?.loggedInCompanyId;
  const companyId = payload.companyProfile?.companiesList?.filter((x: any) => { return x.id == user })[0];

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${apiUrl}${SAGE_ONE_DEPRECIATION.GET.GET_COMPANY_DEPRECIATION_GROUP_ALL}`, { cache: "no-store" });
  const depreciationGroup: any[] = await response.json();
  const filtered = depreciationGroup?.filter((x: any) => { return x.companyId == companyId?.id });

  if (!filtered || filtered.length === 0) {
    return <DepreciationRedirectHandler />;
  }

  return (
    <>
      <Suspense fallback={<TableSkeletonList />}>
        <ViewDepreciationHistoryView />
      </Suspense>
    </>
  );
}
