import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompanyUserAddUserForm from "./_components/CompanyUserAddUserForm";
import { getIronSessionData } from "@/lib/auth/auth";
import { getGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";

export default async function AddUser() {
  const session = await getIronSessionData();

  const { data: myCompany } = await getGreyCloudCompany({
    id: session.companyId as string,
  });

  return (
    <Card className="flex flex-col w-[600px] mx-auto justify-between mt-8">
      <CardHeader className="flex flex-col bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 py-5">
        <CardTitle>
          <h2 className="text-xl text-foreground/80">Add A Company User</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">{myCompany && <CompanyUserAddUserForm myCompany={myCompany} />}</CardContent>
    </Card>
  );
}
