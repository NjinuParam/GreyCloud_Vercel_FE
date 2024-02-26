import CreateSageCompanyForm from "../../../_components/grey-cloud-admin/CreateSageCompanyForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddCompany() {
  return (
    <Card className="flex flex-col w-[600px] mx-auto justify-between mt-8">
      <CardHeader className="flex flex-col bg-gradient-to-b from-primary/5 dark:from-primary/10 to-transparent w-full px-8 py-5">
        <CardTitle>
          <h2 className="text-xl text-foreground/80">Add A Company</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <CreateSageCompanyForm />
      </CardContent>
    </Card>
  );
}
