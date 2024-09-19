"use client";

import { Separator } from "@/components/ui/separator";
import {
  PlusCircle, // For adding new items
  Layers, // For managing items
  UserPlus, // For adding users or admins
  Users, // For managing users or admins
  Briefcase, // For company related links
  Archive, // For asset management
  FolderPlus, // For adding categories or groups
  Folder, // For managing categories or groups
  MapPin, // For location related links
  Notebook,
  ShoppingBasket,
  ShoppingCart,
  ShoppingCartIcon,
  Settings2, // For adding notes
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { SidebarSection } from "./SidebarSection";
import { PlatformUserType } from "@/lib/schemas/common-schemas";

const menuItems = {
  GreyCloud_Admin: [

  ],
  Company_Admin: [
 
  ],
  Company_User: [
 
  ],
};

export const RoleBasedSidebar = ({ role }: PlatformUserType) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const roleMenu = menuItems[role ?? "Company_User"] ?? [];

  return (
    <div className="flex flex-col justify-between gap-0">
      {roleMenu.map((section, index) => (
        <Fragment key={section.heading}>
          <SidebarSection section={section} isActive={isActive} />
          {index < roleMenu.length - 1 && (
            <Separator className="w-full mt-4 mb-6 opacity-60" />
          )}
        </Fragment>
      ))}
    </div>
  );
};
