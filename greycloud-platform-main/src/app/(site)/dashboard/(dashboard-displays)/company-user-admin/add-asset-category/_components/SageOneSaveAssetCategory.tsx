"use client";

import React from "react";
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

export default function SageOneAssetCategorySaveForm() {
  // Define the form:
  const form = useForm<SaveSageOneAssetCategoryType>({
    resolver: zodResolver(SaveSageOneAssetCategorySchema),
    defaultValues: {
      SageCompanyId: 14999,
      assetCategory: {
        description: "Electronics",
        id: Number(0),
        created: new Date(),
        modified: new Date(),
      },
    },
  });

  const { execute, status } = useAction(saveSageOneAssetCategory, {
    onSuccess(data, input, reset) {
      if (data) {
        toast.success(`Asset saved!`, {
          description: "The asset category was stored successfully.",
        });
      } else {
        toast.error("Failed to store asset category.", {
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
      toast.info("Saving asset category...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: SaveSageOneAssetCategoryType) {
    const formattedValues = {
      ...values,
      assetCategory: {
        ...values.assetCategory,
        id: Number(values.assetCategory.id),
      },
    };

    execute(formattedValues);
  }

  return (
    <>
      <Form {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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

              {/* <FormField
                control={form.control}
                name="assetCategory.created"
                render={({ field }) => (
                  <FormItem className="flex-1 grow min-w-full">
                    <FormLabel>Date Created</FormLabel>
                    <FormControl><Input placeholder="" {...field} type="date"/></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assetCategory.modified"
                render={({ field }) => (
                  <FormItem className="flex-1 grow min-w-full">
                    <FormLabel>Date Modified</FormLabel>
                    <FormControl><Input placeholder="" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            <div className="w-full pt-2">
              <Button
                className={cn("w-full font-bold", status === "executing" ? "animate-pulse" : null)}
                size={"lg"}
                type="submit"
                disabled={status === "executing"}
              >
                {status === "executing" ? "Saving Asset..." : "Save Asset"}
              </Button>
            </div>
          </form>
        </Form>
      </Form>
    </>
  );
}
