import { Suspense } from "react";
import { AssetsGroupList } from "../../../_components/company-client/asset-groups/AssetsGroupList";
import GridSkeletonList from "../../../_components/company-client/loaders/AssetsSkeletonList";

export default async function ManageAssetGroups() {
  return (
    <div className="overflow-y-scroll rounded-md bg-slate-50 dark:bg-slate-900/40 p-4">
      <Suspense fallback={<GridSkeletonList />}>
        <AssetsGroupList />
      </Suspense>
    </div>
  );
}
