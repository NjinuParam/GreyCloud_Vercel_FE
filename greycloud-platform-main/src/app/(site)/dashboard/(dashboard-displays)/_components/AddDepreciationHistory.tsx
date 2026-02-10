import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddDepreciationHistoryForm from "../company-user-admin/manage-depreciation-history/_components/AddDepreciationHistoryForm";
import { getIronSessionData } from "@/lib/auth/auth";
import { getSageOneCompanyAssets } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { SAGE_ONE_DEPRECIATION } from "@/lib/api-endpoints/sage-one-company-depreciation";
import { GetCompanyDepreciationGroupResponseType } from "@/lib/schemas/depreciation";

export default async function AddDepreciationHistoryView() {
  const session = await getIronSessionData();

  if (!session) {
    return null;
  }

  const myCompany = session.companyProfile?.companiesList?.find((company: any) => company.id === session.companyProfile.loggedInCompanyId);

  const { data: assets } = await getSageOneCompanyAssets({
    SageCompanyId: Number(myCompany?.si),
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const groupsResponse = await fetch(`${apiUrl}${SAGE_ONE_DEPRECIATION.GET.GET_COMPANY_DEPRECIATION_GROUP_ALL}`, { cache: "no-store" });
  const depreciationGroupsData = await groupsResponse.json();
  const depreciationGroups: any[] = Array.isArray(depreciationGroupsData) ? depreciationGroupsData : (depreciationGroupsData.data || []);

  return (
    <Card className="flex flex-col w-[600px] mx-auto justify-between mt-8">
      <CardHeader className="flex flex-col bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 py-5">
        <CardTitle>
          <h2 className="text-xl text-foreground/80">Add Depreciation History</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <AddDepreciationHistoryForm
          sageCompanyId={Number(myCompany?.si)}
          depreciationGroups={
            (depreciationGroups?.filter((g) => g.companyId === myCompany?.id) as GetCompanyDepreciationGroupResponseType[]) ?? []
          }
          assets={assets ?? []}
        />
      </CardContent>
    </Card>
  );
}
