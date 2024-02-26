import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { formatDate, formatToRand } from "@/lib/utils";
import { AssetCardFooter } from "./AssetCardFooter";
import { UpdateSageOneAssetFormProps } from "../../../(dashboard-displays)/company-user-admin/add-asset/_components/UpdateSageOneAssetForm";
import { getIronSessionData } from "@/lib/auth/auth";

export const AssetCard = async ({ asset, depreciationGroups, sageCompanyId }: UpdateSageOneAssetFormProps) => {
  const session = await getIronSessionData();

  if (!session.isLoggedIn) {
    return null;
  }

  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="pb-0 flex flex-col gap-2">
        <CardTitle>{asset.description}</CardTitle>
        <CardDescription>Asset ID: {asset.id}</CardDescription>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="flex flex-col gap-5 py-2">
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
          <Label htmlFor="sageCompanyId" className="text-xs text-foreground uppercase tracking-wider">
            Replacement Value
          </Label>
          <p>{formatToRand(asset.replacementValue) ?? "---"}</p>
        </span>
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="pb-4">
        {<AssetCardFooter user={session} asset={asset} depreciationGroups={depreciationGroups} sageCompanyId={sageCompanyId} />}
      </CardFooter>
    </Card>
  );
};
