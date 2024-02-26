"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HookActionStatus } from "next-safe-action/hooks";
import React from "react";

type ButtonSubmitFormProps = {
  status: HookActionStatus;
  idleString: string;
  executingString: string;
};

export default function ButtonSubmitForm({ status, idleString, executingString }: ButtonSubmitFormProps) {
  return (
    <Button
      className={cn("w-full font-bold", status === "executing" ? "animate-pulse" : null)}
      size={"lg"}
      type="submit"
      disabled={status === "executing"}
    >
      {status === "executing" ? executingString : idleString}
    </Button>
  );
}
