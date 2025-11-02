"use server";

import "server-only";

import { SAGE_ONE_ACCOUNT } from "@/lib/api-endpoints/sage-one-account";
import { ActionError, action } from "@/lib/safe-action";
import { EmptySchema, IdSchemaNumber } from "@/lib/schemas/common-schemas";
import { SageCompanyAccountResponseType } from "@/lib/schemas/company";
import { API_LOGGING } from "../../../lib/config";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAllAccounts = action(EmptySchema, async () => {
  const endpoint = `${apiUrl}${SAGE_ONE_ACCOUNT.GET.GET_ALL_ACCOUNTS}`;

  try {
    if (API_LOGGING) console.log(`[action][GET] ${endpoint}`);
    const response = await fetch(endpoint, { next: { tags: ["sageone-accounts"] } as any });
    if (API_LOGGING) console.log(`[action][GET] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const accounts: SageCompanyAccountResponseType[] = data.results;

    return accounts;
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
    throw error;
  }
});

export const getCompanyById = action(IdSchemaNumber, async ({ id }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_ACCOUNT.GET.GET_ACCOUNT}/${id}`;

  try {
    if (API_LOGGING) console.log(`[action][GET] ${endpoint}`);
    const response = await fetch(endpoint);
    if (API_LOGGING) console.log(`[action][GET] ${endpoint} -> ${response.status} ${response.statusText}`);
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const company: SageCompanyAccountResponseType = data;

    return company;
  } catch (error) {
    console.error("Failed to fetch company:", error);
    throw error;
  }
});
