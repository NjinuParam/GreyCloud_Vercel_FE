"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { AddCompanyDepreciationGroupSchema, AddCompanyDepreciationGroupType } from "@/lib/schemas/depreciation";
import { addCompanyDepreciationGroup } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { SageCompanyResponseType } from "@/lib/schemas/company";
import { CompanyUserOfSpecificCompanyResponseSchema } from "@/lib/schemas/company-user";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ButtonSubmitForm from "@/app/(auth)/login/_components/ButtonSubmitForm";
import { Coins, Percent } from "lucide-react";

type AddDepreciationGroupFormProps = {
  myCompany: SageCompanyResponseType;
  myProfile: CompanyUserOfSpecificCompanyResponseSchema;
};

export default function AddDepreciationGroupForm({ myCompany, myProfile }: AddDepreciationGroupFormProps) {
  const form = useForm<AddCompanyDepreciationGroupType>({
    resolver: zodResolver(AddCompanyDepreciationGroupSchema),
    defaultValues: {
      depName: "",
      companyId: myCompany?.id ?? "--company--",
      creatingUser: myProfile?.id ?? "--me--",
      depAmount: Number(0),
      period: Number(0),
      active: true,
    },
  });

  const handleToggleIsMoney = (value: string) => {
    form.setValue("isMoney", value === "rand");
  };

  const { execute, status } = useAction(addCompanyDepreciationGroup, {
    onSuccess(data) {
      if (data) {
        toast.success(`Company Depreciation Group saved!`, {
          description: "The depreciation group was stored successfully.",
        });
      } else {
        toast.error("Failed to store depreciation group.", {
          description: "Please try again.",
        });
      }
    },

    onError(error) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error, null, 2),
      });
    },

    onExecute() {
      toast.info("Saving Depreciation Group...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: AddCompanyDepreciationGroupType) {
    const formattedValues = {
      ...values,
      depAmount: Number(values.depAmount),
      period: Number(values.period),
    };

    execute(formattedValues);
  }

  return (
    <>
      <Form {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="depName"
              render={({ field }) => (
                <FormItem className="flex-1 grow min-w-full">
                  <FormLabel>Depreciation Group Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row justify-between w-full gap-2">
              <FormField
                control={form.control}
                name="depAmount"
                render={({ field }) => (
                  <FormItem className="flex-1 grow">
                    <FormLabel>{form.watch("isMoney") ? "Depreciation Amount (in Rands)" : "Depreciation Percentage"}</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min={0} step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ToggleGroup type="single" defaultValue="rand" onValueChange={handleToggleIsMoney} className="self-end">
                <ToggleGroupItem value="rand" aria-label="Rand">
                  <Coins className="size-5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="percentage" aria-label="Percentage">
                  <Percent className="size-5" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem className="flex-1 grow min-w-full">
                  <FormLabel>Period (in Months)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min={0} step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full pt-2">
              <ButtonSubmitForm executingString="Saving Depreciation Group..." idleString="Save Depreciation Group" status={status} />
            </div>
          </form>
        </Form>
      </Form>
    </>
  );
}
