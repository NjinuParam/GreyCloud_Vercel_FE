"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import AuthSVG from "../../../../../public/assets/forgotpassword.svg";
import Image from "next/image";
import ForgotPasswordGreyCloudAdminForm from "./_components/ForgotPasswordGreyCloudAdminForm";
import { useAuthStore } from "@/store/authSlice";
import { isCompanyUser } from "@/lib/schemas/common-schemas";
import ForgotPasswordCompanyUserForm from "./_components/ForgotPasswordCompanyUserForm";

export default function ChangePassword() {
  const { user } = useAuthStore();

  return (
    <Card className="w-[600px] flex flex-col">
      <CardHeader className="flex flex-col gap-2 bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 pt-10 pb-4 mb-4 relative">
        <CardTitle className="text-3xl">Forgot Password</CardTitle>
        <CardDescription className="text-base max-w-[60%]">We will send you instructions on how to reset your password by email.</CardDescription>

        <Image className="absolute size-36 right-8 top-4 flex items-center justify-center" src={AuthSVG} alt="Picture of auth." />
      </CardHeader>

      <CardContent className="p-8">
        {isCompanyUser(user?.role) ? <ForgotPasswordCompanyUserForm /> : <ForgotPasswordGreyCloudAdminForm />}
      </CardContent>

      <CardFooter className="flex mx-auto px-8">
        <p className="text-sm text-muted-foreground -mr-2 text-center">{`
            Remember, your password is confidential.`}</p>
      </CardFooter>
    </Card>
  );
}
