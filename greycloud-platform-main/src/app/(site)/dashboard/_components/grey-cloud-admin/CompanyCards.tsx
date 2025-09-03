"use client";

import React, { useEffect, useRef, useState } from "react";
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
import { PencilIcon, Trash } from "lucide-react";
import { getIronSessionData, logout } from "../../../../../lib/auth/auth";
import { toBase64 } from "../../../../../lib/utils";
import { useRouter } from "next/navigation";
;

export const CompaniesList = ({ companies }: { companies: SageCompanyResponseType[] }) => {

  const [_companies, setCompanies] = useState<any[]>([]);
  const [accounts, setAccounts] = useState([]);
  const [username, setUsername] = useState("");
  const [companyId, setCompanyId] = useState(14999);
  const [password, setPassword] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    getIronSessionData().then((x: any) => {

      const sorted = x?.companyProfile?.companiesList.sort((a, b) => {
  // Check if each has an id
  const aHasId = a.id && a.id.trim() !== "";
  const bHasId = b.id && b.id.trim() !== "";

  if (aHasId && !bHasId) return -1; // a goes before b
  if (!aHasId && bHasId) return 1;  // b goes before a
  return 0; // leave order unchanged if both same
});
      if (x.role == "GreyCloud_Admin" || x.role == "Company_Admin") {


        setCompanies(sorted)

      } else {
        const _comp = companies.filter((_com) => { return x?.companyProfile?.companiesList?.find((company: any) => false) });
        setCompanies(_comp)
      }

    });
  }, []);

  async function onboard(companyId: string) {
    toast.info("Fetching depreciation history...");

    const response = await fetch(`${apiUrl}GreyCloud/Admin/Get-Accounts/${companyId}`, {
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



  return (
    <div className="grid grid-cols-3 gap-2 w-full h-full overflow-y-scroll">
      {_companies.map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
    </div>
  );
};

export const CompanyCard = ({ company }: { company: SageCompanyResponseType }) => {
  ;



  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="pb-0">
        <CardTitle>{company.nm}</CardTitle>
        {company.apiKey != "Not Found" ? <CardDescription>{company.email}</CardDescription> : "--"}
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="flex flex-col gap-4 py-2">
        {/* <span className="flex flex-col gap-1 text-muted-foreground">
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
        </span> */}

        {/* <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="apiKey" className="text-xs text-foreground uppercase tracking-wider">
            API Key
          </Label>
          <p>{company.apiKey ?? "---"}</p>
        </span> */}

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
          <p>{company.si ?? "---"}</p>
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
  const [isResetPassword, setResetPassword] = useState<string>("");
  const [isDeleteUser, setDeleteUser] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("Systa.io123!");

  async function fetchUsage(assetId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}UserCompany/Get-All-Company-User?companyId=${company.id}`, {
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

  async function assignUser() {
    var payload = {
      email: email,
      surname: surname,
      name: firstName,
      companyId: company.id,
      password: toBase64(password),
      role: isAdmin ? "Company_Admin" : "Company_User"
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}UserCompany/Create-User`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response) {

      const res = await response.json();



    } else {

    }

  }


  useEffect(() => { 
    
    if(company.id.length>1){
        fetchUsage(company.id);
  }

  }, []);


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

  function AddUser() {
    assignUser();
  }

  const [isAdmin, setAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [companyId, setCompanyId] = useState(14999);
  const [_password, set_Password] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [compModal, setCompModal] = React.useState<any>(false);
  async function addCompany() {
    const payload = {
      Email: username,
      password: password,
      SageCompanyId: companyId
    };
    var id = toast.loading(`Adding company`, {
      description: "Please wait...",
    });

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
   

    if (res?.error) {
      toast.dismiss(id);
      
      toast.error(`Error adding company`, {
        description: "Please check your sage credentials and try again",
      });

    } else {
      debugger;
      toast.dismiss(id);
      close();
      toast.success(`Company has been created!`, {
        description: "You can access the company on your next login.",
      });


      setCompModal(true);
      // router.push("/company-picker");
    }


  };


   const closeButtonRef = useRef<any>(null);
    
      const close = () => {
        if (closeButtonRef.current) {
          closeButtonRef.current?.click();
        }
      };

      
  return (
    <div className="flex flex-row gap-2 items-center w-full">

      <div id="modal" style={{ display: compModal == true ? "flex" : "" }} className="modal">
        <div className="modal-content sm:max-w-[400px]">
          <div className="grid gap-4 py-4">
            <div>
              <h1>Login Company</h1>
              <small> Would you like to logout now and login to access the new company?</small>

            </div>
            <Button
              type="submit"
              onClick={() => {
                logout().then(x => {
                  router.replace("/login");
          
                });
              }}
            >
              Yes
            </Button>
            <Button
              type="submit"
              onClick={() => {
                setCompModal(false)
              }}
            >
              No
            </Button>

          </div>
        </div>
      </div>


      {company.apiKey != "Not Found" ?
        <>


          <Dialog>
            <DialogTrigger asChild className="grow">
              <Button variant={"outline"} className="text-primary">
                Edit
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
                Users
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  <span className="text-muted-foreground">Manage admin users to </span> {company.nm}
                </DialogTitle>
                <small style={{ float: "left", cursor: "pointer" }}><a onClick={() => { setResetPassword(""); setDeleteUser("") }} style={{ color: "blue" }}>Create new user</a></small>
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
                    {users?.map((itm: any) => (
                      <TableRow>
                        <TableCell>{itm.name}</TableCell>
                        <TableCell>{itm.email}</TableCell>
                        <TableCell>
                          <small style={{ float: "left", cursor: "pointer" }}><a onClick={() => { setDeleteUser(itm.id); setResetPassword("") }} style={{ color: "blue" }}>Delete user</a></small><br />
                          <small style={{ float: "left", cursor: "pointer" }}><a onClick={() => { setResetPassword(itm.id); setDeleteUser("") }} style={{ color: "blue" }}>Change password</a></small>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {isResetPassword != "" ? <>
                  <div className="grid grid-cols-2 gap-4 mt-4 p-4">
                    <div> <p style={{ fontWeight: "bold" }} className="text-muted-foreground">Update password</p> </div><div></div>

                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name"><small>Password</small></Label>
                      <Input
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        defaultValue={password}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name"><small>Confirm Password</small></Label>
                      <Input
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        defaultValue={password}
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


                </> : <>
                  {isDeleteUser != "" ? <>

                    <div className="grid grid-cols-1 gap-4 mt-4 p-4">
                      <div> <p style={{ fontWeight: "bold" }} className="text-muted-foreground">Delete user</p> </div><div></div>

                      <Button
                        className={cn("w-full font-bold", status === "executing" ? "animate-pulse" : null)}
                        size={"lg"}
                        // onClick={() => {
                        //   execute({
                        //     id: company.id,
                        //   });
                        // }}
                        disabled={status === "executing"}
                        variant={"destructive"}
                      >
                        {status === "executing" ? "Deleting User..." : "Delete User"}
                      </Button>
                      <div></div>

                    </div>

                  </> : <>


                    <div className="grid grid-cols-2 gap-4 mt-4 p-4">
                      <div> <p style={{ fontWeight: "bold" }} className="text-muted-foreground">Create new user</p> </div>
                      <div>
                        <input style={{ marginLeft: "3%" }} onChange={(e) => { setAdmin(!isAdmin) }} checked={isAdmin} type="checkbox" /> <small>Is Admin </small><br />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name"><small>Name</small></Label>
                        <Input
                          onChange={(e) => setFirstName(e.target.value)}
                          id="name"
                          placeholder="Name"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name"><small>Surname</small></Label>
                        <Input
                          onChange={(e) => setSurname(e.target.value)}
                          id="surname"
                          placeholder="Surname"
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name"><small>Email</small></Label>
                        <Input
                          id="email"
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name"><small>Password</small></Label>
                        <Input
                          id="password"
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          defaultValue={password}
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
                    </div></>}
                </>}

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
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>
                  <span className="text-muted-foreground">Delete</span> {company.nm}?
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


        </> : <>
          {!company?.companyId ?
            <Dialog>
              <DialogTrigger ref={closeButtonRef}  asChild className="grow">

                <Button
                  onClick={() => { setCompanyId(company?.sageCompanyId ?? 0) }}
                  size={"sm"}
                  type="submit"
                  className={cn(" mt-6 ml-6 mr-4", status === "executing" ? "animate-pulse" : null)}
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
                          placeholder="Password"
                          type="password"
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
        </>}



    </div>
  );
};
