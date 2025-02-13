"use client";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import UpdateSageOneAssetForm, {
  UpdateSageOneAssetFormProps,
} from "../../../(dashboard-displays)/company-user-admin/add-asset/_components/UpdateSageOneAssetForm";
import { FilePenLine } from "lucide-react";
import { useRef } from "react";



export default function AssetCardDrawer({ asset, depreciationGroups, sageCompanyId }: UpdateSageOneAssetFormProps) {

  const closeButtonRef = useRef(null);

  const close = () => {
    if (closeButtonRef.current) {
      closeButtonRef.current.click();
    }
  };
  
  return (
    <Drawer>
      <DrawerTrigger asChild className="grow">
        <Button  ref={closeButtonRef} variant={"outline"} className="text-primary w-48">
          <FilePenLine className="size-5" />
        </Button>
      </DrawerTrigger>
      <div style={{  }}>

      <DrawerContent id="drawer-content" className="w-full">
        <div className="max-w-3xl mx-auto m-4 mb-8 w-full">
          <DrawerHeader>
            <DrawerTitle className="text-2xl">Edit Asset</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>

          <div className="w-full mt-2">
            <UpdateSageOneAssetForm closeFn={()=>close()} asset={asset} depreciationGroups={depreciationGroups ?? []} sageCompanyId={sageCompanyId} />
          </div>
        </div>
      </DrawerContent>
      </div>
      
    </Drawer>
  );
}
