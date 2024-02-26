import { getGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { getAllAssetDepreciationHistory } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { DataTable } from "@/components/ui/data-table";
import { getIronSessionData } from "@/lib/auth/auth";
import { AssetDepreciationHistoryTableTypes, assetDepreciationHistoryColumns } from "../../_components/grey-cloud-admin/DataTableColumns";
import { getSageOneCompanyAssets } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";

export default async function ViewDepreciationHistoryView() {
  const session = await getIronSessionData();

  if (!session.isLoggedIn) {
    return null;
  }

  const { data: myCompany } = await getGreyCloudCompany({
    id: session.companyId as string,
  });

  // Fetch assets and depreciation history in parallel
  const [depreciationHistoryAll, assets] = await Promise.all([
    getAllAssetDepreciationHistory({ sageCompanyId: Number(myCompany?.sageCompanyId) }),
    getSageOneCompanyAssets({ SageCompanyId: Number(myCompany?.sageCompanyId) }),
  ]);

  // Transform the depreciation history data
  const transformedData = depreciationHistoryAll.data?.map((depHistory) => {
    const asset = assets.data?.find((a) => a.id === depHistory.assetId);
    return {
      ...depHistory,
      assetName: asset ? asset.description : "Unknown Asset",
      companyName: myCompany?.companyName,
    };
  }) as AssetDepreciationHistoryTableTypes[];

  return (
    <div className="mx-auto min-w-full min-h-full">
      <div className="flex flex-col gap-4 p-4 w-full h-full">
        <h4 className="text-xl font-semibold text-muted-foreground">{`Depreciation History for ${myCompany?.companyName ?? "Company."}`}</h4>
        <DataTable columns={assetDepreciationHistoryColumns} data={transformedData ?? []} />
      </div>
    </div>
  );
}
