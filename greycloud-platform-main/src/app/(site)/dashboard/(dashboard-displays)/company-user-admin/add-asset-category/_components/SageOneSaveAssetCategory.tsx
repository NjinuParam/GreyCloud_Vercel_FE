"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SaveSageOneAssetCategorySchema, SaveSageOneAssetCategoryType } from "@/lib/schemas/company";
import { saveSageOneAssetCategory } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { useRouter } from "next/navigation";
import { getIronSessionData } from "../../../../../../../lib/auth/auth";

type SageOneAssetCategorySaveFormProps = {
  callBack?:Function
};

export default function SageOneAssetCategorySaveForm({callBack}: SageOneAssetCategorySaveFormProps) {
  // Define the form:

  const [loading, setLoading] = useState<boolean>(false);
  const [compId, setCompanyId] = useState<number>(14999);

const router = useRouter();  
const form = useForm<SaveSageOneAssetCategoryType>({
    resolver: zodResolver(SaveSageOneAssetCategorySchema),
    defaultValues: {
      SageCompanyId: compId,
      assetCategory: {
        description: "",
        id: Number(0),
        created: new Date(),
        modified: new Date(),
      },
    },
  });

  async function createAssetCategory(data:any) {

    try {
      
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      await fetch(`${apiUrl}SageOneAsset/AssetCategory/Save?CompanyId=${compId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      toast.success(`Asset category saved!`, {
                description: "The asset category was stored successfully.",
              });
              
              // router.refresh();
              callBack && callBack();

    } catch (e: any) {
      toast.error(e.message);
    }
  }

  function create(values: SaveSageOneAssetCategoryType) {
    
    const formattedValues = {
      ...values,
      assetCategory: {
        ...values.assetCategory,
        id: Number(values.assetCategory.id),
      },
    };

    
    createAssetCategory(formattedValues.assetCategory);
    
  }
  
  useEffect(()=>{
    getIronSessionData().then((x:any)=>{
    
      const compId = x.companyProfile.loggedInCompanyId;

     const com = x.companyProfile?.companiesList?.filter((x:any)=>{return x.companyId ==compId})[0];
 ;
      setCompanyId(com?.sageCompanyId ??14999);
    });
  },[])
  
  return (
    <>
      <Form {...form}>
        <Form {...form}>
          <form>
            <div className="grid grid-cols-1 gap-6 justify-center mb-4">
              <FormField
                control={form.control}
                name="SageCompanyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company ID</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assetCategory.description"
                render={({ field }) => (
                  <FormItem className="flex-1 grow min-w-full">
                    <FormLabel>Asset Category Description</FormLabel>
                    <FormControl>
                      <Input placeholder={form.control._defaultValues.assetCategory?.description} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assetCategory.id"
                render={({ field }) => (
                  <FormItem className="flex-1 grow min-w-full">
                    <FormLabel>Asset Category ID</FormLabel>
                    <FormControl>
                      <Input placeholder={form.control._defaultValues.assetCategory?.id?.toString()} {...field} type="number" min={0} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full pt-2">
              <button
                className={cn("w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full font-bold", loading? "animate-pulse" : "")}
                onClick={(e)=>{ e.preventDefault(); create(form.getValues());}}
                disabled={loading}
              >
                {loading ? "Saving Category..." : "Save Category"}
              </button>
            </div>
          </form>
        </Form>
      </Form>
    </>
  );
}
