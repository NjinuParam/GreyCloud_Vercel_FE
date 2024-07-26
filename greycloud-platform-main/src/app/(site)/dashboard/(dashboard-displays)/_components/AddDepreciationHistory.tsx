import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddDepreciationHistoryForm from "../company-user-admin/manage-depreciation-history/_components/AddDepreciationHistoryForm";
import { getIronSessionData } from "@/lib/auth/auth";
import { getSageOneCompanyAssets } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { getGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { getAllCompanyDepreciationGroups } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { GetCompanyDepreciationGroupResponseType } from "@/lib/schemas/depreciation";

export default async function AddDepreciationHistoryView() {
  const session = await getIronSessionData();

  if (!session) {
    return null;
  }

  const myCompany = session.companyProfile?.companiesList?.find((company) => company.companyId === session.companyProfile.loggedInCompanyId);

  // const { data: myCompany } = await getGreyCloudCompany({
  //   id: session.companyId as string,
  // });

  const { data: assets } = await getSageOneCompanyAssets({
    SageCompanyId: Number(myCompany?.sageCompanyId),
  });

  const { data: depreciationGroups } = await getAllCompanyDepreciationGroups({});

  return (
    <Card className="flex flex-col w-[600px] mx-auto justify-between mt-8">
      <CardHeader className="flex flex-col bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 py-5">
        <CardTitle>
          <h2 className="text-xl text-foreground/80">Add Depreciation History</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <AddDepreciationHistoryForm
          sageCompanyId={Number(myCompany?.sageCompanyId)}
          depreciationGroups={
            (depreciationGroups?.filter((g) => g.companyId === myCompany?.companyId) as GetCompanyDepreciationGroupResponseType[]) ?? []
          }
          assets={assets ?? []}
        />
      </CardContent>
    </Card>
  );
}
