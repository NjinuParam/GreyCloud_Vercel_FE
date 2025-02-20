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
import ButtonSubmitForm from "@/app/(auth)/login/_components/ButtonSubmitForm";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { format, set } from "date-fns";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
import { useToast } from "@/components/ui/use-toast";
import AutoComplete from "react-google-autocomplete";
import {
  SAGE_ONE_CUSTOMER,
  SAGE_ONE_CUSTOMER_NEW,
} from "@/lib/api-endpoints/sage-one-customer";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { getIronSessionData } from "@/lib/auth/auth";
import { it } from "node:test";
import { Checkbox } from "../../../../../../components/ui/checkbox";

const FormSchema = z.object({
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  endDate: z.date({
    required_error: "An end date is required.",
  }),

  deposit: z.number({
  
  }).default(0),
  discount: z.number({
  
  }).default(0),

  customerId: z.string({
  }).nullable().default(""),
});

function CreateOrderForm({
  assets,
}: {
  assets: any;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [dis, setDiscount] = useState(0);
  const [items, setItems] = useState<
    {
      description: string;
      qty: number;
      serialNumber: string;
      value: number;
      total: number;
      billingType: any;
    }[]
  >([]);
  const [selectedItem, setSelectedItem] = useState(0);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const [custs, setCusts] = useState([]);
  const [qty, setQty] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState(false);
  const [excludedAssets, setExcludedAssets] = useState<any[]>([]);
  const [selectedCustomerAddresses, setSelectedCustomerAddresses] = useState<any[]>(
    []
  );
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [price, setPrice] = useState(0);
  const [customerId, setCustomerId] = useState("");
  const [discountPrice, setDiscountPrice] = useState(0);
  const [total, setTotal] = useState(0);

  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAssets, setFilteredAssets] = useState<any[]>([]);

  const [companyId, setCompanyId] = useState("");

  const getFinalData = (_items:any[]) => {
    
    let price = _items.reduce((accum, item) => accum + item.total, 0);
    setPrice(price);
    let discPr = price * (dis / 100);
    setDiscountPrice(discPr);

    let tot = price - discPr;
    setTotal(tot);
  };

  const endpoint = `${apiUrl}${SAGE_ONE_CUSTOMER.GET.CUSTOMER_GET_FOR_COMPANY}`;
  React.useEffect(() => {
    getIronSessionData().then((comp: any) => {
      const compId = comp.companyProfile.loggedInCompanyId;

      const sageCompanyId = comp.companyProfile.companiesList.find((x:any)=>x.companyId ==compId).sageCompanyId
setCompanyId(sageCompanyId);
      getCustomers(sageCompanyId);
      GetAddresses(sageCompanyId);
      
      setFilteredAssets(assets.filter((x:any)=>x.billingType !=null));
    });
  }, []);

  const getCustomers = async (compId: string) => {
    try {
      const response = await fetch(endpoint + `/${compId}`);
      const res = await response.json();
      setCusts(res.results);
    } catch (e) {}
  };

  async function GetAddresses(_sageCompanyId:any){
    const endpoint = `${apiUrl}Address/Get/${_sageCompanyId}`;


    try {
      
      const response = await fetch(endpoint, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.     
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
       
      });


      const res = await response.json();
      
      setAddresses(res);
      
     
    } catch (e) {
      console.log(e);
    }
  }

  async function GetUnnavailableAssets(_sageCompanyId:any, start:string, endDate:string){

    const endpoint = `${apiUrl}/SageOneOrder/SalesOrderNew/GetUnavailableAssets/${_sageCompanyId}/${start}/${endDate}`;

    try {
      

      const response = await fetch(endpoint, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.     
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
       
      });

      const res = await response.json();
      setExcludedAssets(res);
     

     
    } catch (e) {
      console.log(e);
    }
  }

  function _setSelectedItems(itemId:string){ 

    if(selectedItems.includes(itemId)){
      setSelectedItems(selectedItems.filter((x:any)=> x!=itemId))
    }else{
      setSelectedItems([...selectedItems, itemId]);
    
    }

    if(selectedItems.includes(itemId)){

      const removedItem = items.filter((x:any)=> x.assetId != itemId);
      setItems(removedItem);
      getFinalData(removedItem);

    }else{

      const theAsset = assets.find(
        (x:any) => x.id == itemId
      );
      const sDate = new Date(form.getValues("startDate"));
      const eDate = new Date(form.getValues("endDate"));
      const days = Math.abs(eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24); 
  
      
      const theItem = {
        qty: 1,
        assetId: theAsset.id,
        serialNumber: theAsset.serialNumber,
        description: theAsset.description,
        value: theAsset.billingType.amount,
        // total: theAsset.billingType.amount * days,
        total: getTotal(theAsset),
        billingType: theAsset.billingType,
      };
      setItems([...items, theItem]);
      getFinalData([...items, theItem]);
  
    }

  }


  function getTotal(_asset:any){

    const sDate = new Date(form.getValues("startDate"));
    const eDate = new Date(form.getValues("endDate"));
    const days = Math.abs(eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24);
    

    if(_asset.billingType.type == 1){
      return _asset.billingType.amount;
    }
    if(_asset.billingType.type == 0 ){
      return _asset.billingType.amount * days;
      
    }
    if(_asset.billingType.type == 2){
      return  _asset.billingType.amount;
      
    }
    if(_asset.billingType.type == 3){
      return 0;
      
    }

  }


  async function onSubmit(data: z.infer<typeof FormSchema>) {


    const update= {...data, assets: items, 
  
      depositAmount: data?.deposit??0,
        discountAmount:discountPrice,
         customerId:`${customerId}`, 
         SageCompanyId: companyId,
         postalAddress01: address1,
        postalAddress02: address2};
    
    const endpoint = `${apiUrl}SageOneOrder/SalesOrderNew/Save`;


    try {
      toast.info("Creating order...");
      const response = await fetch(endpoint, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.     
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(update), // body data type must match "Content-Type" header
      });


      const res = await response.json();
      

      toast.success(`Order created!`, {
        description: "The order was created successfully.",
      });
      router.push("/dashboard/orders/show");
    } catch (e) {
      console.log(e);
    }
  }

  // const filtAssets = assets.filter((x:any)=> { return !excludedAssets?.includes(x.id)});


  function searchAssetByName(name:string){

    if(name == "") setFilteredAssets(assets);
    const ret =  assets.filter((x:any)=> x.description.toLowerCase().includes(name.toLowerCase()));
    setFilteredAssets(ret);
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Order</CardTitle>
        <CardDescription>
          Fill in the form below to create a new order.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent>
            <div className="grid w-full items-center grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          // onChange={  getFinalData(items)}
                   
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>End Date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          // disabled={(date) =>
                          //   date < new Date() || date < new Date(form.getValues("startDate"))
                          // }
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          onSelect={field.onChange}
                        //  onChange={form.getValues("startDate") && excludedAssets.length==0 &&  form.getValues("endDate") && GetUnnavailableAssets(companyId, form.getValues("startDate").toDateString(), form.getValues("endDate").toDateString())}
                      
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        
                      
                        field.onChange;

                        const theCustomer = custs.find((c:any) => c?.name == e) as any;
                        setCustomerId(theCustomer?.id??"");
                        
                        setSelectedCustomerAddresses([]);
                        let addresses = [];
                        if (theCustomer?.deliveryAddress01 !== "") {
                          addresses.push(theCustomer?.deliveryAddress01);
                        }

                        if (theCustomer?.deliveryAddress02 !== "") {
                          addresses.push(theCustomer?.deliveryAddress02);
                        }

                        if (theCustomer?.deliveryAddress03 !== "") {
                          addresses.push(theCustomer?.deliveryAddress03);
                        }

                        if (theCustomer?.deliveryAddress04 !== "") {
                          addresses.push(theCustomer?.deliveryAddress04);
                        }

                        if (theCustomer?.deliveryAddress05 !== "") {
                          addresses.push(theCustomer?.deliveryAddress05);
                        }

                        if (theCustomer?.postalAddress01 !== "") {
                          addresses.push(theCustomer?.postalAddress01);
                        }

                        if (theCustomer?.postalAddress02 !== "") {
                          addresses.push(theCustomer?.postalAddress02);
                        }

                        if (theCustomer?.postalAddress03 !== "") {
                          addresses.push(theCustomer?.postalAddress03);
                        }

                        if (theCustomer?.postalAddress04 !== "") {
                          addresses.push(theCustomer?.postalAddress04);
                        }

                        if (theCustomer?.postalAddress05 !== "") {
                          addresses.push(theCustomer?.postalAddress05);
                        }

                        setSelectedCustomerAddresses(addresses);
                      }}
                     
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {custs.map((c:any) => (
                          <SelectItem value={c?.name}>{c?.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount %</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0%"
                        type="number"
                        onChange={(e) => {
                          setDiscount(parseInt(e.target.value));
                          getFinalData(items);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               
              <FormField
                control={form.control}
                name="deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deposit</FormLabel>
                    <FormControl>
                      <Input  defaultValue={0}  type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
          
                  <small> Please enter drop off address or select from your 
                  <a style={{color:"blue", cursor:"pointer"}} onClick={()=>setNewAddress(!newAddress)}> saved addresses</a> 
                  </small>
                {!newAddress?<>
                
                  <AutoComplete
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-4" 
              //  defaultValue={a.postalAddress01??""}
                  apiKey={"AIzaSyDsGw9PT-FBFk7DvGK46BpvEURMxcfJX5k"}
                  onPlaceSelected={(place:any) => {
                  
                    setAddress1(place?.formatted_address);
                    setAddress2(`${place.geometry.location.lat()},${place.geometry.location.lng()}`);
                  
                    // ass[i].address = place?.formatted_address;
                    // ass[i].gps = `${place.geometry.location.lat()},${place.geometry.location.lng()}`
                                                    
                  }}
                  options={{
                    types: ["geocode", "establishment"],//Must add street addresses not just cities
                    componentRestrictions: { country: "za" },
                  }}
                />

                </> : <>  
                {/* <FormField
                control={form.control}
                className="py-2"
                name="address"
                render={({ field }) => (
                  <FormItem> */}
                    {/* <FormLabel>Address</FormLabel> */}
                    <Select
                      // onValueChange={field.onChange}
                      // defaultValue={field.value}
                    >
                      {/* <FormControl> */}
                        <SelectTrigger>
                          <SelectValue placeholder="Address" />
                        </SelectTrigger>
                      {/* </FormControl> */}
                      <SelectContent>
                        {addresses.map((a:any) => (
                          <SelectItem value={a.addressLine}>{a.addressLine}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {/* <FormMessage /> */}
                  {/* </FormItem> */}
                {/* )} */}
              {/* /> */}
              </>}
            </div>


          

            </div>

            <div className="my-4">
              {/* <Popover>
                <PopoverTrigger>
                  <div className="flex flex-row gap-2 p-2 rounded-sm cursor-pointer">
                    <PlusIcon></PlusIcon>
                    Add Asset
                  </div>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="flex flex-col gap-2">
                    <Select onValueChange={(e: any) => setSelectedItem(e)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Assets</SelectLabel>
                          {filtAssets?.map((asset:any) => (
                            <SelectItem value={asset.id}>
                              {asset.description}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => {
                        
                        const theAsset = assets.find(
                          (x:any) => x.id == selectedItem
                        );
                        const sDate = new Date(form.getValues("startDate"));
                        const eDate = new Date(form.getValues("endDate"));
                        const days = Math.abs(eDate.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24); 

                        
                        const theItem = {
                          qty: 1,
                          assetId: theAsset.id,
                          serialNumber: theAsset.serialNumber,
                          description: theAsset.description,
                          value: theAsset.billingType.amount,
                          // total: theAsset.billingType.amount * days,
                          total: getTotal(theAsset),
                          billingType: theAsset.billingType,
                        };
                        setItems([...items, theItem]);
                        getFinalData([...items, theItem]);
                      }}
                    >
                      Add asset
                    </Button>
                  </div>
                </PopoverContent>
              </Popover> */}


<Dialog>
        <DialogTrigger asChild className="grow">
        {form.getValues("startDate") && excludedAssets.length==0 &&  form.getValues("endDate") &&
        <div className="flex flex-row gap-2 p-2 rounded-sm cursor-pointer">
                    <PlusIcon></PlusIcon>
                    Add Asset
                  </div>
}
        
        </DialogTrigger>
        <DialogContent className="md:max-w-[60%]">
        
           <Card className="flex flex-col w-[100%] mx-auto justify-between mt-8">
      <CardHeader className="flex flex-col bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 py-5">
        <CardTitle>
          <h2 className="text-xl text-foreground/80">Add Asset </h2>
        </CardTitle>
      </CardHeader> 

      <CardContent className="p-8">
        {/* <SageOneAssetCategorySaveForm  /> */}
        <Table>
        <div><br/><br/> <Input type="text" placeholder="Search" className="mb-2"  onChange={(e)=>searchAssetByName(e.target.value)} /></div>
                <TableHeader>
                  {/* <TableRow>    */}
                  
                   {/* </TableRow> */}
                  <TableRow>
                  
                  <TableHead >Select</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Billing type</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                  <TableRow>
                 
                  </TableRow>
                </TableHeader>
                <TableBody>
                {filteredAssets?.map((itm:any) => (
                  // {items.map((itm) => (
                    <TableRow>
                       <TableCell>
                        <Checkbox
                        defaultChecked={selectedItems.includes(itm.id)}
                        onCheckedChange={(e: any) => {  _setSelectedItems(itm.id)}}
                       
                       /></TableCell>
                      <TableCell className="font-medium">
                        {itm.description}
                      </TableCell>
                      <TableCell>{itm.serialNumber}</TableCell>
                      <TableCell>{itm.billingType?.type==0?"Daily": itm.billingType?.type==1?"Once off": itm.billingType?.type==2?"Once off + Usage":"Usage" }</TableCell>
                      <TableCell>R{itm.billingType?.amount} {itm.billingType?.type==0?" per day": itm.billingType?.type==1?" once off": itm.billingType?.type==2?` once off + ${itm.billingType?.usageType==0?' per km':'per hour'}`:`${itm.billingType?.usageType==0? 'per km':'per hour'}`} </TableCell>
                  
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                <DialogClose asChild>
          
                    </DialogClose>
                </TableFooter>
              </Table>


      </CardContent>
    </Card>

        
        </DialogContent>
            </Dialog>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Billing type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((itm) => (
                    <TableRow>
                      <TableCell className="font-medium">
                        {itm.description}
                      </TableCell>
                      <TableCell>{itm.serialNumber}</TableCell>
                      <TableCell>{itm.billingType?.type==0?"Daily": itm.billingType?.type==1?"Once off": itm.billingType?.type==2?"Once off + Usage":"Usage" }</TableCell>
                      <TableCell>R{itm.value} {itm.billingType?.type==0?" per day": itm.billingType?.type==1?" once off": itm.billingType?.type==2?` once off + ${itm.billingType?.usageType==0?' per km':'per hour'}`:`${itm.billingType?.usageType==0? 'per km':'per hour'}`} </TableCell>
                      <TableCell className="text-right">R{itm.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Summary</TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p>Sub Total: R{price}</p>
                        <p>Discount: R{discountPrice.toFixed(2)}</p>
                        {/* <p>VAT: ? </p> */}
                        <p>Total: R{total.toFixed(2)}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </CardContent>

          <CardFooter>
          <ButtonSubmitForm
                executingString="Creating Order..."
                idleString="Create Order"
                
                status={"idle"}
              />
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default CreateOrderForm;
