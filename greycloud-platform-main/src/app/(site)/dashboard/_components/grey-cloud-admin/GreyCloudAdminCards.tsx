"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import UpdateGreyCloudAdminForm from "./UpdateGreyCloudAdminForm";
import { GreyCloudAllAdminsResponseType } from "@/lib/schemas/greycloud-admin";
import { deleteGreyCloudAdmin } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";

export const GreyCloudAdminsList = ({ admins }: { admins: GreyCloudAllAdminsResponseType[] }) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-full h-full overflow-y-scroll">
      {admins.map((admin) => (
        <GreyCloudAdminCard key={admin.id} admin={admin} />
      ))}
    </div>
  );
};

export const GreyCloudAdminCard = ({ admin }: { admin: GreyCloudAllAdminsResponseType }) => {
  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="pb-0">
        <CardTitle>
          {admin?.name} {admin?.surname}
        </CardTitle>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="flex flex-col gap-4 py-2">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="userName" className="text-xs text-foreground uppercase tracking-wider">
            Email
          </Label>
          <p>{admin?.email ?? "---"}</p>
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Label htmlFor="userName" className="text-xs text-foreground uppercase tracking-wider">
            Role
          </Label>
          <p>{admin?.role ?? "---"}</p>
        </span>
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="pb-4">{<UserCardFooter {...admin} />}</CardFooter>
    </Card>
  );
};

const UserCardFooter = (user: GreyCloudAllAdminsResponseType) => {
  const { execute, status } = useAction(deleteGreyCloudAdmin, {
    onSuccess(data, input, reset) {
      toast.success("User successfully deleted.", {
        description: `User was removed.`,
      });

      reset();
    },

    onError(error, input, reset) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error),
      });
    },

    onSettled(result, input, reset) {
      reset();
    },

    onExecute(input) {
      toast.info("Deleting User...");
    },
  });

  return (
    <div className="flex flex-row gap-2 items-center w-full">
      <Dialog>
        <DialogTrigger asChild className="grow">
          <Button variant={"outline"} className="text-primary">
            Edit Admin
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit User</DialogTitle>
          </DialogHeader>

          <div className="w-full mt-2">
            <UpdateGreyCloudAdminForm user={user} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild className="grow">
          <Button variant={"outline"} className="text-destructive">
            Delete Admin
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              <span className="text-muted-foreground">Delete</span> {user.name}?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base">This action cannot be undone. This will permanently delete the user account.</DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                className={cn("w-full font-bold", status === "executing" ? "animate-pulse" : null)}
                size={"lg"}
                onClick={(event) => {
                  execute({
                    id: user?.id,
                  });
                }}
                disabled={status === "executing"}
                variant={"destructive"}
              >
                {status === "executing" ? "Deleting Admin..." : "Delete Admin"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
