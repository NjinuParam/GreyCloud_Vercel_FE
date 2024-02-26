"use server";

import "server-only";

import { SAGE_ONE_DEPRECIATION } from "@/lib/api-endpoints/sage-one-company-depreciation";
import { ActionError, action } from "@/lib/safe-action";
import { EmptySchema } from "@/lib/schemas/common-schemas";

import { revalidateTag } from "next/cache";
import {
  AddAssetDepreciationHistorySchema,
  AddAssetGroupSchema,
  AddCompanyDepreciationGroupSchema,
  AssetDepreciationHistoryResponseType,
  DeleteCompanyDepreciationGroupSchema,
  GetAllAssetDepreciationHistorySchema,
  GetAssetGroupResponseType,
  GetCompanyDepreciationGroupResponseType,
  GetSpecificAssetDepreciationHistorySchema,
  GetSpecificAssetGroupSchema,
  GetSpecificCompanyDepreciationGroupSchema,
  UpdateAssetGroupSchema,
} from "@/lib/schemas/depreciation";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAllAssetGroups = action(EmptySchema, async () => {
  const endpoint = `${apiUrl}${SAGE_ONE_DEPRECIATION.GET.ASSET_GROUP_ALL_GET}`;

  try {
    const response = await fetch(endpoint, { next: { tags: ["asset-group"] } });
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const proccessedData: GetAssetGroupResponseType[] = data;

    return proccessedData;
  } catch (error) {
    console.error("Failed to asset group: ", error);
    throw error;
  }
});

export const getAssetGroupById = action(GetSpecificAssetGroupSchema, async ({ Id }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_DEPRECIATION.GET.ASSET_GROUP_GET_BY_ID}/${Id}`;

  try {
    const response = await fetch(endpoint, { next: { tags: ["asset-group"] } });
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const proccessedData: GetAssetGroupResponseType = data;

    return proccessedData;
  } catch (error) {
    console.error("Failed to asset group: ", error);
    throw error;
  }
});

export const updateAssetGroup = action(UpdateAssetGroupSchema, async (body) => {
  const endpoint = `${apiUrl}${SAGE_ONE_DEPRECIATION.PATCH.ASSET_GROUP_UPDATE}`;

  try {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    revalidateTag("asset-group");

    return data;
  } catch (error) {
    console.error("Failed to update asset group: ", error);
    throw error;
  }
});

export const addAssetGroup = action(AddAssetGroupSchema, async (body) => {
  const endpoint = `${apiUrl}${SAGE_ONE_DEPRECIATION.POST.ASSET_GROUP_ADD}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    revalidateTag("asset-group");

    return data;
  } catch (error) {
    console.error("Failed to add asset group: ", error);
    throw error;
  }
});

// company depreciation group

export const getAllCompanyDepreciationGroups = action(EmptySchema, async () => {
  const endpoint = `${apiUrl}${SAGE_ONE_DEPRECIATION.GET.GET_COMPANY_DEPRECIATION_GROUP_ALL}`;

  try {
    const response = await fetch(endpoint, { next: { tags: ["depreciation-group"] } });
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const proccessedData: GetCompanyDepreciationGroupResponseType[] = data;

    return proccessedData;
  } catch (error) {
    console.error("Failed to depreciation group: ", error);
    throw error;
  }
});

export const getSpecificCompanyDepreciationGroup = action(GetSpecificCompanyDepreciationGroupSchema, async ({ id }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_DEPRECIATION.GET.GET_COMPANY_DEPRECIATION_GROUP_BY_ID}/${id}`;

  try {
    const response = await fetch(endpoint, { next: { tags: ["depreciation-group"] } });
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const proccessedData: GetCompanyDepreciationGroupResponseType = data;

    return proccessedData;
  } catch (error) {
    console.error("Failed to depreciation group: ", error);
    throw error;
  }
});

export const addCompanyDepreciationGroup = action(AddCompanyDepreciationGroupSchema, async (body) => {
  const endpoint = `${apiUrl}${SAGE_ONE_DEPRECIATION.POST.ADD_COMPANY_DEPRECIATION_GROUP}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    revalidateTag("depreciation-group");

    return data;
  } catch (error) {
    console.error("Failed to add depreciation group: ", error);
    throw error;
  }
});

export const deleteCompanyDepreciationGroup = action(DeleteCompanyDepreciationGroupSchema, async (body) => {
  const endpoint = `${apiUrl}${SAGE_ONE_DEPRECIATION.DELETE.DELETE_COMPANY_DEPRECIATION_GROUP}`;

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    revalidateTag("depreciation-group");

    return data;
  } catch (error) {
    console.error("Failed to delete depreciation group: ", error);
    throw error;
  }
});

// depreciation history

export const addAssetDepreciationHistory = action(AddAssetDepreciationHistorySchema, async (body) => {
  const endpoint = `${apiUrl}${SAGE_ONE_DEPRECIATION.POST.ADD_ASSET_DEPRECIATION_HISTORY}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data: AssetDepreciationHistoryResponseType[] = await response.json();

    revalidateTag("asset-depreciation-history");

    return data;
  } catch (error) {
    console.error("Failed to add asset depreciation history: ", error);
    throw error;
  }
});

export const getSpecificAssetDepreciationHistory = action(GetSpecificAssetDepreciationHistorySchema, async ({ assetid }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_DEPRECIATION.GET.GET_ASSET_DEPRECIATION_HISTORY_BY_ID}/${assetid}`;

  try {
    const response = await fetch(endpoint, { next: { tags: ["asset-depreciation-history"] } });
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data: AssetDepreciationHistoryResponseType[] = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to asset depreciation history: ", error);
    throw error;
  }
});

export const getAllAssetDepreciationHistory = action(GetAllAssetDepreciationHistorySchema, async ({ sageCompanyId }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_DEPRECIATION.GET.GET_ASSET_DEPRECIATION_HISTORY_ALL}/${sageCompanyId}`;

  try {
    const response = await fetch(endpoint, { next: { tags: ["asset-depreciation-history"] } });
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data: AssetDepreciationHistoryResponseType[] = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to asset depreciation history: ", error);
    throw error;
  }
});
