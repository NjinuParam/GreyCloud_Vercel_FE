"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";
import AssetCard  from "./AssetCard";
import { EnrichedAssetType } from "./assets-columns";
import { useState } from "react";
import { toast } from "sonner";

export default function AssetsTableActions({ asset }: { asset: EnrichedAssetType }) {

  async function updateAsset(assetId:string, usage:string) {

toast.info("Updating asset...");

const response = await fetch(`https://grey-cloud-uat.azurewebsites.net/SageOneAsset/Asset/UpdateUsage/${assetId}/${usage}/14999`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  }
});

if (response) {
  
  toast.success(`Asset usage updated!`, {
    description: "The asset was updated successfully.",
  });
  // router.push("/dashboard/company-user/manage-assets");
} else {
  toast.error("Failed to update asset.", {
    description: "Please try again.",
  });
}


  }

  async function updateAddress(assetId:string, address:string) {
    toast.info("Updating asset...");

    var requests = {
      assetId: assetId,
      location: address,
      gps: "0,0"
    }
    const response = await fetch(`https://grey-cloud-uat.azurewebsites.net/SageOneAsset/Asset/UpdateLocation/${assetId}/14999`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requests)
    });
    

    if (response) {

      toast.success(`Asset location updated!`, {
        description: "The asset was updated successfully.",
      });

      return address;
      // router.push("/dashboard/company-user/manage-assets");
    } else {
      toast.error("Failed to update asset.", {
        description: "Please try again.",
      });
      return "";
    }
  }


  return (
    <div>
      <div className="flex gap-2">
        <Dialog>
          <DialogTrigger>
            <Button variant="outline" size="icon">
              <BookOpen size="16" />
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-fit p-8">
            <AssetCard
              key={asset.id}
              asset={asset ?? []}
              depreciationGroups={asset.depreciationGroups?.filter((g) => g.companyId === asset.companyId) ?? []}
              sageCompanyId={asset.sageCompanyId ?? 0}
              updateUsage = {(assetId:any, usage:any)=>{ updateAsset(assetId, usage)}}
              updateAddress = {(assetId:any, address:any)=>{ updateAddress(assetId, address )}}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
