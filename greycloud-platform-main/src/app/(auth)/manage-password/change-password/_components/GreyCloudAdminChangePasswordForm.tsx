"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { UpdateGreyCloudAdminPasswordSchema, UpdateGreyCloudAdminPasswordType } from "@/lib/schemas/greycloud-admin";
import { updateGreyCloudAdminPassword } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { useAuthStore } from "@/store/authSlice";

export default function GreyCloudAdminChangePasswordForm() {
  const router = useRouter();
  const { tempEmail, user, removeUser } = useAuthStore();

  // Define the form:
  const form = useForm<UpdateGreyCloudAdminPasswordType>({
    resolver: zodResolver(UpdateGreyCloudAdminPasswordSchema),
    defaultValues: {
      email: tempEmail ?? user?.email ?? "--replace me--",
      newPassword: "",
      passwordConfirmation: "",
    },
  });

  const { execute, status } = useAction(updateGreyCloudAdminPassword, {
    onSuccess(data, input, reset) {
      if (data) {
        toast.success("Password successfully changed.", {
          description: `Remember your new password, and keep it confidential.`,
        });

        reset();

        // redirect to reset password page:
        if (Boolean(tempEmail)) {
          removeUser();
          router.push("/login");
        }
      } else {
        toast.error("An error has occured:", {
          description: JSON.stringify(data, null, 2),
        });
      }
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
      toast.info("Changing password...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: UpdateGreyCloudAdminPasswordType) {
    execute(values);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} disabled />
                </FormControl>
                {/* <FormDescription>Enter a valid email address.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input placeholder="" type="password" {...field} />
                </FormControl>
                {/* <FormDescription>Enter a valid password.</FormDescription> */}
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
                {/* <FormDescription>Confirm your password.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full pt-2">
            <Button
              size={"lg"}
              type="submit"
              className={cn("w-full font-bold", status === "executing" ? "animate-pulse" : null)}
              disabled={status === "executing"}
            >
              {status === "executing" ? "Changing Password..." : "Change Password"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
