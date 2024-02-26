import Logo from "@/app/components/logo/Logo";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBasedSidebar } from "./RoleBasedSidebar";
import { SidebarProfile } from "./SidebarProfile";
import { getIronSessionData } from "@/lib/auth/auth";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function SideBar() {
  const session = await getIronSessionData();

  if (!session.isLoggedIn) {
    return null;
  }

  return (
    <Card className="min-h-full flex flex-col w-80 justify-between">
      <CardHeader className="flex flex-col bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 py-5">
        <CardTitle className="flex justify-between items-center">
          <h2 className="text-2xl text-foreground/80">Grey Cloud</h2>
          <Logo className="size-6" />
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <RoleBasedSidebar {...session} />
      </CardContent>

      <CardFooter className="flex flex-col gap-6 px-8 py-6">
        <SidebarProfile {...session} />
      </CardFooter>
    </Card>
  );
}
