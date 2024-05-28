const BASE = "SageOneAsset";

export const SAGE_ONE_ASSET = {
  GET: {
    ASSET_GET: `${BASE}/Asset/GetNew`,
    ASSET_CATEGORY_GET: `${BASE}/AssetCategory/Get`,
    ASSET_LOCATION_GET: `${BASE}/AssetLocation/Get`,
    ASSET_NOTE_GET: `${BASE}/AssetNote/Get`,
  },
  POST: {
    ASSET_SAVE: `${BASE}/Asset/Save`,
    ASSET_CATEGORY_SAVE: `${BASE}/AssetCategory/Save`,
    ASSET_CATEGORY_GET: `${BASE}/AssetCategory/Get`,
    ASSET_LOCATION_SAVE: `${BASE}/AssetLocation/Save`,
    ASSET_NOTE_SAVE: `${BASE}/AssetNote/Save`,
  },
  PUT: {},
  DELETE: {
    ASSET_DELETE: `${BASE}/Asset/Delete`,
    ASSET_CATEGORY_DELETE: `${BASE}/AssetCategory/Delete`,
    ASSET_LOCATION_DELETE: `${BASE}/AssetLocation/Delete`,
    ASSET_NOTE_DELETE: `${BASE}/AssetNote/Delete`,
  },
};
