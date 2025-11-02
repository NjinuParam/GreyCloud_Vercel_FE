"use server";

import "server-only";

import { SAGE_ONE_ASSET } from "@/lib/api-endpoints/sage-one-asset";
import { ActionError, action, authAction } from "@/lib/safe-action";
import {
  CompanyIdAndIdSchema,
  SageOneAssetLocationSchema,
  SageOneAssetLocationType,
  SageOneAssetNoteType,
  SageOneAssetTypeType,
  SaveSageOneAssetCategorySchema,
  SaveSageOneAssetNoteSchema,
  SaveSageOneAssetSchema,
} from "@/lib/schemas/company";
import { revalidateTag } from "next/cache";
import { SageCompanyIdSchema } from "@/lib/schemas/common-schemas";
import { apiFetch } from "../apiHandler";
import { API_LOGGING } from "../../../lib/config";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const saveSageOneAsset = action(SaveSageOneAssetSchema, async ({ SageCompanyId, ...assets }) => {

  const endpoint = `http://localhost:5022/SageOneAsset/Asset/Save?Companyid=${SageCompanyId}&quantity=1`;

  try {
    if (API_LOGGING) console.log(`[action][POST] ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assets.asset),
    } as any);
    if (API_LOGGING) console.log(`[action][POST] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const asset = data;

    revalidateTag("sage-one-assets");

    return asset;
  } catch (error) {
    console.error("Failed to save", error);
    throw error;
  }
});

export const getSageOneCompanyAssets = action(SageCompanyIdSchema, async ({ SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.GET.ASSET_GET}?Companyid=${SageCompanyId}`;

  try {
  if (API_LOGGING) console.log(`[action][GET] ${endpoint}`);
  const response = await fetch(endpoint, { next: { tags: ["sage-one-assets"] } as any });
  if (API_LOGGING) console.log(`[action][GET] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assets: SageOneAssetTypeType[] = data.results;

    revalidateTag("sage-one-assets");

    return assets;
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    throw error;
  }
});

export const getSpecificSageOneCompanyAsset = action(CompanyIdAndIdSchema, async ({ id, SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.GET.ASSET_GET}?SageCompanyId=${SageCompanyId}&id=${id}`;

  try {
  if (API_LOGGING) console.log(`[action][GET] ${endpoint}`);
  const response = await fetch(endpoint);
  if (API_LOGGING) console.log(`[action][GET] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const asset: SageOneAssetTypeType = data;

 
    revalidateTag("sage-one-assets");

    return asset;
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    throw error;
  }
});

export const deleteSpecificSageOneCompanyAsset = action(CompanyIdAndIdSchema, async ({ id, SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.DELETE.ASSET_DELETE}/${id}?SageCompanyId=${SageCompanyId}`;

  try {
    if (API_LOGGING) console.log(`[action][DELETE] ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "DELETE",
    } as any);
    if (API_LOGGING) console.log(`[action][DELETE] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const asset = data;

    revalidateTag("sage-one-assets");

    return asset;
  } catch (error) {
    console.error("Failed to delete", error);
    throw error;
  }
});



export const getSageOneAssetCategory = action(SageCompanyIdSchema, async ({ SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.GET.ASSET_CATEGORY_GET}?SageCompanyId=${SageCompanyId}`;

  try {
    // const response = await fetch(endpoint, { next: { tags: ["sage-one-asset-categories"] } });
    // if (!response.ok) {
    //   throw new ActionError(`Error: ${response.status}`);
    // }

    // const data = await response.json();

    // const assetCategory = data.results;

        const data = await apiFetch(endpoint)as any;
debugger;
    const assetCategory = data.results;
    revalidateTag("sage-one-asset-categories");

    return assetCategory;
  } catch (error) {
    console.error("Failed to fetch asset category:", error);
    throw error;
  }
});

export const saveSageOneAssetCategory = action(SaveSageOneAssetCategorySchema, async ({ SageCompanyId, ...assetsCategory }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.POST.ASSET_CATEGORY_SAVE}?SageCompanyId=${SageCompanyId}`;

  try {
    if (API_LOGGING) console.log(`[action][POST] ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetsCategory.assetCategory),
    } as any);
    if (API_LOGGING) console.log(`[action][POST] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assetCategory = data;

    revalidateTag("sage-one-asset-categories");

    return assetCategory;
  } catch (error) {
    console.error("Failed to save", error);
    throw error;
  }
});

export const getSageOneSpecificAssetCategory = action(CompanyIdAndIdSchema, async ({ id, SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.POST.ASSET_CATEGORY_GET}/${id}?SageCompanyId=${SageCompanyId}`;

  try {
    if (API_LOGGING) console.log(`[action][POST] ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    } as any);
    if (API_LOGGING) console.log(`[action][POST] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assetCategory = data;

    revalidateTag("sage-one-asset-categories");

    return assetCategory;
  } catch (error) {
    console.error("Failed to fetch asset category:", error);
    throw error;
  }
});

export const deleteSageOneSpecificAssetCategory = action(CompanyIdAndIdSchema, async ({ id, SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.DELETE.ASSET_CATEGORY_DELETE}/${id}?SageCompanyId=${SageCompanyId}`;

  try {
    if (API_LOGGING) console.log(`[action][DELETE] ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "DELETE",
    } as any);
    if (API_LOGGING) console.log(`[action][DELETE] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assetCategory = data;

    revalidateTag("sage-one-asset-categories");

    return assetCategory;
  } catch (error) {
    console.error("Failed to delete", error);
    throw error;
  }
});

export const saveSageOneAssetLocation = action(SageOneAssetLocationSchema, async ({ SageCompanyId, ...assetsLocation }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.POST.ASSET_LOCATION_SAVE}?SageCompanyId=${SageCompanyId}`;

  try {
    if (API_LOGGING) console.log(`[action][POST] ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetsLocation),
    } as any);
    if (API_LOGGING) console.log(`[action][POST] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const transformedData = data;

    revalidateTag("sage-one-asset-locations");

    return transformedData;
  } catch (error) {
    console.error("Failed to save", error);
    throw error;
  }
});

export const getSageOneAssetLocation = action(SageCompanyIdSchema, async ({ SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.GET.ASSET_LOCATION_GET}?SageCompanyId=${SageCompanyId}`;

  try {
  if (API_LOGGING) console.log(`[action][GET] ${endpoint}`);
  const response = await fetch(endpoint, { next: { tags: ["sage-one-asset-locations"] } as any });
  if (API_LOGGING) console.log(`[action][GET] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assetLocation: SageOneAssetLocationType[] = data.results;

    return assetLocation;
  } catch (error) {
    console.error("Failed to fetch asset location:", error);
    throw error;
  }
});

export const getSpecificSageOneAssetLocation = action(CompanyIdAndIdSchema, async ({ id, SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.GET.ASSET_LOCATION_GET}/${id}?SageCompanyId=${SageCompanyId}`;

  try {
  if (API_LOGGING) console.log(`[action][GET] ${endpoint}`);
  const response = await fetch(endpoint);
  if (API_LOGGING) console.log(`[action][GET] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assetLocation: SageOneAssetLocationType = data;

    return assetLocation;
  } catch (error) {
    console.error("Failed to fetch asset location:", error);
    throw error;
  }
});

export const deleteSpecificSageOneAssetLocation = action(CompanyIdAndIdSchema, async ({ id, SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.DELETE.ASSET_LOCATION_DELETE}/${id}?SageCompanyId=${SageCompanyId}`;

  try {
    if (API_LOGGING) console.log(`[action][DELETE] ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "DELETE",
    } as any);
    if (API_LOGGING) console.log(`[action][DELETE] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assetLocation = data;

    revalidateTag("sage-one-asset-locations");

    return assetLocation;
  } catch (error) {
    console.error("Failed to delete", error);
    throw error;
  }
});

export const saveSageOneAssetNote = action(SaveSageOneAssetNoteSchema, async ({ SageCompanyId, ...assetsNote }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.POST.ASSET_NOTE_SAVE}?SageCompanyId=${SageCompanyId}`;

  try {
    if (API_LOGGING) console.log(`[action][POST] ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assetsNote.assetNote),
    } as any);
    if (API_LOGGING) console.log(`[action][POST] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assetNote = data;

    revalidateTag("sage-one-asset-notes");

    return assetNote;
  } catch (error) {
    console.error("Failed to save", error);
    throw error;
  }
});

export const getSageOneAssetNotes = action(SageCompanyIdSchema, async ({ SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.GET.ASSET_NOTE_GET}?SageCompanyId=${SageCompanyId}`;

  try {
  if (API_LOGGING) console.log(`[action][GET] ${endpoint}`);
  const response = await fetch(endpoint, { next: { tags: ["sage-one-asset-notes"] } as any });
  if (API_LOGGING) console.log(`[action][GET] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assetNotes: SageOneAssetNoteType[] = data.results;

    return assetNotes;
  } catch (error) {
    console.error("Failed to fetch asset notes:", error);
    throw error;
  }
});

export const getSpecificSageOneAssetNote = action(CompanyIdAndIdSchema, async ({ id, SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.GET.ASSET_NOTE_GET}/${id}?SageCompanyId=${SageCompanyId}`;

  try {
  if (API_LOGGING) console.log(`[action][GET] ${endpoint}`);
  const response = await fetch(endpoint);
  if (API_LOGGING) console.log(`[action][GET] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }
    const data = await response.json();

    const assetNote: SageOneAssetNoteType = data;

    return assetNote;
  } catch (error) {
    console.error("Failed to fetch asset note:", error);
    throw error;
  }
});

export const deleteSpecificSageOneAssetNote = action(CompanyIdAndIdSchema, async ({ id, SageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ASSET.DELETE.ASSET_NOTE_DELETE}/${id}?SageCompanyId=${SageCompanyId}`;

  try {
    if (API_LOGGING) console.log(`[action][DELETE] ${endpoint}`);
    const response = await fetch(endpoint, {
      method: "DELETE",
    } as any);
    if (API_LOGGING) console.log(`[action][DELETE] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assetNote = data;

    revalidateTag("sage-one-asset-notes");

    return assetNote;
  } catch (error) {
    console.error("Failed to delete", error);
    throw error;
  }
});
