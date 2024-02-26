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
  Notebook, // For adding notes
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { SidebarSection } from "./SidebarSection";
import { PlatformUserType } from "@/lib/schemas/common-schemas";

const menuItems = {
  GreyCloud_Admin: [
    {
      heading: "Company",
      links: [
        { title: "Add Company", path: "/dashboard/greycloud-admin/add-company", icon: <PlusCircle /> },
        { title: "Manage Companies", path: "/dashboard/greycloud-admin/manage-companies", icon: <Layers /> },
      ],
    },
    {
      heading: "Admins",
      links: [
        { title: "Add Admin", path: "/dashboard/greycloud-admin/add-admin", icon: <UserPlus /> },
        { title: "Manage Admins", path: "/dashboard/greycloud-admin/manage-admins", icon: <Users /> },
      ],
    },
  ],
  Company_Admin: [
    {
      heading: "Assets",
      links: [
        { title: "Add Asset", path: "/dashboard/company-user-admin/add-asset", icon: <PlusCircle /> },
        { title: "Manage Assets", path: "/dashboard/company-user-admin/manage-assets", icon: <Archive /> },
        { title: "Add Asset Category", path: "/dashboard/company-user-admin/add-asset-category", icon: <FolderPlus /> },
        { title: "Add Asset Location", path: "/dashboard/company-user-admin/add-asset-location", icon: <MapPin /> },
        { title: "Add Asset Note", path: "/dashboard/company-user-admin/add-asset-note", icon: <Notebook /> },
      ],
    },
    {
      heading: "Depreciation Groups",
      links: [
        { title: "Add Group", path: "/dashboard/company-user-admin/add-depreciation-group", icon: <FolderPlus /> },
        { title: "Manage Groups", path: "/dashboard/company-user-admin/manage-depreciation-groups", icon: <Folder /> },
        { title: "Manage Asset Groups", path: "/dashboard/company-user-admin/manage-asset-groups", icon: <Layers /> },
      ],
    },
    {
      heading: "Depreciation History",
      links: [
        { title: "Add History", path: "/dashboard/company-user-admin/add-depreciation-history", icon: <FolderPlus /> },
        { title: "View History", path: "/dashboard/company-user-admin/manage-depreciation-history", icon: <Briefcase /> },
      ],
    },
    {
      heading: "Users",
      links: [
        { title: "Add User", path: "/dashboard/company-user-admin/add-user", icon: <UserPlus /> },
        { title: "Manage Users", path: "/dashboard/company-user-admin/manage-users", icon: <Users /> },
      ],
    },
  ],
  Company_User: [
    {
      heading: "Assets",
      links: [
        { title: "Add Asset", path: "/dashboard/company-user/add-asset", icon: <PlusCircle /> },
        { title: "Manage Assets", path: "/dashboard/company-user/manage-assets", icon: <Archive /> },
        { title: "Add Asset Category", path: "/dashboard/company-user/add-asset-category", icon: <FolderPlus /> },
        { title: "Add Asset Location", path: "/dashboard/company-user/add-asset-location", icon: <MapPin /> },
        { title: "Add Asset Note", path: "/dashboard/company-user/add-asset-note", icon: <Notebook /> },
      ],
    },
    {
      heading: "Depreciation Groups",
      links: [
        { title: "Add Group", path: "/dashboard/company-user/add-depreciation-group", icon: <FolderPlus /> },
        { title: "Manage Groups", path: "/dashboard/company-user/manage-depreciation-groups", icon: <Folder /> },
        { title: "Manage Asset Groups", path: "/dashboard/company-user/manage-asset-groups", icon: <Layers /> },
      ],
    },
    {
      heading: "Depreciation History",
      links: [
        { title: "Add History", path: "/dashboard/company-user/add-depreciation-history", icon: <FolderPlus /> },
        { title: "View History", path: "/dashboard/company-user/manage-depreciation-history", icon: <Briefcase /> },
      ],
    },
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
          {index < roleMenu.length - 1 && <Separator className="w-full mt-4 mb-6 opacity-60" />}
        </Fragment>
      ))}
    </div>
  );
};
