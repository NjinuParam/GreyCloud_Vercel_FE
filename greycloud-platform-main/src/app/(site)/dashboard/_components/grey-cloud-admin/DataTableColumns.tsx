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
  code:string;
  assetName?: string;
  purchasePrice:string;
  companyName?: string;
  residual: string;
  depGroupName:string;
  depGroupDetails:string;
  depreciationThisYear:string;
  depreciationThisMonth:string;
  totalDepreciation:string;
};

export const assetDepreciationHistoryColumns: ColumnDef<AssetDepreciationHistoryTableTypes>[] = [
  {
    accessorKey: "code",
    header: "Asset ID",
  },
  {
    accessorKey: "assetName",
    header: "Asset Name",
  },
  {
    accessorKey: "depGroupName",
    header:"Depreciation Group",
  },{
    accessorKey: "depGroupDetails",
    header:"Depreciation Details",
  },
  {
    accessorKey: "createdDate",
    header: "Depreciation Date",
    cell: (info) => formatDate(info.getValue() as string),
  },
  {
    accessorKey: "newValue",
    header: "Book Value",
  },
  {
    accessorKey: "lastValue",
    header: "Previous Value",
  },
  {
    accessorKey: "depreciationAmount",
    header:"Depreciation amount",
  },
  {
    accessorKey: "purchasePrice",
    header:"Purchase Price",
  },{
    accessorKey: "residual",
    header:"Residual Value",
  },
  {
    accessorKey: "totalDepreciation",
    header:"Total depreciation",
  },
  {
    accessorKey: "depreciationThisYear",
    header:"Depreciation this year",
  },
  
  {
    accessorKey: "depreciationThisMonth",
    header:"Depreciation this month",
  }
];
