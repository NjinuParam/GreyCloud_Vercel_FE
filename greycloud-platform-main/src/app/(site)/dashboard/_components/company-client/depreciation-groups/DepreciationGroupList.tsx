import React from "react";

import { getAllCompanyDepreciationGroups } from "@/app/actions/sage-one-company-depreciation-actions/sage-one-company-depreciation-actions";
import { DepreciationGroupCard } from "./DepreciationGroupCard";

export const DepreciationGroupList = async () => {
  const { data: depreciationGroup } = await getAllCompanyDepreciationGroups({});
debugger;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full h-full overflow-y-scroll">
      {depreciationGroup?.map((depreciation) => (
        <DepreciationGroupCard key={depreciation.depGroupId} depreciationGroup={depreciation} />
      ))}
    </div>
  );
};
