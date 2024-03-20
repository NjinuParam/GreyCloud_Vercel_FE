import { Pencil, Trash, BookOpen } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { SageOneAssetTypeType } from "@/lib/schemas/company";
import { formatDate, formatToRand } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const assetTableColumns: ColumnDef<SageOneAssetTypeType>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category.description",
    header: "Category",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "boughtFrom",
    header: "Bought From",
  },
  {
    accessorKey: "datePurchased",
    header: "Date Purchased",
    cell: (info) => formatDate(String(info.getValue())),
  },
  {
    accessorKey: "purchasePrice",
    header: "Purchase Price",
    cell: (info) => formatToRand(Number(info.getValue())),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {/* View Depreciation Details Button */}
          <Button variant="ghost" title="View Details">
            <BookOpen size="16" />
          </Button>

          {/* Edit Asset Button */}
          <Button variant="ghost" title="Edit Asset">
            <Pencil size="16" />
          </Button>

          {/* Delete Asset Button */}
          <Button variant="ghost" title="Delete Asset">
            <Trash size="16" />
          </Button>
        </div>
      );
    },
  },
];
