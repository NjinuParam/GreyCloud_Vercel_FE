import { AssetCard } from "./AssetCard";
import { getSageOneCompanyAssets } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { getAllCompanyDepreciationGroups } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
// import { DataTable } from "@/components/ui/data-table";
import { getIronSessionData } from "@/lib/auth/auth";
// import { assetTableColumns } from "./assets-columns";

export const AssetsList = async () => {
  const session = await getIronSessionData();

  if (!session.isLoggedIn) {
    return null;
  }

  const myCompany = session.companyProfile.companiesList?.find((company) => company.companyId === session.companyProfile.loggedInCompanyId);

  const [assets, depreciationGroups] = await Promise.all([
    await getSageOneCompanyAssets({
      SageCompanyId: Number(myCompany?.sageCompanyId),
    }),
    await getAllCompanyDepreciationGroups({}),
  ]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full h-full overflow-y-scroll">
        {/* <DataTable columns={assetTableColumns} data={assets.data ?? []} /> */}

        {assets.data?.map((asset) => (
          <AssetCard
            key={asset.id}
            asset={asset ?? []}
            depreciationGroups={depreciationGroups.data?.filter((g) => g.companyId === session.companyId) ?? []}
            sageCompanyId={myCompany?.sageCompanyId ?? 0}
          />
        ))}
      </div>
    </>
  );
};
