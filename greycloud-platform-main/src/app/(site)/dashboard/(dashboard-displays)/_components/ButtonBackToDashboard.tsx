"use client";

import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function ButtonBackToDashboard() {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              router.push("/dashboard");
            }}
            className="self-start"
          >
            <MoveLeft className="text-primary size-6 mr-2" /> Back to Dashboard
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Back to Dashboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
