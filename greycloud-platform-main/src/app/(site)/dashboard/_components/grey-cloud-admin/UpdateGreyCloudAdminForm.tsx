"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { buildFormData, cn } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { GreyCloudAllAdminsResponseType, UpdateGreyCloudAdminRequestModelSchema, UpdateGreyCloudAdminType } from "@/lib/schemas/greycloud-admin";
import { updateGreyCloudAdmin } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";

export default function UpdateGreyCloudAdminForm({ user }: { user: GreyCloudAllAdminsResponseType }) {
  // Define the form:
  const form = useForm<UpdateGreyCloudAdminType>({
    resolver: zodResolver(UpdateGreyCloudAdminRequestModelSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    },
  });

  const { execute, status } = useAction(updateGreyCloudAdmin, {
    onSuccess(data, input, reset) {
      toast.success("GreyCloud admin successfully updated.", {
        description: `Changes applied to the admin account.`,
      });
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
      toast.info("Updating Admin...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: UpdateGreyCloudAdminType) {
    execute(buildFormData(values));
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
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

          <div className="w-full pt-2">
            <Button
              className={cn("w-full font-bold", status === "executing" ? "animate-pulse" : null)}
              size={"lg"}
              type="submit"
              disabled={status === "executing"}
            >
              {status === "executing" ? "Updating Admin..." : "Update Admin"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
