"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { GreyCloudAllAdminsResponseType } from "@/lib/schemas/greycloud-admin";
import { AllCompanyUserResponseType } from "@/lib/schemas/company-user";
import { GreyCloudAdminCard } from "../grey-cloud-admin/GreyCloudAdminCards";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CompanyUserCard } from "../company-client/company-users/CompanyUserCard";
import { PlatformUserType, isCompanyUser } from "@/lib/schemas/common-schemas";
import { logoutCompanyUser } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { useAction } from "next-safe-action/hooks";
import { logoutGreyCloudAdmin } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";

export default function ProfileDropdown(session: PlatformUserType) {
  const router = useRouter();

  const imageFallBackText = (session?.name?.charAt(0) ?? "U") + (session?.surname?.charAt(0) ?? "U");
  const [isViewProfile, setIsViewProfile] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const { execute: logoutCUser } = useAction(logoutCompanyUser, {
    onSuccess() {
      toast.success(`Logged out.`, {
        description: "You have now been logged out.",
      });
    },

    onError(error) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error, null, 2),
      });
    },

    onExecute() {
      toast.info("Logging out...");
    },
  });

  const { execute: logoutGCAdmin } = useAction(logoutGreyCloudAdmin, {
    onSuccess() {
      toast.success(`Logged out.`, {
        description: "You have now been logged out.",
      });
    },

    onError(error) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error, null, 2),
      });
    },

    onExecute() {
      toast.info("Logging out...");
    },
  });

  return (
    <>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hover:cursor-pointer ring-2 ring-primary">
            <Avatar className="size-6 p-2">
              <AvatarImage src="" alt="" />
              <AvatarFallback>{imageFallBackText}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setIsViewProfile(true);
                    setIsChangePassword(false);
                  }}
                >
                  View Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DialogTrigger>

              <DialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setIsChangePassword(true);
                    setIsViewProfile(false);
                  }}
                  disabled={true}
                >
                  Change Password
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                router.push("/login");
                isCompanyUser(session.role) ? logoutCUser({}) : logoutGCAdmin({});
              }}
            >
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isViewProfile ? <>View Profile</> : isChangePassword ? <>Change Password</> : null}</DialogTitle>
          </DialogHeader>

          {isViewProfile && (
            <>
              {isCompanyUser(session.role) ? (
                <CompanyUserCard user={{ ...session, company: "" } as AllCompanyUserResponseType} />
              ) : (
                <GreyCloudAdminCard admin={session as GreyCloudAllAdminsResponseType} />
              )}
            </>
          )}

          {isChangePassword && <>Working on the client</>}
        </DialogContent>
      </Dialog>
    </>
  );
}
