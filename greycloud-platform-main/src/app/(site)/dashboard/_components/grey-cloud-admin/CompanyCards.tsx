"use client";

import React, { useEffect, useState } from "react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { Input } from "../../../../../components/ui/input";
import { Trash } from "lucide-react";

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
  const [users, setUsers] = useState<any[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  
  async function fetchUsage(assetId:string){
    const response = await fetch(`https://grey-cloud-uat.azurewebsites.net/UserCompany/Get-All-Company-User?companyId=${company.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });
  
    if (response) {
     
      const res = await response.json();
    setUsers(res);
    
     
    } else {
      
    }

  } 
  
  async function assignUser(){
    var payload = {
      email: email,
      surname: surname,
      name: firstName,
      companyId: company.id,
      password: "password",
      role:"Company_Admin"
    };
debugger;
    const response = await fetch(`https://grey-cloud-uat.azurewebsites.net/UserCompany/Create-User`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  
    if (response) {
      debugger;
      const res = await response.json();
      debugger;
     
     
    } else {
      
    }

  }    

  
  useEffect(() => {
      fetchUsage(company.id);
    });


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

  function AddUser(){
    assignUser();
  }

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
          <Button variant={"outline"} className="text-primary">
            Assign users
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              <span className="text-muted-foreground">Manage admin users to </span> {company.companyName}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base">
           
             <Table>
                <TableHeader>
                  <TableRow>   
                    <TableHead >Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Actions</TableHead>
                    {/* <TableHead>Serial Number</TableHead>
                    <TableHead>Billing type</TableHead>
                    <TableHead>Price</TableHead> */}
                  </TableRow>
                
                </TableHeader>
                <TableBody>
                {users?.map((itm:any) => (
                    <TableRow>
                       <TableCell>{itm.name}</TableCell>
                       <TableCell>{itm.email}</TableCell>
                       <TableCell><small><Trash width={"16px"}/></small></TableCell>
            </TableRow>
            ))}
                </TableBody>
              </Table>

              <div className="grid grid-cols-2 gap-4 mt-4 p-4">
        <div><h5>Add new admin user</h5></div><div></div>

        <div className="flex flex-col space-y-1.5">
          {/* <Label htmlFor="name">Name</Label> */}
          <Input
          onChange={(e) => setFirstName(e.target.value)}
            id="name"
            placeholder="Name"
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          {/* <Label htmlFor="name">Surname</Label> */}
          <Input
          onChange={(e) => setSurname(e.target.value)}
            id="name"
            placeholder="Surname"
          />
        </div>
        
        <div className="flex flex-col space-y-1.5">
          {/* <Label htmlFor="name">Email</Label> */}
          <Input
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
           />
        </div>
        <div></div>
<div>    
  <Button
                className={cn("w-full font-bold", status === "executing" ? "animate-pulse" : null)}
                size={"lg"}
                onClick={() => {
                  AddUser()
                }}
                disabled={status === "executing" || !email || !firstName || !surname}
                // variant={"primary"}
              >
                {status === "executing" ? "Updating users..." : "Update users"}
              </Button>
              
              </div>
        </div>
            </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              {/* <Button
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
              </Button> */}
            </DialogClose>
          </DialogFooter>
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
