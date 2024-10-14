
import React, { forwardRef, Fragment } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/app/components/ModeToggle";
import { formatRoleDisplayName } from "@/lib/utils";
import {
  PlusCircle, // For adding new items
  Layers, // For managing items
  UserPlus, // For adding users or admins
  Users, // For managing users or admins
  Briefcase, // For company related links
  Archive, // For asset management
  // For adding categories or groups
  Folder, // For managing categories or groups
  MapPin, // For location related links
  Notebook,
  ShoppingBasket,
  ShoppingCart,
  ShoppingCartIcon,
  Settings2, // For adding notes
  FolderPlus, Menu, MoreHorizontal, Search,
  PowerCircle
} from "lucide-react";

import { getIronSessionData } from "@/lib/auth/auth";

import Link from "next/link";
import { cn } from "../../../../lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

export default async function NavBar() {


  const session = await getIronSessionData();

  debugger;
  if (!session.isLoggedIn) {
    return null;
  }

  const companyName = session?.companyProfile?.companiesList?.find(
    (company) => company.companyId === session?.companyProfile?.loggedInCompanyId
  )?.companyName;
  const adminNavBarText = formatRoleDisplayName(session?.role ?? "") + " Dashboard";


  const menuItems = {
    GreyCloud_Admin: [
      {
        heading: "Company",
        links: [
          {
            title: "Add Company",
            path: "/dashboard/greycloud-admin/add-company",
            icon: <PlusCircle />,
          },
          {
            title: "Manage Companies",
            path: "/dashboard/greycloud-admin/manage-companies",
            icon: <Layers />,
          },
        ],
      },
      {
        heading: "Admins",
        links: [
          {
            title: "Add Admin",
            path: "/dashboard/greycloud-admin/add-admin",
            icon: <UserPlus />,
          },
          {
            title: "Manage Admins",
            path: "/dashboard/greycloud-admin/manage-admins",
            icon: <Users />,
          },
        ],
      },
    ],
    Company_Admin: [
      {
        heading: "Assets",
        links: [
          {
            title: "Trasact",
            path: "/dashboard/orders/create",
            icon: <ShoppingCartIcon />,
          },
          {
            title: "Add Depreciation Group",
            path: "/dashboard/company-user-admin/add-depreciation-group",
            icon: <FolderPlus />,
          },
          {
            title: "Add Asset",
            path: "/dashboard/company-user-admin/add-asset",
            icon: <PlusCircle />,
          },
          {
            title: "Manage Assets",
            path: "/dashboard/company-user-admin/manage-assets",
            icon: <Archive />,
          },
          {
            title: "Add Asset Category",
            path: "/dashboard/company-user-admin/add-asset-category",
            icon: <FolderPlus />,
          },
          // {
          //   title: "Add Asset Location",
          //   path: "/dashboard/company-user-admin/add-asset-location",
          //   icon: <MapPin />,
          // },
          // {
          //   title: "Add Asset Note",
          //   path: "/dashboard/company-user-admin/add-asset-note",
          //   icon: <Notebook />,
          // },
        ],
      },
      {
        heading: "Company",
        links: [
          // {
          //   title: "Manage Companies",
          //   path: "/dashboard/greycloud-admin/manage-companies",
          //   icon: <Layers />,
          // },
          // {
          //         title: "Add Company",
          //         path: "/dashboard/greycloud-admin/add-company",
          //         icon: <PlusCircle />,
          //       },
                {
                  title: "Company Assets",
                  path: "/dashboard/company-user-admin/manage-assets",
                  icon: <Archive />,
                },
          {
            title: "Company Groups",
            path: "/dashboard/company-user-admin/manage-depreciation-groups",
            icon: <Folder />,
          },
          {
            title: "Manage Groups",
            path: "/dashboard/company-user-admin/add-depreciation-group",
            icon: <FolderPlus />,
          },
          
          
          // {
          //   title: "Manage Asset Groups",
          //   path: "/dashboard/company-user-admin/manage-asset-groups",
          //   icon: <Layers />,
          // },
        ],
      },
      {
        heading: "Customers",
        links: [
          {
            title: "Customers",
            path: "/dashboard/customers/show",
            icon: <Users />,
          },
          {
            title: "Add Customer",
            path: "/dashboard/customers/create",
            icon: <UserPlus />,
          },
        ],
      },
      
     
 
      {
        heading: "Orders",
        links: [
          {
            title: "Orders",
            path: "/dashboard/orders/show",
            icon: <ShoppingBasket />,
          },
          {
            title: "Create Order",
            path: "/dashboard/orders/create",
            icon: <ShoppingCartIcon />,
          },
        ],
      },
      {
          heading: "Reports",
          links: [
            {
              title: "Reports",
              path: "/dashboard/company-user-admin/manage-depreciation-history",
              icon: <Briefcase />,
            },
            {
              title: "Run Depreciation",
              path: "#",
              icon: <PowerCircle />,
            }
          ]
        }
            
      // {
      //   heading: "Users",
      //   links: [
      //     {
      //       title: "Add New Profile",
      //       path: "/dashboard/company-user-admin/add-user",
      //       icon: <UserPlus />,
      //     },
      //     {
      //       title: "Manage Users",
      //       path: "/dashboard/company-user-admin/manage-users",
      //       icon: <Users />,
      //     },
      //   ],
      // },
      // {
      //   heading: "Company",
      //   links: [
      //     {
      //       title: "Add Company",
      //       path: "/dashboard/greycloud-admin/add-company",
      //       icon: <PlusCircle />,
      //     },
      //     {
      //       title: "Manage Companies",
      //       path: "/dashboard/greycloud-admin/manage-companies",
      //       icon: <Layers />,
      //     },
          
      //   ],
      // }
    ],
    Company_User: [
      {
        heading: "Depreciation Groups",
        links: [
          {
            title: "Add Group",
            path: "/dashboard/company-user/add-depreciation-group",
            icon: <FolderPlus />,
          },
          {
            title: "Manage Groups",
            path: "/dashboard/company-user/manage-depreciation-groups",
            icon: <Folder />,
          },
          {
            title: "View History",
            path: "/dashboard/company-user/manage-depreciation-history",
            icon: <Briefcase />,
          },
          // {
          //   title: "Add Asset Category",
          //   path: "/dashboard/company-user/add-asset-category",
          //   icon: <FolderPlus />,
          // },
          // {
          //   title: "Manage Asset Groups",
          //   path: "/dashboard/company-user/manage-asset-groups",
          //   icon: <Layers />,
          // },
        ],
      },

      {
        heading: "Assets",
        links: [
          {
            title: "Add Asset",
            path: "/dashboard/company-user/add-asset",
            icon: <PlusCircle />,
          },
          {
            title: "Manage Assets",
            path: "/dashboard/company-user/manage-assets",
            icon: <Archive />,
          },

          // {
          //   title: "Add Asset Location",
          //   path: "/dashboard/company-user/add-asset-location",
          //   icon: <MapPin />,
          // },
          // {
          //   title: "Add Asset Note",
          //   path: "/dashboard/company-user/add-asset-note",
          //   icon: <Notebook />,
          // },
        ],
      },
      {
        heading: "Customers",
        links: [
          {
            title: "Customers",
            path: "/dashboard/customers/show",
            icon: <Users />,
          },
          {
            title: "Add Customer",
            path: "/dashboard/customers/create",
            icon: <UserPlus />,
          },
        ],
      },
      {
        heading: "Orders",
        links: [
          {
            title: "Orders",
            path: "/dashboard/orders/show",
            icon: <ShoppingBasket />,
          },
          {
            title: "Create Order",
            path: "/dashboard/orders/create",
            icon: <ShoppingCartIcon />,
          },
        ],
      },

      // {
      //   heading: "Company",
      //   links: [
      //     {
      //       title: "Settings",
      //       path: "/dashboard/company/settings",
      //       icon: <Settings2 />,
      //     },
      //   ],
      // },
    ],
  };

  const pathname = "";

  const isActive = (path: string) => pathname === path;
  const roleMenu = menuItems[session.role ?? "Company_User"] ?? [];

  console.log("TEESESSE", roleMenu);
  const AnchorWithRef = forwardRef<HTMLAnchorElement, { name: string }>(
    function AnchorWithRef({ name }, forwardedRef) {
      return <a ref={forwardedRef}>{name}</a>;
    }
  );
  
  return (
    <Card className="min-w-full flex flex-row bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent justify-between items-center p-4">
      <CardHeader className="flex flex-col items-center justify-center p-0">
        <Button variant={"ghost"} size="icon">
          <Menu className="size-6" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-row gap-2 items-center">
          {/* <h1 className="text-lg dark:text-primary/90 text-primary/100 tracking-widest uppercase font-bold text-center">{companyName}</h1>
          <h1 className="text-lg dark:text-primary/70 text-primary/80 tracking-widest uppercase font-normal text-center">{adminNavBarText}</h1> */}

          {roleMenu.map((section, index) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 p-5">
                  {section.heading}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {section.links.map((link: any) => (
                  <>
                    
                    <DropdownMenuItem>
                    {/* <Link
                      style={{cursor: "pointer"}}
                      href={link.path}
                      className={isActive(link.path) ? "font-bold" : ""}
                    >
                     <DropdownMenuLabel> {link.title}    </DropdownMenuLabel>
                    </Link> */}
                      <Link href={link.path} legacyBehavior>
                      {link.title}  
                      </Link>
                    </DropdownMenuItem>
                  </>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

        </div>
      </CardContent>

      <CardFooter className="flex flex-row gap-2 p-0">
        <Button variant={"ghost"} size="icon">
          <Search className="size-6" />
        </Button>

        <ModeToggle />
      </CardFooter>
    </Card>
  );
}
