"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import AuthSVG from "../../../../public/assets/signingup.svg";
import Image from "next/image";
import GreyCloudAdminRegisterForm from "./_components/GreyCloudAdminRegisterForm";
import { isCompanyUser } from "@/lib/schemas/common-schemas";
import { useAuthStore } from "@/store/authSlice";
import CompanyUserRegisterForm from "./_components/CompanyUserRegisterForm";

export default function Register() {
  const router = useRouter();
  const { user } = useAuthStore();

  const isCompUser = isCompanyUser(user?.role);

  return (
    <Card className="w-[600px] flex flex-col p-0 overflow-hidden">
      <CardHeader className="flex flex-col gap-2 bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 pt-10 pb-4 mb-4 relative">
        <CardTitle className="text-3xl">{isCompUser ? "Client Register" : "GreyCloud Register"}</CardTitle>
        <CardDescription className="text-base max-w-[60%]">Register for an account to access the Grey Cloud Technology platform.</CardDescription>

        <Image className="absolute size-36 right-8 top-4 flex items-center justify-center" src={AuthSVG} alt="Picture of auth." />
      </CardHeader>

      <CardContent className="p-8">{isCompanyUser(user?.role) ? <CompanyUserRegisterForm /> : <GreyCloudAdminRegisterForm />}</CardContent>

      <CardFooter className="flex mx-auto px-8">
        <p className="text-sm text-muted-foreground -mr-2">Already have an account?</p>
        <Button
          variant={"link"}
          onClick={() => {
            router.push("/login");
          }}
        >
          Sign in.
        </Button>
      </CardFooter>
    </Card>
  );
}
