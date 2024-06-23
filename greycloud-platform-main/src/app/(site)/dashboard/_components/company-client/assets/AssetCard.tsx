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

 export default function AssetCard({ asset, depreciationGroups, sageCompanyId,updateUsage, updateAddress}: UpdateSageOneAssetFormProps){
  let session ={}as any;
  useEffect(() => {
    session = getIronSessionData();

  })
 
  async function updateLocation(){
    if(updateAddress!==undefined){
      var res = await  updateAddress(asset?.id, _address);
    }
  
    debugger;
    if(res !==""){ setNewAddress(res); }
  }
  

  // if (!session.isLoggedIn) {
  //   return null;
  // }


  const [_address, _setAddress] = useState< string>("");
  const [newAddress, setNewAddress] = useState< string>("");
  const [_usage, _setUsage] = useState< number>(asset.usage??0);


  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="pb-0 flex flex-col gap-2">
        <CardTitle>{asset.description}</CardTitle>
        <CardDescription>Asset ID: {asset.id}</CardDescription>
      </CardHeader>

      <Separator className="my-2" />
     
      <CardContent className="flex flex-col gap-5 py-2">
      <div className="grid w-full items-center grid-cols-3 gap-4">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
            Category Description
          </Label>
          <p>{asset.category?.description ?? "---"}</p>
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
          <p>{formatDate(asset.datePurchased.toString())}</p>
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
           Recoverable amount
          </Label>
          <p>{"---"}</p>
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
          <p>{asset?.billingType?.amount==0? "None": asset?.billingType?.type==0? `Daily (R${asset?.billingType?.amount})` : asset?.billingType?.type==1?"Usage": "---"}</p>
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
            <Label style={{marginTop:"10px"}}>Last location: {newAddress!=""? newAddress :asset.locName}</Label>
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
          <button className="text-sm text-blue-500 ml-2"><small>Update</small></button>
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
          <Input
            style={{marginTop:"10px"}}
            id="name"
            placeholder="New usage (units)"
            value={_usage}
          //  min={asset?.usage}
            type="number"
            onChange={(e:any) => {
            
              // updateUsage(asset.id, e.target.value);
              debugger;
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


         />}
      </CardFooter>
    </Card>
  );
};
// export default AssetCard;