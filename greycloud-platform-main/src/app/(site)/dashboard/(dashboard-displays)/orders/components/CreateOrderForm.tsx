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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { getIronSessionData } from "@/lib/auth/auth";

const FormSchema = z.object({
  startDate: z.date({
    required_error: "A start date is required.",
  }),
  endDate: z.date({
    required_error: "An end date is required.",
  }),
  customerId: z.string({
    required_error: "A customer is required.",
  }),
  assetId: z.string({
    required_error: "An asset is required.",
  }),
});

function CreateOrderForm({
  customers,
  assets,
}: {
  customers: any[];
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
    }[]
  >([]);
  const [selectedItem, setSelectedItem] = useState(0);
  const [custs, setCusts] = useState([]);
  const [qty, setQty] = useState(0);
  const [selectedCustomerAddresses, setSelectedCustomerAddresses] = useState(
    []
  );
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [total, setTotal] = useState(0);

  const getFinalData = () => {
    let price = items.reduce((accum, item) => accum + item.total, 0);
    setPrice(price);
    let discPr = price * (dis / 100);
    setDiscountPrice(discPr);

    let tot = price - discPr;
    setTotal(tot);
  };

  const endpoint = `${apiUrl}${SAGE_ONE_CUSTOMER.GET.CUSTOMER_GET_FOR_COMPANY}`;
  React.useEffect(() => {
    getIronSessionData().then((comp: any) => {
      let currentCompanyId = comp.companyId;
      let sageCompanyId = comp.companyProfile.companiesList.find(
        (c) => c.companyId == currentCompanyId
      ).sageCompanyId;
      getCustomers(sageCompanyId);
    });
  }, []);

  const getCustomers = async (compId: string) => {
    try {
      const response = await fetch(endpoint + `/${compId}`);
      const res = await response.json();
      setCusts(res.results);
      console.log("CUSTOMERSSSS", res.results);
    } catch (e) {}
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const endpoint = `${apiUrl}${SAGE_ONE_CUSTOMER_NEW.POST.CUSTOMER_SAVE}`;
    try {
      toast({
        title: "Success!",
        description: "Order Saved!",
      });
    } catch (e) {
      console.log(e);
    }
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
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
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
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
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
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select
                      onValueChange={(e) => {
                        field.onChange;

                        const theCustomer = custs.find((c) => c.name == e);
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
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {custs.map((c) => (
                          <SelectItem value={c.name}>{c.name}</SelectItem>
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
                        placeholder="Discount %"
                        type="number"
                        onChange={(e) => {
                          setDiscount(parseInt(e.target.value));
                          getFinalData();
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
                      <Input placeholder="Deposit" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalUsage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Usage</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Total Usage"
                        type="number"
                        {...field}
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
                    <FormLabel>Start Usage</FormLabel>
                    <FormControl>
                      <Input placeholder="Deposit" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Address" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCustomerAddresses.map((a) => (
                          <SelectItem value={a}>{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="my-4">
              <Popover>
                <PopoverTrigger>
                  <div className="flex flex-row gap-2 border-2 p-2 rounded-sm cursor-pointer">
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
                          {assets.map((asset) => (
                            <SelectItem value={asset.id}>
                              {asset.description}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      onChange={(e) => setQty(parseInt(e.target.value))}
                      placeholder="Quanity"
                    />

                    <Button
                      onClick={() => {
                        const theAsset = assets.find(
                          (x) => x.id == selectedItem
                        );

                        const theItem = {
                          qty: qty,
                          serialNumber: theAsset.serialNumber,
                          description: theAsset.description,
                          value: theAsset.currentValue,
                          total: theAsset.currentValue * qty,
                        };
                        setItems([...items, theItem]);
                        getFinalData();
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Quantity</TableHead>
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
                      <TableCell>{itm.qty}</TableCell>
                      <TableCell>R{itm.value}</TableCell>
                      <TableCell className="text-right">R{itm.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Summary</TableCell>
                    <TableCell className="text-right">
                      <div>
                        <p>Price: R{price}</p>
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
            <Button type="submit" variant={"outline"}>
              {isLoading ? "Saving..." : "Create Order"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default CreateOrderForm;
