import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddDepreciationGroupView from "../../../_components/AddDepreciationGroupView";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function AddAssetDepreciationGroupToNewAsset() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button" variant={"secondary"}>
          <Plus className="text-primary mr-2 size-5" /> Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full flex items-center justify-center">
        <AddDepreciationGroupView />
      </DialogContent>
    </Dialog>
  );
}
