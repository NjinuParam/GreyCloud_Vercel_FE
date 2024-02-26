"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LoginGreyCloudAdminSchema, LoginGreyCloudAdminType } from "@/lib/schemas/greycloud-admin";
import { loginGreyCloudAdmin } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { useAuthStore } from "@/store/authSlice";

export default function GreyCloudAdminLoginForm() {
  const { storeUser } = useAuthStore();

  const router = useRouter();

  // Define the form:
  const form = useForm<LoginGreyCloudAdminType>({
    resolver: zodResolver(LoginGreyCloudAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { execute, status } = useAction(loginGreyCloudAdmin, {
    onSuccess(data, input, reset) {
      if (data) {
        toast.success(`Welcome, ${data.name}!`, {
          description: "You can now access the GreyCloud Admin dashboard.",
        });

        storeUser(
          {
            id: data.id,
            name: data.name,
            surname: data.surname,
            email: data.email,
            role: data.role,
            companyId: null,
            company: null,
          },
          true
        );

        router.push("/dashboard");
      } else {
        toast.error("Incorrect credentials.", {
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
      toast.info("Logging in...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: LoginGreyCloudAdminType) {
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
                  {/* <FormDescription>Enter your email address</FormDescription> */}
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
                  {/* <FormDescription>Enter your password</FormDescription> */}
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
                  {/* <FormDescription>Remember me.</FormDescription> */}
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
                {status === "executing" ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </Form>
      </Form>
    </>
  );
}
