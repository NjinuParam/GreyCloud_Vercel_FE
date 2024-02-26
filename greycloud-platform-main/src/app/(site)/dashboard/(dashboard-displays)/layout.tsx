import React from "react";
import ButtonBackToDashboard from "./_components/ButtonBackToDashboard";

const DashboardInsideLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col items-center justify-center min-w-full min-h-full p-2 gap-4">
      <ButtonBackToDashboard />
      <main className="overflow-y-scroll min-w-full min-h-full">{children}</main>
    </div>
  );
};

export default DashboardInsideLayout;
