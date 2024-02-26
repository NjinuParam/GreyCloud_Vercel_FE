import ProfileDropdown from "./ProfileDropdown";
import { PlatformUserType } from "@/lib/schemas/common-schemas";

export const SidebarProfile = (session: PlatformUserType) => {
  return (
    <div className="flex items-center gap-6 w-full">
      <ProfileDropdown {...session} />
      <div className="flex gap-1 items-center">
        <p className="text-sm text-muted-foreground">Signed in as</p>
        <p className="text-sm text-primary">{session?.name}</p>
      </div>
    </div>
  );
};
