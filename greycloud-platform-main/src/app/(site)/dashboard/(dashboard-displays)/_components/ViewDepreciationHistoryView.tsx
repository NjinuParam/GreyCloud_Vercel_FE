
"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import {

  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { Switch } from "@/components/ui/switch";

import { getGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import { getAllAssetDepreciationHistory } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { DataTable } from "@/components/ui/data-table";
import { getIronSessionData } from "@/lib/auth/auth";
import { AssetDepreciationHistoryTableTypes, assetDepreciationHistoryColumns } from "../../_components/grey-cloud-admin/DataTableColumns";
import { getSageOneCompanyAssets } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { CheckCircle, FileSpreadsheet, FileWarning, FileWarningIcon, LucideMessageSquareWarning, MailWarning, PowerCircle, Timer, UploadCloud } from "lucide-react";
import { Badge } from "../../../../../components/ui/badge";
import { getAllCompanyDepreciationGroups } from "../../../../actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { SAGE_ONE_DEPRECIATION } from "@/lib/api-endpoints/sage-one-company-depreciation";
import { toast } from "sonner";
import { useExcelDownloder } from 'react-xls';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../../../../../components/ui/label";
import moment from "moment";
import { debug } from "node:console";
import { Button } from "../../../../../components/ui/button";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { FormLabel } from "../../../../../components/ui/form";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { apiFetch } from "../../../../actions/apiHandler";
import { Skeleton } from "../../../../../components/ui/skeleton";


export default function ViewDepreciationHistoryView() {

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [depreciationHistoryAll, setDepreciationHistoryAll] = useState<any>();

  const [assets, setAssets] = useState<any>();
  const [myCompany, setMyCompany] = useState<any>();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [transformedData, setTransformedData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [auditData, setAuditData] = useState<any[]>([]);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any>();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [selectedDateFilter, setSelectedDateFilter] = useState<any>();
  const [summaryData, setSummaryData] = useState<any>();
  const [canDepr, setCanDepreciate] = useState<any[]>([]);
  const [updatedUsageAssets, setUpdatedUsageAssets] = useState<any[]>([]);
  const [isGroupedView, setIsGroupedView] = useState(true);

  const [audit, setAudit] = useState<any[]>([]);
  const { ExcelDownloder, Type } = useExcelDownloder();


  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const comp: any = await getIronSessionData();
        if (!comp.isLoggedIn) {
          setLoading(false);
          return;
        }

        const _myCompany = comp.companyProfile.companiesList?.find(
          (company: any) => company.id === comp.companyProfile.loggedInCompanyId
        );
        setMyCompany(_myCompany);

        const sageCompanyId = Number(_myCompany?.si);
        fetchAudit(sageCompanyId);
        canDepreciate(sageCompanyId || 14999);

        const depreHistoryFull: any = await getAllAssetDepreciationHistory({ sageCompanyId });
        const depreHistory = depreHistoryFull.data.data;
        const summary = depreHistoryFull.data.summary;
        const audit = depreHistoryFull.data.audit.filter((x: any) => x.posted == true);

        const full = { fullExport: depreHistory, summary: summary, audit: audit };
        setSummaryData(full);
        setDepreciationHistoryAll(depreHistory);

        const _assets: any = await getSageOneCompanyAssets({ SageCompanyId: sageCompanyId });
        setAssets(_assets);

        // Fetch groups using direct fetch as requested
        const groupsUrl = `${apiUrl}${SAGE_ONE_DEPRECIATION.GET.GET_COMPANY_DEPRECIATION_GROUP_ALL}`;
        const groupsResponse = await fetch(groupsUrl, { cache: "no-store" });
        const depreciationGroupsData = await groupsResponse.json();
        const depreciationGroups = Array.isArray(depreciationGroupsData) ? depreciationGroupsData : (depreciationGroupsData.data || []);

        const _transformedData = depreHistory?.map((depHistory: any) => {
          const asset = _assets.data?.find((a: any) => a.assetid === depHistory.assetId);
          const depGroup = depreciationGroups?.find((dg: any) => dg.depGroupId === depHistory.depGroupId);

          const purchasePrice = asset?.purchasePrice || 0;
          const totalDepreciation = depHistory.totalDepreciation || 0;
          const currentYearDepreciation = depHistory?.depreciationThisYear || 0;
          const bookValue = purchasePrice - totalDepreciation;

          return {
            ...depHistory,
            code: asset?.code,
            assetName: asset ? asset.description : "Unknown Asset",
            category: asset?.catDescription ?? asset?.category?.description ?? "Uncategorized",
            companyName: _myCompany?.companyName,
            purchasePrice: asset?.purchasePrice,
            residual: asset?.residual ? (asset.residual == 0 ? 1 : asset.residual) : 1,
            depGroupName: depGroup ? `${depGroup?.depName}` : "Unknown",
            totalDepreciation: depHistory.totalDepreciation,
            depreciationThisYear: depHistory?.depreciationThisYear,
            depreciationThisMonth: depHistory?.depreciationThisMonth,
            depGroupDetails: depGroup
              ? `${depGroup.type == 0 ? " Straight Line" : depGroup.type == 1 ? "Reducing Balance" : " Usage"} (${depGroup?.depAmount}${depGroup.type == 0 ? " years write off" : depGroup.type == 1 ? "% per year" : " units"})`
              : "Unknown Group",
            purchaseDate: asset?.datePurchased ? moment(asset.datePurchased).format("DD-MMM-YY") : "NA",
            depreciationStartDate: asset?.dateDepreciationStart ? moment(asset?.dateDepreciationStart).format("DD-MMM-YY") : "NA",
            revaluedValue: "NA",
            priorYearsDepreciation: totalDepreciation - currentYearDepreciation,
            bookValue: bookValue,
          };
        }) as AssetDepreciationHistoryTableTypes[];

        setTransformedData(_transformedData);
        setFilteredData(_transformedData);

        try {
          const cats = Array.from(new Set((_transformedData || []).map((x: any) => x.category).filter(Boolean)));
          setCategoriesList(cats as string[]);
        } catch (e) {
          setCategoriesList([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading depreciation history:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);




  async function canDepreciate(companyId: number) {
    toast.info("Fetching depreciation history...");

    const response = await apiFetch(`${apiUrl}Depreciation/CanDepreciate/${companyId}`
      //   , {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   }
      // }
    );

    if (response) {

      const res = await response.json();
      ;
      setCanDepreciate(res);

    } else {

    }
  }

  function filterByName(name: string) {
    if (name != "") {
      setFilteredData(transformedData?.filter((data: any) => data.assetName.toLowerCase().includes(name.toLowerCase())));
      setPage(1);
    } else {
      setFilteredData(transformedData);
      setPage(1);
    }

  }

  function filterByDate(start: string, end: string) {
    debugger;
    if (start != "" && end != "") {

      var startDate = new Date(start);
      var endDate = new Date(end);

      setFilteredData(transformedData?.filter((data: any) => new Date(data.createdDate) >= startDate && new Date(data.createdDate) <= endDate));
      setPage(1);
    }

  }

  function changeStartDate(date: string) {

    setStartDate(date)
    filterByDate(date, endDate);

  }

  function changeEndDate(date: string) {
    setEndDate(date)
    filterByDate(startDate, date);
  }


  async function POST_depreciationRun(payload: any) {
    toast.info("Processing...");

    // setFetchingDepreciation(true);
    const response = await fetch(`${apiUrl}Depreciation/PostDepreciationRun/${myCompany?.si}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response) {

      close();
      toast.success(`Complete!`, {
        description: "The depreciation run completed succesfully.",
      });
      const res = await response.json();

      setTimeout(() => {
        window?.location?.reload();
      }, 2000);

      const newTransformedData = res?.map((depHistory: any) => ({
        ...depHistory,
        companyName: "company",
      })) as AssetDepreciationHistoryTableTypes[];
      // _setTransformedData(newTransformedData);


    } else {
      toast.error("Depreciation run failed", {
        description: "Please try again.",
      });
    }

    // setFetchingDepreciation(false);
  }


  async function fetchAudit(companyId: any) {
    // setFetchingDepreciation(true);

    const response = await apiFetch(`${apiUrl}Depreciation/GetSageAudit/${companyId}`
      //   , {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   }
      // }
    );
    if (response) {

      const res = await response.json();

      setAuditData(res);

    }
  }

  function nextRun() {
    var a = moment().endOf('month');
    var b = moment();

    return a.diff(b, 'days');
  }


  const closeButtonRef = useRef<any>(null);
  const postJournalsCloseRef = useRef<any>(null);

  const close = () => {
    if (closeButtonRef.current) {
      closeButtonRef.current?.click();
    }
  };

  const closePostJournalsModal = () => {
    if (postJournalsCloseRef.current) {
      postJournalsCloseRef.current?.click();
    }
  };


  async function postJournals(compId: any) {
    toast.info("Processing...");
    // setFetchingDeprecipostation(true);
    try {
      const response = await apiFetch(`${apiUrl}Depreciation/PostJournals/${compId}`
        //   , {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   }
        // }
      );

      if (response) {
        toast.success(`Complete!`, {
          description: "Journals posted succesfuly.",
        });
        const res = await response.json();
      } else {
        toast.error(`Failed!`, {
          description: "Journals posting failed.",
        });
      }
    } catch (e) {
      toast.error(`Error!`, {
        description: "An error occurred while posting journals.",
      });
    } finally {
      // Close the modal regardless of success/error
      closePostJournalsModal();
    }
  }

  function filter(option: any) {

    setSelectedDateFilter(option);
    const endDate = new Date().toString()
    if (option == "0") {
      clearFilters();
    }
    if (option == "1") {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      filterByDate(startDate.toString(), endDate);
    }
    if (option == "2") {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 120);
      filterByDate(startDate.toString(), endDate);
    }
    if (option == "3") {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 180);
      filterByDate(startDate.toString(), endDate);
    }
    if (option == "4") {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 365);
      filterByDate(startDate.toString(), endDate);
    }

  }


  function clearFilters() {

    transformedData && setFilteredData(transformedData);
    setPage(1);
  }

  const dataSource = filteredData ?? transformedData ?? [];
  const totalItems = (dataSource && dataSource.length) || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // ensure current page is valid
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return dataSource.slice(start, start + pageSize);
  }, [dataSource, page, pageSize]);

  return (
    <div className="mx-auto min-w-full min-h-full">
      <div className="flex flex-col gap-4 p-4 w-full h-full">
        <h4 className="text-xl font-semibold text-muted-foreground">{`Depreciation History for ${myCompany?.companyName ?? "Company."}`}</h4>
        <div className="grid grid-cols-3 justify-center mb-4">
          <div>
            <small>Search by asset name</small><br />
            <input style={{ fontSize: "14px" }} onChange={(e) => filterByName(e.target.value)} type="text" placeholder="Search asset name" className="w-1/2 p-1 border border-gray-300 rounded-md" />
          </div>
          <div>
            <small>Filter by category</small><br />
            <select style={{ fontSize: "15px", color: "darkgray" }} className="w-1/2 p-1 border rounded-md w-1/2 p-1 border border-gray-300 rounded-md" value={selectedCategory} onChange={(e) => {
              const v = e.target.value;
              setSelectedCategory(v);
              if (v) {
                setFilteredData((transformedData || []).filter((d: any) => d.category === v));
              } else {
                setFilteredData(transformedData);
              }
              setPage(1);
            }}>
              <option value="">All categories</option>
              {categoriesList.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center" style={{ marginTop: "15px" }}>
            <Badge style={{ padding: "2%" }} variant="outline" className={`bg-green-100 text-green-700 mr-2`}>
              <CheckCircle size={16} style={{ paddingRight: "1%" }} /> <small> Last run: --</small>
            </Badge>

            <Dialog>
              <DialogTrigger asChild className="grow">
                <Badge style={{ padding: "2%", cursor: "pointer" }} variant="outline" className={`bg-orange-100 text-orange-700 mr-2`}>
                  <MailWarning style={{ paddingRight: "1%" }} size={16} />
                  {canDepr.length}
                </Badge>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Assets pending usage update</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-base">
                  {canDepr.map((x: any) => (
                    <React.Fragment key={x.id}>
                      <Label>Asset: {x.name}</Label> <br />
                    </React.Fragment>
                  ))}
                </DialogDescription>
                <DialogFooter>
                  <DialogClose asChild></DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger ref={closeButtonRef} asChild>
                <Badge style={{ padding: "2%", cursor: "pointer" }} variant="outline" className={`bg-red-100 text-red-700 mr-2`}>
                  <PowerCircle size={16} style={{ paddingRight: "1%" }} /><small> Trigger run</small>
                </Badge>
              </DialogTrigger>
              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle>Run Depreciation</DialogTitle>
                  <DialogDescription>Please update the usage on the following assets to proceed</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {canDepr.map((x: any) => (
                    <div key={x.id}>
                      <label style={{ fontSize: "12px", float: "left", width: "60%" }}>Asset: {x.name}</label>
                      <input
                        onChange={(e: any) => {
                          var up = {
                            assetId: x.id,
                            usage: e.target.value,
                            sageCompanyId: myCompany?.si,
                            categoryId: x.categoryId
                          };
                          var newUp = updatedUsageAssets.filter((a: any) => a.assetId !== x.id);
                          setUpdatedUsageAssets([...newUp, up]);
                        }}
                        style={{ fontSize: "10px", float: "left", width: "40%" }}
                        type="text" placeholder="0"
                        className="w-1/2 p-1 border border-gray-300 rounded-md" />
                    </div>
                  ))}
                </div>
                <label className="text-muted-foreground flex items-center gap-1">
                  <Checkbox id="pushtosage" style={{ fontSize: "10px" }} checked={false} />
                  <label style={{ fontSize: "12px" }}>Push journals to SAGE?</label>
                </label>
                <DialogFooter>
                  <Button type="submit" onClick={() => POST_depreciationRun(updatedUsageAssets)}>Run</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Badge style={{ padding: "2%", cursor: "pointer" }} variant="outline" className={`bg-green-100 text-green-700 mr-2`}>
                  <UploadCloud size={16} style={{ paddingRight: "1%" }} /><small> Post journals</small>
                </Badge>
              </DialogTrigger>
              <DialogContent className="md:max-w-[1000px] mt-10">
                <DialogHeader>
                  <DialogTitle>Post journals</DialogTitle>
                  <DialogDescription>Proceeding will post the following entries to SAGE</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Depreciation Date</TableHead>
                        <TableHead>Category Name</TableHead>
                        <TableHead>Depreciation amount</TableHead>
                        <TableHead>Debit Account</TableHead>
                        <TableHead>Credit Account</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditData.filter(x => x.posted == false)?.map((x: any) => (
                        <TableRow key={x.id || Math.random()}>
                          <TableCell>{moment(x.createdDate).format('DD/MM/YYYY')}</TableCell>
                          <TableCell>{x.categoryName}</TableCell>
                          <TableCell>R{x.totalCategoryDepreciation}.00</TableCell>
                          <TableCell>{x.debitJournalCode}</TableCell>
                          <TableCell>{x.creditJournalCode}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <DialogFooter>
                  <DialogClose ref={postJournalsCloseRef} className="hidden" />
                  <Button className="w-full" type="submit" onClick={() => postJournals(myCompany.si)}>Upload journals</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

        </div>
        <div className="grid grid-cols-3 gap-2 justify-center mb-4">

          <div>

            <div className="grid grid-cols-2 mb-4">
              <div>
                <small>Start</small><br />
                <input type="date" style={{ fontSize: "12px", color: "grey" }} placeholder="Search by date" className="w-2/3 p-1 border border-gray-300 rounded-md" onChange={(e) => { changeStartDate(e.target.value) }} />


              </div>
              <div>
                <small>End</small><br />
                <input type="date" style={{ fontSize: "12px", color: "grey" }} placeholder="Search by date" onChange={(e) => { changeEndDate(e.target.value) }} className="w-2/3 p-1 border border-gray-300 rounded-md" />

              </div>
            </div>


          </div>



          <div>
            <small>By date</small>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              <label className="text-muted-foreground flex items-center gap-1 cursor-pointer">
                <Checkbox onCheckedChange={(e: any) => { if (e == true) { filter(1) } else { filter(0) } }} id="date-filter-1" className="size-4" checked={selectedDateFilter == 1} />
                <span style={{ fontSize: "12px" }}>This month</span>
              </label>
              <label className="text-muted-foreground flex items-center gap-1 cursor-pointer">
                <Checkbox onCheckedChange={(e: any) => { if (e == true) { filter(2) } else { filter(0) } }} id="date-filter-2" className="size-4" checked={selectedDateFilter == 2} />
                <span style={{ fontSize: "12px" }}>Last 4 months</span>
              </label>
              <label className="text-muted-foreground flex items-center gap-1 cursor-pointer">
                <Checkbox onCheckedChange={(e: any) => { if (e == true) { filter(3) } else { filter(0) } }} id="date-filter-3" className="size-4" checked={selectedDateFilter == 3} />
                <span style={{ fontSize: "12px" }}>Last 6 months</span>
              </label>
              <label className="text-muted-foreground flex items-center gap-1 cursor-pointer">
                <Checkbox onCheckedChange={(e: any) => { if (e == true) { filter(4) } else { filter(0) } }} id="date-filter-4" className="size-4" checked={selectedDateFilter == 4} />
                <span style={{ fontSize: "12px" }}>Year to date</span>
              </label>
            </div>
          </div>
          <div style={{ marginTop: "6%", marginLeft: "15%" }}>


            {filteredData?.length > 0 &&
              <ExcelDownloder
                data={(() => {
                  const dataToExport = filteredData || transformedData || [];
                  const formatItem = (item: any) => ({
                    "Asset Code": item.code,
                    "Asset Description": item.assetName,
                    "Category": item.category,
                    "Purchase Date": item.purchaseDate,
                    "Depreciation Start Date": item.depreciationStartDate,
                    "Purchase Price": item.purchasePrice,
                    "Revalued Value": item.revaluedValue,
                    "Total Depreciation": item.totalDepreciation,
                    "Prior Years": item.priorYearsDepreciation,
                    "Current Year": item.depreciationThisYear,
                    "Current Period": item.depreciationThisMonth,
                    "Book Value": item.bookValue
                  });

                  if (isGroupedView) {
                    const groups: Record<string, any[]> = {};
                    dataToExport.forEach((item: any) => {
                      const cat = item.category || "Uncategorized";
                      if (!groups[cat]) groups[cat] = [];
                      groups[cat].push(formatItem(item));
                    });
                    return groups;
                  } else {
                    return {
                      "Depreciation History": dataToExport.map(formatItem)
                    };
                  }
                })()}
                filename={`DepreciationExport_${new Date().toDateString()}`}
                type={Type.Button} // or type={'button'}
              >
                <a style={{ cursor: "pointer" }}>
                  <FileSpreadsheet style={{ float: "left" }} /> <small>Export spreadsheet</small>
                </a>
              </ExcelDownloder>

            }


          </div>
        </div>


        <div className="flex items-center space-x-2 mb-4">
          <Switch id="grouped-view" checked={isGroupedView} onCheckedChange={setIsGroupedView} />
          <label htmlFor="grouped-view" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Grouped List View
          </label>
        </div>

        {!isGroupedView && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <small>Showing</small>
              <select value={pageSize} onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(1); }} className="p-1 border rounded">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <small>of {totalItems} records</small>
            </div>

            <div className="flex items-center gap-2">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
              <span>Page {page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-2">
                <div className="h-4 mb-2 w-32">
                  <Skeleton className="h-4 w-32 rounded" />
                </div>
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            ))}
          </div>
        ) : !transformedData || transformedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 bg-slate-50 dark:bg-slate-900/20 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-amber-100 p-3 rounded-full mb-4">
              <FileWarning size={32} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Depreciation history not found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-center max-w-md">
              It looks like no depreciation runs have been performed for this company yet.
              Perform a run now to generate history.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-md flex items-center gap-2">
                  <PowerCircle size={18} />
                  Run Now
                </Button>
              </DialogTrigger>
              <DialogContent className="">
                <DialogHeader>
                  <DialogTitle>Run Depreciation</DialogTitle>
                  <DialogDescription>
                    Please update the usage on the following assets to proceed
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {canDepr.map((x: any) => {

                    return <>
                      <div key={x.id}>


                        <label style={{ fontSize: "12px", float: "left", width: "60%" }}>Asset: {x.name}</label>
                        <input
                          onChange={(e: any) => {
                            ;
                            var up = {
                              assetId: x.id,
                              usage: e.target.value,
                              sageCompanyId: myCompany?.si,
                              categoryId: x.categoryId
                            };

                            var newUp = updatedUsageAssets.filter((a: any) => { return a.assetId !== x.id });

                            setUpdatedUsageAssets([...newUp, up]);
                            ;
                          }}
                          style={{ fontSize: "10px", float: "left", width: "40%" }}
                          type="text" placeholder="0"
                          className="w-1/2 p-1 border border-gray-300 rounded-md" />
                      </div>
                    </>
                  })}
                </div>
                <label className="text-muted-foreground"> <Checkbox id="pushtosage-empty" style={{ fontSize: "10px" }} checked={false} /> <label style={{ fontSize: "12px" }}>Push journals to SAGE?</label> </label>

                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={
                      () => { POST_depreciationRun(updatedUsageAssets) }
                    }
                  >
                    Run
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : isGroupedView ? (
          <div className="overflow-x-auto space-y-8">
            {(() => {
              const data = filteredData || transformedData || [];
              const groups: Record<string, any[]> = {};
              data.forEach((item: any) => {
                const cat = item.category || "Uncategorized";
                if (!groups[cat]) groups[cat] = [];
                groups[cat].push(item);
              });

              return Object.keys(groups).sort().map(category => (
                <div key={category} className="border rounded-md p-4">
                  <h4 className="font-bold mb-4">Asset Type: {category}</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset Code</TableHead>
                        <TableHead>Asset Description</TableHead>
                        <TableHead>Purchase Date</TableHead>
                        <TableHead>Depreciation Start Date</TableHead>
                        <TableHead className="text-right">Purchase Price</TableHead>
                        <TableHead className="text-right">Revalued Value</TableHead>
                        <TableHead className="text-right">Total Depr.</TableHead>
                        <TableHead className="text-right">Prior Years</TableHead>
                        <TableHead className="text-right">Current Year</TableHead>
                        <TableHead className="text-right">Current Period</TableHead>
                        <TableHead className="text-right">Book Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groups[category].map((item: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell>{item.code}</TableCell>
                          <TableCell>{item.assetName}</TableCell>
                          <TableCell>{item.purchaseDate}</TableCell>
                          <TableCell>{item.depreciationStartDate}</TableCell>
                          <TableCell className="text-right">{item.purchasePrice?.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right">{item.revaluedValue === "NA" ? "NA" : item.revaluedValue}</TableCell>
                          <TableCell className="text-right">{item.totalDepreciation?.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right">{item.priorYearsDepreciation?.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right">{item.depreciationThisYear?.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right">{item.depreciationThisMonth?.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell className="text-right">{item.bookValue?.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-muted/50">
                        <TableCell colSpan={4} className="text-left py-4">Total Depreciation for {category}</TableCell>
                        <TableCell className="text-right">
                          {groups[category].reduce((sum: number, item: any) => sum + (Number(item.purchasePrice) || 0), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          {groups[category].reduce((sum: number, item: any) => sum + (typeof item.revaluedValue === 'number' ? item.revaluedValue : 0), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          {groups[category].reduce((sum: number, item: any) => sum + (Number(item.totalDepreciation) || 0), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          {groups[category].reduce((sum: number, item: any) => sum + (Number(item.priorYearsDepreciation) || 0), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          {groups[category].reduce((sum: number, item: any) => sum + (Number(item.depreciationThisYear) || 0), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          {groups[category].reduce((sum: number, item: any) => sum + (Number(item.depreciationThisMonth) || 0), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right">
                          {groups[category].reduce((sum: number, item: any) => sum + (Number(item.bookValue) || 0), 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ));
            })()}
          </div>
        ) : (
          <DataTable columns={assetDepreciationHistoryColumns} data={paginatedData} />
        )}
      </div>
    </div>
  );
}
