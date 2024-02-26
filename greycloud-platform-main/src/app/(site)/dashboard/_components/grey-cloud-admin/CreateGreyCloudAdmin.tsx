"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { buildFormData, cn } from "@/lib/utils";
import { RegisterGreyCloudAdminRequestModelSchema, RegisterGreyCloudAdminType } from "@/lib/schemas/greycloud-admin";
import { createGreyCloudAdmin } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";

export default function CreateGreyCloudAdminForm() {
  // Define the form:
  const form = useForm<RegisterGreyCloudAdminType>({
    resolver: zodResolver(RegisterGreyCloudAdminRequestModelSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "TemporaryPassword123!",
      passwordConfirmation: "TemporaryPassword123!",
      role: "GreyCloud_Admin",
    },
  });

  const { execute, result, status, reset } = useAction(createGreyCloudAdmin, {
    onSuccess(data, input, reset) {
      toast.success("Admin successfully created.", {
        description: `Admin was registered.`,
      });

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
      toast.info("Creating Admin...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: RegisterGreyCloudAdminType) {
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="" type="password" {...field} disabled />
                </FormControl>
                <FormDescription>Default password has already been set for new admin.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input className="w-full" placeholder="" {...field} disabled />
                </FormControl>
                <FormDescription>Admin role has already been set for new admin.</FormDescription>
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
              {status === "executing" ? "Adding Admin..." : "Add Admin"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
