"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import AuthSVG from "../../../../../public/assets/reset.svg";
import Image from "next/image";
import ResetPasswordGreyCloudAdminForm from "./_components/ResetPasswordOTPGreyCloudAdminForm";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authSlice";
import { resetGreyCloudAdminAccountPassword } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import ResetPasswordCompanyUserForm from "./_components/ResetPasswordOTPCompanyUserForm";
import { isCompanyUser } from "@/lib/schemas/common-schemas";
import { resetCompanyUserAccountPassword } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";

export default function ResetPassword() {
  const router = useRouter();

  const { tempEmail, user } = useAuthStore();

  const { execute: executeGCAdminReset, status: statusGCAdmin } = useAction(resetGreyCloudAdminAccountPassword, {
    onSuccess(data, input, reset) {
      if (!data || data === null) {
        toast.error("An error has occured:", {
          description: JSON.stringify(data, null, 2),
        });
      } else {
        toast.success("GreyCloud Admin: One Time Pin (OTP) sent successfully.", {
          description: `Password reset instructions sent to your email.`,
        });

        reset();

        // redirect to reset password page:
        if (Boolean(tempEmail)) router.push("/manage-password/reset-password");
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
      toast.info("Re-sending OTP...");
    },
  });

  const { execute: executeCUReset, status: statusCU } = useAction(resetCompanyUserAccountPassword, {
    onSuccess(data, input, reset) {
      if (!data || data === null) {
        toast.error("An error has occured:", {
          description: JSON.stringify(data, null, 2),
        });
      } else {
        toast.success("Company User: ne Time Pin (OTP) sent successfully.", {
          description: `Password reset instructions sent to your email.`,
        });

        reset();

        // redirect to reset password page:
        if (Boolean(tempEmail)) router.push("/manage-password/reset-password");
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
      toast.info("Re-sending OTP...");
    },
  });

  return (
    <Card className="w-[600px] flex flex-col">
      <CardHeader className="flex flex-col gap-2 bg-gradient-to-b from-primary/5 dark:from-primary/5 to-transparent w-full px-8 pt-10 pb-4 mb-4 relative">
        <CardTitle className="text-3xl">Reset Password</CardTitle>
        <CardDescription className="text-base max-w-[55%]">Enter the OPT verification code sent to your email address.</CardDescription>

        <Image className="absolute size-32 right-8 top-4 flex items-center justify-center" src={AuthSVG} alt="Picture of auth." />
      </CardHeader>

      <CardContent className="p-8">{isCompanyUser(user?.role) ? <ResetPasswordCompanyUserForm /> : <ResetPasswordGreyCloudAdminForm />}</CardContent>

      <CardFooter className="flex mx-auto px-8">
        <p className="text-sm text-muted-foreground -mr-2">{`Didn't receive code?`}</p>
        <Button
          variant={"link"}
          onClick={() => (isCompanyUser(user?.role) ? executeCUReset({ email: tempEmail! }) : executeGCAdminReset({ email: tempEmail! }))}
          disabled={(isCompanyUser(user?.role) ? statusCU === "executing" : statusGCAdmin === "executing") || !Boolean(tempEmail)}
        >
          Resend verification code.
        </Button>
      </CardFooter>
    </Card>
  );
}
