import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { GetAssetGroupResponseType } from "@/lib/schemas/depreciation";
import { cn, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const AssetGroupCard = ({ assetGroup }: { assetGroup: GetAssetGroupResponseType }) => {
  return (
    <Card className="flex flex-col gap-2 pb-4">
      <CardHeader className="flex flex-col gap-2 pb-0">
        <CardTitle>Asset Group</CardTitle>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="flex flex-col gap-6 py-2">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
            Asset ID
          </Label>
          <p>{assetGroup.assetId ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="contactNumber" className="text-xs text-foreground uppercase tracking-wider">
            Asset Depreciation ID
          </Label>
          <p>{assetGroup.assetDepId ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
            Depreciation Group ID
          </Label>
          <p>{assetGroup.depGroupId ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="dateCreated" className="text-xs text-foreground uppercase tracking-wider">
            Date Created
          </Label>
          <p>{formatDate(assetGroup.createdDate.toString())}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="dateCreated" className="text-xs text-foreground uppercase tracking-wider">
            Active State
          </Label>
          <Badge variant="outline" className={cn(`max-w-fit mt-1 bg-red-100 text-red-700`, assetGroup.active && `bg-green-100 text-green-700`)}>
            {assetGroup.active ? "Active" : "Not Active"}
          </Badge>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="contactEmail" className="text-xs text-foreground uppercase tracking-wider">
            Creating User
          </Label>
          <p>{assetGroup.creatingUser ?? "---"}</p>
        </span>
      </CardContent>
    </Card>
  );
};
