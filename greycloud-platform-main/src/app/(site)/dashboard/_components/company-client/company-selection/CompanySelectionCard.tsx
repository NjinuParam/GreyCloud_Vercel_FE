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
import { useState } from "react";
import { apiFetch } from "../../../../../actions/apiHandler";

export const CompanySelectionCard = ({ company }: { company: CompanyResponseTypeForUser }) => {
  const router = useRouter();
  const [accounts, setAccounts] = useState([]);
  const [username, setUsername] = useState("");
  const [companyId, setCompanyId] = useState(14999);
  const [password, setPassword] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const handleCompanySelection = () => {
    ;
    execute({
      companyId: company.id,
    });
  };

  async function addCompany() {
    const payload = {
      Email: username,
      password: password,
      SageCompanyId: companyId
    };

    const response = await fetch(`${apiUrl}SageOneCompany/Company/OnBoardNewCompany`, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.     
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(payload), // body data type must match "Content-Type" header
    });
    const res = await response.json();
    ;

    if (res?.error) {
      toast.error(`Error adding company`, {
        description: "Please check your sage credentials and try again",
      });


    } else {
      toast.success(`Company has been created!`, {
        description: "The order was created successfully.",
      });

      router.push("/company-picker");
    }


  }


  async function onboard(companyId: string) {
    toast.info("Fetching depreciation history...");

    const response = await apiFetch(`${apiUrl}GreyCloud/Admin/Get-Accounts/${companyId}`,
      //    {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   }
      // }
    );

    if (response) {
      const res = await response.json();
      var data = res.results;

      setAccounts(data);


    } else {

    }
  }

  const { execute, status } = useAction(assignCompanyProfileToCompanyUser, {
    async onSuccess(data: any) {
      try {
        // Fetch company settings to see if it's configured
        const response = await apiFetch(`${apiUrl}GreyCloud/Admin/Get-Company/${company.id}`);
        const settings = await response.json();

        // Check if essential settings are present (journal codes and start date)
        const hasSettings = !!(
          settings &&
          settings.sageAccumilatedDepreciationJournalCode &&
          settings.sageDepreciationJournalCode &&
          settings.sageDisposalJournalCode &&
          settings.sageRevaluationJournalCode &&
          settings.depreciationStartDate
        );

        if (!hasSettings) {
          toast.info(`Please complete settings for ${data?.nm ?? "the company"}.`, {
            description: "Redirecting to company settings.",
          });
          router.push("/dashboard/company/settings");
        } else {
          toast.success(`Signed into ${data?.nm ?? "company"}.`, {
            description: "Accessing dashboard...",
          });
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking company settings:", error);
        // Fallback to dashboard if check fails or API error
        router.push("/dashboard");
      }
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

  const cId = company?.id;

  return (
    <>
      <Card

        className="flex flex-col gap-2 pb-4 max-h-min cursor-pointer hover:ring-2 hover:ring-primary hover:shadow-lg transition-shadow duration-300"

      >
        <CardHeader className="flex flex-col gap-2 pb-0">
          <CardTitle>{company.nm}
            <br /><br />
            {!company?.id ?
              <Dialog>
                <DialogTrigger asChild className="grow">

                  <Button
                    onClick={() => { setCompanyId(company?.si ?? 0) }}
                    size={"sm"}
                    type="submit"
                    className={cn("w-full", status === "executing" ? "animate-pulse" : null)}
                    disabled={status === "executing"}
                  >
                    Add company
                  </Button>

                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">

                  <>
                    Please note, adding a new company will add to your monthly bill.

                    {/* <form> */}
                    <div className="grid grid-cols-2 ">

                      <div className="flex flex-col space-y-1.5 p-4">
                        <>
                          <Label style={{ float: 'left' }} htmlFor="name">Sage username</Label>
                          <Input
                            id="name"
                            style={{ float: 'left' }}
                            placeholder="Name"
                            // value={depName}
                            onChange={(e: any) => setUsername(e.target.value)}
                          />
                        </>

                      </div>
                      <div className="flex flex-col space-y-1.5 p-4">

                        <>
                          <Label style={{ float: 'left' }} htmlFor="password">Sage password</Label>
                          <Input
                            style={{ float: 'left' }}
                            id="password"
                            type="password"
                            placeholder="Password"
                            // value={depName}
                            onChange={(e: any) => setPassword(e.target.value)}
                          />
                        </>
                      </div>
                    </div>

                    <Button
                      onClick={() => { addCompany() }}
                      size={"sm"}
                      // type="submit"
                      className={cn("w-full  mt-5 pl-4 pr-4", status === "executing" ? "animate-pulse" : null)}
                      disabled={status === "executing"}
                    >
                      Add company
                    </Button>
                    {/* </form> */}

                  </>
                  <DialogFooter>
                    <DialogClose asChild>

                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog> : ""

            }

          </CardTitle>
          {cId && <CardDescription>ID: {company.id} </CardDescription>}
        </CardHeader>

        <Separator className="my-2" />


        <div style={{ opacity: cId ? "1" : "0.3", cursor: cId ? "pointer" : "not-allowed" }}>
          <CardContent onClick={cId ? handleCompanySelection : () => { }} className="flex flex-col gap-6 py-2">
            <span className="flex flex-col gap-1 text-muted-foreground">
              <Label htmlFor="email" className="text-xs text-foreground uppercase tracking-wider">
                Email
              </Label>
              <p><small>{company.email ?? "---"}</small></p>
            </span>

            {/* <span className="flex flex-col gap-1 text-muted-foreground">
              <Label htmlFor="apiKey" className="text-xs text-foreground uppercase tracking-wider">
                API Key
              </Label>
              <p><small>{company.apiKey ?? "---"}</small></p>
            </span> */}

            <span className="flex flex-col gap-1 text-muted-foreground">
              <Label htmlFor="apiKey" className="text-xs text-foreground uppercase tracking-wider">
                Sage Company ID
              </Label>
              <p><small>{company.si ?? "---"}</small></p>
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
              {company.id ? (
                <div className="flex flex-col items-center mt-2 gap-1 w-fit">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                  <span className="text-xs text-green-700 font-medium">Active</span>
                </div>
              ) : (
                <Badge variant="outline" className={cn(`max-w-fit mt-1 bg-red-100 text-red-700`)}>
                  Inactive
                </Badge>
              )}
            </span>
          </CardContent>
        </div>

      </Card>

    </>
  );
};
