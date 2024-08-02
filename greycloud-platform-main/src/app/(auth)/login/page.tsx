"use client";

import React from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AuthSVG from "../../../../public/assets/print.svg";
import { useRouter } from "next/navigation";
import GreyCloudAdminLoginForm from "./_components/GreyCloudAdminLoginForm";
import CompanyUserLoginForm from "./_components/CompanyUserLoginForm";
import { useAuthStore } from "@/store/authSlice";

export default function Login() {
  const router = useRouter();
  const { storeUser, updateUserField } = useAuthStore();

  return (
    <Tabs defaultValue="company-user" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="company-user" onClick={() => updateUserField("role", "Company_User")}>
          External Login
        </TabsTrigger>
        {/* <TabsTrigger value="greycloud-admin" onClick={() => updateUserField("role", "GreyCloud_Admin")}>
          Admin
        </TabsTrigger> */}
      </TabsList>

      <TabsContent value="company-user">
        <Card className="w-full flex flex-col p-0 overflow-hidden">
          <CardHeader className="flex flex-col gap-2 bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 pt-10 pb-4 mb-4 relative">
            <CardTitle className="text-3xl">Sign In</CardTitle>
            <CardDescription className="text-base max-w-[60%]">Continue to Systa.io external platform.</CardDescription>

            <Image className="absolute size-32 right-8 top-4 flex items-center justify-center fill-primary" src={AuthSVG} alt="Picture of auth." />
          </CardHeader>

          <CardContent className="p-8">
            <CompanyUserLoginForm />
          </CardContent>

          <CardFooter className="flex flex-row justify-between px-8 align-top">
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground -mr-2">Don't have an account?</p>
              <Button
                variant={"link"}
                onClick={() => {
                  storeUser(
                    {
                      role: "Company_User",
                      email: "",
                      id: "",
                      name: "",
                      surname: "",
                      companyId: 0,
                      company: "",
                    },
                    true
                  );
                  router.push("/register");
                }}
              >
                Register.
              </Button>
            </div>

            <Button
              variant={"link"}
              onClick={() => {
                router.push("/manage-password/forgot-password");
              }}
            >
              Forgot Password?
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="greycloud-admin">
        <Card className="w-full flex flex-col p-0 overflow-hidden border-primary/30">
          <CardHeader className="flex flex-col gap-2 bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 pt-10 pb-4 mb-4 relative">
            <CardTitle className="text-3xl">Grey Cloud Admin</CardTitle>
            <CardDescription className="text-base max-w-[60%]">Sign in to continue to Systa.io Admin platform.</CardDescription>

            <Image className="absolute size-32 right-8 top-4 flex items-center justify-center fill-primary" src={AuthSVG} alt="Picture of auth." />
          </CardHeader>

          <CardContent className="p-8">
            <GreyCloudAdminLoginForm />
          </CardContent>

          <CardFooter className="flex flex-row justify-between px-8 align-top">
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground -mr-2">Already have an account?</p>
              <Button
                variant={"link"}
                onClick={() => {
                  storeUser(
                    {
                      role: "GreyCloud_Admin",
                      email: "",
                      id: "",
                      name: "",
                      surname: "",
                      companyId: 0,
                      company: "",
                    },
                    true
                  );
                  router.push("/register");
                }}
              >
                Register.
              </Button>
            </div>

            <Button
              variant={"link"}
              onClick={() => {
                router.push("/manage-password/forgot-password");
              }}
            >
              Forgot Password?
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
