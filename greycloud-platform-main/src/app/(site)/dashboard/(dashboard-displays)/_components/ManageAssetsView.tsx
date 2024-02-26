import { Suspense } from "react";
import { AssetsList } from "../../_components/company-client/assets/AssetsList";
import GridSkeletonList from "../../_components/company-client/loaders/AssetsSkeletonList";

export default function ManageAssetsView() {
  return (
    <div className="overflow-y-scroll rounded-md bg-slate-50 dark:bg-slate-900/40 p-4">
      <Suspense fallback={<GridSkeletonList />}>
        <AssetsList />
      </Suspense>
    </div>
  );
}
