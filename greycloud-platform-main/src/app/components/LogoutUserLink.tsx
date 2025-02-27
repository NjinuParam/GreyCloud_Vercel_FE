"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { logoutCompanyUser } from "../actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";

export default function LogoutUserLink({ label = "log out." }: { label?: string }) {
  const router = useRouter();

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

  return (
    <Button
      onClick={() => {
        logoutCUser({});
        router.replace("/login");
      }}
      variant={"link"}
      className="text-base max-w-fit p-0"
    >
      {label}
    </Button>
  );
}
