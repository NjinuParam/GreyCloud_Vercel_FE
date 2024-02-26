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
import { SaveSageOneAssetSchema, SaveSageOneAssetType } from "@/lib/schemas/company";
import { saveSageOneAsset } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GetCompanyDepreciationGroupResponseType } from "@/lib/schemas/depreciation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ButtonSubmitForm from "@/app/(auth)/login/_components/ButtonSubmitForm";

type SageOneAssetSaveFormProps = {
  children?: React.ReactNode;
  depreciationGroups: GetCompanyDepreciationGroupResponseType[];
  SageCompanyId: number;
};

export default function SageOneAssetSaveForm({ depreciationGroups, SageCompanyId, children }: SageOneAssetSaveFormProps) {
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
      },
    },
  });

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
          assetId: 0,
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
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
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

              <div className="flex flex-row gap-6 items-end">
                <FormField
                  control={form.control}
                  name="asset.assetDepreciationGroupRequestModel"
                  render={({ field }) => (
                    <FormItem className="min-w-full flex-1 flex-shrink-0">
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
                        defaultValue={field.value.depGroupId}
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

                {children}
              </div>
            </div>

            <div className="w-full pt-4">
              <ButtonSubmitForm executingString="Saving Asset..." idleString="Save Asset" status={status} />
            </div>
          </form>
        </Form>
      </Form>
    </>
  );
}
