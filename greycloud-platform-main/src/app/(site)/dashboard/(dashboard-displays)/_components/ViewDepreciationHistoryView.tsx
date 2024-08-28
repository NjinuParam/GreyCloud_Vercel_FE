
"use client";
import React, { useEffect, useState } from "react";
import { getGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { getAllAssetDepreciationHistory } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { DataTable } from "@/components/ui/data-table";
import { getIronSessionData } from "@/lib/auth/auth";
import { AssetDepreciationHistoryTableTypes, assetDepreciationHistoryColumns } from "../../_components/grey-cloud-admin/DataTableColumns";
import { getSageOneCompanyAssets } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { CheckCircle, FileSpreadsheet, FileWarning, FileWarningIcon, LucideMessageSquareWarning, MailWarning, PowerCircle, Timer } from "lucide-react";
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


export default function ViewDepreciationHistoryView() {

  const [depreciationHistoryAll, setDepreciationHistoryAll] = useState<any>();

  const [assets, setAssets] = useState<any>();
  const [myCompany, setMyCompany] = useState<any>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [transformedData, setTransformedData] = useState<any>();
  const [filteredData, setFilteredData] = useState<any>();
  const [summaryData, setSummaryData] = useState<any>();
  const [canDepr, setCanDepreciate] = useState<any[]>([]);
  const { ExcelDownloder, Type } = useExcelDownloder();


  useEffect(() => {

    const session = getIronSessionData().then((comp: any) => {
      if (!comp.isLoggedIn) {
        return null;
      }
      const _myCompany = comp.companyProfile.companiesList?.find((company: any) => company.companyId === comp.companyProfile.loggedInCompanyId);
      setMyCompany(_myCompany)

      getAllAssetDepreciationHistory({ sageCompanyId: Number(_myCompany?.sageCompanyId) }).then((depreHistoryFull: any) => {

        const depreHistory = depreHistoryFull.data.data;
        const summary = depreHistoryFull.data.summary;

        const full = {fullExport: depreHistory, summary: summary};
        

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


  async function canDepreciate(assetId: number) {
    toast.info("Fetching depreciation history...");

    const response = await fetch(`https://grey-cloud-uat.azurewebsites.net/Depreciation/CanDepreciate/${assetId}`, {
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
    const response = await fetch(`https://grey-cloud-uat.azurewebsites.net/Depreciation/DepreciationRun`, {
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

  function nextRun() {
    var a = moment().endOf('month');
    var b = moment();

    return a.diff(b, 'days');
  }

  useEffect(() => {

    canDepreciate(14999);

  }, []);



  return (
    <div className="mx-auto min-w-full min-h-full">
      <div className="flex flex-col gap-4 p-4 w-full h-full">
        <h4 className="text-xl font-semibold text-muted-foreground">{`Depreciation History for ${myCompany?.companyName ?? "Company."}`}</h4>
        <div className="grid grid-cols-2 gap-2 justify-center mb-4">
          <div>
            <small>Search by asset name</small><br />
            <input onChange={(e) => filterByName(e.target.value)} type="text" placeholder="Search asset name" className="w-1/2 p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            {/* <label>Search by date</label><br/> */}
            <div className="grid grid-cols-2 gap-1  mb-4">
              <div><small>Start</small><br />
                <input type="date" placeholder="Search by date" className="w-2/3 p-2 border border-gray-300 rounded-md" onChange={(e) => { changeStartDate(e.target.value) }} />
              </div>
              <div><small>End</small><br />
                <input type="date" placeholder="Search by date" onChange={(e) => { changeEndDate(e.target.value) }} className="w-2/3 p-2 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>

        </div>
        <div className="grid grid-cols-4 gap-1  mb-4">

          <div>
            {filteredData?.length &&
              <ExcelDownloder
                data={ summaryData }
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
              <CheckCircle size={16} style={{ paddingRight: "1%" }} />  Last run: 5 hr ago
            </Badge>

            <Badge style={{ padding: "2%" }} variant="outline" className={`bg-orange-100 text-orange-700 mr-2`}>
              <Timer size={16} style={{ paddingRight: "1%" }} />  Next run: {nextRun()} days
            </Badge> </a>
          {/* <Badge  style={{padding:"2%"}}  variant="outline" className={`bg-green-100 text-green-700 mr-2`}>
          <CheckCircle size={16} style={{paddingRight:"1%"}} />  Next run: in 21 days   
          </Badge>  */}
          <div></div>
          <a onClick={() => { depreciationRun() }} style={{ cursor: canDepr.length == 0 ? "pointer" : "none" }}>

            <Dialog>
              <DialogTrigger asChild className="grow">

                <Badge style={{ padding: "2%" }} variant="outline" className={`bg-orange-100 text-orange-700 mr-2`}>
                  <MailWarning style={{ paddingRight: "1%" }} size={16} />



                  {canDepr.length} assets need to be updated          
                </Badge>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>
                    Assets pending usage update
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-base">
                  {/* <Label style={{marginTop:"10px"}}>Last location: {newAddress!=""? newAddress :asset.locName}</Label>
            <AutoComplete
              style={{zIndex:99999999}}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" 
              //  defaultValue={a.postalAddress01??""}
                  apiKey={"AIzaSyDsGw9PT-FBFk7DvGK46BpvEURMxcfJX5k"}
                  onPlaceSelected={(place:any) => {
                    _setAddress(`${place?.formatted_address}(${place?.geometry?.location?.lat()},${place?.geometry?.location?.lng()})`);
                  }}
                  options={{
                    types: ["geocode", "establishment"],//Must add street addresses not just cities
                    componentRestrictions: { country: "za" },
                  }}  
                /> */}

                  {canDepr.map((x: any) => {
                    return <> <Label>Asset: {x}</Label> <br /></>
                  })}


                </DialogDescription>

                <DialogFooter>
                  <DialogClose asChild>
                    {/* <Button onClick={()=>{ updateLocation();
         
              
              }
               
               } variant={"outline"}>Update location</Button> */}
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>





            <Badge style={{ padding: "2%" }} variant="outline" className={`bg-red-100 text-red-700 mr-2`}>
              <PowerCircle size={16} style={{ paddingRight: "1%" }} />  Trigger run
            </Badge>
          </a>

        </div>
        <DataTable columns={assetDepreciationHistoryColumns} data={filteredData ?? transformedData ?? []} />
      </div>
    </div>
  );
}
