"use client";

import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CompanyResponseTypeForUser, SelectedCompanyIdType } from "@/lib/schemas/common-schemas";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { assignCompanyProfileToCompanyUser } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { toast } from "sonner";

export const CompanySelectionCard = ({ company }: { company: CompanyResponseTypeForUser }) => {
  const router = useRouter();

  const handleCompanySelection = () => {
    execute({
      companyId: company.companyId,
    });
  };

  const { execute, status } = useAction(assignCompanyProfileToCompanyUser, {
    onSuccess(data) {
      router.push("/dashboard");
      toast.success(`You're now signed into company: ${data?.companyName ?? "Unknown"}.`, {
        description: "You can now access company's dashboard.",
      });
    },

    onError(error) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error, null, 2),
      });
    },

    onExecute() {
      toast.info("Signing into profile...");
    },
  });

  return (
    <Card
      className="flex flex-col gap-2 pb-4 max-h-min cursor-pointer hover:ring-2 hover:ring-primary hover:shadow-lg transition-shadow duration-300"
      onClick={handleCompanySelection}
    >
      <CardHeader className="flex flex-col gap-2 pb-0">
        <CardTitle>{company.companyName}</CardTitle>
        <CardDescription>ID: {company.companyId}</CardDescription>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="flex flex-col gap-6 py-2">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="email" className="text-xs text-foreground uppercase tracking-wider">
            Email
          </Label>
          <p>{company.email ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="apiKey" className="text-xs text-foreground uppercase tracking-wider">
            API Key
          </Label>
          <p>{company.apiKey ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="apiKey" className="text-xs text-foreground uppercase tracking-wider">
            Sage Company ID
          </Label>
          <p>{company.sageCompanyId ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
            Record
          </Label>
          <p>{company.status ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="dateCreated" className="text-xs text-foreground uppercase tracking-wider">
            Status
          </Label>
          <Badge variant="outline" className={cn(`max-w-fit mt-1 bg-red-100 text-red-700`, company.success && `bg-green-100 text-green-700`)}>
            {company.success ? "Success" : "No Success"}
          </Badge>
        </span>
      </CardContent>
    </Card>
  );
};
