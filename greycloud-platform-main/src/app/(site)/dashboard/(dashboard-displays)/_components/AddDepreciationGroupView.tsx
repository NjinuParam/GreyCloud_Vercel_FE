"use client";
import React, { useEffect, useState } from "react";

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

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getIronSessionData } from "@/lib/auth/auth";
import { toast } from "sonner";
import { SelectGroup } from "@radix-ui/react-select";
import SageOneAssetCategorySaveForm from "../company-user-admin/add-asset-category/_components/SageOneSaveAssetCategory";
import Select from 'react-select';

function AddDepreciationGroup() {
  useEffect(() => {
    getIronSessionData().then((comp: any) => {
      console.log("USER", comp);
      let currentCompanyId = comp.companyId;
      const sageCompanyId = comp.companyProfile.companiesList.find(
        (x:any) => x.companyId == comp.companyId
      ).sageCompanyId;
      setCompanyId(sageCompanyId);

      let name = comp.companyProfile.companiesList.find(
        (x:any) => x.companyId == currentCompanyId
      )?.companyName;

      let sageId = comp.companyProfile.companiesList.find(
        (x:any) => x.companyId == currentCompanyId
      )?.sageCompanyId;

      setUserId(comp.email);

      fetch(`${apiUrl}SageOneAsset/AssetCategory/Get?Companyid=${sageId}`)
        .then((res) => res.json().then((data) => setCategories(data.results)))
        .catch((e) => console.log(e));

      setCompanyName(name);
    });
  }, []);

  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState("0");
  const [companyName, setCompanyName] = useState("");
  const [userId, setUserId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [writeOffPeriod, setWriteOffPeriod] = useState(0);
  const [depName, setDepName] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [periodType, setPeriodType] = useState("0");
  const [type, setType] = useState("0");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [
    sageAccumilatedDepreciationJournalCode,
    setSageAccumilatedDepreciationJournalCode,
  ] = useState("");
  const [sageDepreciationJournalCode, setSageDepreciationJournalCode] =
    useState("");
  const [sageDisposalJournalCode, setSageDisposalJournalCode] = useState("");
  const [sageRevaluationJournalCode, setSageRevaluationJournalCode] =
    useState("");

  async function save() {
    let obj = {
      companyId:`${companyId}`,  
      categoryId: parseInt(category),
      depAmount:writeOffPeriod,// write off period
      depName,
      period: parseInt(periodType), // km/hours/years
      type: parseInt(type), //depreciation type
      creatingUser: userId,
      isMoney: true,
      active: true,
      sageAccumilatedDepreciationJournalCode,
      sageDepreciationJournalCode,
      sageDisposalJournalCode,
      sageRevaluationJournalCode     
    };

    

    try {
      await fetch(`${apiUrl}Depreciation/Add-Company-Depreciation-Group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      toast.success("Depreciation saved!");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function fetchAccounts(assetId:string){
    toast.info("Fetching depreciation history...");
    
    const response = await fetch(`https://grey-cloud-uat.azurewebsites.net/GreyCloud/Admin/Get-Accounts/14999`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
  
    if (response) {
      const res = await response.json();
      var data = res.results;
      
      setAccounts(data);
      
     
    } else {
      
    }
  }

  useEffect(() => { 

    fetchAccounts("14999");
   }, []);

  
   const customStyle = {
    option: (base:any) => ({
      ...base,
      backgroundColor: "white",
      font:"black !important",
      zIndex:999999999999999
    }),
     menuPortal: (base:any) => ({ ...base, zIndex: 999999999999999999 }) 
  }

  interface IOption {
    label:string, 
    value: string;
  }
 

   const p = accounts.map((x:any)=>{return {value:x.id.toString() as string, label:x.name as string} as IOption});
  const dep = categories.map(x=>{return {value:x.id as string, label:x.description as string} as IOption});


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Depreciation Group</CardTitle>
        <CardDescription>
          Add depreciation group for {companyName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid grid-cols-2 gap-4">
        
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                placeholder="Name"
                value={depName}
                onChange={(e:any) => setDepName(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
            <Label >Category
            <Dialog>
        <DialogTrigger asChild className="grow">
         
            <small style={{marginLeft:"5%", color:"blue"}}>Add new asset category</small>
        
        </DialogTrigger>
        <DialogContent className="md:max-w-[600px]">
        
        <SageOneAssetCategorySaveForm  />

        </DialogContent>
            </Dialog>
            </Label>
            
            <Select
                  styles={customStyle}
                  // defaultValue={categories.find(x=>x.id == category)?.description as string}
                  // value={categories.find(x=>x.id == category)?.description }
                  value = {
                    dep.filter(option => 
                       option.value == category )
                 }
                  onChange={(e:any)=>{
                    debugger;
                    const cat =  dep.filter(option => 
                      option.value == category )
                    debugger;
                    setCategory(cat[0]?.value?.toString());
                  }}
                  options={dep}
                />
            </div>
          
            <div className="flex flex-col space-y-1.5">
            <Label> Depreciation Type</Label>
          
               <Select
                  styles={customStyle}
                  defaultValue={type=="0"?"Straight Line":type=="1"?"Reducing Amount":"Usage" }
                  onChange={(e:any)=>{
                    setType(e.value)
                  }}
                  options={[{value:"0", label:"Straight Line"}, {value:"1", label:"Reducing Amount"}, {value:"2", label:"Usage"}] as IOption[]}
                />
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <br/>
              </div>
            <div className="flex flex-col space-y-1.5">
            { type=="0" &&<Label>Write off period</Label>}
            { type=="1" &&<Label>Amount (%)</Label>}
            { type=="2" &&<Label>Total Units </Label>}
              <Input
                placeholder={"0"}
                type="number"
                min={1}
                value={writeOffPeriod}
                onChange={(e:any) => setWriteOffPeriod(parseFloat(e.target.value))}
              />
            </div>
            <div className="flex flex-col space-y-1.5" style={{width:"30%"}}>
            <Label> <br/></Label>
                
                  <Label style={{marginTop:"20px"}}>
                   
                    { type=="0" &&  "Years" }  
                      { type=="1" && "Per Year" }
                      { type=="2" && "Units"}
                    </Label>
                </div>

        
            {type === "2" ? (
              <>
                {/* <div className="flex flex-col space-y-1.5">
                <Label> <br/></Labe
                l>
                  <Select onValueChange={(e) => setUsageType(e)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Usage Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Usage Type</SelectLabel>
                        <SelectItem value="0">KM</SelectItem>
                        <SelectItem value="1">Hours </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div> */}

                {/* <div className="flex flex-col space-y-1.5">
                  <Select onValueChange={(e) => setPeriod(e)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Period</SelectLabel>
                        <SelectItem value="0">Monthly</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div> */}
              </>
            ) : (
              <></>
            )}
        </div>
        {/* <CardHeader> */}
        
          <CardDescription className="mt-10 mb-5">
           Depreciation journal settings (Sage)
          </CardDescription>
        {/* </CardHeader> */}

        <div className="grid grid-cols-2 gap-4">
        
        <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">
                Sage Accumilated Depreciation Journal Code
              </Label>
             
                   <Select
                      styles={customStyle}
                      value = {
                        p.filter(option => 
                           option.value == sageAccumilatedDepreciationJournalCode )
                     }
                  onChange={(e:any)=>{debugger; setSageAccumilatedDepreciationJournalCode(e.value)}}
                  options={p}
                />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Sage Depreciation Journal Code</Label>
           
                <Select
                  styles={customStyle}
                  value = {
                    p.filter(option => 
                       option.value == sageDepreciationJournalCode )
                 }
                  onChange={(e:any)=>{debugger; setSageDepreciationJournalCode(e.value)}}
                  options={p}
                />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Sage Disposal Journal Code</Label>
             
                       <Select
                  styles={customStyle}
                  value = {
                    p.filter(option => 
                       option.value == sageDisposalJournalCode )
                 }
                  onChange={(e:any)=>{debugger; setSageDisposalJournalCode(e.value)}}
                  options={p}
                />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Sage Revaluation Journal Code</Label>
             
               {/* <Select value={sageRevaluationJournalCode}  onValueChange={(e) =>  { setSageRevaluationJournalCode(e)}}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                       
                        {
                          accounts.map((x:any) => (
                            <SelectItem key={x.id} value={`${x.id}`}>
                               {`${x.name} (${x.id})`} 
                            </SelectItem>
                          ))
                        }
                       
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}
                          <Select
                  styles={customStyle}
                  value = {
                    p.filter(option => 
                       option.value == sageRevaluationJournalCode )
                 }
                  onChange={(e:any)=>{debugger; setSageRevaluationJournalCode(e.value)}}
                  options={p}
                />
            </div>
      </div>

        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => save()}>Save</Button>
      </CardFooter>
      <br/><br/><br/><br/><br/><br/>
    </Card>
  );
}

export default AddDepreciationGroup;
