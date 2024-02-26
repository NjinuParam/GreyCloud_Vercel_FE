"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { buildFormData, cn } from "@/lib/utils";
import ButtonSubmitForm from "@/app/(auth)/login/_components/ButtonSubmitForm";
import { addAssetDepreciationHistory } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import {
  AddAssetDepreciationHistorySchema,
  AddAssetDepreciationHistoryType,
  GetCompanyDepreciationGroupResponseType,
} from "@/lib/schemas/depreciation";
import { SageOneAssetTypeType } from "@/lib/schemas/company";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AddDepreciationHistoryFormProps = {
  sageCompanyId: number;
  depreciationGroups: GetCompanyDepreciationGroupResponseType[];
  assets: SageOneAssetTypeType[];
};

export default function AddDepreciationHistoryForm({ sageCompanyId, depreciationGroups, assets }: AddDepreciationHistoryFormProps) {
  const { execute, status } = useAction(addAssetDepreciationHistory, {
    onSuccess() {
      toast.success("Depreciation History added to asset.", {
        description: "This item should now appear in your list of depreciation history list.",
      });
    },
    onError(error) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error),
      });
    },
    onExecute() {
      toast.info("Creating an Asset Depreciation History...");
    },
  });

  // Define the form:
  const form = useForm<AddAssetDepreciationHistoryType>({
    resolver: zodResolver(AddAssetDepreciationHistorySchema),
    defaultValues: {
      assetId: 0,
      depGroupId: "",
      lastValue: 0,
      newValue: 0,
      sageCompanyId: sageCompanyId,
    },
  });

  // Define a submit handler:
  function onSubmit(values: AddAssetDepreciationHistoryType) {
    execute(buildFormData(values));
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="assetId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Asset</FormLabel>
                <Select
                  onValueChange={(selectedAssetId) => {
                    // selectedAssetId will be a string because Select values are always strings,
                    // so it needs to be converted to a number before setting the value.
                    const numericAssetId = Number(selectedAssetId);
                    // Directly set the assetId field value to the numeric ID of the selected asset
                    form.setValue("assetId", numericAssetId);
                  }}
                  defaultValue={field.value.toString()} // Convert the numeric value to a string for the defaultValue
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Asset" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.id.toString()} value={asset.id.toString()}>
                        {asset.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="depGroupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Depreciation Group</FormLabel>
                <Select
                  onValueChange={(selectedDepGroupId) => {
                    // Directly set the depGroupId field value to the selected ID
                    form.setValue("depGroupId", selectedDepGroupId);
                  }}
                  defaultValue={field.value} // field.value is already a string, suitable for defaultValue
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

          <FormField
            control={form.control}
            name="lastValue"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Last Value</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder={form.control._defaultValues.lastValue?.toString()}
                    {...field}
                    type="number"
                    min={0}
                    step="0.01"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newValue"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>New Value</FormLabel>
                <FormControl>
                  <Input
                    className="w-full"
                    placeholder={form.control._defaultValues.newValue?.toString()}
                    {...field}
                    type="number"
                    min={0}
                    step="0.01"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sageCompanyId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Sage Company ID</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder={form.control._defaultValues.sageCompanyId?.toString()} {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full pt-2">
            <ButtonSubmitForm status={status} idleString="Create Depreciation History" executingString="Creating Depreciation History" />
          </div>
        </form>
      </Form>
    </>
  );
}
