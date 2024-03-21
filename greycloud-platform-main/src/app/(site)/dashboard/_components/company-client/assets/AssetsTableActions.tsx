"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen } from "lucide-react";
import { AssetCard } from "./AssetCard";
import { EnrichedAssetType } from "./assets-columns";

export default function AssetsTableActions({ asset }: { asset: EnrichedAssetType }) {
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
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
