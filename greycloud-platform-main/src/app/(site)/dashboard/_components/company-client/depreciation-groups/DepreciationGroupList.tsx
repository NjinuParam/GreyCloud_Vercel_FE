import React from "react";

import { getAllCompanyDepreciationGroups } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { DepreciationGroupCard } from "./DepreciationGroupCard";
import { DataTable } from "../../../../../../components/ui/data-table";
import { depreciationGroupColumns } from "../assets/assets-columns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../../components/ui/table";
import { Button } from "../../../../../../components/ui/button";
import { BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../../components/ui/dialog";

export const DepreciationGroupList = async () => {
  const { data: depreciationGroup } = await getAllCompanyDepreciationGroups({});

  

  return (
    <>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full h-full overflow-y-scroll">
        {depreciationGroup?.map((depreciation) => (
          <DepreciationGroupCard key={depreciation.depGroupId} depreciationGroup={depreciation} />
        ))}


      </div> */}
      <Table className="w-full h-full">
        <TableHeader>

          <TableRow key={""}>

            <TableHead key={""}>
              <small>   Name </small>
            </TableHead>

            <TableHead key={""}>
              <small>     Asset Category ID </small>
            </TableHead>
            <TableHead key={""}>
              <small>    Depreciation Type </small>
            </TableHead>

            <TableHead key={""}>
              <small>     Depreciation Type </small>
            </TableHead>
            <TableHead key={""}>
              <small>     Acc. Depreciation Journal </small>
            </TableHead>
            <TableHead key={""}>
              <small>     Depreciation Journal </small>
            </TableHead>
            <TableHead key={""}>
              <small>     Disposal Journal </small>
            </TableHead>
            <TableHead key={""}>
              <small>      Revaluation Journal </small>
            </TableHead>
            {/* <TableHead key={""}>
            <small>    Creating User </small>
            </TableHead> */}
            <TableHead key={""}>

            </TableHead>

          </TableRow>

        </TableHeader>
        <TableBody>
          {depreciationGroup?.map((depreciation:any) => (


            <TableRow key={""}>


              <TableCell key={""}>
                <small>  {depreciation.depName} </small>
              </TableCell>

              <TableCell key={""}>
                <small>  {depreciation?.categoryId} </small>
              </TableCell>

              <TableCell key={""}>
                <small> {depreciation.type == 0 ? "Write off period" : depreciation.type == 1 ? "Depreciation amount (per year)" : depreciation.type == 2 ? "Useful life (units)" : ""} :
                  {depreciation.depAmount} {depreciation.type == 0 ? " years" : depreciation.type == "1" ? "%" : depreciation.type == "2" ? " units" : ""}
                </small> </TableCell>


              <TableCell key={""}>
                <small>  {depreciation?.type == 0 ? "Straight Line" : depreciation?.type == 1 ? "Reducing Balance" : "Usage"}
                </small>
              </TableCell>

              <TableCell key={""}>
                <small>   {depreciation.sageAccumilatedDepreciationJournalCode} </small>
              </TableCell>

              <TableCell key={""}>
                <small>  {depreciation.sageDepreciationJournalCode} </small>
              </TableCell>

              <TableCell key={""}>
                <small>  {depreciation.sageDisposalJournalCode} </small>
              </TableCell>

              <TableCell key={""}>
                <small>  {depreciation.sageRevaluationJournalCode} </small>
              </TableCell>
              {/*               
              <TableCell key={""}>
              <small>   {depreciation.creatingUser.sub} </small>
              </TableCell> */}

              <TableCell key={""}>
                <Dialog>
                  <DialogTrigger asChild className="grow">
                    <Button variant={"outline"} className="text-primary w-full">
                      <BookOpen size="16" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[1000px] w-full">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-center">
                        {/* {_depreciationGroup.depName}  */}
                        Depreciation
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                      <p className="mx-auto text-center" style={{ width: "50%", float: "left", marginLeft: "5%" }}>

                        Select a depreciation period and then click one of the buttons below to view historic or projected depreciation for this depreciation group.
                      </p>
                    </DialogDescription>


                    {/* {_transformedData.length > 0 && (
          <DataTable
            columns={assetDepreciationHistoryColumns}
            data={_transformedData}
          />
        )} */}

                    <div className="grid w-full items-center grid-cols-2 gap-4">
                      <div>
                        {/* <Button
          variant={"outline"}
           disabled={fetchingDepreciation}
          className="text-primary w-full"
          onClick={() => fetchHistoriceDepreciation(_depreciationGroup?.categoryId)}
        >
           Depreciation History
        </Button> */}
                      </div>
                      <div>

                        {/* <Button
          variant={"outline"}
          // disabled={transformedData.length > 0 || status === "executing"}
          className="text-primary  w-full " 
           onClick={() => fetchFutureDepreciation(_depreciationGroup?.categoryId)}
          // onClick={() => execute({ assetid: asset.id })}
        >
           Projected Depreciation
        </Button>  */}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>


            </TableRow>
          ))}

        </TableBody>
      </Table>
    </>
  );
};
