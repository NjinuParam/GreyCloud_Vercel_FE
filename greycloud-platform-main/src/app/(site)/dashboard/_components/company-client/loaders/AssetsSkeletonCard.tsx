import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-select";

export default function AssetsSkeletonCard() {
  return (
    <Card className="flex flex-col gap-2">
      <CardHeader className="pb-0">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-2 w-full rounded-lg" />
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="flex flex-col gap-4 py-2">
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
        </span>
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
        </span>
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
        </span>
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
        </span>
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
        </span>
        <span className="flex flex-col gap-1 text-muted-foreground">
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
        </span>
      </CardContent>

      <Separator className="my-2" />

      <CardFooter className="pb-4 flex gap-2">
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}
