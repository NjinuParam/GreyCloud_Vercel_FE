import { getIronSessionData } from "@/lib/auth/auth";
import React from "react";
import CreateCustomerForm from "../components/CreateCustomerForm";

async function CreateCustomer() {
  const session = await getIronSessionData();

  return (
    <CreateCustomerForm
      companyId={session.companyProfile.loggedInCompanyId!!}
    />
  );
}

export default CreateCustomer;
