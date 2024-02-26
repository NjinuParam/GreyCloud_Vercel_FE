import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CreateSageCompanyForm from "../(site)/dashboard/_components/grey-cloud-admin/CreateSageCompanyForm";

export function SheetCreateCompany() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Register Company</SheetTitle>
          <SheetDescription>`${"Create a Sage Company."}`</SheetDescription>
        </SheetHeader>

        <CreateSageCompanyForm />

        {/* <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter> */}
      </SheetContent>
    </Sheet>
  );
}
