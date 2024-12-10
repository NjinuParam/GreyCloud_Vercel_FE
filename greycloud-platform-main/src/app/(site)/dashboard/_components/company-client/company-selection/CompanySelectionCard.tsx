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
import { Button } from "../../../../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../../../../../../components/ui/input";

export const CompanySelectionCard = ({ company }: { company: CompanyResponseTypeForUser }) => {
  const router = useRouter();

  const handleCompanySelection = () => {
    execute({
      companyId: company.companyId,
    });
  };


  async function onboard(assetId:string){
    toast.info("Fetching depreciation history...");
    
    const response = await fetch(`https://systa-api.azurewebsites.net/GreyCloud/Admin/Get-Accounts/14999`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
  
    if (response) {
      const res = await response.json();
      var data = res.results;
      
      setAccounts(data);
      
     
    } else {
      
    }
  }

  const { execute, status } = useAction(assignCompanyProfileToCompanyUser, {
    onSuccess(data:any) {
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

  const cId = company?.companyId;
  return (
    <>
      <Card

        className="flex flex-col gap-2 pb-4 max-h-min cursor-pointer hover:ring-2 hover:ring-primary hover:shadow-lg transition-shadow duration-300"

      >
        <CardHeader className="flex flex-col gap-2 pb-0">
          <CardTitle>{company.companyName}

            {!company.companyId ?
              <Dialog>
                <DialogTrigger asChild className="grow">

                  <Button

                    size={"sm"}
                    type="submit"
                    className={cn(" ml-6 mr-4", status === "executing" ? "animate-pulse" : null)}
                    disabled={status === "executing"}
                  >
                    Add company
                  </Button>

                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">

                  <>
                    Please note, adding a new company will add to your monthly bill.

                    <form>
                      <div className="grid grid-cols-2 ">

                        <div className="flex flex-col space-y-1.5 p-4">
                          <>
                            <Label style={{ float: 'left' }} htmlFor="name">Sage username</Label>
                            <Input
                              id="name"
                              style={{ float: 'left' }}
                              placeholder="Name"
                            // value={depName}
                            // onChange={(e:any) => setDepName(e.target.value)}
                            />
                          </>

                        </div>
                        <div className="flex flex-col space-y-1.5 p-4">

                          <>
                            <Label style={{ float: 'left' }} htmlFor="password">Sage password</Label>
                            <Input
                              style={{ float: 'left' }}
                              id="password"
                              placeholder="Password"
                            // value={depName}
                            // onChange={(e:any) => setDepName(e.target.value)}
                            />
                          </>
                        </div>
                      </div>
                      
                  <Button

                  size={"sm"}
                  type="submit"
                  className={cn("w-full  mt-5 pl-4 pr-4", status === "executing" ? "animate-pulse" : null)}
                  disabled={status === "executing"}
                  >
                  Add company
                  </Button>
                    </form>

                  </>
                  <DialogFooter>
                    <DialogClose asChild>

                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog> : ""

            }

          </CardTitle>
          {cId && <CardDescription>ID: {company.companyId} </CardDescription>}
        </CardHeader>

        <Separator className="my-2" />


        <div style={{ opacity: cId ? "1" : "0.3", cursor: cId ? "pointer" : "not-allowed" }}>
          <CardContent onClick={cId ? handleCompanySelection : {}} className="flex flex-col gap-6 py-2">
            <span className="flex flex-col gap-1 text-muted-foreground">
              <Label htmlFor="email" className="text-xs text-foreground uppercase tracking-wider">
                Email
              </Label>
              <p><small>{company.email ?? "---"}</small></p>
            </span>

            <span className="flex flex-col gap-1 text-muted-foreground">
              <Label htmlFor="apiKey" className="text-xs text-foreground uppercase tracking-wider">
                API Key
              </Label>
              <p><small>{company.apiKey ?? "---"}</small></p>
            </span>

            <span className="flex flex-col gap-1 text-muted-foreground">
              <Label htmlFor="apiKey" className="text-xs text-foreground uppercase tracking-wider">
                Sage Company ID
              </Label>
              <p><small>{company.sageCompanyId ?? "---"}</small></p>
            </span>

            <span className="flex flex-col gap-1 text-muted-foreground">
              <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
                Record
              </Label>
              <p><small>{company.status ?? "---"}</small></p>
            </span>

            <span className="flex flex-col gap-1 text-muted-foreground">
              <Label htmlFor="dateCreated" className="text-xs text-foreground uppercase tracking-wider">
                Status
              </Label>
              <Badge variant="outline" className={cn(`max-w-fit mt-1 bg-red-100 text-red-700`, company.companyId && `bg-green-100 text-green-700`)}>
                {company.companyId ? "Active" : "Inactive"}
              </Badge>
            </span>
          </CardContent>
        </div>

      </Card>

    </>
  );
};
