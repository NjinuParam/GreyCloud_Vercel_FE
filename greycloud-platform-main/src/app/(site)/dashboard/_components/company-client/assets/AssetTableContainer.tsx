"use client";

import React from "react";
import { SageOneAssetTypeType } from "@/lib/schemas/company";
import { GetCompanyDepreciationGroupResponseType } from "@/lib/schemas/depreciation";
import { PlatformUserType } from "@/lib/schemas/common-schemas";
import { assetTableColumns } from "./assets-columns";
import { DataTable } from "@/components/ui/data-table";

export type AssetTableProps = {
  assets: SageOneAssetTypeType[];
  depreciationGroups: GetCompanyDepreciationGroupResponseType[];
  sageCompanyId: number;
  companyId: string;
  user?: PlatformUserType;
};

export default function AssetTableContainer({ assets, depreciationGroups, sageCompanyId, companyId }: AssetTableProps) {
  // Enrich each asset with additional context
  const enrichedAssets = assets.map((asset) => ({
    ...asset,
    depreciationGroups,
    sageCompanyId,
    companyId,
  }));

  return (
    <div className="min-w-full">
      <DataTable columns={assetTableColumns} data={enrichedAssets} />
    </div>
  );
}
