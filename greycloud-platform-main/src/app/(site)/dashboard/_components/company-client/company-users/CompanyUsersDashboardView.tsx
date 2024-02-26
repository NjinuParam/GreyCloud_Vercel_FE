import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { companyUsersColumns } from "../../grey-cloud-admin/DataTableColumns";
import { getAllCompanyUsers } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { getIronSessionData } from "@/lib/auth/auth";

export const CompanyUserDashboardView = async () => {
  const session = await getIronSessionData();

  if (!session.isLoggedIn) {
    return null;
  }

  const { data: users } = await getAllCompanyUsers({
    companyId: session.companyId as string,
  });

  return (
    <>
      <div className="mx-auto min-w-full">
        <div className="flex flex-col gap-4 p-4">
          <h4 className="text-xl font-semibold text-muted-foreground">Your Colleagues</h4>
          <DataTable columns={companyUsersColumns} data={users ?? []} />
        </div>
      </div>
    </>
  );
};
