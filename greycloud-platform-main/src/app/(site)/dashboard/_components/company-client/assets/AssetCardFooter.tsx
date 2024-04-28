"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { deleteSpecificSageOneCompanyAsset } from "@/app/actions/sage-one-assets-actions/sage-one-assets-actions";
import { getGreyCloudCompany } from "@/app/actions/greycloud-admin-actions/greycloud-admin-actions";
import AssetCardDrawer from "./AssetCardDrawer";
import { UpdateSageOneAssetFormProps } from "../../../(dashboard-displays)/company-user-admin/add-asset/_components/UpdateSageOneAssetForm";
import AssetDepreciationDialog from "./AssetDepreciationDrawer";

export const AssetCardFooter = ({
  user,
  asset,
  depreciationGroups,
  sageCompanyId,
}: UpdateSageOneAssetFormProps) => {
  const { execute: executeDeleteAsset, status: statusDeleteAsset } = useAction(
    deleteSpecificSageOneCompanyAsset,
    {
      onSuccess() {
        toast.success("Asset successfully deleted.", {
          description: `The selected asset was removed.`,
        });
      },

      onError(error) {
        toast.error("An error has occured deleting:", {
          description: JSON.stringify(error),
        });
      },

      onExecute(input) {
        toast.info("Deleting Asset...");
      },
    }
  );

  const {
    execute: executeFetchCompanyForUser,
    status: statusFetchCompanyForUser,
  } = useAction(getGreyCloudCompany, {
    onSuccess(data) {
      executeDeleteAsset({
        SageCompanyId: Number(data.sageCompanyId),
        id: Number(asset.id),
      });
    },
    onError(error) {
      toast.error("An error has occured fetching:", {
        description: JSON.stringify(error),
      });
    },
  });

  return (
    <div className="flex  flex-row gap-2 items-center w-full">
      <AssetDepreciationDialog
        asset={asset}
        depreciationGroups={depreciationGroups}
        sageCompanyId={sageCompanyId}
      />

      <AssetCardDrawer
        asset={asset}
        depreciationGroups={depreciationGroups}
        sageCompanyId={sageCompanyId}
      />

      <Dialog>
        <DialogTrigger asChild className="grow">
          <Button
            variant={"outline"}
            className={cn(
              "text-destructive w-48",
              statusFetchCompanyForUser === "executing" ||
                statusDeleteAsset === "executing"
                ? "animate-pulse"
                : null
            )}
            disabled={
              statusFetchCompanyForUser === "executing" ||
              statusDeleteAsset === "executing"
            }
          >
            {/* {statusFetchCompanyForUser === "executing" || statusDeleteAsset === "executing" ? "Deleting Asset..." : "Delete Asset"} */}
            <p>Suspend</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              <span className="text-muted-foreground">Delete</span>{" "}
              {asset.description}?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base">
            This action cannot be undone. This will permanently delete the
            asset.
          </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                className={cn(
                  "w-full font-bold",
                  statusFetchCompanyForUser === "executing" ||
                    statusDeleteAsset === "executing"
                    ? "animate-pulse"
                    : null
                )}
                size={"lg"}
                onClick={() => {
                  if (Boolean(user)) {
                    executeFetchCompanyForUser({
                      id: user?.companyId as string,
                    });
                  } else {
                    toast.error("An error has occured singing in:", {
                      description: "User not found.",
                    });
                  }
                }}
                disabled={
                  statusFetchCompanyForUser === "executing" ||
                  statusDeleteAsset === "executing"
                }
                variant={"destructive"}
              >
                {statusFetchCompanyForUser === "executing" ||
                statusDeleteAsset === "executing"
                  ? "Deleting Asset..."
                  : "Delete Asset"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild className="grow">
          <Button
            variant={"outline"}
            className={cn(
              "text-destructive w-48",
              statusFetchCompanyForUser === "executing" ||
                statusDeleteAsset === "executing"
                ? "animate-pulse"
                : null
            )}
            disabled={
              statusFetchCompanyForUser === "executing" ||
              statusDeleteAsset === "executing"
            }
          >
            {/* {statusFetchCompanyForUser === "executing" || statusDeleteAsset === "executing" ? "Deleting Asset..." : "Delete Asset"} */}
            <Trash className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              <span className="text-muted-foreground">Delete</span>{" "}
              {asset.description}?
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base">
            This action cannot be undone. This will permanently delete the
            asset.
          </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                className={cn(
                  "w-full font-bold",
                  statusFetchCompanyForUser === "executing" ||
                    statusDeleteAsset === "executing"
                    ? "animate-pulse"
                    : null
                )}
                size={"lg"}
                onClick={() => {
                  if (Boolean(user)) {
                    executeFetchCompanyForUser({
                      id: user?.companyId as string,
                    });
                  } else {
                    toast.error("An error has occured singing in:", {
                      description: "User not found.",
                    });
                  }
                }}
                disabled={
                  statusFetchCompanyForUser === "executing" ||
                  statusDeleteAsset === "executing"
                }
                variant={"destructive"}
              >
                {statusFetchCompanyForUser === "executing" ||
                statusDeleteAsset === "executing"
                  ? "Deleting Asset..."
                  : "Delete Asset"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
