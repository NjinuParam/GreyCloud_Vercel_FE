import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { GetCompanyDepreciationGroupResponseType } from "@/lib/schemas/depreciation";
import { formatDate, formatToPercentage, formatToRand } from "@/lib/utils";

export const DepreciationGroupCard = ({ depreciationGroup }: { depreciationGroup: GetCompanyDepreciationGroupResponseType }) => {
  return (
    <Card className="flex flex-col gap-2 pb-2">
      <CardHeader className="flex flex-col gap-2 pb-0">
        <CardTitle>{depreciationGroup.depName}</CardTitle>
        <CardDescription>Group ID: {depreciationGroup.depGroupId}</CardDescription>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="flex flex-col gap-6 pt-2 pb-4">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
            {depreciationGroup.isMoney ? "Depreciation Amount (in Rands)" : "Depreciation Percentage"}
          </Label>
          {depreciationGroup.isMoney ? (
            <p>{formatToRand(depreciationGroup.depAmount)}</p>
          ) : (
            <p>{formatToPercentage(depreciationGroup.depAmount) ?? "---"}</p>
          )}
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="contactNumber" className="text-xs text-foreground uppercase tracking-wider">
            Depreciation Period (in months)
          </Label>
          <p>{depreciationGroup.period ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="dateCreated" className="text-xs text-foreground uppercase tracking-wider">
            Active State
          </Label>
          <p>{depreciationGroup.active ? "Active" : "Not Active"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="dateCreated" className="text-xs text-foreground uppercase tracking-wider">
            Date Created
          </Label>
          <p>{formatDate(depreciationGroup.createdDate.toString())}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="dateModified" className="text-xs text-foreground uppercase tracking-wider">
            Date Modified
          </Label>
          <p>{formatDate(depreciationGroup.dateModified.toString())}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
            Company ID
          </Label>
          <p>{depreciationGroup.companyId ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="creatingUser" className="text-xs text-foreground uppercase tracking-wider">
            Creating User
          </Label>
          <p>{depreciationGroup.creatingUser ?? "---"}</p>
        </span>
      </CardContent>

      {/* <Separator className="my-2" /> */}
    </Card>
  );
};
