"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AssetCategorySummary } from './assets-utils';
import { formatToRand } from '@/lib/utils';

export default function AssetsSummary({ data, onGroupClick }: { data: AssetCategorySummary[]; onGroupClick?: (groupKey: string) => void }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Total Purchase Price</TableHead>
            <TableHead>Total Current Value</TableHead>
            <TableHead>Avg Current Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow 
              key={row.groupKey} 
              onClick={() => onGroupClick?.(row.groupKey)}
              className="cursor-pointer hover:bg-slate-50"
            >
              <TableCell>{row.groupKey}</TableCell>
              <TableCell>{row.count}</TableCell>
              <TableCell>{formatToRand(row.totalPurchasePrice)}</TableCell>
              <TableCell>{formatToRand(row.totalCurrentValue)}</TableCell>
              <TableCell>{formatToRand(row.avgCurrentValue)}</TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
             <TableRow>
               <TableCell colSpan={5} className="h-24 text-center">
                 No results.
               </TableCell>
             </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
