"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resetGreyCloudAdminAccountPassword } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { EmailOnlySchema, EmailOnlyType } from "@/lib/schemas/common-schemas";
import { useAuthStore } from "@/store/authSlice";

export default function ForgotPasswordGreyCloudAdminForm() {
  const router = useRouter();
  const { setTempEmail, updateUserField } = useAuthStore();

  // Define the form:
  const form = useForm<EmailOnlyType>({
    resolver: zodResolver(EmailOnlySchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, status } = useAction(resetGreyCloudAdminAccountPassword, {
    onSuccess(data, input, reset) {
      if (!data || data === null) {
        toast.error("This email is not linked to any GreyCloud Admin account.", {
          description: `Please check the email you entered and try again.`,
        });

        reset();
      } else {
        toast.success("GreyCloud Admin: One Time Pin (OTP) sent successfully.", {
          description: `Password reset instructions sent to your email.`,
        });

        reset();

        updateUserField("role", "Company_Admin");
        setTempEmail(input.email);

        // redirect to OTP page:
        router.push("/manage-password/reset-password");
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
      toast.info("Sending OTP...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: EmailOnlyType) {
    execute({
      email: values.email,
    });
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
                  <Input placeholder="" {...field} />
                </FormControl>
                {/* <FormDescription>Enter a valid email address.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full pt-2">
            <Button className="w-full font-bold" size={"lg"} type="submit" disabled={status === "executing"}>
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
