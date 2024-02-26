"use client";

import { AllCompanyUserResponseType } from "@/lib/schemas/company-user";
import { CompanyUserCard } from "./CompanyUserCard";

export const CompanyUsersList = ({ users }: { users: AllCompanyUserResponseType[] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full h-full overflow-y-scroll">
      {users?.map((user) => (
        <CompanyUserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
