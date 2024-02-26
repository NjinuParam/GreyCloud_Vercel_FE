"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ContinueToLoginButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push("/login");
      }}
      variant={"default"}
      className="text-lg max-w-fit"
      size={"lg"}
    >
      Continue to Login
    </Button>
  );
}
