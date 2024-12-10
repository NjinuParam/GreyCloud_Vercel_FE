import { getIronSessionData } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { CompanySelectionCard } from "./CompanySelectionCard";
import { Card, CardContent } from "@/components/ui/card";

export const CompanySelectionList = async () => {
  const session = await getIronSessionData();

  if (!session.isLoggedIn) {
    return redirect("/login");
  }

  // if the user is not associated with any company, redirect to the dashboard:
  // this means the user only has 1 company, and it is the default company
  if (session.companyProfile?.companiesList?.length === 0) {
    redirect("/dashboard");
  }

  return (
    <Card className="min-h-full w-full p-8 max-w-7xl bg-transparent overflow-y-auto">
      <CardContent className="p-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-scroll">
        {session?.companyProfile?.companiesList
          // ?.filter(
          //   (c) => c.companyId !== session.companyProfile.loggedInCompanyId
          // )
          ?.sort((a, b) => a.companyName.localeCompare(b.companyName))
          .map((company) => (
            <CompanySelectionCard key={company.companyId} company={company} />
          ))}
      </CardContent>
    </Card>
  );
};
