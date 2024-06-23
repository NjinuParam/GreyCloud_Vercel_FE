
"use client";
import React, { useEffect, useState } from "react";
import { getGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { getAllAssetDepreciationHistory } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { DataTable } from "@/components/ui/data-table";
import { getIronSessionData } from "@/lib/auth/auth";
import { AssetDepreciationHistoryTableTypes, assetDepreciationHistoryColumns } from "../../_components/grey-cloud-admin/DataTableColumns";
import { getSageOneCompanyAssets } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { CheckCircle, FileSpreadsheet, PowerCircle } from "lucide-react";
import { Badge } from "../../../../../components/ui/badge";
import { getAllCompanyDepreciationGroups } from "../../../../actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { toast } from "sonner";
import { useExcelDownloder } from 'react-xls';

export default function ViewDepreciationHistoryView() {

  const [depreciationHistoryAll, setDepreciationHistoryAll] = useState<any>();
  
  const [assets, setAssets] = useState<any>();
  const [myCompany, setMyCompany] = useState<any>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  
  const [transformedData, setTransformedData] = useState<any>();
  const [filteredData, setFilteredData] = useState<any>();
  const { ExcelDownloder, Type } = useExcelDownloder();



  // async function fetchFutureDepreciation(categoryId:string){

  //   // setFetchingDepreciation(true);
  //   const response = await fetch(`https://grey-cloud-be.azurewebsites.net/Depreciation/FutureDepreciationPerCategory/${categoryId}/${selectedPeriod}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     }
  //   });
  
  //   if (response) {
  //     const res = await response.json();
  //     const newTransformedData = res?.map((depHistory:any) => ({
  //       ...depHistory,
  //       companyName: "company",
  //     })) as AssetDepreciationHistoryTableTypes[];
  //     // _setTransformedData(newTransformedData);
    
     
  //   } else {
  //   }
  
  //   // setFetchingDepreciation(false);
  // }
  
  useEffect(() => {

  const session =  getIronSessionData().then((comp: any) => {
    if (!comp.isLoggedIn) {
      return null;
    }
    const _myCompany = comp.companyProfile.companiesList?.find((company:any) => company.companyId === comp.companyProfile.loggedInCompanyId);
    setMyCompany(_myCompany)

    getAllAssetDepreciationHistory({ sageCompanyId: Number(_myCompany?.sageCompanyId) }).then((depreHistory: any) => {
   
      setDepreciationHistoryAll(depreHistory)
      getSageOneCompanyAssets({ SageCompanyId: Number(_myCompany?.sageCompanyId) }).then((_assets: any) => {
      
        setAssets(_assets)
        
    getAllCompanyDepreciationGroups({}).then((depreciationGroups: any) => {
  
    let _transformedData = depreHistory.data?.map((depHistory:any) => {
      const asset = _assets.data?.find((a:any) => a.id === depHistory.assetId);
      const depGroup = depreciationGroups.data?.find((dg:any) => dg.depGroupId === depHistory.depGroupId);
      debugger;
      return {
        ...depHistory,
        assetName: asset ? asset.description : "Unknown Asset",
        companyName: myCompany?.companyName,
        purchasePrice: asset?.purchasePrice,
        residual: asset?.residual? asset.residual==0?1:asset.residual:1,
        depGroupName: `${depGroup?.depName}`,
        totalDepreciation:depHistory.totalDepreciation,
        depreciationThisYear:depHistory?.depreciationThisYear,
        depreciationThisMonth:depHistory?.depreciationThisMonth,
        depGroupDetails:`${depGroup.type==0? " Straight Line": depGroup.type==1?"Reducing Balance":" Usage"} (${depGroup?.depAmount}${depGroup.type==0? " years write off": depGroup.type==1?"% per year":" units"})`
      };
    }) as AssetDepreciationHistoryTableTypes[];
  
    debugger;
    setTransformedData(_transformedData);
    filteredData?.data==undefined && setFilteredData(_transformedData)
      
      });
    });

    
    });
    
  

  });

}, []);
  


  function filterByName(name:string){
    if(name!=""){
      setFilteredData(transformedData?.filter((data:any) => data.assetName.toLowerCase().includes(name.toLowerCase())));
    }
    
  }

  function filterByDate(start:string, end:string){

    if(start!="" && end!=""){
      debugger;
      var startDate = new Date(start);
      var endDate = new Date(end);

      setFilteredData(transformedData?.filter((data:any) => new Date(data.createdDate) >= startDate && new Date(data.createdDate) <= endDate));
    }
    
  }

  function changeStartDate(date:string){
    setStartDate(date)
    filterByDate(date, endDate);
  }

 function changeEndDate(date:string){
  setStartDate(date)
  filterByDate(startDate, date);
  }

  async function depreciationRun(){
    toast.info("Processing...");
    // setFetchingDepreciation(true);
    const response = await fetch(`https://grey-cloud-be.azurewebsites.net/Depreciation/DepreciationRun`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
  debugger;
    if (response) {
      toast.success(`Complete!`, {
        description: "The depreciation run completed succesfully.",
      });
      const res = await response.json();
      const newTransformedData = res?.map((depHistory:any) => ({
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


  return (
    <div className="mx-auto min-w-full min-h-full">
      <div className="flex flex-col gap-4 p-4 w-full h-full">
        <h4 className="text-xl font-semibold text-muted-foreground">{`Depreciation History for ${myCompany?.companyName ?? "Company."}`}</h4>
        <div className="grid grid-cols-2 gap-2 justify-center mb-4">
          <div>
          <small>Search by asset name</small><br/>
          <input onChange={(e)=>filterByName(e.target.value)} type="text" placeholder="Search asset name" className="w-1/2 p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
          {/* <label>Search by date</label><br/> */}
          <div className="grid grid-cols-2 gap-1  mb-4">
          <div><small>Start</small><br/>
          <input type="date" placeholder="Search by date" className="w-2/3 p-2 border border-gray-300 rounded-md" onChange={(e)=>{changeStartDate(e.target.value)}} />
          </div>
          <div><small>End</small><br/>
          <input type="date" placeholder="Search by date" onChange={(e)=>{changeEndDate(e.target.value)}} className="w-2/3 p-2 border border-gray-300 rounded-md" />
          </div>
          </div>
          </div>
        
        </div>
        <div className="grid grid-cols-4 gap-1  mb-4">
       
        <div>
          {filteredData?.length &&
      <ExcelDownloder
        data={{data:filteredData}}
        filename={`DepreciationExport_${new Date().toDateString()}`}
        type={Type.Button} // or type={'button'}
      >
        <a style={{cursor:"pointer"}}>
        <FileSpreadsheet style={{float:"left"}}/> <small>Export spreadsheet</small>
        </a>
      </ExcelDownloder>
}
    </div>
    <a  onClick={()=>{depreciationRun()}}>
      <Badge  style={{padding:"2%"}}  variant="outline" className={`bg-green-100 text-green-700 mr-2`}>
          <CheckCircle size={16} style={{paddingRight:"1%"}} />  Last run: 2 days ago   
          </Badge> </a>
          <div></div>
        <a style={{cursor:"pointer"}} onClick={()=>{depreciationRun()}}>
      <Badge  style={{padding:"2%"}}  variant="outline" className={`bg-red-100 text-red-700 mr-2`}>
          <PowerCircle size={16} style={{paddingRight:"1%"}} />  Run depreciation job   
          </Badge> </a>
         
          </div>
        <DataTable columns={assetDepreciationHistoryColumns} data={filteredData ??  transformedData??[]} />
      </div>
    </div>
  );
}
