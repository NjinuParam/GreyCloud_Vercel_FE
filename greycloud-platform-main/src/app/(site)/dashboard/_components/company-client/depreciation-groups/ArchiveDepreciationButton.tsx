"use client";
import React from "react";
import { Button } from "../../../../../../components/ui/button";
import { Trash, Play } from "lucide-react";
import { toast } from "sonner";
import { apiPut } from "@/app/actions/apiHandler";
import { useRouter } from "next/navigation";

interface Props {
  depGroupId: string;
  active?: boolean;
}

export default function ArchiveDepreciationButton({ depGroupId, active }: Props) {
  const router = useRouter();

  const handleArchive = async () => {
    try {
      // If the controller expects a raw string ([FromBody] string id), send the id as a JSON string
      // (apiPut will JSON.stringify the payload so passing a string is correct)
      const payload = depGroupId;
      const isActive = !!active;
      const url = isActive
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}Depreciation/Update-Company-Depreciation-Group`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}Depreciation/Activate-Company-Depreciation-Group`;

      const res = await apiPut(url, payload);
      await res.json();
      toast.success(isActive ? "Depreciation group archived" : "Depreciation group activated");
      // Refresh the current route so server components re-fetch data
      try {
        router.refresh();
      } catch (e) {
        // router.refresh might not be available in some environments; fallback to reload
        window.location.reload();
      }
    } catch (e: any) {
      console.error(e);
      toast.error(active ? "Failed to archive depreciation group" : "Failed to activate depreciation group");
    }
  };
  const isActive = !!active;

  return (
    <Button
      variant={"outline"}
      className={`${isActive ? "text-destructive" : "text-success"} w-48`}
      onClick={handleArchive}
    >
      {isActive ? <Trash className="size-5" /> : <Play className="size-5" />}
      {isActive ? "Archive" : "Activate"}
    </Button>
  );
}
