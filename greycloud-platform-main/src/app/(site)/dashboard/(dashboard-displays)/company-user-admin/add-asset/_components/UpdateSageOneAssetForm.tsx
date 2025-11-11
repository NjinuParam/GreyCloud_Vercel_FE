"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
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
  SageOneAssetTypeType,
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
import Select from 'react-select';
import { PlatformUserType } from "@/lib/schemas/common-schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { getIronSessionData } from "@/lib/auth/auth";
import AutoComplete from "react-google-autocomplete";
import ButtonSubmitForm from "../../../../../../(auth)/admin/_components/ButtonSubmitForm";
import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "../../../../../../../components/ui/select";
import { Select as UiSelect} from "../../../../../../../components/ui/select" ;
import { SelectValue } from "@radix-ui/react-select";
import { apiFetch, apiPost } from "../../../../../../actions/apiHandler";
import { Skeleton } from "@/components/ui/skeleton";
export type UpdateSageOneAssetFormProps = {
  asset: SageOneAssetTypeType;
  depreciationGroups: GetCompanyDepreciationGroupResponseType[];
  sageCompanyId: number;
  user?: PlatformUserType;
  updateUsage?: Function;
  updateAddress?: Function;
  catDescription?: string;
  closeFn?: Function;
};

export default function UpdateSageOneAssetForm({
  asset,
  depreciationGroups,
  sageCompanyId,
  closeFn
}: UpdateSageOneAssetFormProps) {
  // const [sageCompanyId, setSageCompanyId] = useState('');
  const [assetName, setAssetName] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [assetDescription, setAssetDescription] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [physicalLocation, setPhysicalLocation] = useState('');
  const [datePurchased, setDatePurchased] = useState<Date | undefined>(undefined);
  const [depreciationStart, setDepreciationStart] = useState<Date | undefined>(undefined);
  const [serialNumber, setSerialNumber] = useState('');
  const [boughtFrom, setBoughtFrom] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [replacementValue, setReplacementValue] = useState('');
  const [recoverableAmount, setRecoverableAmount] = useState("1");
  const [companyId, setCompanyId] = useState('');
  const [usage, setUsage] = useState('');
  const [_Id, setId] = useState('');
  // const [category, setCategory] = useState('');
  // const [isRental, setIsRental] = useState(false);
  // const [billingType, setBillingType] = useState('');
  const [isCollection, setIsCollection] = useState(false);
  const [qty, setQty] = useState(0);
  const [createAnother, setCreateAnother] = useState(false);
  const [usageOrDailyAmount, setUsageOrDailyAmount] = useState(0);
  const [onceOffAmount, setOnceOffAmount] = useState(0);
  const [usageType, setUsageType] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const { execute, status } = useAction(saveSageOneAsset, {

    onSuccess(data, _, reset) {
      if (data) {
        toast.success(`Asset saved!`, {
          description: "The asset was edited successfully.",
        });
      } else {
        toast.error("Failed to store asset.", {
          description: "Please try again.",
        });
      }

      reset();
    },

    onError(error) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error, null, 2),
      });
    },

    onExecute() {
      toast.info("Editing asset...");
    },
  });

  // Define a submit handler:

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const comp: any = await getIronSessionData();
        const currentCompanyId = comp.companyProfile.loggedInCompanyId;
        const com = comp.companyProfile.companiesList.filter((x: any) => x.id == currentCompanyId)[0]?.si;
        if (!mounted) return;
        setCompanyId(com);

        const p = asset as any;

        // Fetch categories and asset details in parallel and wait for both to finish
        const [catRes, assetRes] = await Promise.all([
          apiFetch(`${apiUrl}SageOneAsset/AssetCategory/Get?Companyid=${com}`).then((r) => r.json()).catch(() => null),
          apiFetch(`${apiUrl}SageOneAsset/Asset/GetNewById/${p.assetid}/${com}`).then((r) => r.json()).catch(() => null),
        ]);

        if (!mounted) return;

        // categories (guarded)
        setCategories(catRes?.results ?? []);
        // keep previous behavior to set category after a short delay (preserve UX)
        setTimeout(() => {
          setCategory(asset?.category?.id?.toString());
        }, 1000);

        // asset details - fall back to the incoming asset prop when API response is missing
        const data = assetRes ?? p;
        setAssetName(data.description);
        setAssetCode(data.code);
        setAssetDescription(data.description);
        setStreetAddress(data.locName);
        setPhysicalLocation(data.physicalLocation);
        setDatePurchased(data.datePurchased ? new Date(data.datePurchased) : undefined);
        setDepreciationStart(data.depreciationStartDate ? new Date(data.depreciationStartDate) : undefined);
        setSerialNumber(data.serialNumber);
        setBoughtFrom(data.boughtFrom);
        setPurchasePrice(data.purchasePrice?.toString() ?? "");
        setReplacementValue(data.replacementValue?.toString() ?? "");
        // Treat 0/null/undefined residual as default 1
        const residualVal = (data?.residual === undefined || data?.residual === null || Number(data?.residual) === 0)
          ? "1"
          : data.residual.toString();
        setRecoverableAmount(residualVal);
        setUsage(data.usage?.toString() ?? "");
  setCategory(data.catDescription || '');
        setIsRental(!!data.rentalAsset);
        setCategoryId(data.catIid);
        setBillingType(data.billingType?.type?.toString()==0?"daily":data.billingType?.type?.toString()==1?"onceoff":data.billingType?.type?.toString()==2?"onceoffusage":data.billingType?.type?.toString()==3?"usage":"");
        setIsCollection(false);
        setQty(0);
        setCreateAnother(false);
        setId(data.id);
  setUsageType(data.billingType?.usageType ?? "");
  setOnceOffAmount(data.billingType?.amount ?? 0);
  setUsageOrDailyAmount(data.billingType?.usageRate ?? 0);

      } catch (e: any) {
        console.log(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [asset?.assetid]);


  const [isRental, setIsRental] = useState<boolean>(asset?.billingType?.amount !== 0);
  const [billingType, setBillingType] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState("0");
  const [categoryDesc, setCategoryDesc] = useState("");
  const [categoryId, setCategoryId] = useState(0);

  const [GPSLocation, setGPSLocation] = useState("");
  
  // 

  const options = [
    { label: "Daily", value: "0" },
    { label: "Once Off", value: "1" },
    { label: "Once Off + Usage", value: "2" },
    { label: "Usage", value: "3" },
  ];

  async function updateAsset() {
    // execute(formattedValues);

    const _asset = asset as any;
    const formatForBackend = (d: any) => {
      if (!d) return null;
      // If it's already a string, try to parse it and return ISO if possible
      if (typeof d === "string") {
        const parsed = new Date(d);
        return isNaN(parsed.getTime()) ? d : parsed.toISOString();
      }
      // If it's a Date object, return ISO string
      if (d instanceof Date) return d.toISOString();
      try {
        const parsed = new Date(d as any);
        return isNaN(parsed.getTime()) ? String(d) : parsed.toISOString();
      } catch (e) {
        return String(d);
      }
    };

    const payload: any = {
      assetid: _asset.assetid,
      description: assetName,
      code: assetCode,
      catDescription: categories.filter(x => x.id == categoryId)[0]?.description,
      catId: categoryId,
      locName: streetAddress,
      streetAddress: streetAddress,
      physicalLocation: physicalLocation,
      serialNumber: serialNumber,
      boughtFrom: boughtFrom,
      purchasePrice: purchasePrice,
      replacementValue: replacementValue,
      residual: recoverableAmount,
      usage: usage,
      rentalAsset: isRental,
      isCollection: isCollection,
      qty: qty,
      textField1: "",
      textField2: "",
      textField3: "",
      _id: _Id,
      location: {
        id: 0,
        description: streetAddress,
        physicalLocation: physicalLocation,
        gps: GPSLocation
      },
      category: {
        description:categories.filter(x => x.id == categoryId)[0]?.description,
        id: categoryId
        // modified: "",
        // created: ""
      },

      billingType: {
        type: billingType=="daily"?0:billingType=="onceoff"?1:billingType=="onceoffusage"?2:billingType=="usage"?3:0,
        amount: onceOffAmount,
        usageType: usageType,
        usageRate: usageOrDailyAmount
      },
    };

    // Conditionally include date fields only when we have a valid value to avoid sending nulls
    const existingDatePurchased = _asset?.datePurchased;
    if (datePurchased) {
      payload.DatePurchased = formatForBackend(datePurchased);
    } else if (existingDatePurchased) {
      const pd = new Date(existingDatePurchased);
      payload.DatePurchased = isNaN(pd.getTime()) ? existingDatePurchased : pd.toISOString();
    }

    const existingDepreciation = _asset?.depreciationStartDate;
    if (depreciationStart) {
      payload.DepreciationStart = formatForBackend(depreciationStart);
    } else if (existingDepreciation) {
      const ds = new Date(existingDepreciation);
      payload.DepreciationStart = isNaN(ds.getTime()) ? existingDepreciation : ds.toISOString();
    }

    


    try {

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      await apiPost(`${apiUrl}SageOneAsset/Asset/Update?CompanyId=${companyId}`
        , payload);
      toast.success(`Asset updated!`, {
        description: "The asset updated was stored successfully.",
      });

      closeFn && closeFn();



    } catch (e: any) {
      toast.error(e.message);
    }

  }



  const handleSubmit = (e: any) => {
    ;
    e.preventDefault();
    updateAsset();

    // Handle form submission
  };

  const customStyle = {
    option: (base: any) => ({
      ...base,
      backgroundColor: "white",
      font: "black !important",
      zIndex: 999999999999999
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 999999999999999999 })
  }

  const mappedCategories = categories.map(x => { return { label: x.description, value: x.id } });

  const _hasRental = asset?.billingType?.amount !== 0;
  

  return (
    <>
      <form onSubmit={handleSubmit}>
        {loading ? (
          <div className="grid grid-cols-2 gap-6 justify-center mb-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 mb-2 w-32">
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 justify-center mb-4">

          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Asset name</label>
            <Input
              className="mt-2"
              defaultValue={assetName}
              value={assetName}
              onChange={(e: any) => setAssetName(e.target.value)}
              placeholder=""
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Asset code</label>
            <Input
              className="mt-2"
              value={assetCode}
              onChange={(e: any) => setAssetCode(e.target.value)}
              placeholder=""
            />
          </div>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Category</label>
            <div style={{ marginTop: "10px" }}>
              <Select
                styles={customStyle}
                value={
                  mappedCategories.filter(option =>
                    option.value == categoryId)
                }
                onChange={(value) => {
                   setCategoryId(parseInt(value?.value ?? "0"));
                  setCategoryDesc(value?.label ?? "");
                  }}
                options={mappedCategories}
              />

            </div>
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description</label>
            <Input
              className="mt-2"
              value={assetDescription}
              onChange={(e: any) => setAssetDescription(e.target.value)}
              placeholder=""
            />
          </div>

          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Street address</label>
            <AutoComplete

              style={{ zIndex: 99999999 }}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4"
              defaultValue={streetAddress}
              apiKey={"AIzaSyDvgazKlMlD-yi7OHEmee_dRMySNxvRmlI"}
              onPlaceSelected={(place) => {
                
                setGPSLocation(`${place?.geometry?.location?.lat()},${place?.geometry?.location?.lng()}`);
                setStreetAddress(place?.formatted_address);
              }}
              options={{
                types: ["geocode", "establishment"],
                componentRestrictions: { country: "za" },
              }}

            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Physical location</label>
            <Input
              className="mt-2"
              value={physicalLocation}
              onChange={(e: any) => setPhysicalLocation(e.target.value)}
              placeholder="e.g. Room 403"
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Purchase date</label>
            <br /> <input type="date"
              className="mt-2"
              onChange={(e: any) => {
                const v = e.target.value;
                setDatePurchased(v ? new Date(v) : undefined);
              }}
              defaultValue={datePurchased ? format(datePurchased, "yyyy-MM-dd") : ""}

            />
          </div>

          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Depreciation start date</label>
            <br />   <input type="date"
              className="mt-2"

              onChange={(e: any) => {
                const v = e.target.value;
                setDepreciationStart(v ? new Date(v) : undefined);
              }}
              defaultValue={depreciationStart ? format(depreciationStart, "yyyy-MM-dd") : ""}

            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Serial number</label>
            <Input
              className="mt-2"
              value={serialNumber}
              onChange={(e: any) => setSerialNumber(e.target.value)}
              placeholder=""
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Purchased from</label>
            <Input
              className="mt-2"
              required
              value={boughtFrom}
              onChange={(e: any) => setBoughtFrom(e.target.value)}
              placeholder=""
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Purchase price</label>

            <Input
              className="mt-2"
              value={purchasePrice}
              onChange={(e: any) => setPurchasePrice(e.target.value)}
              type="number"
              min={0}
              step="0.01"
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Replacement value</label>
            <Input
              className="mt-2"
              value={replacementValue}
              onChange={(e: any) => setReplacementValue(e.target.value)}
              type="number"
              min={0}
              step="0.01"
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Recoverable amount</label>

            <Input
              defaultValue={recoverableAmount}
              className="mt-2"
              value={recoverableAmount}
              onChange={(e: any) => setRecoverableAmount(e.target.value)}
              type="number"
              min={1}
              step="1"

            />
          </div>
          <div>
                    <label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Rental</label><br/>
                    <div className="mt-4 flex gap-4">

                      <UiSelect value={billingType} onValueChange={(e) => setBillingType(e)}>
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
                      </UiSelect>

                      {billingType === "daily" ? (
                        <div className="w-full">
                          <Input
                            onChange={(e: any) => setUsageOrDailyAmount(e.target.value)}
                            className="w-full"
                            type="number"
                            value={usageOrDailyAmount}
                            placeholder="Price (per day)"
                          />
                        </div>
                      ) : (
                        <></>
                      )}

                      {billingType === "onceoff" ? (
                        <div className="w-full">
                          <Input
                            onChange={(e: any) => setOnceOffAmount(e.target.value)}
                            className="w-full"
                            type="number"
                            value={onceOffAmount}
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
                              onChange={(e: any) => setOnceOffAmount(e.target.value)}
                              className="w-full"
                              type="number"
                              value={onceOffAmount}
                              placeholder="Price (once off)"
                            />
                          </div>
                          <div className="flex flex-row gap-4 w-full mt-2">
                            <UiSelect value={usageType} onValueChange={(e) => setUsageType(e)}>
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
                            </UiSelect>
                          </div>
                          <div className="flex flex-row gap-4 w-full mt-2">
                            <Input
                              onChange={(e: any) => setUsageOrDailyAmount(e.target.value)}
                              className="w-full"
                              type="number"
                              value={usageOrDailyAmount}
                              placeholder="Price (per unit)"
                            />
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}

                      {billingType === "usage" ? (
                        <div className="flex flex-row gap-4 w-full">
                          <UiSelect value={usageType} onValueChange={(e) => setUsageType(e)}>
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
                          </UiSelect>
                          <Input
                            onChange={(e: any) => setUsageOrDailyAmount(e.target.value)}
                            className="w-full"
                            type="number"
                            placeholder="Price (usage)"
                            value={usageOrDailyAmount}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      
                    </div>
                 
          </div>

          {/* <div className="items-top flex space-x-2 mt-5">
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
          </div> */}
          </div>
        )}
        <div>
        
          
        </div>

        <div className="w-full">
          <Button type="submit" >Update Asset</Button>
        </div><br/><br/><br/>
        

        {/* <div style={{ float: "right", marginTop: "15px" }}>
          <p style={{ float: "left", marginRight: "5px" }} className="text-sm text-muted-foreground">
            Add another
          </p>
        </div> */}
      </form>
      {/* </Form> */}


    </>
  );
}
