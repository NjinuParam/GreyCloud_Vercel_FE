"use client";

import { deleteCompanyUser } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { Button } from "@/components/ui/button";
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
import { AllCompanyUserResponseType } from "@/lib/schemas/company-user";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import UpdateCompanyUserForm from "../UpdateCompanyUser";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type UserCardFooterProps = {
  user: AllCompanyUserResponseType;
};

export const UserCardFooter = ({ user }: UserCardFooterProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const { execute, status } = useAction(deleteCompanyUser, {
    onSuccess(data, input, reset) {
      toast.success("User successfully deleted.", {
        description: `User was removed.`,
      });
      router.refresh();
      reset();
    },
    onError(error, input, reset) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error),
      });
    },
    onExecute(input) {
      toast.info("Deleting User...");
    },
  });

  return (
    <div className="flex flex-col lg:flex-row gap-2 items-center w-full">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild className="grow">
          <Button variant={"outline"} className="text-primary w-full">
            Update User
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit User</DialogTitle>
          </DialogHeader>

          <div className="w-full mt-2">
            <UpdateCompanyUserForm user={user} onClose={handleDialogClose} />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild className="grow">
          <Button variant={"outline"} className="text-destructive w-full">
            Delete User
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
                {status === "executing" ? "Deleting User..." : "Delete User"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
