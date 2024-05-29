"use client";
import React, { useState } from "react";

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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getIronSessionData } from "@/lib/auth/auth";
import { toast } from "sonner";

function Settings() {
  React.useEffect(() => {
    getIronSessionData().then((comp: any) => {
      console.log(comp);
      let currentCompanyId = comp.companyId;
      setCompanyId(currentCompanyId);
      getCompanySettings(currentCompanyId);

      let name = comp.companyProfile.companiesList.find(
        (x:any) => x.companyId == currentCompanyId
      )?.companyName;

      setCompanyName(name);
    });
  }, []);

  const getCompanySettings = async (id: string) => {
    try {
      const request = await fetch(`${apiUrl}GreyCloud/Admin/Get-Company/${id}`);
      const response = await request.json();
      setSageAccumilatedDepreciationJournalCode(
        response.sageAccumilatedDepreciationJournalCode
      );
      setSageDepreciationJournalCode(response.sageDepreciationJournalCode);
      setSageDisposalJournalCode(response.sageDisposalJournalCode);
      setSageRevaluationJournalCode(response.sageRevaluationJournalCode);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [
    sageAccumilatedDepreciationJournalCode,
    setSageAccumilatedDepreciationJournalCode,
  ] = useState("");
  const [sageDepreciationJournalCode, setSageDepreciationJournalCode] =
    useState("");
  const [sageDisposalJournalCode, setSageDisposalJournalCode] = useState("");
  const [sageRevaluationJournalCode, setSageRevaluationJournalCode] =
    useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function saveSettings() {
    let settings = {
      id: companyId,
      sageAccumilatedDepreciationJournalCode,
      sageDepreciationJournalCode,
      sageDisposalJournalCode,
      sageRevaluationJournalCode,
    };
    try {
      await fetch(`${apiUrl}GreyCloud/Admin/UpdateCompanySettings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      toast.success("Settings saved!");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>These are settings for {companyName}</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">
                Sage Accumilated Depreciation Journal Code
              </Label>
              <Input
                id="name"
                placeholder="Sage Accumilated Depreciation Journal Code"
                value={sageAccumilatedDepreciationJournalCode}
                onChange={(e) =>
                  setSageAccumilatedDepreciationJournalCode(e.target.value)
                }
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Sage Depreciation Journal Code</Label>
              <Input
                id="name"
                placeholder="Sage Depreciation Journal Code"
                value={sageDepreciationJournalCode}
                onChange={(e) => setSageDepreciationJournalCode(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Sage Disposal Journal Code</Label>
              <Input
                id="name"
                placeholder="Sage Disposal Journal Code"
                value={sageDisposalJournalCode}
                onChange={(e) => setSageDisposalJournalCode(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Sage Revaluation Journal Code</Label>
              <Input
                id="name"
                placeholder="Sage Revaluation Journal Code"
                value={sageRevaluationJournalCode}
                onChange={(e) => setSageRevaluationJournalCode(e.target.value)}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => saveSettings()}>Save</Button>
      </CardFooter>
    </Card>
  );
}

export default Settings;
