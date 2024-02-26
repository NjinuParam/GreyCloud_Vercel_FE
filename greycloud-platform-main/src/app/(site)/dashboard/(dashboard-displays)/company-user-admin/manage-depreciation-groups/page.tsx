import { DepreciationGroupList } from "../../../_components/company-client/depreciation-groups/DepreciationGroupList";

export default async function ManageDepreciationGroups() {
  return (
    <div className="overflow-y-scroll rounded-md bg-slate-50 dark:bg-slate-900/40 p-4">
      <DepreciationGroupList />
    </div>
  );
}
