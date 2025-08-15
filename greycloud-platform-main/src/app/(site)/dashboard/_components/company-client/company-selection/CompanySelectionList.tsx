import { getIronSessionData } from "@/lib/auth/auth";
import { getCompanyInfoFromSession } from "@/lib/storage/storage";
import { redirect } from "next/navigation";
import { CompanySelectionCard } from "./CompanySelectionCard";
import { Card, CardContent } from "@/components/ui/card";
import { CompanySelectionListClient } from "./CompanySelectionListClient";

export const CompanySelectionList = async () => {
  const session = await getIronSessionData();
  // const companies = getCompanyInfoFromSession();
  // console.log("CompanySelectionList companies", companies);
  // if (!session.isLoggedIn) {
  //   return redirect("/login");
  // }

  // if the user is not associated with any company, redirect to the dashboard:
  // this means the user only has 1 company, and it is the default company
  // if (companies?.length === 0) {
  //   redirect("/dashboard");
  // }

return (
    <div>
      <h1>Select Company</h1>
      <CompanySelectionListClient />
    </div>
  );
};

