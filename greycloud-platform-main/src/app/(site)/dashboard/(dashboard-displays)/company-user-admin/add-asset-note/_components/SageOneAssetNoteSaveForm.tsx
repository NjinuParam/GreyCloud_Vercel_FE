"use client";

import React from "react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAction } from "next-safe-action/hooks";
import { saveSageOneAssetNote } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { SaveSageOneAssetNoteSchema, SaveSageOneAssetNoteType } from "@/lib/schemas/company";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import ButtonSubmitForm from "@/app/(auth)/login/_components/ButtonSubmitForm";

type SageOneAssetNoteSaveFormProps = {
  sageCompanyId: number;
  assetId: number;
};

export default function SageOneAssetNoteSaveForm({ sageCompanyId, assetId }: SageOneAssetNoteSaveFormProps) {
  // Define the form:
  const form = useForm<SaveSageOneAssetNoteType>({
    resolver: zodResolver(SaveSageOneAssetNoteSchema),
    defaultValues: {
      SageCompanyId: sageCompanyId,
      assetNote: {
        id: 0,
        assetId: assetId,
        actionDate: new Date(),
        entryDate: new Date(),
        hasAttachments: false,
        status: true,
        note: "",
        subject: "",
      },
    },
  });

  const { execute, status } = useAction(saveSageOneAssetNote, {
    onSuccess(data) {
      toast.success("Asset Note added.", {
        description: `The asset note was added to the note.`,
      });
    },

    onError(error) {
      toast.error("An error has occured:", {
        description: JSON.stringify(error),
      });
    },

    onExecute(input) {
      toast.info("Saving Asset Note...");
    },
  });

  // Define a submit handler:
  function onSubmit(values: SaveSageOneAssetNoteType) {
    execute(values);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-row gap-2 items-center min-w-full">
            <FormField
              control={form.control}
              name="assetNote.assetId"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input className="w-full" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assetNote.subject"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input className="w-full" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assetNote.note"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input className="w-full" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full pt-2">
            <ButtonSubmitForm status={status} idleString="Save Asset Note" executingString="Saving Asset Note..." />
          </div>
        </form>
      </Form>
    </>
  );
}
