"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { buildFormData, cn } from "@/lib/utils";
import { CreateCompanyUserRequestModelSchema, CreateCompanyUserType } from "@/lib/schemas/company-user";
import { RolesCompanyOptions } from "@/lib/schemas/common-schemas";
import { createCompanyUser } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";

export default function CompanyUserRegisterForm() {
  const router = useRouter();

  const { execute, status } = useAction(createCompanyUser, {
    onSuccess(data, input, reset) {
      router.push("/login");

      toast.success("Account registered successfully.", {
        description: "You may now log in.",
      });

      reset();
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
      toast.info("Creating Account...");
    },
  });

  // Define the form:
  const form = useForm<CreateCompanyUserType>({
    resolver: zodResolver(CreateCompanyUserRequestModelSchema),
    defaultValues: {
      companyId: "",
      name: "",
      surname: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      role: undefined,
    },
  });

  // Define a submit handler:
  function onSubmit(values: CreateCompanyUserType) {
    execute(buildFormData(values));
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-row space-x-4 w-full">
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

          <div className="flex flex-row space-x-4 w-full">
            <div className="min-w-full">
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
            </div>

            <div className="min-w-full">
              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem className="min-w-full flex-1">
                    <FormLabel>Company ID</FormLabel>
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
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="" type="password" {...field} />
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
              {status === "executing" ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
