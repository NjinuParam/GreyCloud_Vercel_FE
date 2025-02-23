'use client';
import { AllCompanyUserResponseType } from "@/lib/schemas/company-user";
import { getIronSessionData } from "@/lib/auth/auth";
import { getAllCompanyUsers } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { CompanyUsersList } from "../../_components/company-client/company-users/CompanyUsersList";
import { SAGE_ONE_USER_COMPANY } from "../../../../../lib/api-endpoints/sage-one-user-company";

export default async function ManageCompanyUsersView() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
 
  const session =  await getIronSessionData();

const res =  await  fetch(`${apiUrl}/SageOneCompany/Company/GetUsers/${session.companyProfile?.loggedInCompanyId}`);
const _res = await res.json();
debugger;


  return (
    <div className="overflow-y-scroll rounded-md bg-slate-50 dark:bg-slate-900/40 p-4">
      <CompanyUsersList users={(_res as AllCompanyUserResponseType[]) ?? []} />
    </div>
  );
}
