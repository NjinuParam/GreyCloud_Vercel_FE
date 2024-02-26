"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { buildFormData, cn } from "@/lib/utils";
import { CreateSageCompanyRequestModelType, CreateSageCompanyRequestModelSchema } from "@/lib/schemas/greycloud-admin";
import { createGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { revalidateTag } from "next/cache";

export default function CreateSageCompanyForm() {
  // Define the form:
  const form = useForm<CreateSageCompanyRequestModelType>({
    resolver: zodResolver(CreateSageCompanyRequestModelSchema),
    defaultValues: {
      companyName: "",
      email: "",
      password: "",
      apiKey: "",
      sageCompanyId: 0,
      contactName: "",
      contactEmail: "",
      contactNumber: "",
    },
  });

  const { execute, status } = useAction(createGreyCloudCompany, {
    onSuccess(data, input, reset) {
      toast.success("Company successfully created.", {
        description: `Company was registered.`,
      });

      revalidateTag("all-sage-companies");

      reset();
      form.reset();
    },

    onError(error, input, reset) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error),
      });
    },

    onSettled(result, input, reset) {
      reset();
    },

    onExecute(input) {
      toast.info("Creating Company...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: CreateSageCompanyRequestModelType) {
    execute(buildFormData(values));
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-row gap-2 items-center min-w-full">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input className="w-full" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="w-full" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sageCompanyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sage Company ID</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row gap-2 items-center min-w-full">
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full pt-2">
            <Button
              className={cn("w-full font-bold", status === "executing" ? "animate-pulse" : null)}
              size={"lg"}
              type="submit"
              disabled={status === "executing"}
            >
              {status === "executing" ? "Registering Company..." : "Register Company"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
