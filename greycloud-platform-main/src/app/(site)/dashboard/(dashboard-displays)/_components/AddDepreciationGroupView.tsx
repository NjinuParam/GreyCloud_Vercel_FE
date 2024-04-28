"use client";
import React, { useEffect, useState } from "react";

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
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getIronSessionData } from "@/lib/auth/auth";
import { toast } from "sonner";
import { SelectGroup } from "@radix-ui/react-select";

function AddDepreciationGroup() {
  useEffect(() => {
    getIronSessionData().then((comp: any) => {
      console.log("USER", comp);
      let currentCompanyId = comp.companyId;
      const sageCompanyId = comp.companyProfile.companiesList.find(
        (x) => x.companyId == comp.companyId
      ).sageCompanyId;
      setCompanyId(sageCompanyId);

      let name = comp.companyProfile.companiesList.find(
        (x) => x.companyId == currentCompanyId
      )?.companyName;

      let sageId = comp.companyProfile.companiesList.find(
        (x) => x.companyId == currentCompanyId
      )?.sageCompanyId;

      setUserId(comp.email);

      fetch(`${apiUrl}SageOneAsset/AssetCategory/Get?Companyid=${sageId}`)
        .then((res) => res.json().then((data) => setCategories(data.results)))
        .catch((e) => console.log(e));

      setCompanyName(name);
    });
  }, []);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("0");
  const [companyName, setCompanyName] = useState("");
  const [userId, setUserId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [depAmount, setDepAmount] = useState(0);
  const [depName, setDepName] = useState("");
  const [period, setPeriod] = useState("0");
  const [usageType, setUsageType] = useState("0");
  const [type, setType] = useState("0");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function save() {
    let obj = {
      companyId,
      period: parseInt(period),
      usageType: parseInt(usageType),
      type: parseInt(type),
      creatingUser: userId,
      isMoney: true,
      active: true,
      categoryId: parseInt(category),
      depAmount,
      depName,
    };
    try {
      await fetch(`${apiUrl}Depreciation/Add-Company-Depreciation-Group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
      });
      toast.success("Depreciation saved!");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add Depreciation Group</CardTitle>
        <CardDescription>
          Add depreciation group for {companyName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Amount</Label>
              <Input
                id="name"
                placeholder="Amount"
                value={depAmount}
                onChange={(e) => setDepAmount(parseFloat(e.target.value))}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Name"
                value={depName}
                onChange={(e) => setDepName(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Select onValueChange={(e) => setType(e)}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Type</SelectLabel>
                    <SelectItem value="0">Straight Line</SelectItem>
                    <SelectItem value="1">Reducing Amount </SelectItem>
                    <SelectItem value="2">Usage </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Select onValueChange={(e) => setUsageType(e)}>
                <SelectTrigger>
                  <SelectValue placeholder="Usage Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Usage Type</SelectLabel>
                    <SelectItem value="0">KM</SelectItem>
                    <SelectItem value="1">Hours </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Select onValueChange={(e) => setPeriod(e)}>
                <SelectTrigger>
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Period</SelectLabel>
                    <SelectItem value="0">Monthly</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Select onValueChange={(e) => setCategory(e)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {categories.map((c: any) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.description}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => save()}>Save</Button>
      </CardFooter>
    </Card>
  );
}

export default AddDepreciationGroup;
