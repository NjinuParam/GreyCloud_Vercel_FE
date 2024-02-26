"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { buildFormData, cn } from "@/lib/utils";
import { CreateCompanyUserRequestModelSchema, CreateCompanyUserType } from "@/lib/schemas/company-user";
import { RolesCompanyOptions } from "@/lib/schemas/common-schemas";
import { createCompanyUser } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { SageCompanyResponseType } from "@/lib/schemas/company";

type CompanyUserAddUserFormProps = {
  myCompany: SageCompanyResponseType;
};

export default function CompanyUserAddUserForm({ myCompany }: CompanyUserAddUserFormProps) {
  const { execute, status } = useAction(createCompanyUser, {
    onSuccess() {
      toast.success("User added to your organization.", {
        description: "The user should now appear in your list of users.",
      });

      form.reset();
    },
    onError(error) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error),
      });
    },
    onExecute() {
      toast.info("Creating Company User...");
    },
  });

  // Define the form:
  const form = useForm<CreateCompanyUserType>({
    resolver: zodResolver(CreateCompanyUserRequestModelSchema),
    defaultValues: {
      companyId: myCompany.id,
      name: "",
      surname: "",
      email: "",
      password: "TemporaryPassword#123",
      passwordConfirmation: "TemporaryPassword#123",
      role: "Company_User",
    },
  });

  // Define a submit handler:
  function onSubmit(values: CreateCompanyUserType) {
    execute(buildFormData({ ...values, companyId: myCompany.id }));
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-row space-x-6 w-full">
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
                <FormItem className="w-full">
                  <FormLabel>Surname</FormLabel>
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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RolesCompanyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.displayName}
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Company</FormLabel>
                <FormControl>
                  {/* <Input className="w-full" placeholder={form.control._defaultValues.companyId} {...field} disabled /> */}
                  <Input className="w-full" {...field} placeholder={myCompany.companyName} value={myCompany.companyName} disabled />
                </FormControl>
                <FormDescription>You can only add users to your own company.</FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="" type="password" {...field} disabled />
                </FormControl>
                <FormDescription>New user will need to set their new password.</FormDescription>

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
              {status === "executing" ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
