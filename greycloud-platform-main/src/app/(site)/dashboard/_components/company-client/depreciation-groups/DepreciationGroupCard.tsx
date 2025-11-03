"use client";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { GetCompanyDepreciationGroupResponseType } from "@/lib/schemas/depreciation";
import { formatDate, formatToPercentage, formatToRand } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AssetDepreciationHistoryTableTypes, assetDepreciationHistoryColumns } from "../../grey-cloud-admin/DataTableColumns";
import { DataTable } from "../../../../../../components/ui/data-table";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { PowerCircle } from "lucide-react";
import { apiFetch } from "../../../../../actions/apiHandler";



export const DepreciationGroupCard = ({ depreciationGroup }: { depreciationGroup: GetCompanyDepreciationGroupResponseType }) => {
console.log("depreciationGroup", depreciationGroup  )
const [selectedPeriod, setSelectedPeriod] = useState<number>(0);
const [fetchingDepreciation, setFetchingDepreciation] = useState<boolean>(false);

const [_transformedData, _setTransformedData] = useState<
AssetDepreciationHistoryTableTypes[]
>([]);


async function fetchFutureDepreciation(categoryId:string){
  toast.info("Fetching depreciation history...");
  setFetchingDepreciation(true);
  const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}Depreciation/FutureDepreciationPerCategory/${categoryId}/${selectedPeriod}`
  //   , {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   }
  // }
);

  if (response) {
    const res = await response.json();
    const newTransformedData = res?.map((depHistory:any) => ({
      ...depHistory,
    })) as AssetDepreciationHistoryTableTypes[];
    _setTransformedData(newTransformedData);
    
   
  } else {
    
  }

  setFetchingDepreciation(false);
}

async function fetchHistoriceDepreciation(categoryId:string){
  toast.info("Fetching depreciation history...");
  setFetchingDepreciation(true);
  const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}Depreciation/HistoricDepreciationPerCategory/${categoryId}/${selectedPeriod}`
  //   , {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   }
  // }
);

  if (response) {
    const res = await response.json();
    const newTransformedData = res?.map((depHistory:any) => ({
      ...depHistory,

    })) as AssetDepreciationHistoryTableTypes[];
    _setTransformedData(newTransformedData);
    
   
  } else {
    
  }

  setFetchingDepreciation(false);
}
const tableRef = useRef(null);
const _depreciationGroup= depreciationGroup as any;
  return (
    <Card className="flex flex-col gap-2 pb-2">
     
      <CardHeader className="flex flex-col gap-2 pb-0">
        <CardTitle>
          <Badge variant="outline" className={`bg-green-100 text-green-700 mr-2`}>
          Active   
          </Badge> 
          {_depreciationGroup.depName}    
          
        </CardTitle>
        <CardDescription>Category: {_depreciationGroup?.categoryId } 
                  <br/>   
        <small>Next depreciation run: 30 June 2024</small></CardDescription>
    
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="flex flex-col gap-6 pt-2 pb-4">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
        {_depreciationGroup.type==0?"Write off period" : _depreciationGroup.type==1?"Depreciation amount (per year)":_depreciationGroup.type==2?"Useful life (units)":"" }     
          </Label>
          {/* {depreciationGroup.isMoney ? ( */}
            <p>{_depreciationGroup.depAmount} {_depreciationGroup.type==0?" years": _depreciationGroup.type=="1"?"%": _depreciationGroup.type=="2"?" units":""}</p>
          {/* ) : (
            <p>{formatToPercentage(depreciationGroup.depAmount) ?? "---"}</p>
          )} */}
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="contactNumber" className="text-xs text-foreground uppercase tracking-wider">
            Asset Category (Sage)
          </Label>
          <p>{_depreciationGroup?.categoryId }</p>
        </span>
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="contactNumber" className="text-xs text-foreground uppercase tracking-wider">
           Depreciation Type 
          </Label>
          <p>{_depreciationGroup?.type==0?"Straight Line": _depreciationGroup?.type==1?"Reducing Balance":"Usage" }</p>
        </span>
        <div className="grid w-full items-center grid-cols-2 gap-4">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="dateCreated" className="text-xs text-foreground uppercase tracking-wider">
           Acc.  Depreciation Journal
          </Label>
          <p>{_depreciationGroup.sageAccumilatedDepreciationJournalCode}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="dateCreated" className="text-xs text-foreground uppercase tracking-wider">
            Depreciation Journal
          </Label>
          <p>{_depreciationGroup.sageDepreciationJournalCode}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="dateModified" className="text-xs text-foreground uppercase tracking-wider">
          Disposal Journal
          </Label>
          <p>{_depreciationGroup.sageDisposalJournalCode}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
           Revaluation Journal
          </Label>
          <p>{_depreciationGroup.sageRevaluationJournalCode}</p>
        </span>
</div>
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="creatingUser" className="text-xs text-foreground uppercase tracking-wider">
            Creating User
          </Label>
          <p>{_depreciationGroup.creatingUser ?? "---"}</p>
        </span>
        <Dialog>
      <DialogTrigger asChild className="grow">
        <Button variant={"outline"} className="text-primary w-full">
         View Depreciation
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[1000px] w-full">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
             {_depreciationGroup.depName} Depreciation
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
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
    <SelectTrigger style={{width: "30%", float:"left"}} >
      <SelectValue placeholder="Period"  />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Period</SelectLabel>
        <SelectItem  key={0} value={"0"}>
           1 month
          </SelectItem>
          <SelectItem  key={0} value={"1"}>
           3 months
          </SelectItem>
        <SelectItem  key={0} value={"2"}>
            6 months
          </SelectItem>
    
          <SelectItem key={1} value={"3"}>
            12 months
          </SelectItem>
    
          <SelectItem key={2} value={"4"}>
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
            <p className="mx-auto text-center" style={{ width:"50%", float: "left", marginLeft: "5%"}}>

              Select a depreciation period and then click one of the buttons below to view historic or projected depreciation for this depreciation group.
            </p>
          </DialogDescription>
      
            
          {_transformedData.length > 0 && (
          <DataTable
            columns={assetDepreciationHistoryColumns}
            data={_transformedData}
            enablePagination={true}
            pageSize={10}
          />
        )}
      

  <div className="grid w-full items-center grid-cols-2 gap-4">
    <div>
        <Button
          variant={"outline"}
           disabled={fetchingDepreciation}
          className="text-primary w-full"
          onClick={() => fetchHistoriceDepreciation(_depreciationGroup?.categoryId)}
        >
           Depreciation History
        </Button>
      </div>
      <div>
        
        <Button
          variant={"outline"}
          // disabled={transformedData.length > 0 || status === "executing"}
          className="text-primary  w-full " 
           onClick={() => fetchFutureDepreciation(_depreciationGroup?.categoryId)}
          // onClick={() => execute({ assetid: asset.id })}
        >
           Projected Depreciation
        </Button> 
      </div>
        </div>
      </DialogContent>
    </Dialog>

      </CardContent>

      {/* <Separator className="my-2" /> */}
    </Card>
  );
};
