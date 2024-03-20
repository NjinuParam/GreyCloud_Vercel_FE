import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllCompanyDepreciationGroups } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import SageOneAssetSaveForm from "../company-user-admin/add-asset/_components/SageOneAssetSaveForm";
import { getIronSessionData } from "@/lib/auth/auth";
import { getGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import AddAssetDepreciationGroupToNewAsset from "../company-user-admin/add-asset/_components/AddAssetDepreciationGroupToNewAsset";

export default async function AddAssetView() {
  const { data: depreciationGroups } = await getAllCompanyDepreciationGroups({});

  const session = await getIronSessionData();

  if (!session) {
    return null;
  }

  // const { data: myCompany } = await getGreyCloudCompany({
  //   id: session.companyId as string,
  // });

  const myCompany = session.companyProfile.companiesList?.find((company) => company.companyId === session.companyProfile.loggedInCompanyId);

  return (
    <Card className="flex flex-col w-[600px] mx-auto justify-between mt-8">
      <CardHeader className="flex flex-col bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 py-5">
        <CardTitle>
          <h2 className="text-xl text-foreground/80">Add A Sage Asset</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <SageOneAssetSaveForm depreciationGroups={depreciationGroups ?? []} SageCompanyId={Number(myCompany?.sageCompanyId ?? 0)}>
          <AddAssetDepreciationGroupToNewAsset />
        </SageOneAssetSaveForm>
      </CardContent>
    </Card>
  );
}
