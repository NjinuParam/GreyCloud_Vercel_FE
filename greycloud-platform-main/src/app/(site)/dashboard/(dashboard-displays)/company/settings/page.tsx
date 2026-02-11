"use client";
import React, { useState, useEffect } from "react";
import { Skeleton } from "../../../../../../components/ui/skeleton";

import { Button } from "../../../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../../../components/ui/card";
import { Input } from "../../../../../../components/ui/input";
import { Label } from "../../../../../../components/ui/label";
import ReactSelect from "react-select";
import { getIronSessionData } from "../../../../../../lib/auth/auth";
import { toast } from "sonner";

function Settings() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getIronSessionData().then((comp: any) => {
      const currentCompanyId = comp.companyId;
      console.log(comp);

      // Find the matching company entry (some payloads use `companyId`, others `id`)
      const companyEntry = comp.companyProfile?.companiesList?.find(
        (x: any) => x.companyId === currentCompanyId || x.id === currentCompanyId
      );

      // Try common fields for the Sage company id (different APIs may use different keys)
      const sageId =
        companyEntry?.sageCompanyId ?? companyEntry?.si ?? companyEntry?.sageCompany ?? null;

      setCompanyId(currentCompanyId);
      setCompanyName(companyEntry?.companyName ?? companyEntry?.company ?? "");

      // Load saved settings for this company (sets the select state values)
      getCompanySettings(currentCompanyId);

      // Fetch Sage accounts for the company so dropdown options are available
      if (sageId) {
        fetchAccounts(sageId).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
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
      // map depreciation start date (convert to datetime-local format if present)
      if (response.depreciationStartDate) {
        try {
          const dt = new Date(response.depreciationStartDate);
          setDepreciationStartDate(dt.toISOString().slice(0, 16));
        } catch (e) {
          setDepreciationStartDate("");
        }
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const [accounts, setAccounts] = useState<any[]>([]);

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
  const [depreciationStartDate, setDepreciationStartDate] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const customStyle = {
    option: (base: any) => ({
      ...base,
      backgroundColor: "white",
      color: "black",
      zIndex: 999999,
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 999999 }),
  };

  const p = accounts.map((x: any) => ({ value: x.id?.toString() ?? "", label: x.name })) as any[];

  async function fetchAccounts(id: any) {
    try {
      const res = await fetch(`${apiUrl}GreyCloud/Admin/Get-Accounts/${id}`);
      const json = await res.json();
      debugger;
      setAccounts(json.results || []);
    } catch (e) {
      console.log(e);
    }
  }

  async function saveSettings() {
    // Log individual state values to help debug duplicate/null issue
    console.log("Saving company settings - states:", {
      sageAccumilatedDepreciationJournalCode,
      sageDepreciationJournalCode,
      sageDisposalJournalCode,
      sageRevaluationJournalCode,
      depreciationStartDate,
    });


    // Build settings payload explicitly and add both spellings of the
    // accumulated depreciation property to be compatible with API variations.
    const settings: any = {
      id: companyId,
      sageDepreciationJournalCode: sageDepreciationJournalCode,
      sageDisposalJournalCode: sageDisposalJournalCode,
      sageRevaluationJournalCode: sageRevaluationJournalCode,
      sageAccumilatedDepreciationJournalCode: sageAccumilatedDepreciationJournalCode,
      // send ISO datetime if set, otherwise null
      depreciationStartDate: depreciationStartDate
        ? new Date(depreciationStartDate).toISOString()
        : null,
    };

    debugger;
    const payload = JSON.stringify(settings);


    // log payload to help debug missing/duplicated fields
    console.log("UpdateCompanySettings payload:", settings);
    try {
      await fetch(`${apiUrl}GreyCloud/Admin/UpdateCompanySettings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
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
        {loading ? (
          <div className="space-y-6">
            <div className="grid w-full items-center gap-4 grid-cols-1 md:grid-cols-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form>
            <div className="grid w-full items-center gap-4 grid-cols-1 md:grid-cols-2">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="accumulated">
                  Sage Accumilated Depreciation Journal Code
                </Label>
                <ReactSelect
                  styles={customStyle}
                  value={p.find((o: any) => o.value === sageAccumilatedDepreciationJournalCode) || null}
                  onChange={(e: any) => setSageAccumilatedDepreciationJournalCode(e?.value || "")}
                  options={p}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="depreciation">Sage Depreciation Journal Code</Label>
                <ReactSelect
                  styles={customStyle}
                  value={p.find((o: any) => o.value === sageDepreciationJournalCode) || null}
                  onChange={(e: any) => setSageDepreciationJournalCode(e?.value || "")}
                  options={p}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="disposal">Sage Disposal Journal Code</Label>
                <ReactSelect
                  styles={customStyle}
                  value={p.find((o: any) => o.value === sageDisposalJournalCode) || null}
                  onChange={(e: any) => setSageDisposalJournalCode(e?.value || "")}
                  options={p}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="revaluation">Sage Revaluation Journal Code</Label>
                <ReactSelect
                  styles={customStyle}
                  value={p.find((o: any) => o.value === sageRevaluationJournalCode) || null}
                  onChange={(e: any) => setSageRevaluationJournalCode(e?.value || "")}
                  options={p}
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="depreciationStart">Depreciation Start Date</Label>
                <Input
                  id="depreciationStart"
                  type="datetime-local"
                  value={depreciationStartDate}
                  onChange={(e) => setDepreciationStartDate(e.target.value)}
                />
              </div>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => saveSettings()}>Save</Button>
      </CardFooter>
    </Card>
  );
}

export default Settings;
