import React, { Suspense } from "react";
import ViewDepreciationHistoryView from "../../_components/ViewDepreciationHistoryView";
import TableSkeletonList from "../../../_components/company-client/loaders/TableSkeletonList";

export default async function ManageDepreciationHistoryContainer() {
  return (
    <>
      <Suspense fallback={<TableSkeletonList />}>
        <ViewDepreciationHistoryView />
      </Suspense>
    </>
  );
}
