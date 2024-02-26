import { AssetGroupCard } from "./AssetGroupCard";
import { getAllAssetGroups } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";

export const AssetsGroupList = async () => {
  const { data: assetsGroup } = await getAllAssetGroups({});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full h-full overflow-y-scroll">
      {assetsGroup?.map((assetGroup) => (
        <AssetGroupCard key={assetGroup.assetDepId} assetGroup={assetGroup} />
      ))}
    </div>
  );
};
