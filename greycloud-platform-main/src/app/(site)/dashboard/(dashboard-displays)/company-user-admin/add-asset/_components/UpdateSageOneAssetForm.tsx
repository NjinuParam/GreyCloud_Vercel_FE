"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SageOneAssetTypeType, SaveSageOneAssetSchema, SaveSageOneAssetType } from "@/lib/schemas/company";
import { saveSageOneAsset } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GetCompanyDepreciationGroupResponseType } from "@/lib/schemas/depreciation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlatformUserType } from "@/lib/schemas/common-schemas";

export type UpdateSageOneAssetFormProps = {
  asset: SageOneAssetTypeType;
  depreciationGroups: GetCompanyDepreciationGroupResponseType[];
  sageCompanyId: number;
  user?: PlatformUserType;
};

export default function UpdateSageOneAssetForm({ asset, depreciationGroups, sageCompanyId }: UpdateSageOneAssetFormProps) {
  const form = useForm<SaveSageOneAssetType>({
    resolver: zodResolver(SaveSageOneAssetSchema),
    defaultValues: {
      SageCompanyId: Number(sageCompanyId),
      asset: {
        ...asset,
        assetDepreciationGroupRequestModel: {
          active: depreciationGroups[0].active,
          assetId: asset.id,
          creatingUser: depreciationGroups[0].creatingUser,
          depGroupId: depreciationGroups[0].depGroupId,
        },
      },
    },
  });

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
  function onSubmit(values: SaveSageOneAssetType) {
    const formattedValues: SaveSageOneAssetType = {
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
          active: Boolean(values.asset.assetDepreciationGroupRequestModel.active),
          assetId: Number(values.asset.assetDepreciationGroupRequestModel.assetId),
        },
      },
    };

    execute(formattedValues);
  }

  return (
    <>
      <Form {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-6 justify-center mb-4">
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

              <FormField
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
              />

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
                name="asset.id"
                render={({ field }) => (
                  <FormItem className="flex-1 grow min-w-full">
                    <FormLabel>Asset ID</FormLabel>
                    <FormControl>
                      <Input placeholder={form.control._defaultValues.asset?.id?.toString()} {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
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
                      <Input placeholder="" {...field} type="number" min={0} step="0.01" />
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
                      <Input placeholder="" {...field} type="number" min={0} step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset.currentValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Value</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} type="number" min={0} step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="asset.assetDepreciationGroupRequestModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depreciation Group</FormLabel>
                    <Select
                      onValueChange={(selectedDepGroupId) => {
                        // Find the full depreciation group object based on the selected ID
                        const selectedGroup = depreciationGroups.find((group) => group.depGroupId === selectedDepGroupId);

                        // Update the form field with the selected group's full object
                        // Ensure to preserve other properties of the assetDepreciationGroupRequestModel object if needed
                        form.setValue("asset.assetDepreciationGroupRequestModel", {
                          ...field.value, // Preserve other fields if necessary
                          ...selectedGroup, // Spread the selected group's properties
                          depGroupId: selectedDepGroupId, // Ensure the depGroupId is set correctly
                        });
                      }}
                      // defaultValue={field.value.depGroupId}
                      defaultValue={form.control._defaultValues.asset?.assetDepreciationGroupRequestModel?.depGroupId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Depreciation Group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {depreciationGroups?.map((option) => (
                          <SelectItem key={option.depGroupId} value={option.depGroupId}>
                            {option.depName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                {status === "executing" ? "Edting Asset..." : "Edit Asset"}
              </Button>
            </div>
          </form>
        </Form>
      </Form>
    </>
  );
}
