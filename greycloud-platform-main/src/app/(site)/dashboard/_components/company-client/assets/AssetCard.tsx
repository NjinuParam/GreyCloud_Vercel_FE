"use client";
import React, { useEffect, useState } from "react";


import { Label } from "@/components/ui/label";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatToRand } from "@/lib/utils";
import { AssetCardFooter } from "./AssetCardFooter";
import { UpdateSageOneAssetFormProps } from "../../../(dashboard-displays)/company-user-admin/add-asset/_components/UpdateSageOneAssetForm";
import { getIronSessionData } from "@/lib/auth/auth";
import { Input } from "../../../../../../components/ui/input";
import AutoComplete from "react-google-autocomplete";

import { Button } from "@/components/ui/button";
import moment from "moment";
import { apiFetch } from "../../../../../actions/apiHandler";

 export default function AssetCard({ asset, depreciationGroups, sageCompanyId,updateUsage, updateAddress, closeFn, onAssetUpdated}: UpdateSageOneAssetFormProps){
  let session ={}as any;
  let _asset= asset as any;
  useEffect(() => {
    session = getIronSessionData();

  })
 
  async function updateLocation(){
    if(updateAddress!==undefined){
      
      var res = await  updateAddress(asset?.id, _address);
    }
  
    closeFn!=undefined && closeFn();
     setNewAddress(_address); 
  }
  

  // if (!session.isLoggedIn) {
  //   return null;
  // }


  const [_address, _setAddress] = useState< string>("");
  const [newAddress, setNewAddress] = useState< string>(asset?.locName??"");
  const [_usage, _setUsage] = useState< number>(asset?.usage??0);
  const [prevUsage, setPrevUsage] = useState<any[]>([]);

  const billingText = (() => {
    const bt = asset?.billingType as any;
    if (!bt) return "--";
    const type = Number(bt.type ?? -1);
    const amount = Number(bt.amount ?? 0);
    const usageRate = Number(bt.usageRate ?? 0);

    if (type === 0) return `Daily (${formatToRand(amount)})`;
    if (type === 1) return `Once off (${formatToRand(amount)})`;
    if (type === 2) return `Once off + Usage`;
    if (type === 3) {
      // For usage, prefer amount if present, otherwise fall back to usageRate
      const display = amount && amount > 0 ? amount : (usageRate && usageRate > 0 ? usageRate : null);
      return display ? `Usage (${formatToRand(display)}) per unit` : `Usage`;
    }

    // If amount is zero and no type matched, show None
    if (amount === 0) return "None";
    return amount ? formatToRand(amount) : "--";
  })();

  async function fetchUsage(assetId:string){
    try {
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}SageOneAsset/Asset/GetUsage/${assetId}`);
      if (response) {
        const res = await response.json();
        setPrevUsage(res);
      }
    } catch (e) {
      console.error("Failed to fetch usage", e);
    }
  }

  // Sync local state when asset prop changes so modal reflects updates from parent
  useEffect(() => {
    setNewAddress(asset?.locName ?? "");
    _setUsage(asset?.usage ?? 0);
    // Fetch latest usage history
    if (asset?.id) fetchUsage(asset.id);
  }, [asset]);

   
  return (
    <Card style={{width:"97%"}} className="flex flex-col gap-2">
      <CardHeader className="pb-0 flex flex-col gap-2">
        <CardTitle>{asset.description}</CardTitle>
        <CardDescription>Asset ID: {asset.code}</CardDescription>
      </CardHeader>

      <Separator className="my-2" />
     
      <CardContent className="flex flex-col gap-5 py-2">
      <div className="grid w-full items-center grid-cols-3 gap-4">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
            Category Description
          </Label>
          <p>{_asset?.catDescription ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
            Serial Number
          </Label>
          <p>{asset.serialNumber ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="contactNumber" className="text-xs text-foreground uppercase tracking-wider">
            Bought From
          </Label>
          <p>{asset.boughtFrom ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="dateCreated" className="text-xs text-foreground uppercase tracking-wider">
            Date Purchased
          </Label>
          <p>{moment(asset.datePurchased).format("MMM Do YYYY")}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="contactEmail" className="text-xs text-foreground uppercase tracking-wider">
            Purchase Price
          </Label>
          <p>{formatToRand(asset.purchasePrice) ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="apiKey" className="text-xs text-foreground uppercase tracking-wider">
            Current Value
          </Label>
          <p>{formatToRand(asset.currentValue) ?? "---"}</p>
        </span> 

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="apiKey" className="text-xs text-foreground uppercase tracking-wider">
           Residual amount
          </Label>
          <p>{formatToRand(asset.residual)}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="sageCompanyId" className="text-xs text-foreground uppercase tracking-wider">
            Replacement Value
          </Label>
          <p>{formatToRand(asset.replacementValue) ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
           Billing Type
          </Label>
          <p>{billingText}</p>
        </span>
  <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
           Last Location 
           <Dialog>
        <DialogTrigger asChild className="grow">
          <button className="text-sm text-blue-500 ml-2"><small>Update</small></button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              <span className="text-muted-foreground">Update location</span>{" "}
              {asset.description}?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base">
            <Label style={{marginTop:"10px"}}>Last location: {newAddress}</Label>
            <AutoComplete
              style={{zIndex:99999999}}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" 
              //  defaultValue={a.postalAddress01??""}
                  apiKey={"AIzaSyDvgazKlMlD-yi7OHEmee_dRMySNxvRmlI"}
                  onPlaceSelected={(place:any) => {
                    _setAddress(`${place?.formatted_address}(${place?.geometry?.location?.lat()},${place?.geometry?.location?.lng()})`);
                  }}
                  options={{
                    types: ["geocode", "establishment"],//Must add street addresses not just cities
                    componentRestrictions: { country: "za" },
                  }}  
                />
                
          </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
            <Button onClick={()=>{ updateLocation();
         
              
              }
               
               } variant={"outline"}>Update location</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          </Label>
          <p>{asset.locName} </p>
          
        </span>
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
          Last usage            
      <Dialog>
        <DialogTrigger asChild className="grow">
          <button className="text-sm text-blue-500 ml-2"><small>Update / View</small></button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              <span className="text-muted-foreground">Update usage</span>{" "}
              {asset.description}?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base">
            <Label style={{marginTop:"10px"}}>Last usage: {asset?.usage} units</Label>
               {prevUsage.length==0 &&<button className="text-sm text-blue-500 ml-2" onClick={()=>{fetchUsage(asset.id)}}><small>Fetch all usage</small></button>}
            {/* <Label>Previous Usage History</Label> */}
            <div></div>
         <br/>
          {prevUsage.map((x:any)=>{return (
            <div className="grid w-full  grid-cols-2 gap-4">
            
              <Label><small>{moment(x.dateCreated).format("MMM Do YYYY")} : </small></Label>
              <Label><small>{x.usage} units </small></Label>
             <br/>
          </div>
          
            );
            })}


              
  <div></div>
 <Label>New Usage</Label>
          <Input
            style={{marginTop:"10px"}}
            id="name"
            placeholder="New usage (units)"
            value={_usage}
          //  min={asset?.usage}
            type="number"
            onChange={(e:any) => {
            
              // updateUsage(asset.id, e.target.value);
              
               _setUsage(parseInt(e.target.value));
            }}
              />
          </DialogDescription>

    
 
          <DialogFooter>
            <DialogClose asChild>
            <Button type="submit" onClick={()=>{updateUsage!=undefined && updateUsage(asset.id, _usage)}} variant={"outline"}>Update usage</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

          </Label>
          <p>{asset.usage==0?"--":asset.usage} units
          {/* <small style={{color:"blue" }}>update usage</small> */}

          
          </p>
        </span>
        </div>
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="pb-4">
        {<AssetCardFooter 
        user={session} 
        asset={asset} 
        depreciationGroups={depreciationGroups} 
        sageCompanyId={sageCompanyId}
        onAssetUpdated={onAssetUpdated}


         />}
      </CardFooter>
    </Card>
  );
};
// export default AssetCard;