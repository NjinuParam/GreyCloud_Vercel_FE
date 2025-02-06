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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformUserType } from "@/lib/schemas/common-schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { getIronSessionData } from "@/lib/auth/auth";
import AutoComplete from "react-google-autocomplete";
import ButtonSubmitForm from "../../../../../../(auth)/admin/_components/ButtonSubmitForm";
export type UpdateSageOneAssetFormProps = {
  asset: SageOneAssetTypeType;
  depreciationGroups: GetCompanyDepreciationGroupResponseType[];
  sageCompanyId: number;
  user?: PlatformUserType;
  updateUsage?: Function;
  updateAddress?: Function;
  catDescription?: string;
};

export default function UpdateSageOneAssetForm({
  asset,
  depreciationGroups,
  sageCompanyId,
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
  const [recoverableAmount, setRecoverableAmount] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [usage, setUsage] = useState('');
  const [_Id, setId] = useState('');
  // const [category, setCategory] = useState('');
  // const [isRental, setIsRental] = useState(false);
  // const [billingType, setBillingType] = useState('');
  const [isCollection, setIsCollection] = useState(false);
  const [qty, setQty] = useState(0);
  const [createAnother, setCreateAnother] = useState(false);


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
    getIronSessionData().then((comp: any) => {
      const currentCompanyId = comp.companyProfile.loggedInCompanyId;

      // const com = comp.companyProfile.companiesList.find((x:any)=>{x.companyId ==currentCompanyId}).sageCompanyId

      const com = comp.companyProfile.companiesList.filter((x: any) => { return x.companyId == currentCompanyId })[0]?.sageCompanyId

      setCompanyId(com);
      fetch(`${apiUrl}SageOneAsset/AssetCategory/Get?Companyid=${com}`)
        .then((res) =>
          res.json().then((data) => {
            setCategories(data.results);
            setTimeout(() => {
              setCategory(asset?.category?.id?.toString());
            }, 1000);
          })
        )
        .catch((e:any) => console.log(e));
      const p = asset as any;
      fetch(`${apiUrl}SageOneAsset/Asset/GetNewById/${p.assetid}/${com}`)
        .then((res) =>
          res.json().then((data) => {
            // setSageCompanyId(data.sageCompanyId.toString());
            ;
            setAssetName(data.description);
            setAssetCode(data.code);
            setAssetDescription(data.description);
            setStreetAddress(data.locName);
            setPhysicalLocation(data.physicalLocation);
            setDatePurchased(new Date(data.datePurchased));
            setDepreciationStart(data.depreciationStartDate ? new Date(data.depreciationStartDate) : undefined);
            setSerialNumber(data.serialNumber);
            setBoughtFrom(data.boughtFrom);
            setPurchasePrice(data.purchasePrice.toString());
            setReplacementValue(data.replacementValue.toString());
            setRecoverableAmount(data.residual.toString());
            setUsage(data.usage.toString());
            setCategory(data.catDescription || '');
            setIsRental(data.rentalAsset);
          setCategoryId(data.catIid);
            setBillingType(data.billingType.type.toString());
            setIsCollection(false); // Assuming this is not part of the response
            setQty(0); // Assuming this is not part of the response
            setCreateAnother(false); // Assuming this is not part of the response
            setId(data.id)
          })
        )
        .catch((e:any) => console.log(e));
    });
  }, []);


  const [isRental, setIsRental] = useState<boolean>(asset?.billingType?.amount !== 0);
  const [billingType, setBillingType] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState("0");

  const [categoryId, setCategoryId] = useState(0);

  // 

  async function updateAsset() {
    // execute(formattedValues);
debugger;
const _asset = asset as any;
    const payload = {
      assetid: _asset.assetid,
      description: assetName,
      code: assetCode,
      catDescription: categories.filter(x=>x.id == categoryId)[0]?.description,
      catId:categoryId,
      locName: streetAddress,
      physicalLocation: physicalLocation,
      datePurchased: datePurchased,
      depreciationStartDate: depreciationStart,
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
        description: "",
        physicalLocation: "",
        gps: ""
      },
      category: {
        description: "",
        id: 0,
        // modified: "",
        // created: ""
      },

      billingType: {
        type: 0,
        amount: 0,
        usageType: "",
        usageRate: 0
      },
    }

    ;
    try {

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      await fetch(`${apiUrl}SageOneAsset/Asset/Update?CompanyId=${companyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      toast.success(`Asset updated!`, {
        description: "The asset updated was stored successfully.",
      });



    } catch (e: any) {
      toast.error(e.message);
    }

  }



  const handleSubmit = (e:any) => {
    ;
    e.preventDefault();
    updateAsset();
    // Handle form submission
  };


  return (
    <>


      {/* <Form> */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6 justify-center mb-4">

          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Asset name</label>
            <Input
              className="mt-2"
              defaultValue={assetName}
              value={assetName}
              onChange={(e:any) => setAssetName(e.target.value)}
              placeholder=""
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Asset code</label>
            <Input
              className="mt-2"
              value={assetCode}
              onChange={(e:any) => setAssetCode(e.target.value)}
              placeholder=""
            />
          </div>
          <div>
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Category</label>
            <div style={{ marginTop: "7px" }}>
              <Select
                onValueChange={(value) => {setCategoryId(parseInt(value));}}
                
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.description}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description</label>
            <Input
              className="mt-2"
              value={assetDescription}
              onChange={(e:any) => setAssetDescription(e.target.value)}
              placeholder=""
            />
          </div>

          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Street address</label>
            <AutoComplete

              style={{ zIndex: 99999999 }}
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4"
              defaultValue={streetAddress}
              apiKey={"AIzaSyDsGw9PT-FBFk7DvGK46BpvEURMxcfJX5k"}
              onPlaceSelected={(place) => {
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
              onChange={(e:any) => setPhysicalLocation(e.target.value)}
              placeholder="e.g. Room 403"
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Purchase date</label>
            <br /> <input type="date"
              className="mt-2"
              onChange={(e:any) => {

              }}

            />
          </div>

          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Depreciation start date</label>
            <br />   <input type="date"
              className="mt-2"
              onChange={(e:any) => {

              }}

            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Serial number</label>
            <Input
              className="mt-2"
              value={serialNumber}
              onChange={(e:any) => setSerialNumber(e.target.value)}
              placeholder=""
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Purchased from</label>
            <Input
              className="mt-2"
              value={boughtFrom}
              onChange={(e:any) => setBoughtFrom(e.target.value)}
              placeholder=""
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Purchase price</label>

            <Input
              className="mt-2"
              value={purchasePrice}
              onChange={(e:any) => setPurchasePrice(e.target.value)}
              type="number"
              min={0}
              step="0.01"
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Replacement value</label>
            <Input
              className="mt-2"
              value={replacementValue}
              onChange={(e:any) => setReplacementValue(e.target.value)}
              type="number"
              min={0}
              step="0.01"
            />
          </div>
          <div><label className="text-sm mb-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Recoverable amount</label>

            <Input
              className="mt-2"
              value={recoverableAmount}
              onChange={(e:any) => setRecoverableAmount(e.target.value)}
              type="number"
              min={1}
              step="1"

            />
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
        <div>
          <div className="items-top flex space-x-2 mt-5">
            <Checkbox
              id="terms1"
              checked={isRental}
              onCheckedChange={(e:any) => setIsRental(e.valueOf().toString() === "true")}
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
                  <Select
                    onValueChange={(value) => setBillingType(value)}
                  >
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
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div className="w-full pt-4">
          <Button type="submit" >Update Asset</Button>
        </div>

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
