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
    <div >
      <div className="flex flex-col gap-4 text-center items-center">
        <h3 className="text-xl text-foreground font-bold text-pretty max-w-xl text-center ">Welcome, {session.name}.</h3>
        <p className="text-muted-foreground ">Please select the Company Profile you want to log in with.</p>
      </div>

      <CompanySelectionList />

      <div className="flex flex-col gap-2 text-center items-center py-4 w-full">
        <p className="text-muted-foreground text-xl">
        <small>{`If you don't see the company you are looking for, please contact your administrator.`}
        </small>
        </p>
        <span className="text-lg text-muted-foreground flex flex-row gap-1 items-center">
          <p><small>Alternatively, you can </small></p> <small> {<LogoutUserLink />}</small>
        </span>
      </div>
    </div>
  );
};

export default CompanyPicker;
