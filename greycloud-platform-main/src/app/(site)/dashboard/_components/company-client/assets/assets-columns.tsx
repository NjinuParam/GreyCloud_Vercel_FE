import { ColumnDef } from "@tanstack/react-table";
import { SageOneAssetTypeType } from "@/lib/schemas/company";
import { formatDate, formatToRand } from "@/lib/utils";
import AssetsTableActions from "./AssetsTableActions";
import { GetCompanyDepreciationGroupResponseType } from "@/lib/schemas/depreciation";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import moment from "moment";

// Define a new type that represents enriched assets
export type EnrichedAssetType = SageOneAssetTypeType & {
  depreciationGroups: GetCompanyDepreciationGroupResponseType[];
  sageCompanyId: number;
  companyId: string;
  billingType:any
};

export const assetTableColumns: ColumnDef<EnrichedAssetType>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "catDescription",
    header: "Category",
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "boughtFrom",
    header: "Bought From",
  },
  {
    accessorKey: "datePurchased",
    header: "Date Purchased",
    cell: (info) => moment(String(info.getValue())).format("MMM Do YYYY"),
  },
  {
    accessorKey: "purchasePrice",
    header: "Purchase Price",
    cell: (info) => formatToRand(Number(info.getValue())),
  },
  {
    accessorKey: "currentValue",
    header: "Current Value",
    cell: (info) => {
      const currentValue = Number(info.getValue());
      const purchasePrice = Number(info.row.original.purchasePrice);
      let arrowIcon = null;

      if (currentValue > purchasePrice) {
        // Asset has appreciated
        arrowIcon = <ArrowUpRight className="text-green-500 size-4" />;
      } else if (currentValue < purchasePrice) {
        // Asset has depreciated
        arrowIcon = <ArrowDownRight className="text-red-500 size-4" />;
      } else {
        // No change in value
        arrowIcon = <ArrowRight className="text-slate-500 size-4" />;
      }

      return (
        <div className="flex items-center gap-2">
          {formatToRand(currentValue)}
          <span className={`inline-block`}>{arrowIcon}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <AssetsTableActions asset={row.original} />;
    },
  },
];
