"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SageOneAssetLocationSchema, SageOneAssetLocationType } from "@/lib/schemas/company";
import { saveSageOneAssetLocation } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";

export default function SageOneAssetLocationSaveForm() {
  // Define the form:
  const form = useForm<SageOneAssetLocationType>({
    resolver: zodResolver(SageOneAssetLocationSchema),
    defaultValues: {
      SageCompanyId: 14999,
      description: "Food",
      id: 0,
    },
  });

  const { execute, status } = useAction(saveSageOneAssetLocation, {
    onSuccess(data, input, reset) {
      if (data) {
        toast.success(`Asset saved!`, {
          description: "The asset location was stored successfully.",
        });
      } else {
        toast.error("Failed to store asset location.", {
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
  function onSubmit(values: SageOneAssetLocationType) {
    execute(values);
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
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex-1 grow min-w-full">
                    <FormLabel>Asset Location Description</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem className="flex-1 grow min-w-full">
                    <FormLabel>Asset Location ID</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
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
                {status === "executing" ? "Saving Asset..." : "Save Asset"}
              </Button>
            </div>
          </form>
        </Form>
      </Form>
    </>
  );
}
