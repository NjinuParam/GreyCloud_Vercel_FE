"use client";

import { Button } from "@/components/ui/button";
import { UpdateSageOneAssetFormProps } from "../../../(dashboard-displays)/company-user-admin/add-asset/_components/UpdateSageOneAssetForm";
import { DataTable } from "@/components/ui/data-table";
import {
  AssetDepreciationHistoryTableTypes,
  assetDepreciationHistoryColumns,
} from "../../grey-cloud-admin/DataTableColumns";
import { getSpecificAssetDepreciationHistory } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AssetDepreciationDialog({
  asset,
  depreciationGroups,
  sageCompanyId,
}: UpdateSageOneAssetFormProps) {
  const [transformedData, setTransformedData] = useState<
    AssetDepreciationHistoryTableTypes[]
  >([]);

  const { execute, status } = useAction(getSpecificAssetDepreciationHistory, {
    onSuccess(data) {
      if (data.length === 0) {
        toast.info("No Depreciation History found.", {
          description: "This asset has no depreciation history.",
        });
      } else {
        toast.success("Depreciation History fetched.", {
          description:
            "The depreciation history for this asset was fetched successfully.",
        });

        // Transform the depreciation history data
        const newTransformedData = data?.map((depHistory) => ({
          ...depHistory,
          assetName: asset ? asset.description : "Unknown Asset",
          companyName: sageCompanyId.toString(),
        })) as AssetDepreciationHistoryTableTypes[];

        setTransformedData(newTransformedData);
      }
    },

    onError(error) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error, null, 2),
      });
    },

    onExecute() {
      toast.info("Fetching Asset Depreciation History...");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild className="grow">
        <Button variant={"outline"} className="text-primary w-full">
          View Depreciation
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[1000px] w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            View Asset Depreciation
          </DialogTitle>
        </DialogHeader>

        {transformedData.length > 0 ? (
          <DataTable
            columns={assetDepreciationHistoryColumns}
            data={transformedData}
          />
        ) : (
          <DialogDescription>
            <p className="mx-auto text-center">
              Click button below to fetch asset depreciation.
            </p>
          </DialogDescription>
        )}

        <Button
          variant={"outline"}
          disabled={transformedData.length > 0 || status === "executing"}
          className="text-primary w-full"
          onClick={() => execute({ assetid: asset.id })}
        >
          Fetch Depreciation History
        </Button>
      </DialogContent>
    </Dialog>
  );
}
