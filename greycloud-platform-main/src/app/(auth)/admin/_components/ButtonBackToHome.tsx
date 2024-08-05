"use client";

import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function ButtonBackToHome() {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              router.push("/");
            }}
            size="icon"
          >
            <Home className="text-primary" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Return to Home.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
