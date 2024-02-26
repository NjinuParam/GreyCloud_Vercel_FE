"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { loginCompanyUser } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { LoginCompanyUserSchema, LoginCompanyUserType } from "@/lib/schemas/company-user";
import { useAuthStore } from "@/store/authSlice";
import ButtonSubmitForm from "./ButtonSubmitForm";

export default function CompanyUserLoginForm() {
  const { storeUser } = useAuthStore();
  const router = useRouter();

  // Define the form:
  const form = useForm<LoginCompanyUserType>({
    resolver: zodResolver(LoginCompanyUserSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { execute, status } = useAction(loginCompanyUser, {
    onSuccess(data) {
      if (data) {
        router.push("/dashboard");

        toast.success(`Welcome, ${data.name}!`, {
          description: "You can now access the user dashboard.",
        });

        storeUser(
          {
            id: data.id,
            name: data.name,
            surname: data.surname,
            email: data.email,
            role: data.role,
            companyId: data.companyId,
            company: null,
          },
          true
        );
      } else {
        toast.error("Incorrect credentials.", {
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
      toast.info("Logging in...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: LoginCompanyUserType) {
    execute(values);
  }

  return (
    <>
      <Form {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="rememberMe"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2 pt-2">
                    <FormControl>
                      <Checkbox id="rememberMe" checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="text-muted-foreground">Remember me?</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full pt-2">
              <ButtonSubmitForm status={status} idleString="Login" executingString="Logging in..." />
            </div>
          </form>
        </Form>
      </Form>
    </>
  );
}
