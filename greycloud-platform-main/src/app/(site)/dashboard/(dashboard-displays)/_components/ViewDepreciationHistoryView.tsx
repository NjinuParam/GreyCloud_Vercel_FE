
"use client";
import React, { useEffect, useState } from "react";
import {

  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";


import { getGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { getAllAssetDepreciationHistory } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { DataTable } from "@/components/ui/data-table";
import { getIronSessionData } from "@/lib/auth/auth";
import { AssetDepreciationHistoryTableTypes, assetDepreciationHistoryColumns } from "../../_components/grey-cloud-admin/DataTableColumns";
import { getSageOneCompanyAssets } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { CheckCircle, FileSpreadsheet, FileWarning, FileWarningIcon, LucideMessageSquareWarning, MailWarning, PowerCircle, Timer, UploadCloud } from "lucide-react";
import { Badge } from "../../../../../components/ui/badge";
import { getAllCompanyDepreciationGroups } from "../../../../actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { toast } from "sonner";
import { useExcelDownloder } from 'react-xls';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../../../../../components/ui/label";
import moment from "moment";
import { debug } from "node:console";
import { Button } from "../../../../../components/ui/button";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { FormLabel } from "../../../../../components/ui/form";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";


export default function ViewDepreciationHistoryView() {

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [depreciationHistoryAll, setDepreciationHistoryAll] = useState<any>();

  const [assets, setAssets] = useState<any>();
  const [myCompany, setMyCompany] = useState<any>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [transformedData, setTransformedData] = useState<any>();
  const [auditData, setAuditData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any>();
  const [summaryData, setSummaryData] = useState<any>();
  const [canDepr, setCanDepreciate] = useState<any[]>([]);

  const [audit, setAudit] = useState<any[]>([]);
  const { ExcelDownloder, Type } = useExcelDownloder();


  useEffect(() => {

    const session = getIronSessionData().then((comp: any) => {
      if (!comp.isLoggedIn) {
        return null;
      }
      const _myCompany = comp.companyProfile.companiesList?.find((company: any) => company.companyId === comp.companyProfile.loggedInCompanyId);
      setMyCompany(_myCompany)

      fetchAudit(Number(_myCompany?.sageCompanyId));

      getAllAssetDepreciationHistory({ sageCompanyId: Number(_myCompany?.sageCompanyId) }).then((depreHistoryFull: any) => {

        const depreHistory = depreHistoryFull.data.data;
        const summary = depreHistoryFull.data.summary;
        const audit = depreHistoryFull.data.audit.filter((x:any)=>x.posted==true);

        const full = { fullExport: depreHistory, summary: summary, audit: audit };


        setSummaryData(full);

        setDepreciationHistoryAll(depreHistory)
        getSageOneCompanyAssets({ SageCompanyId: Number(_myCompany?.sageCompanyId) }).then((_assets: any) => {

          setAssets(_assets)

          getAllCompanyDepreciationGroups({}).then((depreciationGroups: any) => {

            let _transformedData = depreHistory?.map((depHistory: any) => {
              const asset = _assets.data?.find((a: any) => a.code === depHistory.assetId);
              const depGroup = depreciationGroups.data?.find((dg: any) => dg.depGroupId === depHistory.depGroupId);

              return {
                ...depHistory,
                code: asset?.code,
                assetName: asset ? asset.description : "Unknown Asset",
                companyName: myCompany?.companyName,
                purchasePrice: asset?.purchasePrice,
                residual: asset?.residual ? asset.residual == 0 ? 1 : asset.residual : 1,
                depGroupName: `${depGroup?.depName}`,
                totalDepreciation: depHistory.totalDepreciation,
                depreciationThisYear: depHistory?.depreciationThisYear,
                depreciationThisMonth: depHistory?.depreciationThisMonth,
                depGroupDetails: `${depGroup.type == 0 ? " Straight Line" : depGroup.type == 1 ? "Reducing Balance" : " Usage"} (${depGroup?.depAmount}${depGroup.type == 0 ? " years write off" : depGroup.type == 1 ? "% per year" : " units"})`
              };
            }) as AssetDepreciationHistoryTableTypes[];


            setTransformedData(_transformedData);
            filteredData?.data == undefined && setFilteredData(_transformedData)

          });
        });


      });



    });

  }, []);




  async function canDepreciate(companyId: number) {
    toast.info("Fetching depreciation history...");

    const response = await fetch(`${apiUrl}Depreciation/CanDepreciate/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response) {

      const res = await response.json();
      setCanDepreciate(res);

    } else {

    }
  }

  function filterByName(name: string) {
    if (name != "") {
      setFilteredData(transformedData?.filter((data: any) => data.assetName.toLowerCase().includes(name.toLowerCase())));
    } else {
      setFilteredData(transformedData);
    }

  }

  function filterByDate(start: string, end: string) {

    if (start != "" && end != "") {

      var startDate = new Date(start);
      var endDate = new Date(end);

      setFilteredData(transformedData?.filter((data: any) => new Date(data.createdDate) >= startDate && new Date(data.createdDate) <= endDate));
    }

  }

  function changeStartDate(date: string) {
    setStartDate(date)
    filterByDate(date, endDate);
  }

  function changeEndDate(date: string) {
    setStartDate(date)
    filterByDate(startDate, date);
  }

  async function depreciationRun() {
    toast.info("Processing...");
    // setFetchingDepreciation(true);
    const response = await fetch(`${apiUrl}Depreciation/DepreciationRun`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (response) {
      toast.success(`Complete!`, {
        description: "The depreciation run completed succesfully.",
      });
      const res = await response.json();
      const newTransformedData = res?.map((depHistory: any) => ({
        ...depHistory,
        companyName: "company",
      })) as AssetDepreciationHistoryTableTypes[];
      // _setTransformedData(newTransformedData);


    } else {
      toast.error("Depreciation run failed", {
        description: "Please try again.",
      });
    }

    // setFetchingDepreciation(false);
  }

  async function fetchAudit(companyId: any) {
    // setFetchingDepreciation(true);
debugger;
    const response = await fetch(`${apiUrl}Depreciation/GetSageAudit/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
    if (response) {

      const res = await response.json();
      debugger;
      setAuditData(res);
      //   const res = await response.json();
      //   const newTransformedData = res?.map((depHistory: any) => ({
      //     ...depHistory,
      //     companyName: "company",
      //   })) as AssetDepreciationHistoryTableTypes[];
      //   // _setTransformedData(newTransformedData);


      // } else {
      //   toast.error("Depreciation run failed", {
      //     description: "Please try again.",
      //   });
    }

    // setFetchingDepreciation(false);
  }

  function nextRun() {
    var a = moment().endOf('month');
    var b = moment();

    return a.diff(b, 'days');
  }

  useEffect(() => {

    getIronSessionData().then(comp=>{
    
      const compId = comp?.companyProfile?.loggedInCompanyId;

      const com = comp?.companyProfile?.companiesList?.find((x:any)=>{x.companyId ==compId})?.sageCompanyId
      debugger;
      canDepreciate(com??14999);
    });

    

  }, []);



  return (
    <div className="mx-auto min-w-full min-h-full">
      <div className="flex flex-col gap-4 p-4 w-full h-full">
        <h4 className="text-xl font-semibold text-muted-foreground">{`Depreciation History for ${myCompany?.companyName ?? "Company."}`}</h4>
        <div className="grid grid-cols-2 gap-2 justify-center mb-4">
          <div>
            <small>Search by asset name</small><br />
            <input style={{ fontSize: "14px" }} onChange={(e) => filterByName(e.target.value)} type="text" placeholder="Search asset name" className="w-1/2 p-1 border border-gray-300 rounded-md" />
          </div>
          <div>
            {/* <label>Search by date</label><br/> */}
            <div className="grid grid-cols-2 gap-1  mb-4">
              <div><small>Start</small><br />
                <input type="date" style={{ fontSize: "14px" }} placeholder="Search by date" className="w-2/3 p-1 border border-gray-300 rounded-md" onChange={(e) => { changeStartDate(e.target.value) }} />
              </div>
              <div><small>End</small><br />
                <input type="date" style={{ fontSize: "14px" }} placeholder="Search by date" onChange={(e) => { changeEndDate(e.target.value) }} className="w-2/3 p-1 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>

        </div>
        <div className="grid grid-cols-4 gap-1  mb-4">

          <div>


            {filteredData?.length > 0 &&
              <ExcelDownloder
                data={summaryData}
                filename={`DepreciationExport_${new Date().toDateString()}`}
                type={Type.Button} // or type={'button'}
              >
                <a style={{ cursor: "pointer" }}>
                  <FileSpreadsheet style={{ float: "left" }} /> <small>Export spreadsheet</small>
                </a>
              </ExcelDownloder>

            }


          </div>



          <a >
            <Badge style={{ padding: "2%" }} variant="outline" className={`bg-green-100 text-green-700 mr-2`}>
              <CheckCircle size={16} style={{ paddingRight: "1%" }} /> <small> Last run: --</small>
            </Badge>

            <Badge style={{ padding: "2%" }} variant="outline" className={`bg-orange-100 text-orange-700 mr-2`}>
              <Timer size={16} style={{ paddingRight: "1%" }} /> <small> Next run: {nextRun()} days</small>
            </Badge> </a>
          {/* <Badge  style={{padding:"2%"}}  variant="outline" className={`bg-green-100 text-green-700 mr-2`}>
          <CheckCircle size={16} style={{paddingRight:"1%"}} />  Next run: in 21 days   
          </Badge>  */}
          <div></div>
          <a style={{ cursor: canDepr.length == 0 ? "pointer" : "none" }}>

            <Dialog>
              <DialogTrigger asChild className="grow">

                <Badge style={{ padding: "2%" }} variant="outline" className={`bg-orange-100 text-orange-700 mr-2`}>
                  <MailWarning style={{ paddingRight: "1%" }} size={16} />



                  {canDepr.length}
                  {/* assets need to be updated           */}
                </Badge>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>
                    Assets pending usage update
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-base">

                  {canDepr.map((x: any) => {
                    return <> <Label>Asset: {x}</Label> <br /></>
                  })}


                </DialogDescription>

                <DialogFooter>
                  <DialogClose asChild>

                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>


            <Dialog>
              <DialogTrigger asChild>

                <Badge style={{ padding: "2%" }} variant="outline" className={`bg-red-100 text-red-700 mr-2`}>






                  <PowerCircle size={16} style={{ paddingRight: "1%" }} /><small>  Trigger run</small>
                </Badge>

              </DialogTrigger>
              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle>Run Depreciation</DialogTitle>
                  <DialogDescription>
                    Please update the usage on the following assets to proceed
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {canDepr.map((x: any) => {
                    return <>
                      <div>


                        <label style={{ float: "left", width: "60%" }}>Asset: {x}</label>
                        <input style={{ fontSize: "14px", float: "left", width: "40%" }} type="text" placeholder="0" className="w-1/2 p-1 border border-gray-300 rounded-md" />
                      </div>
                    </>
                  })}
                </div>
                <label className="text-muted-foreground"> <Checkbox id="pushtosage" checked={false} /> Push journals to SAGE? </label>

                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => { depreciationRun() }}
                  >
                    Run
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>








            <Dialog>
              <DialogTrigger asChild>

                <Badge style={{ padding: "2%" }} variant="outline" className={`bg-green-100 text-green-700 mr-2`}>
                  <UploadCloud size={16} style={{ paddingRight: "1%" }} /><small>  Post journals</small>
                </Badge>

              </DialogTrigger>
              <DialogContent className="md:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Post journals</DialogTitle>
                  <DialogDescription>
                    Proceeding will post the following entries to SAGE
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead >Date</TableHead>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Depreciation amount</TableHead>
                        {/* <TableHead>Serial Number</TableHead>
                          <TableHead>Billing type</TableHead>
                          <TableHead>Price</TableHead> */}
                      </TableRow>

                    </TableHeader>
                    <TableBody>
                      {auditData.filter(x=>x.posted==false)?.map((x: any) => (
                        <TableRow>
                          <TableCell>{moment(x.createdDate).format('DD/MM/YYYY')}</TableCell>
                          <TableCell>{x.categoryName}</TableCell>
                          <TableCell>
                            R{x.totalCategoryDepreciation}.00</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>



                </div>
                {/* <label className="text-muted-foreground"> <Checkbox id="pushtosage" checked={false} /> Push journals to SAGE? </label> */}

                <DialogFooter>
                  <Button
                  className="w-full"
                    type="submit"
                    onClick={() => { depreciationRun() }}
                  >
                    Push to Sage Journals
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>








          </a>

        </div>
        <DataTable columns={assetDepreciationHistoryColumns} data={filteredData ?? transformedData ?? []} />
      </div>
    </div>
  );
}
