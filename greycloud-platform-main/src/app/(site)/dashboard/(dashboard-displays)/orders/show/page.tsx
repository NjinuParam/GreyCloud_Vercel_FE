"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getIronSessionData } from "@/lib/auth/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import AutoComplete from "react-google-autocomplete";
import { Label } from "@/components/ui/label";
import { SelectGroup } from "@radix-ui/react-select";
import { cn, formatDate } from "@/lib/utils";
export default function ShowOrder() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const endpoint = `${apiUrl}SageOneOrder/SalesOrderNew/GetAll`;
  const [orders, setOrders] = React.useState([]);
  // const [assets, setAssets] = React.useState([]);
  const [ordersFormated, setOrdersFormated] = React.useState<any[]>([]);
  const [ordersFiltered, setOrdersFiltered] = React.useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState(-1);
const [addressToggles, setAddressToggles] = React.useState<any>({});

  const [loading, setLoading] = React.useState(true);

  const [startOrderAssets, setStartOrderAssets] = React.useState<any[]>([]);
  const [completeOrderAssets, setCompleteOrderAssets] = React.useState<any[]>([]);
  const [compId, setCompanyId] = React.useState<number>(14999);
  React.useEffect(() => {
    getIronSessionData().then((comp: any) => {
      const currentCompanyId = comp.companyProfile.loggedInCompanyId;

      const com = comp.companyProfile.companiesList.find(x=>x.companyId ==currentCompanyId).sageCompanyId

      getOrders(com);
      
    });
  }, []);


  const filterOrders = (state:number)=>{
    if(state == -1){
      setOrdersFiltered(ordersFormated);
      setSelectedFilter(state);
      return;
    }
    var _filtered = ordersFormated.filter((o:any) => {
      return o.status == state

    });

    setOrdersFiltered(_filtered);
    setSelectedFilter(state);
  }

  function toggleThis(index:number){
    
    setAddressToggles({...addressToggles, i:true})
  
  }
 


  const completeOrder = async (orderId: string, assets: any[]) => {
    try {
      toast.info("Processing...");
      const response = await fetch(
        `${apiUrl}SageOneOrder/SalesOrderNew/Complete/${orderId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({assets:assets}),
        }
        
      );
      toast.success(`Order updated!`, {
        description: "The order was updated successfully.",
      });
      
      getOrders(compId);
    } catch (e) {
      toast.error(`Error occured!`, {
        description: "Please try again.",
      });
      console.log(e);
    }
  };

  const getOrders = async (sageCompId: number) => {
    try {
      setLoading(true)
      const response = await fetch(endpoint + `/${sageCompId}`);
      const res = await response.json();
      
      setOrders(res);
      let fOrders = [] as any[];

      res.forEach((o:any) => {
        let fo = {
          id: o.id,
          customer: o.customer.name,
          address: `${o.postalAddress01}`,
          email: o.customer.email,
          startDate: o.startDate,
          endDate: o.endDate,
          status: o.status
        };

        fOrders.push(fo);
      });
      setOrdersFormated(fOrders);
      setOrdersFiltered(fOrders);
      setLoading(false)
    } catch (e) {
      setLoading(false)
    }
  };

  
async function updateStartOrderAssets(payload:any,orderId:string){
  toast.info("Processing...");
  try {
    const response = await fetch(
      `${apiUrl}SageOneOrder/SalesOrderNew/Start/${orderId}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({assets:payload}),
      }
    );
    toast.success(`Order updated!`, {
      description: "The order was updated successfully.",
    });
    getOrders(compId);
  } catch (e) {
    toast.error(`Error occured!`, {
      description: "Please try again.",
    });
    console.log(e);
  }
}


function initStartOrderModal(order:any, assets: any[]){
  const req =assets.map((asset:any)=>{
    return {
      assetId: asset.assetId,
      address:"",
      gps:"",
      usage: ""

    } as IUpdateOrderUsage;
  })

  // setStartOrderAssets(req);


}

interface IUpdateOrderUsage{
assetId:string;
address: string;
gps:string;
usage:string
}




  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("customer")}</div>
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Address
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="">{row.getValue("address")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div>Order Status</div>,
      cell: ({ row }) => (
        <div className="">
           <Badge variant="outline" className={row.getValue("status")=="0" ? `max-w-fit mt-1 bg-green-100 text-green-700`: row.getValue("status")=="4" ?`max-w-fit mt-1 bg-red-100 text-red-700`:  `max-w-fit mt-1 bg-green-100 text-green-700`}>
           {row.getValue("status")=="0"? "New Order" : row.getValue("status")=="1" ? "Awaiting Delivery" : row.getValue("status")=="2" ? "Ongoing" : row.getValue("status")=="3" ? "Completed": row.getValue("status")=="4" ? "Overdue": "Cancelled"}
          </Badge>
          
          </div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div>Email</div>,
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "startDate",
      header: () => <div>Start Date</div>,
      cell: ({ row }) => (
        <div className="">{formatDate(row.getValue("startDate"))}</div>
      ),
    },
    {
      accessorKey: "endDate",
      header: () => <div>End Date</div>,
      cell: ({ row }) => (
        <div className="">{formatDate(row.getValue("endDate"))}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const order = row.original;
        const _assets = orders.find((x:any) => x.id === order.id) as any;
        const assets = _assets?.assets;
        let ass: any[] = [];
        assets.forEach((a:any) => {
          if (a?.assetDetail?.billingType) {
            ass.push({
              assetId: a.assetId,
              returned: true,
              assetLocation:a?.assetDetail?.locName,
              usage: a.assetDetail?.billingType?.usageType
                ? a?.assetDetail?.billingType?.amount
                : 0,
                startUsage: a.startUsage??0
            });
          }
        });

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <a
                target="_blank"
                  href={`${apiUrl}/GetInvSalesOrderNew/GetInvoice/${order.id}`}
                  download
                >
                  Download Invoice
                </a>
              </DropdownMenuLabel>

              <Dialog>
                <DialogTrigger asChild>
                  {( order.status ==4 || order.status == 2) && 
                    <DropdownMenuLabel className="cursor-pointer">
                    Complete Order
                  </DropdownMenuLabel>
                  }

              

                
                </DialogTrigger>
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle>Complete Order</DialogTitle>
                    <DialogDescription>
                      Please fill in the form below to complete the order
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {ass.map((a, i) => (
                      <>
                      <div  style={{paddingBottom: "20px", paddingTop:"20px"}} className="w-full flex flex-row justify-between items-center">
                        <div className="w-full">
                        <h2 style={{fontWeight:"bold"}} >
                            {
                              assets.find((x:any) => x.assetId == a.assetId).assetDetail.description
                            }
                             <label style={{marginLeft:"15%"}}> <Checkbox checked={true}></Checkbox><small style={{marginLeft:"2%", fontWeight:"normal"}}>Mark as returned  </small></label>
                              
                          </h2>
                          <p>
                           { (a.billingType?.type==2 || a.billingType==3) && <small>
                            Starting usage: {
                              a.startUsage
                            } {  assets.find((x:any) => x.assetId == a.assetId)
                              .assetDetail.billingType.usageType}
                            </small>
                            }
                          </p>
                          <br/>
                          {a.usage !== 0 ? (
                            <div>
                                <label><small>Set final usage</small></label>
                              <Input
                               className="mt-4"
                                type="number"
                                placeholder="Usage"
                                value={a.usage}
                                onChange={(e) => {
                                  ass[i].usage = e.target.value;
                                }}
                              />
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                       
                       
                      </div>
                      <div style={{ borderBottom: "1px solid silver",  paddingBottom: "40px"}}>
                    
                    <small> Please enter drop off address or select from your <small onClick={(e)=>{ toggleThis(i)}} style={{color:"blue", cursor:"pointer"}}> saved addresses</small> </small>
                          {
                            addressToggles[i]?<>
Test      </>:<>
                            <AutoComplete
                            style={{zIndex:99999999}}
                             className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" 
                             defaultValue={order?.address??""}
                                apiKey={"AIzaSyDsGw9PT-FBFk7DvGK46BpvEURMxcfJX5k"}
                                onPlaceSelected={(place:any) => {
                                
                                
                                  ass[i].address = place?.formatted_address;
                                  ass[i].gps = `${place?.geometry?.location?.lat()},${place?.geometry?.location?.lng()}`
                                                                  
                                }}
                                options={{
                                  types: ["geocode", "establishment"],//Must add street addresses not just cities
                                  componentRestrictions: { country: "za" },
                                }}
                              />
                            </>
                          }
                          
                       

                      </div>
                      
                                          </>
                    ))}
               
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={() => {
                        completeOrder(order.id, assets);
                      }}
                    >
                      Complete Order
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  {order.status ==1 && 
                    <DropdownMenuLabel onClick={()=>initStartOrderModal(order, ass)} className="cursor-pointer">
                    Start Order
                  </DropdownMenuLabel>
                  }

              

                
                </DialogTrigger>
                
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle>Start Order</DialogTitle>
                    <DialogDescription>
                      Please fill in the form below to begin the order
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-2 py-4">
                    {ass.map((a, i) => (
                      <>
                      <div  style={{paddingTop: "20px"}} className="w-full flex flex-row justify-between items-center">
                        <div className="w-full">
                          <h2 style={{fontWeight:"bold"}}>
                            {
                              assets.find((x:any) => x.assetId == a.assetId).assetDetail.description
                            }
                             <label style={{marginLeft:"15%"}}> <Checkbox checked={true}></Checkbox><small style={{marginLeft:"2%", fontWeight:"normal"}}>Mark as delivered  </small></label>
                              
                          </h2>
                       
                          <br/>
                          {a.usage !== 0 ?  (<p>
                            <small>
                            Last recorded usage: {
                              a.startUsage
                            } {  assets.find((x:any) => x.assetId == a.assetId)
                              .assetDetail.billingType.usageType}
                            </small>
                          </p>):<></>
                          }
                          <br/>
                          {a.usage !== 0 ? (
                        <div className="grid w-full items-center grid-cols-2 gap-4">
                           <div className=" justify-between items-center">
                                <label><small>Enter initial usage</small></label>
                              <Input
                                className="mt-4"
                                type="number"
                                placeholder="Usage"
                                value={a.usage}
                                onChange={(e) => {
                                  ass[i].usage = e.target.value;
                                }}
                              />
                            </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                       
                       
                      </div>
                      <div>
                    
                      <small> Please enter pickup address or select from your <a  onClick={(e)=>{ }}  style={{color:"blue", cursor:"pointer"}}> saved addresses</a> </small>
                            
                              <AutoComplete
                               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" 
                              //  defaultValue={a.postalAddress01??""}
                                defaultValue={ass[i].assetLocation??""}
                                  apiKey={"AIzaSyDsGw9PT-FBFk7DvGK46BpvEURMxcfJX5k"}
                                  onPlaceSelected={(place:any) => {
                                  
                                  
                                    ass[i].address = place?.formatted_address;
                                    ass[i].gps = `${place.geometry.location.lat()},${place.geometry.location.lng()}`
                                                                    
                                  }}
                                  options={{
                                    types: ["geocode", "establishment"],//Must add street addresses not just cities
                                    componentRestrictions: { country: "za" },
                                  }}
                                />
                         

                        </div>
                        <div  style={{ borderBottom: "1px solid silver",  paddingBottom: "40px"}}>
                    
                      <small> Destination address  </small>
                            
                              <AutoComplete
                               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" 
                                defaultValue={order.address??""}
                                  apiKey={"AIzaSyDsGw9PT-FBFk7DvGK46BpvEURMxcfJX5k"}
                                  onPlaceSelected={(place:any) => {
                                  
                                    ass[i].address = place?.formatted_address;
                                    ass[i].gps = `${place.geometry.location.lat()},${place.geometry.location.lng()}`
                                                                    
                                  }}
                                  options={{
                                    types: ["geocode", "establishment"],//Must add street addresses not just cities
                                    componentRestrictions: { country: "za" },
                                  }}
                                />
                         

                        </div>

                        </>
                    ))}
                 
                  </div>
                  <DialogFooter>
                    <Button
                      // type="submit"
                      onClick={() => {
                        updateStartOrderAssets(ass, order.id);
                      }}
                    >
                    Start order
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: ordersFiltered,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by customer"
          value={
            (table.getColumn("customer")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("customer")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter By Status <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
          <DropdownMenuCheckboxItem
                    key="-1"
                    className="capitalize"
                    checked={selectedFilter == -1}
                    onCheckedChange={(value) =>
                      filterOrders(-1)
                    }
                  >
                    All orders
                  </DropdownMenuCheckboxItem>
             
                <DropdownMenuCheckboxItem
                    key="0"
                    className="capitalize"
                    checked={selectedFilter == 0}
                    // checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      filterOrders(0)
                    }
                  > 
                    <Badge variant="outline" className={cn(`bg-green-100 text-green-700`)}>
                    New Orders
                    </Badge>
                  
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    key="1"
                    className="capitalize"
                    checked = {selectedFilter == 1}
                    // checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      filterOrders(1)
                    }
                  >
                  <Badge variant="outline" className={cn(`max-w-fit mt-1 bg-red-100 text-red-700`)}>
                    Awaiting delivery
                  </Badge>
               
                  </DropdownMenuCheckboxItem>

                  <DropdownMenuCheckboxItem
                    key="2"
                    className="capitalize"
                    checked = {selectedFilter == 2}
                    // checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      filterOrders(2)
                    }
                  >
                  <Badge variant="outline" className={cn(`max-w-fit mt-1  bg-orange-100 text-orange-700`)}>
                    Ongoing orders
                  </Badge>
               
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    key="4"
                    className="capitalize"
                    checked = {selectedFilter == 4}
                    // checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      filterOrders(4)
                    }
                  >
                  <Badge variant="outline" className={cn(`max-w-fit mt-1 bg-red-100 text-red-700`)}>
                    Overdue orders
                  </Badge>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    key="3"
                    className="capitalize"
                    checked = {selectedFilter == 3}
                    // checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      filterOrders(3)
                    }
                  >
                    <Badge variant="outline" className={cn(`max-w-fit mt-1`)}>
                    Completed orders
                  </Badge>
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    key="5"
                    checked = {selectedFilter == 5}
                    className="capitalize"
                    // checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      filterOrders(5)
                    }
                  >
                  <Badge variant="outline" className={cn(`max-w-fit mt-1 `)}>
                    Cancelled orders
                  </Badge>
                  </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                    { loading? "Fetching orders..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
