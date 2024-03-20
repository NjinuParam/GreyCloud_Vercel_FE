import { AllCompanyUserResponseType } from "@/lib/schemas/company-user";
import { getIronSessionData } from "@/lib/auth/auth";
import { getAllCompanyUsers } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { CompanyUsersList } from "../../_components/company-client/company-users/CompanyUsersList";

export default async function ManageCompanyUsersView() {
  const session = await getIronSessionData();

  const mySelectedCompany = session.companyProfile.companiesList?.find((company) => company.companyId === session.companyProfile.loggedInCompanyId);

  const myCompanyUsers = await getAllCompanyUsers({
    companyId: mySelectedCompany?.companyId ?? "",
  });

  return (
    <div className="overflow-y-scroll rounded-md bg-slate-50 dark:bg-slate-900/40 p-4">
      <CompanyUsersList users={(myCompanyUsers.data as AllCompanyUserResponseType[]) ?? []} />
    </div>
  );
}
