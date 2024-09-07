import { getIronSessionData } from "@/lib/auth/auth";
import { CompanySelectionList } from "../dashboard/_components/company-client/company-selection/CompanySelectionList";
import { redirect } from "next/navigation";
import LogoutUserLink from "@/app/components/LogoutUserLink";

const CompanyPicker = async () => {
  const session = await getIronSessionData();

  if (!session.isLoggedIn) {
    return redirect("/login");
  }

  return (
    <div className="flex flex-col items-center space-y-16 p-8 pt-16 w-screen min-h-screen max-h-screen bg-slate-200/40 dark:bg-slate-900/30 overflow-auto">
      <div className="flex flex-col gap-4 text-center items-center">
        <h1 className="text-2xl text-foreground font-bold text-pretty max-w-xl text-center ">Welcome, {session.name}.</h1>
        <p className="text-muted-foreground text-2xl">Please select the Company Profile you want to log in with.</p>
      </div>

      <CompanySelectionList />

      <div className="flex flex-col gap-2 text-center items-center py-4 w-full">
        <p className="text-muted-foreground text-xl">{`If you don't see the company you are looking for, please contact your administrator.`}</p>
        <span className="text-lg text-muted-foreground flex flex-row gap-1 items-center">
          <p>Alternatively, you can</p> {<LogoutUserLink />}
        </span>
      </div>
    </div>
  );
};

export default CompanyPicker;
