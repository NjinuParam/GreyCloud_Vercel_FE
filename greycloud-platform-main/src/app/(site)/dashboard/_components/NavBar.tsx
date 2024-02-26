import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/app/components/ModeToggle";
import { formatRoleDisplayName } from "@/lib/utils";
import { getIronSessionData } from "@/lib/auth/auth";

export default async function NavBar() {
  const session = await getIronSessionData();

  if (!session.isLoggedIn) {
    return null;
  }

  const adminNavBarText = formatRoleDisplayName(session?.role ?? "") + " Dashboard";

  return (
    <Card className="min-w-full flex flex-row bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent justify-between items-center p-4">
      <CardHeader className="flex flex-col items-center justify-center p-0">
        <Button variant={"ghost"} size="icon">
          <Menu className="size-6" />
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <h1 className="text-lg dark:text-primary/70 text-primary/80 tracking-widest uppercase font-bold text-center">{adminNavBarText}</h1>
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
