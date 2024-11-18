import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { customers } from "../../../../../../../../mock";
import { getIronSessionData } from "@/lib/auth/auth";
import { getSageOneCompanyAssets } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { getAllCompanyDepreciationGroups } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import CreateOrderForm from "../components/CreateOrderForm";

async function CreateOrder() {
  const session = await getIronSessionData();
  const myCompany = session.companyProfile?.companiesList?.find(
    (company) => company.companyId === session.companyProfile.loggedInCompanyId
  );

  const [assets] = await Promise.all([
    await getSageOneCompanyAssets({
      SageCompanyId: Number(myCompany?.sageCompanyId),
    }),
  ]);
  
  return <CreateOrderForm assets={assets.data} customers={customers} />;
}

export default CreateOrder;
