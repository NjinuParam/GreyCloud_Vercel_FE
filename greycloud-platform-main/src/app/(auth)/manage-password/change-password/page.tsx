import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import AuthSVG from "../../../../../public/assets/secure.svg";
import Image from "next/image";
import GreyCloudAdminChangePasswordForm from "./_components/GreyCloudAdminChangePasswordForm";
import CompanyUserChangePasswordForm from "./_components/CompanyUserChangePasswordForm";
import { isCompanyUser } from "@/lib/schemas/common-schemas";
import { getIronSessionData } from "@/lib/auth/auth";

export default async function ChangePassword() {
  const session = await getIronSessionData();

  return (
    <Card className="w-[600px] flex flex-col">
      <CardHeader className="flex flex-col gap-2 bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 pt-10 pb-4 mb-4 relative">
        <CardTitle className="text-3xl">Change Password</CardTitle>
        <CardDescription className="text-base max-w-[60%]">Enter your new password below.</CardDescription>

        <Image className="absolute size-28 right-8 top-4 flex items-center justify-center" src={AuthSVG} alt="Picture of auth." />
      </CardHeader>

      <CardContent className="p-8">
        {isCompanyUser(session?.role!) ? <CompanyUserChangePasswordForm /> : <GreyCloudAdminChangePasswordForm />}
      </CardContent>

      <CardFooter className="flex mx-auto px-8">
        <p className="text-sm text-muted-foreground -mr-2">{`Remember, your password is confidential.`}</p>
      </CardFooter>
    </Card>
  );
}
