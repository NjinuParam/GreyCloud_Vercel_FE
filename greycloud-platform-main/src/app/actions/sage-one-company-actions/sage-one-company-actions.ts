"use server";

import "server-only";

import { SAGE_ONE_COMPANY } from "@/lib/api-endpoints/sage-one-company";
import { ActionError, action, authAction } from "@/lib/safe-action";
import { IdSchemaNumber } from "@/lib/schemas/common-schemas";
import { SageCompanyAccountResponseType, SageOneCompanySchemaWithStatus } from "@/lib/schemas/company";
import { serverFetch } from "../apiHandler";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getSageOneCompanyDetails = action(IdSchemaNumber, async ({ id }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_COMPANY.GET.COMPANY_GET}/${id}`;

  try {
  const response = await serverFetch(endpoint);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assets: SageCompanyAccountResponseType = data;

    return assets;
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    throw error;
  }
});

export const getSageOneCompanyDetailsWithStatus = action(SageOneCompanySchemaWithStatus, async ({ includeStatus }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_COMPANY.GET.COMPANY_GET_STATUS}/${includeStatus}`;

  try {
  const response = await serverFetch(endpoint);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const assets = data.results;
    // const assets: SageCompanyAccountResponseType = data.results;

    return assets;
  } catch (error) {
    console.error("Failed to fetch assets:", error);
    throw error;
  }
});
