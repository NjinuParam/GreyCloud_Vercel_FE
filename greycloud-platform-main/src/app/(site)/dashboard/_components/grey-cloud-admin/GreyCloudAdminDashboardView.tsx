import { DataTable } from "@/components/ui/data-table";
import { greycloudAdminColumns } from "./DataTableColumns";
import { getIronSessionData } from "@/lib/auth/auth";
import { getAllGreyCloudAdmins } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";

export const GreyCloudAdminDashboardView = async () => {
  const { data: admins } = await getAllGreyCloudAdmins({});

  const session = await getIronSessionData();

  if (!session || session.role !== "GreyCloud_Admin") {
    return null;
  }

  return (
    <div className="mx-auto min-w-full">
      <div className="flex flex-col gap-4 p-4">
        <h4 className="text-xl font-semibold text-muted-foreground">GreyCloud Admins</h4>
        <DataTable columns={greycloudAdminColumns} data={admins ?? []} />
      </div>
    </div>
  );
};
