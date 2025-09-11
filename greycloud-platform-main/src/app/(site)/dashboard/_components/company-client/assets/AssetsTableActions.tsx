"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, X } from "lucide-react";
import AssetCard  from "./AssetCard";
import { EnrichedAssetType } from "./assets-columns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getIronSessionData } from "../../../../../../lib/auth/auth";
import { DialogClose } from "../../../../../../components/ui/dialog";
import { apiFetch } from "../../../../../actions/apiHandler";

export default function AssetsTableActions({ asset }: { asset: EnrichedAssetType }) {

  const [compId, setCompanyId] = useState<number>(14999);
    const [compModal, setCompModal] = useState<any>(false);

  async function updateAsset(assetId:string, usage:string) {

toast.info("Updating asset...");


const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}SageOneAsset/Asset/UpdateUsage/${assetId}/${usage}/${compId}`
//   , {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//   }
// }
);

if (response) {
  setCompModal(false);
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

  useEffect(()=>{
    getIronSessionData().then((x:any)=>{
    
      const compId = x.companyProfile.loggedInCompanyId;
      
      const companyId = x.companyProfile?.companiesList?.filter((y:any)=>{return y.id ==compId})[0]?.sageCompanyId;
     //const p = com[0].sageCompanyId;
      setCompanyId(companyId ??14999);
    });
  },[])

  async function updateAddress(assetId:string, address:string) {
    toast.info("Updating asset...");

    var requests = {
      assetId: assetId,
      location: address,
      gps: "0,0"
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}SageOneAsset/Asset/UpdateLocation/${assetId}/${compId}`, {
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
      setCompModal(false);
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
 



         <Button variant="outline" size="icon" onClick={() => setCompModal(true)}>
              <BookOpen size="16" />
            </Button>

        <div id="modal"  style={{ display: compModal == true ? "flex" : "" }} className="modal">
                      <div className="modal-content">
                      <X onClick={()=>setCompModal(false)} style={{float:"right"}} className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                      
                        <div className="grid gap-4 py-4">
                        <AssetCard
                        closeFn={()=>setCompModal(false)}
              key={asset.id}
              asset={asset ?? []}
              depreciationGroups={asset.depreciationGroups?.filter((g) => g.companyId === asset.companyId) ?? []}
              sageCompanyId={asset.sageCompanyId ?? 0}
              updateUsage = {(assetId:any, usage:any)=>{ updateAsset(assetId, usage)}}
              updateAddress = {(assetId:any, address:any)=>{ updateAddress(assetId, address )}}
            />
        
                        </div>
                      </div>
                    </div>

      </div>
    </div>
  );
}
