"use client";

import React from 'react';
import { DataTable } from '@/components/ui/data-table';
import { AssetCategorySummary } from './assets-utils';
import { formatToRand } from '@/lib/utils';

const summaryColumns = [
  {
    accessorKey: 'groupKey',
    header: 'Category',
  },
  {
    accessorKey: 'count',
    header: 'Count',
  },
  {
    accessorKey: 'totalPurchasePrice',
    header: 'Total Purchase Price',
    cell: (info: any) => formatToRand(Number(info.getValue() ?? 0)),
  },
  {
    accessorKey: 'totalCurrentValue',
    header: 'Total Current Value',
    cell: (info: any) => formatToRand(Number(info.getValue() ?? 0)),
  },
  {
    accessorKey: 'avgCurrentValue',
    header: 'Avg Current Value',
    cell: (info: any) => formatToRand(Number(info.getValue() ?? 0)),
  },
];

export default function AssetsSummary({ data, onGroupClick }: { data: AssetCategorySummary[]; onGroupClick?: (groupKey: string) => void }) {
  const rows = data.map(d => ({ ...d }));

  // attach click handler via rowProps
  return (
    <div>
      <DataTable
        columns={summaryColumns}
        data={rows}
        rowProps={(row: any) => ({
          onClick: () => { if (onGroupClick) onGroupClick(row.groupKey); },
          className: 'cursor-pointer hover:bg-slate-50',
        })}
      />
    </div>
  );
}
