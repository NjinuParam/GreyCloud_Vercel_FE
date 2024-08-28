"use client";

import { Button } from "@/components/ui/button";
import { UpdateSageOneAssetFormProps } from "../../../(dashboard-displays)/company-user-admin/add-asset/_components/UpdateSageOneAssetForm";
import { DataTable } from "@/components/ui/data-table";
import {
  AssetDepreciationHistoryTableTypes,
  assetDepreciationHistoryColumns,
} from "../../grey-cloud-admin/DataTableColumns";
import { getFutureAssetDepreciationHistory, getSpecificAssetDepreciationHistory } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
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
import { SelectGroup } from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function AssetDepreciationDialog({
  asset,
  depreciationGroups,
  sageCompanyId,
}: UpdateSageOneAssetFormProps) {
  const [transformedData, setTransformedData] = useState<
    AssetDepreciationHistoryTableTypes[]
  >([]);

  const [_transformedData, _setTransformedData] = useState<
  AssetDepreciationHistoryTableTypes[]
>([]);

  const [selectedPeriod, setSelectedPeriod] = useState<
  number
>(0);



async function fatchFutureDepreciation(assetId:string){
  toast.info("Fetching depreciation history...");
  
  const response = await fetch(`https://grey-cloud-uat.azurewebsites.net/Depreciation/CalculateFutureepreciation/${assetId}/${selectedPeriod}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  if (response) {
    
    const res = await response.json();
    const newTransformedData = res?.map((depHistory:any) => ({
      ...depHistory,
      code: asset ? asset.code : "--",
      assetName: asset ? asset.description : "Unknown Asset",
      companyName: sageCompanyId?.toString(),
    })) as AssetDepreciationHistoryTableTypes[];

    
    _setTransformedData(newTransformedData);
    
   
  } else {
    
  }
}



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
          companyName: sageCompanyId?.toString(),
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
    <>
    <Dialog>
      <DialogTrigger asChild className="grow">
        <Button variant={"outline"} className="text-primary">
          Historic Depreciation
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
    <Dialog>
      <DialogTrigger asChild className="grow">
        <Button variant={"outline"} className="text-primary">
          Projected Depreciation
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[1000px] w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            View Projected Depreciation
          </DialogTitle>
        </DialogHeader>

        {_transformedData.length > 0 ? (
          <DataTable
            columns={assetDepreciationHistoryColumns}
            data={_transformedData}
          />
        ) : (
          <DialogDescription>
            <p className="mx-auto text-center">
              Click button below to fetch asset depreciation.
            </p>
          </DialogDescription>
        )}

        {/* <Button
          variant={"outline"}
          disabled={transformedData.length > 0 || status === "executing"}
          className="text-primary w-full"
          onClick={() => execute({ assetid: asset.id })}
        >
          Fetch Depreciation History
        </Button> */}
              <Select
value={`${selectedPeriod}`}
onValueChange={(e:any) => {
   
  const p = e as number;
  setSelectedPeriod(p);
  // console.log(e);
  // const cat = categories && categories.find((x:any) => x.description == e).id;
  // setCategory(cat);
}}
>
<SelectTrigger>
  <SelectValue placeholder="Period"  />
</SelectTrigger>
<SelectContent>
  <SelectGroup>
    <SelectLabel>Period</SelectLabel>
    <SelectItem  key={0} value={"0"}>
        6 months
      </SelectItem>

      <SelectItem key={1} value={"1"}>
        12 months
      </SelectItem>

      <SelectItem key={2} value={"2"}>
        24 months
      </SelectItem>

    {/* {categories.map((c: any) => (
      <SelectItem key={c.id} value={c.description}>
        {c.description}
      </SelectItem>
    ))} */}
  </SelectGroup>
</SelectContent>
</Select>
        <Button
          variant={"outline"}
          disabled={status === "executing"}
          className="text-primary w-full"
          onClick={() => fatchFutureDepreciation(asset.id)}
        >
          View Projected Depreciation 
        </Button>
      </DialogContent>
    </Dialog>
    </>
  );
}
