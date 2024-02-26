import { GreyCloudAdminsList } from "../../../_components/grey-cloud-admin/GreyCloudAdminCards";
import { getAllGreyCloudAdmins } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { GreyCloudAllAdminsResponseType } from "@/lib/schemas/greycloud-admin";

export default async function ManageAdmins() {
  const { data: admins } = await getAllGreyCloudAdmins({});

  return (
    <div className="overflow-y-scroll rounded-md bg-slate-50 dark:bg-slate-900/40 p-4">
      <GreyCloudAdminsList admins={(admins as GreyCloudAllAdminsResponseType[]) ?? []} />
    </div>
  );
}
