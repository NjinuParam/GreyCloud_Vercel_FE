"use client";

import { AllCompanyUserResponseType } from "@/lib/schemas/company-user";
import { AssetDepreciationHistoryResponseType } from "@/lib/schemas/depreciation";
import { GreyCloudAllAdminsResponseType } from "@/lib/schemas/greycloud-admin";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const greycloudAdminColumns: ColumnDef<GreyCloudAllAdminsResponseType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "surname",
    header: "Surname",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];

export const companyUsersColumns: ColumnDef<AllCompanyUserResponseType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "surname",
    header: "Surname",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
];

export type AssetDepreciationHistoryTableTypes = AssetDepreciationHistoryResponseType & {
  assetName?: string;
  companyName?: string;
};

export const assetDepreciationHistoryColumns: ColumnDef<AssetDepreciationHistoryTableTypes>[] = [
  {
    accessorKey: "depGroupId",
    header: "Depreciation Group ID",
  },
  {
    accessorKey: "assetName",
    header: "Asset Name",
  },
  {
    accessorKey: "lastValue",
    header: "Last Value",
  },
  {
    accessorKey: "newValue",
    header: "New Value",
  },
  {
    accessorKey: "companyName",
    header: "Company Name (Sage)",
  },
  {
    accessorKey: "createdDate",
    header: "Created Date",
    cell: (info) => formatDate(info.getValue() as string),
  },
];
