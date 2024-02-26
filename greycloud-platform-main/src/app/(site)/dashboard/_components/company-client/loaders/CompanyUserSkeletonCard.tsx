"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompanyUserSkeletonCard() {
  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="pb-0">
        <CardTitle>
          <Skeleton className="h-8 w-full rounded-lg" />
        </CardTitle>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="flex flex-col gap-6 py-2">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-2 w-16 rounded-lg" />
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-2 w-16 rounded-lg" />
        </span>

        <span className="flex flex-col gap-1 text-muted-foreground">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-2 w-16 rounded-lg" />
        </span>
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="pb-4 flex gap-2">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}
