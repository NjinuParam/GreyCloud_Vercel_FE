"use client";

import React from "react";
import { SageOneAssetTypeType } from "@/lib/schemas/company";
import { GetCompanyDepreciationGroupResponseType } from "@/lib/schemas/depreciation";
import { PlatformUserType } from "@/lib/schemas/common-schemas";
import { assetTableColumns } from "./assets-columns";
import { DataTable } from "@/components/ui/data-table";
import { FileSpreadsheet } from "lucide-react";
import { useExcelDownloder } from 'react-xls';

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
  const { ExcelDownloder, Type } = useExcelDownloder();




  return (
    <div className="min-w-full">
      {assets?.length > 0 &&
        <ExcelDownloder
          data={{assets:enrichedAssets}}
          filename={`AssetExport_${new Date().toDateString()}`}
          type={Type.Button} // or type={'button'}
        >
          <a style={{ cursor: "pointer" }}>
            <FileSpreadsheet style={{ float: "left" }} /> <small>Export spreadsheet</small>
          </a>
        </ExcelDownloder>

      }
      <br/><br/>
      <DataTable columns={assetTableColumns} data={enrichedAssets} />
    </div>
  );
}
