"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { getIronSessionData } from "@/lib/auth/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  SaveSageOneAssetSchema,
  SaveSageOneAssetType,
} from "@/lib/schemas/company";
import { saveSageOneAsset } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GetCompanyDepreciationGroupResponseType } from "@/lib/schemas/depreciation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import ButtonSubmitForm from "@/app/(auth)/login/_components/ButtonSubmitForm";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

 const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

type SageOneAssetSaveFormProps = {
  children?: React.ReactNode;
  depreciationGroups: GetCompanyDepreciationGroupResponseType[];
  SageCompanyId: number;
};

export default function SageOneAssetSaveForm({
  depreciationGroups,
  SageCompanyId,
  children,
}: SageOneAssetSaveFormProps) {
  const form = useForm<SaveSageOneAssetType>({
    resolver: zodResolver(SaveSageOneAssetSchema),
    defaultValues: {
      SageCompanyId: Number(SageCompanyId),
      asset: {
        description: "Sample Product",
        category: {
          description: "Electronics",
          id: 8184,
          modified: new Date(),
          created: new Date(),
        },
        location: {
          id: 10220,
          description: "Living Room",
        },
        datePurchased: new Date(),
        serialNumber: "ABC_123",
        boughtFrom: "Electronics Store",
        purchasePrice: 500,
        currentValue: 350,
        replacementValue: 600,
        textField1: "Additional Info 1",
        textField2: "Additional Info 2",
        textField3: "Additional Info 3",
        numericField1: 10,
        numericField2: 20,
        numericField3: 30,
        yesNoField1: true,
        yesNoField2: false,
        yesNoField3: true,
        dateField1: new Date(),
        dateField2: new Date(),
        dateField3: new Date(),
        id: 0,
        assetDepreciationGroupRequestModel: {
          active: depreciationGroups[0].active,
          assetId: 0,
          creatingUser: depreciationGroups[0].creatingUser,
          depGroupId: depreciationGroups[0].depGroupId,
        },
        billingType:{
          type:  0,
          amount:  0,
          usageType:  "",
          usageRate:  0,
          
        }
      },
    },
  });


  useEffect(() => {

    getIronSessionData().then((comp: any) => {
      let currentCompanyId = comp.companyId;

      let sageId = comp.companyProfile.companiesList.find(
        (x) => x.companyId == currentCompanyId
      )?.sageCompanyId;
      fetch(`${apiUrl}SageOneAsset/AssetCategory/Get?Companyid=${sageId}`)
        .then((res) => res.json().then((data) => { setCategories(data.results); debugger; }))
        .catch((e) => console.log(e));
    });
  }, []);


  const { execute, status } = useAction(saveSageOneAsset, {
    onSuccess(data, input, reset) {
      if (data) {
        toast.success(`Asset saved!`, {
          description: "The asset was stored successfully.",
        });
      } else {
        toast.error("Failed to store asset.", {
          description: "Please try again.",
        });
      }

      reset();
    },

    onError(error, input, reset) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error, null, 2),
      });
    },

    onSettled(result, input, reset) {
      reset();
    },

    onExecute(input) {
      toast.info("Saving asset...");
    },
  });

  
   async function createAsset(input:any){
    toast.info("Saving asset...");

    const response = await fetch(`https://grey-cloud-be.azurewebsites.net/SageOneAsset/Asset/Save?Companyid=14999&quantity=1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (response) {
      toast.success(`Asset saved!`, {
        description: "The asset was stored successfully.",
      });
    } else {
      toast.error("Failed to store asset.", {
        description: "Please try again.",
      });
    }
  }


  // Define a submit handler:
  function onSubmit(values: SaveSageOneAssetType) {
  
    const formattedValues = {
      ...values,
      SageCompanyId: Number(values.SageCompanyId),
      asset: {
        ...values.asset,
        purchasePrice: Number(values.asset.purchasePrice),
        currentValue: Number(values.asset.currentValue),
        replacementValue: Number(values.asset.replacementValue),
        numericField1: Number(values.asset.numericField1),
        numericField2: Number(values.asset.numericField2),
        numericField3: Number(values.asset.numericField3),
        assetDepreciationGroupRequestModel: {
          ...values.asset.assetDepreciationGroupRequestModel,
          active: Boolean(
            values.asset.assetDepreciationGroupRequestModel.active
          ),
          assetId: 0,
        },
        billingType: {
          type: billingType=="daily"?0: billingType=="onceoff"?1: billingType == "onceoffusage"?2: 3,
          amount: billingType=="onceoffusage"?onceOffAmount: usageOrDailyAmount,
          usageType: usageType,
          usageRate: usageOrDailyAmount
        },
      },
     
      quantity: qty,
    };

    // execute(formattedValues);
    createAsset(formattedValues.asset);
  }



  const [qty, setQty] = useState(1);
  const [isCollection, setIsCollection] = useState("");
  const [category, setCategory] = useState("0");
  const [billingType, setBillingType] = useState("");
  const [usageType, setUsageType] = useState("");
  const [isRental, setIsRental] = useState(false);
  const [categories, setCategories] = useState([]);

  const [usageOrDailyAmount, setUsageOrDailyAmount] = useState(0);
  const [onceOffAmount, setOnceOffAmount] = useState(0);

  return (
    <>
      <Form {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-6 justify-center mb-4">
              <FormField
                control={form.control}
                name="SageCompanyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company ID</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset.description"
                render={({ field }) => (
                  <FormItem className="flex-1 grow min-w-full">
                    <FormLabel>Asset Description</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Category</label>
                <div style={{ marginTop: "7px" }}>
                  <Select

                    onValueChange={(e) => {
                      console.log(e);
                      const cat = categories.find((x:any) => x.description == e).id;
                      setCategory(cat);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {categories.map((c: any) => (
                          <SelectItem key={c.id} value={c.description}>
                            {c.description}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* <FormField
                control={form.control}
                name="asset.category.description"
                render={({ field }) => (
                  <FormItem className="flex-1 grow min-w-full">
                    <FormLabel>Asset Category Description</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="asset.location.description"
                render={({ field }) => (
                  <FormItem className="flex-1 grow min-w-full">
                    <FormLabel>Location Description</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset.datePurchased"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full grow min-w-full">
                    <FormLabel>Date Purchased</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="asset.datePurchased"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full grow min-w-full">
                    <FormLabel>Depreciation Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset.serialNumber"
                render={({ field }) => (
                  <FormItem className="flex-1 grow min-w-full">
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset.boughtFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bought From</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset.purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset.replacementValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Replacement Value</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

        
            </div>
            {/* TODO: Add a suspend button on manage asset modal */}

            <div className="items-top flex space-x-2 mt-5">
              <Checkbox

                onCheckedChange={(e) => setIsCollection(e.valueOf().toString())}
                id="isCollection"
              />

              <div className="flex flex-col w-full">
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark asset as a collection
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Create multiple identical assets
                  </p>
                </div>
              </div>
            </div>
            {isCollection == "true" ? (
              <div className="mt-2 ml-5">
                <Label htmlFor="qty">Quantity</Label>
                <Input
                  style={{ width: "50%" }}
                  value={qty}
                  min={2}
                  max={20}
                  onChange={(e) => setQty(parseInt(e.target.value))}
                  type="number"
                  id="qty"
                  placeholder="Quantity"
                />
              </div>
            ) : (
              <></>
            )}
            <div>
              <div className="items-top flex space-x-2 mt-5">
                <Checkbox
                  id="terms1"
                  onCheckedChange={(e) => {
                    if (e.valueOf().toString() == "true") {
                      setIsRental(true);
                    } else {
                      setIsRental(false);
                    }
                  }}
                />

                <div className="flex flex-col w-full">
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Rental
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Mark this asset as a rental.
                    </p>
                  </div>

                  {isRental ? (
                    <div className="mt-4 flex gap-4">
                      <Select onValueChange={(e) => setBillingType(e)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Billing type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Billing type</SelectLabel>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="onceoff">Once Off</SelectItem>
                            <SelectItem value="onceoffusage">
                              Once Off + Usage
                            </SelectItem>
                            <SelectItem value="usage">Usage</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {billingType === "daily" ? (
                        <div className="w-full">
                          <Input
                          onChange={(e:any) => setUsageOrDailyAmount(e.target.value)}
                            className="w-full"
                            type="number"
                            placeholder="Price per day"
                          />
                        </div>
                      ) : (
                        <></>
                      )}

                      {billingType === "onceoff" ? (
                        <div className="w-full">
                          <Input
                          onChange={(e:any) => setOnceOffAmount(e.target.value)}
                            className="w-full"
                            type="number"
                            placeholder="Price (once off)"
                          />
                        </div>
                      ) : (
                        <></>
                      )}

                      {billingType === "onceoffusage" ? (
                        <div>
                          <div className="flex flex-row gap-4 w-full">
                            <Input
                            onChange={(e:any) => setOnceOffAmount(e.target.value)}
                              className="w-full"
                              type="number"
                              placeholder="Price (once off)"
                            />
                          </div>
                          <div className="flex flex-row gap-4 w-full mt-2">
                            <Select onValueChange={(e) => setUsageType(e)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Usage type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Usage type</SelectLabel>
                                  <SelectItem value="km">KM</SelectItem>
                                  <SelectItem value="hours">Hours</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex flex-row gap-4 w-full mt-2">
                            <Input
                            onChange={(e:any) => setUsageOrDailyAmount(e.target.value)}
                              className="w-full"
                              type="number"
                              placeholder="Price (usage)"
                            />
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}

                      {billingType === "usage" ? (
                        <div className="flex flex-row gap-4 w-full">
                          <Select onValueChange={(e) => setUsageType(e)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Usage type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Usage type</SelectLabel>
                                <SelectItem value="km">KM</SelectItem>
                                <SelectItem value="hours">Hours</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                          <Input
                           onChange={(e:any) => setUsageOrDailyAmount(e.target.value)}
                            className="w-full"
                            type="number"
                            placeholder="Price (usage)"
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full pt-4">
              <ButtonSubmitForm
                executingString="Saving Asset..."
                idleString="Save Asset"
                status={status}
              />
            </div>
          </form>
        </Form>
      </Form>
    </>
  );
}
