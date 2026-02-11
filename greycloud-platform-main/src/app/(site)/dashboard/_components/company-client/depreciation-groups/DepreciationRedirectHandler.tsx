"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DepreciationRedirectHandler() {
    const router = useRouter();

    useEffect(() => {
        toast.error("No depreciation categories set");
        router.push("/dashboard/company-user-admin/manage-depreciation-groups");
    }, [router]);

    return null;
}
