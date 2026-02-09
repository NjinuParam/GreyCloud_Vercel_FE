import { SageOneAssetTypeType } from '../../../../../../lib/schemas/company';

export type AssetCategorySummary = {
  groupKey: string;
  count: number;
  totalPurchasePrice: number;
  totalCurrentValue: number;
  avgCurrentValue: number;
  totalResidual: number;
  sampleCodes: string[];
};

export function groupAssetsByCategory(assets: SageOneAssetTypeType[]): AssetCategorySummary[] {
  const map = new Map<string, AssetCategorySummary>();

  for (const a of assets) {
    const cat = (a?.category?.description) ? a.category.description : 'Uncategorized';
    const key = cat || 'Uncategorized';

    const purchase = Number(a.purchasePrice ?? 0);
    const current = Number(a.currentValue ?? 0);
    const residual = Number(a.residual ?? 0);

    if (!map.has(key)) {
      map.set(key, {
        groupKey: key,
        count: 0,
        totalPurchasePrice: 0,
        totalCurrentValue: 0,
        avgCurrentValue: 0,
        totalResidual: 0,
        sampleCodes: [],
      });
    }

    const entry = map.get(key)!;
    entry.count += 1;
    entry.totalPurchasePrice += purchase;
    entry.totalCurrentValue += current;
    entry.totalResidual += residual;
    if (entry.sampleCodes.length < 3 && a.code) entry.sampleCodes.push(String(a.code));
  }

  const out: AssetCategorySummary[] = [];
  map.forEach((v) => {
    v.avgCurrentValue = v.count > 0 ? v.totalCurrentValue / v.count : 0;
    out.push(v);
  });

  // Sort by count desc
  out.sort((a, b) => b.count - a.count);
  return out;
}

export default groupAssetsByCategory;
