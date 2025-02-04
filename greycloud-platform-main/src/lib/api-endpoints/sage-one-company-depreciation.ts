const BASE = "Depreciation";

export const SAGE_ONE_DEPRECIATION = {
  GET: {
    ASSET_GROUP_ALL_GET: `${BASE}/Get-AssetGroup-All`,
    ASSET_GROUP_GET_BY_ID: `${BASE}/Get-AssetGroup`,
    GET_COMPANY_DEPRECIATION_GROUP_ALL: `${BASE}/Get-Company-Depreciation-Group-All`,    
    GET_COMPANY_DEPRECIATION_GROUP_BY_COMPANYID: `${BASE}/Get-Company-Depreciation-Group-ByCompanyId`,
    GET_COMPANY_DEPRECIATION_GROUP_BY_ID: `${BASE}/Get-Company-Depreciation-Group`,
    GET_ASSET_DEPRECIATION_HISTORY_ALL: `${BASE}/Get-Asset-Depreciation-History-All`,
    GET_ASSET_DEPRECIATION_HISTORY_BY_ID: `${BASE}/Get-Asset-Depreciation-History`,
    GET_ASSET_DEPRECIATION_FUTURE_BY_ID: `${BASE}/CalculateDepreciation`,
  },
  PATCH: {
    ASSET_GROUP_UPDATE: `${BASE}/Update-AssetGroup`,
  },
  POST: {
    ASSET_GROUP_ADD: `${BASE}/Add-AssetGroup`,
    ADD_COMPANY_DEPRECIATION_GROUP: `${BASE}/Add-Company-Depreciation-Group`,
    ADD_ASSET_DEPRECIATION_HISTORY: `${BASE}/Add-Asset-Depreciation-History`,
  },
  PUT: {},
  DELETE: {
    DELETE_COMPANY_DEPRECIATION_GROUP: `${BASE}/Delete-Company-Depreciation-Group`,
  },
};
