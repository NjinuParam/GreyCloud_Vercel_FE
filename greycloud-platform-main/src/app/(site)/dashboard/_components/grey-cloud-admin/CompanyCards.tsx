"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate } from "@/lib/utils";
import UpdateSageCompanyForm from "./UpdateSageCompanyForm";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { deleteGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { SageCompanyResponseType } from "@/lib/schemas/company";

export const CompaniesList = ({ companies }: { companies: SageCompanyResponseType[] }) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-full h-full overflow-y-scroll">
      {companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
};

export const CompanyCard = ({ company }: { company: SageCompanyResponseType }) => {
  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="pb-0">
        <CardTitle>{company.companyName}</CardTitle>
        <CardDescription>{company.email}</CardDescription>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="flex flex-col gap-4 py-2">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="companyName" className="text-xs text-foreground uppercase tracking-wider">
            Contact Name
          </Label>
          <p>{company.contactName ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="contactNumber" className="text-xs text-foreground uppercase tracking-wider">
            Contact Number
          </Label>
          <p>{company.contactNumber ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="contactEmail" className="text-xs text-foreground uppercase tracking-wider">
            Contact Email
          </Label>
          <p>{company.contactEmail ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="apiKey" className="text-xs text-foreground uppercase tracking-wider">
            API Key
          </Label>
          <p>{company.apiKey ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="dateCreated" className="text-xs text-foreground uppercase tracking-wider">
            Date Created
          </Label>
          <p>{formatDate(company.dateCreated?.toString())}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="sageCompanyId" className="text-xs text-foreground uppercase tracking-wider">
            Sage Company ID
          </Label>
          <p>{company.sageCompanyId ?? "---"}</p>
        </span>
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="pb-4">{<CompanyCardFooter {...company} />}</CardFooter>
    </Card>
  );
};

const CompanyCardFooter = (company: SageCompanyResponseType) => {
  const { execute, result, status, reset } = useAction(deleteGreyCloudCompany, {
    onSuccess(data, input, reset) {
      toast.success("Company successfully deleted.", {
        description: `Company was removed.`,
      });

      reset();
    },

    onError(error, input, reset) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error),
      });
    },

    onSettled(result, input, reset) {
      reset();
    },

    onExecute(input) {
      toast.info("Deleting Company...");
    },
  });

  return (
    <div className="flex flex-row gap-2 items-center w-full">
      <Dialog>
        <DialogTrigger asChild className="grow">
          <Button variant={"outline"} className="text-primary">
            Edit Company
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Company</DialogTitle>
          </DialogHeader>

          <div className="w-full mt-2">
            <UpdateSageCompanyForm company={company} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild className="grow">
          <Button variant={"outline"} className="text-destructive">
            Delete Company
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              <span className="text-muted-foreground">Delete</span> {company.companyName}?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base">This action cannot be undone. This will permanently delete the company account.</DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                className={cn("w-full font-bold", status === "executing" ? "animate-pulse" : null)}
                size={"lg"}
                onClick={() => {
                  execute({
                    id: company.id,
                  });
                }}
                disabled={status === "executing"}
                variant={"destructive"}
              >
                {status === "executing" ? "Deleting Company..." : "Delete Company"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
