import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SAGE_ONE_DEPRECIATION } from "@/lib/api-endpoints/sage-one-company-depreciation";
import SageOneAssetSaveForm from "../company-user-admin/add-asset/_components/SageOneAssetSaveForm";
import { getIronSessionData } from "@/lib/auth/auth";
import AddAssetDepreciationGroupToNewAsset from "../company-user-admin/add-asset/_components/AddAssetDepreciationGroupToNewAsset";

export default async function AddAssetView() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const groupsResponse = await fetch(`${apiUrl}${SAGE_ONE_DEPRECIATION.GET.GET_COMPANY_DEPRECIATION_GROUP_ALL}`, { cache: "no-store" });
  const depreciationGroupsData = await groupsResponse.json();
  const depreciationGroups = Array.isArray(depreciationGroupsData) ? depreciationGroupsData : (depreciationGroupsData.data || []);

  const session = await getIronSessionData();

  if (!session) {
    return null;
  }

  const myCompany = session.companyProfile?.companiesList?.find((company: any) => company.id === session.companyProfile.loggedInCompanyId);

  return (
    <Card className="flex flex-col w-[600px] mx-auto justify-between mt-8">
      <CardHeader className="flex flex-col bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 py-5">
        <CardTitle>
          <h2 className="text-xl text-foreground/80">Add A Sage Asset</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <SageOneAssetSaveForm depreciationGroups={depreciationGroups ?? []} SageCompanyId={Number(myCompany?.si ?? 0)}>
          <AddAssetDepreciationGroupToNewAsset />
        </SageOneAssetSaveForm>
      </CardContent>
    </Card>
  );
}
