"use client";

import AssetsSkeletonCard from "./AssetsSkeletonCard";

export default function GridSkeletonList() {
  const users = Array.from({ length: 9 }, (_, index) => ({ id: index }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full h-full overflow-y-scroll">
      {users.map((user) => (
        <AssetsSkeletonCard key={user.id} />
      ))}
    </div>
  );
}
