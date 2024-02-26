"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authSlice";
import { verifyCompanyUserOTP } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { OTPCompanyUserSchema, OTPCompanyUserType } from "@/lib/schemas/company-user";

export default function ResetPasswordCompanyUserForm() {
  const router = useRouter();

  const { tempEmail, user } = useAuthStore();

  // Define the form:
  const form = useForm<OTPCompanyUserType>({
    resolver: zodResolver(OTPCompanyUserSchema),
    defaultValues: {
      email: tempEmail ?? user?.email ?? "--replace me--",
      code: "",
    },
  });

  const { execute, status } = useAction(verifyCompanyUserOTP, {
    onSuccess(data, input, reset) {
      if (data === null) {
        toast.error("This email is not linked to any GreyCloud Admin account.", {
          description: `Please check the email you entered and try again.`,
        });

        reset();
      } else {
        toast.success("OTP successfully verified. Redirecting...", {
          description: `You may now change your password.`,
        });

        reset();

        // redirect to change password page:
        if (Boolean(tempEmail)) router.push("/manage-password/change-password");
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
      toast.info("Verifying OTP...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: OTPCompanyUserType) {
    execute(values);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name={"code"}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} maxLength={4} pattern="\d*" />
                </FormControl>
                <FormMessage className="text-center" />
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
              {status === "executing" ? "Verifying OTP..." : "Verify OTP"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
