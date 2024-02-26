"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeletonList() {
  const data = Array.from({ length: 9 }, (_, index) => ({ id: index }));

  return (
    <>
      <Skeleton className="h-6 w-56 rounded-md mt-4 mb-2" />
      <div className="flex flex-col gap-4 w-full h-full">
        {data.map((user) => (
          <Skeleton className="h-8 w-full rounded-md" key={""} />
        ))}
      </div>
    </>
  );
}
