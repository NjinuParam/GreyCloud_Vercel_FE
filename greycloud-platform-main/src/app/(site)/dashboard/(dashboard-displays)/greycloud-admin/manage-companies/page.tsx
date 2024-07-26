import { CompaniesList } from "../../../_components/grey-cloud-admin/CompanyCards";
import { SageCompanyResponseType } from "@/lib/schemas/company";
import { getAllGreyCloudCompanies } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { getIronSessionData } from "../../../../../../lib/auth/auth";
// import { unstable_noStore as noStore } from "next/cache";

export default async function ManageCompanies() {
  // noStore();
  const session = await getIronSessionData();
  
  const { data: companies } = await getAllGreyCloudCompanies({});
debugger;
  return (
    <div className="overflow-y-scroll rounded-md bg-slate-50 dark:bg-slate-900/40 p-4">
      <CompaniesList companies={(companies as SageCompanyResponseType[]) ?? []} />
    </div>
  );
}
