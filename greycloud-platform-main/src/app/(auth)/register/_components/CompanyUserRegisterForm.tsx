"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { buildFormData, cn } from "@/lib/utils";
import { CreateCompanyUserRequestModelSchema, CreateCompanyUserType } from "@/lib/schemas/company-user";
import { RolesCompanyOptions } from "@/lib/schemas/common-schemas";
import { createCompanyUser } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "../../../../components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu";
import { SelectGroup, SelectLabel } from "../../../../components/ui/select";


export default function CompanyUserRegisterForm() {
  const router = useRouter();

  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setCompanyId] = useState<string[]>([]);
  const [companyNames, setCompanyNames] = useState<any[]>([]);



  function selectCompany(companyId:any){
    
    var company = companies.filter(x=>x.id == companyId);
    if(!companyNames.includes(company[0].name)){
    setCompanyNames([...companyNames, company[0].name]);
    setCompanyId([...selectedCompanyId, companyId]);
    }else{
      var _companyNames = companyNames.filter(x=>x != company[0].name);
      var _selectedCompanyId = selectedCompanyId.filter(x=>x != companyId);
      setCompanyNames(_companyNames);
      setCompanyId(_selectedCompanyId);
    }

  }
  
  const { execute, status } = useAction(createCompanyUser, {
    onSuccess(data, input, reset) {
      router.push("/login");

      toast.success("Account registered successfully.", {
        description: "You may now log in.",
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
      toast.info("Creating Account...");
    },
  });


  async function completeCreateCompany(payload:any){
    

    var _payload = {
      email: payload.email,
      password: payload.password,
      apiKey: payload.apiKey,
      sageCompanyId: selectedCompanyId,
      companyName: companyNames,
      contactName: payload.name + " " + payload.surname,
      contactEmail: payload.email,
      contactNumber:""
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}GreyCloud/Customer/Create-Sage-Company`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_payload),
    });
  
    if (response) {
      const res = await response.json();
      
      if(res ==null){
        toast.error("An error occurred", {
          description: "Something went wrong",
        });
      }else{
        var data = res.results;
        toast.success("Company created succesfully, please login", {})
        router.push("/login");
      }

  }else{
    toast.error("An error occurred", {
      description: "Something went wrong",
    });
  }
}



    async function fetchAccounts(payload:any){
      toast.info("Fetching company details...");
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}SageOneCompany/Company/CheckStatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    
      if (response) {
        const res = await response.json();
        if(res?.results ==null){
          toast.error("Invalid credentials", {
            description: "No companies found",
          });
        }else{
             var data = res.results;
        toast.success("Company details fetched successfully", {})

        
        setCompanies(data);
        }
     
        
       
      } else {
        
      }
    }
  
  // Define the form:
  const form = useForm<CreateCompanyUserType>({
    resolver: zodResolver(CreateCompanyUserRequestModelSchema),
    defaultValues: {
      companyId: "",
      name: "",
      surname: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      apiKey: "{3A1FAB7A-D758-49F4-A958-C3AB2765AC9A}",
      role:"Company_Admin"
    },
  });

  // Define a submit handler:
  function onSubmit(values: CreateCompanyUserType) {
    
    fetchAccounts(values);

  //   {
  //     "name": "Njinu",
  //     "surname": "Kimani",
  //     "email": "njinukimani@webparam.org",
  //     "apiKey": "{3A1FAB7A-D758-49F4-A958-C3AB2765AC9A}",
  //     "password": "Password123!",
  //     "passwordConfirmation": "Password123!"
  // }

  }

  return (
    <>
    {
      companies?.length>0?
     <div>
    <Card className="flex flex-col">
      <CardHeader className="flex flex-col gap-2 bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 pt-10 pb-4 mb-4 relative">
        <CardTitle className="text-xl">Select company</CardTitle>
        <CardDescription className="text-base max-w-[60%]">Select all companies that you want to import.</CardDescription>

        {/* <Image className="absolute size-36 right-8 top-4 flex items-center justify-center" src={AuthSVG} alt="Picture of auth." /> */}
      </CardHeader>

      <CardContent className="p-8">
        {/* {isCompanyUser(user?.role) ? <ForgotPasswordCompanyUserForm /> : <ForgotPasswordGreyCloudAdminForm />} */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4 w-full">
         
            {/* <select className="w-full"> */}
              {/* {companies.map((company) => (
                <label>  <Checkbox key={company.id} 
                onCheckedChange={()=>selectCompany(company.id)}
                value={company.id} checked={selectedCompanyId.includes(company.id)}>
               
                </Checkbox> {company.name}</label>
              ))} */}
            {/* </select> */}
             

                   <Select>
                                     <SelectTrigger>
                                       <SelectValue placeholder="Select company" />
                                     </SelectTrigger>
                                     <SelectContent>
                                       <SelectGroup>
                                         <SelectLabel>Select company</SelectLabel>
                                         {/* <SelectItem value="daily">Daily</SelectItem>
                                         <SelectItem value="onceoff">Once Off</SelectItem>
                                         <SelectItem value="onceoffusage">
                                           Once Off + Usage
                                         </SelectItem>
                                         <SelectItem value="usage">Usage</SelectItem> */}
                                         {companies.map((company) => (
                // <label>  <Checkbox key={company.id} 
                // onCheckedChange={()=>selectCompany(company.id)}
                // value={company.id} checked={selectedCompanyId.includes(company.id)}>
               
                // </Checkbox> {company.name}</label>
                 <SelectItem key={company.id} value={company.id} >{company.name}</SelectItem>
              ))}
                                       </SelectGroup>
                                     </SelectContent>
                                   </Select>
          </div>

          </div>
      </CardContent>

      <CardFooter className="flex mx-auto px-8">
        <p className="w-full  text-sm text-muted-foreground -mr-2 text-center">{`
           You will be billed for each company that is loaded.`}</p><br/><br/>
         
          <Button
            className={"w-full font-bold"}
            onClick={()=>completeCreateCompany(form.getValues())}
            size={"lg"}
            type="submit"
            disabled={status === "executing"}
          >
            {status === "executing" ? "Creating Account..." : "Create Account"}
          </Button>
       
      </CardFooter>
    </Card>
     </div>
      : 
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-row space-x-4 w-full">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-row space-x-4 w-full">
          {/* <div className="">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RolesCompanyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}

            {/* <FormField

              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel>Sage API Key</FormLabel>
                  <FormControl>
                    <Input className="" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>Sage Email</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-row space-x-4 w-full">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>Sage Password</FormLabel>
              <FormControl>
                <Input placeholder="" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirmation"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>Confirm Sage Password</FormLabel>
              <FormControl>
                <Input placeholder="" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
</div>
        <div className="w-full pt-2">
          <Button
            className={cn("w-full font-bold", status === "executing" ? "animate-pulse" : null)}
            size={"lg"}
            type="submit"
            disabled={status === "executing"}
          >
            {status === "executing" ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>
    </Form>

    }
     
    </>
  );
}
