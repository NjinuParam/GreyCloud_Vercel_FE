import { AssetCard } from "./AssetCard";
import { getSageOneCompanyAssets } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { getAllCompanyDepreciationGroups } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { getIronSessionData } from "@/lib/auth/auth";
import { getGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";

export const AssetsList = async () => {
  const session = await getIronSessionData();

  if (!session.isLoggedIn) {
    return null;
  }

  const { data: myCompany } = await getGreyCloudCompany({
    id: session.companyId as string,
  });

  const { data: assets } = await getSageOneCompanyAssets({
    SageCompanyId: Number(myCompany?.sageCompanyId),
  });

  const { data: depreciationGroups } = await getAllCompanyDepreciationGroups({});

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full h-full overflow-y-scroll">
        {assets?.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset ?? []}
            depreciationGroups={depreciationGroups?.filter((g) => g.companyId === session.companyId) ?? []}
            sageCompanyId={myCompany?.sageCompanyId ?? 0}
          />
        ))}
      </div>
    </>
  );
};
