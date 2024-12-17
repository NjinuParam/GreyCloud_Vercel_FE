"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import AutoComplete from "react-google-autocomplete";
import {
  SAGE_ONE_CUSTOMER,
  SAGE_ONE_CUSTOMER_NEW,
} from "@/lib/api-endpoints/sage-one-customer";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { getIronSessionData } from "../../../../../../lib/auth/auth";

const FormSchema = z.object({
  // dob: z.date({
  //   required_error: "A date of birth is required.",
  // }),
  name: z.string({
    required_error: "Please enter the full name",
  }),
  category: z.string({
    required_error: "Please select the category",
  }).default("0"),
  balance: z.number({
    required_error: "Please enter the balance",
  }).default(0),

  creditLimit: z.number({
    required_error: "Please enter the credit limit",
  }).default(0),
  defaultDiscountPercentage: z.string({
    required_error: "Please enter the default discount percentage",
  }).default("0"),
  acceptsElectronicInvoices: z.boolean().default(false).optional(),
  subjectToDRCVat: z.boolean().default(false).optional(),
  salesRepresentativeId: z.number({
    required_error: "Please select a sales representative",
  }).default(5417),
  contactName: z.string({
    required_error: "Please enter the contact name",
  }),
  mobile: z.string({
    required_error: "Please enter the mobile number",
  }),
  telephone: z.string({
    required_error: "Please enter the telephone number",
  }),
  email: z.string({
    required_error: "Please enter the email",
  }),
  fax: z.string({
    required_error: "Please enter the fax number",
  }),
  webAddress: z.string({
    required_error: "Please enter the web address",
  }),
  deliveryAddress01: z.string({
    required_error: "Please enter the address line 1",
  }),
  deliveryAddress02: z.string({
    required_error: "Please enter the address line 2",
  }),
  postalCode: z.string({
    required_error: "Please enter the postal code",
  }),
  city: z.string({
    required_error: "Please select the city",
  }).default("0"),
  statementDistribution: z.string({
    required_error: "Please select the statement distribution",
  }),
  defaultPriceListId: z.string({
    required_error: "Please select the default price list",
  }).default("0"),
});

function CreateCustomerForm({ companyId }: { companyId: any }) {
  const [gpsx, setGpsLatitude] = useState("");
  const [gpsy, setGpsLongitude] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  
  const [compId, setCompanyId] = useState<number>(14999);
  useEffect(()=>{
    getIronSessionData().then(x=>{
    
      const compId = x.companyProfile.loggedInCompanyId;

     const com = comp.companyProfile.companiesList.find((x:any)=>{x.companyId ==currentCompanyId}).sageCompanyId
      
      setCompanyId(com);
    });
  },[])

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const values = {
      ...data,
      category: {
        description: "string",
        id: 0,
        modified: "2024-04-16T01:40:15.340Z",
        created: "2024-04-16T01:40:15.340Z",
      },
      salesRepresentativeId: 5417,
      // salesRepresentative: {
      //   id: 0,
      //   firstName: "string",
      //   lastName: "string",
      //   name: "string",
      //   active: true,
      //   email: "string",
      //   mobile: "string",
      //   telephone: "string",
      //   created: "2024-04-16T01:40:15.340Z",
      //   modified: "2024-04-16T01:40:15.340Z",
      // },
      taxReference: "string",
      communicationMethod: 0,
      postalAddress01: "string",
      postalAddress02: "string",
      postalAddress03: "string",
      postalAddress04: "string",
      postalAddress05: "string",
      deliveryAddress03: "string",
      deliveryAddress04: "string",
      deliveryAddress05: "string",
      creditLimit:0,
      autoAllocateToOldestInvoice: true,
      enableCustomerZone: true,
      customerZoneGuid: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      cashSale: true,
      textField1: "string",
      textField2: "string",
      textField3: "string",
      numericField1: 0,
      numericField2: 0,
      numericField3: 0,
      yesNoField1: true,
      yesNoField2: true,
      yesNoField3: true,
      dateField1: "2024-04-16T01:40:15.341Z",
      dateField2: "2024-04-16T01:40:15.341Z",
      dateField3: "2024-04-16T01:40:15.341Z",
      defaultPriceList: {
        id: 0,
        description: "string",
        isDefault: true,
      },
      modified: "2024-04-16T01:40:15.341Z",
      created: "2024-04-16T01:40:15.341Z",
      businessRegistrationNumber: "string",
      taxStatusVerified: "2024-04-16T01:40:15.341Z",
      currencyId: 0,
      currencySymbol: "string",
      hasActivity: true,
      defaultTaxTypeId: 0,
      defaultTaxType: {
        id: 0,
        name: "string",
        percentage: 0,
        isDefault: true,
        hasActivity: true,
        isManualTax: true,
        active: true,
        created: "2024-04-16T01:40:15.341Z",
        modified: "2024-04-16T01:40:15.341Z",
        taxTypeDefaultUID: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        companyId: compId,
        dueDateMethodId: 0,
        dueDateMethodValue: 0,
        cityId: 0,
        accountingAgreement: true,
        hasSpecialCountryTaxActivity: true,
        outstandingInvoices: true,
        overdueInvoices: true,
        onHold: true,
        excludeFromDebtorsManager: true,
        subjectToDRCVat: false,
      },
    };

    const endpoint = `${apiUrl}${SAGE_ONE_CUSTOMER.POST.CUSTOMER_SAVE}/${compId}`;

    try {
      toast.info("Creating customer");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

  
     const res = await response.json();
     
     

      if(response.status==200){
        if(res ==null){

          toast.success("Success!",{
            description: res,
          });
          router.push("/dashboard/customers/show");
        }else{
          toast.error("Errors on the following fields:",{
            description:res,
          });
        }
     
      }else{
        toast.error("Errors on the following fields:",{
          description: Object.keys(res.errors).join(" , "),
        });
      }
      
    } catch (e:any) {
      
      console.log(e);
      toast.error("An error has occured:", {
        description: e.message,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Customer</CardTitle>
        <CardDescription>
          Fill in the form below to create a new customer.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="grid w-full grid-cols-2 gap-4">
                <div id="personal-details" className="space-y-2">
                  <p className="mb-5 text-lg">Customer details</p>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={"0"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="balance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Balance</FormLabel>
                        <FormControl>
                          <Input
                          defaultValue={0}
                            placeholder="Balance"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div id="personal-details" className="space-y-2">
                  <p className="mb-5 text-lg text-white">.</p>
                  <FormField
                    control={form.control}
                    name="creditLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Limit</FormLabel>
                        <FormControl>
                          <Input
                          defaultValue={0}
                            placeholder="Credit Limit"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salesRepresentativeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales Representative</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={"5417"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sales Representative" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem  value={"5417"}>Current user</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <p className="text-xs text-white">.</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="acceptsElectronicInvoices"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Accepts Electronic Invoice</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-4">
                <div id="personal-details" className="space-y-2">
                  <p className="mb-5 text-lg">Contact details</p>
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Contact name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="webAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Web Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Web Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div id="personal-details" className="space-y-2">
                  <p className="mb-5 text-lg text-white">.</p>
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Mobile Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Telephone Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fax</FormLabel>
                        <FormControl>
                          <Input placeholder="Fax" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-4">
                <div id="personal-details" className="space-y-2">
                  <p className="mb-5 text-lg">Delivery Address</p>
                  <FormField
                    control={form.control}
                    name="deliveryAddress01"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="Address Line 1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deliveryAddress02"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Address Line 2"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div id="personal-details" className="space-y-2">
                  <p className="mb-5 text-lg text-white">.</p>

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal code</FormLabel>
                        <FormControl>
                          <Input placeholder="Postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={"0"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a city" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Johannesburg</SelectItem>
                            <SelectItem value="1">Pretoria</SelectItem>
                            <SelectItem value="2">Cape Town</SelectItem>
                            <SelectItem value="3">Durban</SelectItem>
                            <SelectItem value="4">Pietermaritzburg</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-4">
                <div id="personal-details" className="space-y-2">
                  <p className="mb-5 text-lg">Default Settings</p>
                  <FormField
                    control={form.control}
                    name="statementDistribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statement Distribution</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Statement Distribution" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">(None)</SelectItem>
                            <SelectItem value="print">Print</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="printAndEmail">
                              Print and Email
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultDiscountPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Descount Percentage</FormLabel>
                        <FormControl>
                          <Input
                          defaultValue={0}
                            placeholder="Default Descount Percentage"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div id="personal-details" className="space-y-2">
                  <p className="mb-5 text-lg text-white">.</p>

                  <FormField
                    control={form.control}
                    name="defaultPriceListId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Price List</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Default Price List" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">(None)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <p className="text-xs text-white">.</p>
                  </div>
                  <FormField
                    control={form.control}
                    name="subjectToDRCVat"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Subject to DRC VAT</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" variant={"outline"}>
              {isLoading ? "Saving..." : "Add Customer"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default CreateCustomerForm;
