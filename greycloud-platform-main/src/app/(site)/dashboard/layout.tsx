import { Card, CardContent } from "@/components/ui/card";
import NavBar from "./_components/NavBar";
import SideBar from "./_components/sidebar/Sidebar";

const SiteLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex w-screen min-h-screen max-h-screen bg-slate-200/40 dark:bg-slate-900/30 p-2 gap-2 overflow-auto">
      {/* Sidebar */}
      <div className="min-h-full">{<SideBar />}</div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Navbar */}
        <NavBar />

        {/* Main content */}
        <Card className="flex-1 overflow-auto p-2">
          <CardContent className="min-w-full p-0 ">
            <main className="overflow-hidden">{children}</main>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SiteLayout;
