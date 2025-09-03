"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIronSessionData } from "@/lib/auth/auth";
import { getCompanyInfoFromSession } from "@/lib/storage/storage";
import { CompanySelectionCard } from "./CompanySelectionCard";
import { Card, CardContent } from "@/components/ui/card";

export const CompanySelectionListClient = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [sessionChecked, setSessionChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSessionAndLoadCompanies = async () => {
      const session = await getIronSessionData();

      if (!session?.isLoggedIn) {
        router.push("/login");
        return;
      }

      const data = getCompanyInfoFromSession();
      console.log("CompanySelectionListClient data", data);
      if (!data || data.length === 0) {
        router.push("/dashboard");
        return;
      }

      setCompanies(
        data.sort((a, b) => a.nm.localeCompare(b.nm))
      );
      setSessionChecked(true);
    };

    checkSessionAndLoadCompanies();
  }, [router]);

  // Optionally show nothing until session is checked
  if (!sessionChecked) return null;

  return (
    <Card className="min-h-full w-full p-8 max-w-7xl bg-transparent overflow-y-auto">
      <CardContent className="p-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-scroll">
        {companies.map((company) => (
          <CompanySelectionCard key={company.id} company={company} />
        ))}
      </CardContent>
    </Card>
  );
};
