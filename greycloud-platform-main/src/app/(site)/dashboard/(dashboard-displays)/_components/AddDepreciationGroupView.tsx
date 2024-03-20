import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import AddDepreciationGroupForm from "../company-user-admin/add-depreciation-group/_components/AddDepreciationGroupForm";
import { getGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { getIronSessionData } from "@/lib/auth/auth";
import { getSpecificCompanyUser } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { CompanyUserOfSpecificCompanyResponseSchema } from "@/lib/schemas/company-user";
import { SageCompanyResponseType } from "@/lib/schemas/company";

export default async function AddDepreciationGroupView() {
  const session = await getIronSessionData();

  const mySelectedCompany = session.companyProfile.companiesList?.find((company) => company.companyId === session.companyProfile.loggedInCompanyId);

  // await getSpecificCompanyUser({
  //   id: session.id as string,
  // })

  const [myCompany, myProfile] = await Promise.all([
    await getGreyCloudCompany({
      id: mySelectedCompany?.companyId as string,
    }),
    await getSpecificCompanyUser({
      id: session.id as string,
    }),
  ]);

  return (
    <Card className="flex flex-col w-[600px] mx-auto justify-between mt-8">
      <CardHeader className="flex flex-col bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 py-5">
        <CardTitle>
          <h2 className="text-xl text-foreground/80">Add Depreciation Group</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <AddDepreciationGroupForm
          myCompany={myCompany?.data as SageCompanyResponseType}
          myProfile={myProfile?.data as CompanyUserOfSpecificCompanyResponseSchema}
        />
      </CardContent>
    </Card>
  );
}
