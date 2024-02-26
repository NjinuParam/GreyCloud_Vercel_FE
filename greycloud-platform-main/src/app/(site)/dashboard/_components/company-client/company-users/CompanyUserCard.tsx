import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AllCompanyUserResponseType } from "@/lib/schemas/company-user";
import { Label } from "@radix-ui/react-label";
import { Separator } from "@radix-ui/react-select";
import { UserCardFooter } from "./UserCardFooter";
import { PlatformUserType } from "@/lib/schemas/common-schemas";

type CompanyUserCardProps = {
  user: AllCompanyUserResponseType | PlatformUserType;
};

export const CompanyUserCard = ({ user }: CompanyUserCardProps) => {
  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="pb-0">
        <CardTitle>
          {user?.name} {user?.surname}
        </CardTitle>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="flex flex-col gap-6 py-2">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="userName" className="text-xs text-foreground uppercase tracking-wider">
            Email
          </Label>
          <p>{user?.email ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="role" className="text-xs text-foreground uppercase tracking-wider">
            Role
          </Label>
          <p>{user?.role ?? "---"}</p>
        </span>

        {(user as AllCompanyUserResponseType)?.company && (user as AllCompanyUserResponseType)?.company.length > 0 && (
          <span className="flex flex-col gap-1 text-muted-foreground">
            <Label htmlFor="company" className="text-xs text-foreground uppercase tracking-wider">
              Company
            </Label>
            <p>{(user as AllCompanyUserResponseType)?.company ?? "---"}</p>
          </span>
        )}
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="pb-4">{<UserCardFooter user={user as AllCompanyUserResponseType} />}</CardFooter>
    </Card>
  );
};
