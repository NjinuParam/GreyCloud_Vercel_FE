"use client";

import React, { useMemo, useState, useEffect } from "react";
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

  // Pagination state (client-side)
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  // Filtered assets by search
  const filteredAssets = useMemo(() => {
    if (!search) return enrichedAssets;
    const s = search.trim().toLowerCase();
    return enrichedAssets.filter(a => {
      const name = (a.description || a.name || "").toString().toLowerCase();
      const code = (a.code || "").toString().toLowerCase();
      return name.includes(s) || code.includes(s);
    });
  }, [enrichedAssets, search]);

  const total = filteredAssets.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  // Ensure current page is valid when data or pageSize changes
  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [pageCount]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredAssets.slice(start, start + pageSize);
  }, [filteredAssets, page, pageSize]);




  return (
    <div className="min-w-full">
      <div className="flex items-center justify-between">
        <div className="w-1/3">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or code"
            className="w-full border rounded px-2 py-1"
          />
        </div>

        {assets?.length > 0 && (
          <ExcelDownloder
            data={{assets:enrichedAssets}}
            filename={`AssetExport_${new Date().toDateString()}`}
            type={Type.Button} // or type={'button'}
          >
            <a style={{ cursor: "pointer" }}>
              <FileSpreadsheet style={{ float: "left" }} /> <small>Export spreadsheet</small>
            </a>
          </ExcelDownloder>
        )}

      </div>
      <br/><br/>
      {/* Table receives only the current page */}
      <DataTable columns={assetTableColumns} data={paginatedData} />

      {/* Pagination controls */}
      {total > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="border rounded px-2 py-1"
            >
              {[5,10,20,50].map(sz => (
                <option key={sz} value={sz}>{sz} / page</option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >First</button>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >Prev</button>
              <span className="px-2">{page} / {pageCount}</span>
              <button
                onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >Next</button>
              <button
                onClick={() => setPage(pageCount)}
                disabled={page === pageCount}
                className="px-2 py-1 border rounded disabled:opacity-50"
              >Last</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
