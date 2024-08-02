import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAction } from "next-safe-action/hooks";
import { buildFormData, cn } from "@/lib/utils";
import { AllCompanyUserResponseType, UpdateCompanyUserRequestModelSchema, UpdateCompanyUserType } from "@/lib/schemas/company-user";
import { RolesCompanyOptions } from "@/lib/schemas/common-schemas";
import { updateCompanyUser } from "@/app/actions/sage-one-user-company-actions/sage-one-user-company-actions";
import { useRouter } from "next/navigation";

export default function UpdateCompanyUserForm({ user, onClose }: { user: AllCompanyUserResponseType; onClose: () => void }) {
  const router = useRouter();

  // Define the form:
  const form = useForm<UpdateCompanyUserType>({
    resolver: zodResolver(UpdateCompanyUserRequestModelSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      // isPasswordUpdated: false,
      role: user.role??"Company_User",
    },
  });

  const { execute, status } = useAction(updateCompanyUser, {
    onSuccess(data, input, reset) {
      toast.success("Account updated successfully.", {
        description: "Your changes have been saved.",
      });

      router.refresh();
      onClose();
      reset();
    },

    onError(error) {
      onClose();
      toast.error("An error has occured while updating:", {
        description: JSON.stringify(error),
      });
    },

    onSettled(result, input, reset) {
      reset();
    },

    onExecute(input) {
      toast.info("Updating Account...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: UpdateCompanyUserType) {
    execute(buildFormData(values));
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-row space-x-6 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="w-full" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Surname</FormLabel>
                  <FormControl>
                    <Input className="w-full" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RolesCompanyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full pt-2">
            <Button
              className={cn("w-full font-bold", status === "executing" ? "animate-pulse" : null)}
              size={"lg"}
              type="submit"
              disabled={status === "executing"}
            >
              {status === "executing" ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
