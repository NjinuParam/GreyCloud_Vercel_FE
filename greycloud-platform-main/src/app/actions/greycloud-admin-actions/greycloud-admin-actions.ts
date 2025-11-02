"use server";

import "server-only";

import { GREYCLOUD } from "@/lib/api-endpoints/greycloud";
import { ActionError, action, authAction } from "@/lib/safe-action";
import { EmailOnlySchema, EmptySchema, IdSchemaString } from "@/lib/schemas/common-schemas";
import { SageCompanyResponseType } from "@/lib/schemas/company";
import {
  GreyCloudAllAdminsResponseType,
  LoginGreyCloudAdminSchema,
  RegisterGreyCloudAdminRequestModelSchema,
  UpdateSageCompanyRequestModelSchema,
  UpdateGreyCloudAdminRequestModelSchema,
  CreateSageCompanyRequestModelSchema,
  OTPGreyCloudSchema,
  UpdateGreyCloudAdminPasswordSchema,
  GreyCloudSpecificAdminResponseType,
  LoginGreyCloudAdminResponseType,
} from "@/lib/schemas/greycloud-admin";
import { toBase64 } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { getIronSessionData, logout } from "@/lib/auth/auth";
import { serverFetch } from "../apiHandler";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAllGreyCloudAdmins = action(EmptySchema, async () => {
  const endpoint = `${apiUrl}${GREYCLOUD.GET.GET_ALL_USERS}`;

  try {
  const response = await serverFetch(endpoint, { next: { tags: ["greycloud-admins"], revalidate: 1 } as any });
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const admins: GreyCloudAllAdminsResponseType[] = data;

    return admins;
  } catch (error) {
    console.error("Failed to fetch admins:", error);
    throw error;
  }
});

export const getGreyCloudAdmin = action(IdSchemaString, async ({ id }) => {
  const endpoint = `${apiUrl}${GREYCLOUD.GET.GET_USER}/${id}`;

  try {
  const response = await serverFetch(endpoint, { next: { tags: ["greycloud-admins"] } as any });
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const admin: GreyCloudSpecificAdminResponseType = data;

    revalidateTag("greycloud-admins");

    return admin;
  } catch (error) {
    console.error("Failed to fetch admin:", error);
    throw error;
  }
});

export const createGreyCloudAdmin = action(RegisterGreyCloudAdminRequestModelSchema, async ({ passwordConfirmation, ...myAdmin }) => {
  const endpoint = `${apiUrl}${GREYCLOUD.POST.CREATE_USER}`;

  // Convert password to base64
  myAdmin.password = toBase64(myAdmin.password);

  try {
    const response = await serverFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(myAdmin),
      headers: {
        "Content-Type": "application/json",
      },
    } as any);

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    // const admin: AdminResponseType = data;
    const admin = data;

    revalidateTag("greycloud-admins");

    return admin;
  } catch (error) {
    console.error("Failed to create admin:", error);
    throw error;
  }
});

export const updateGreyCloudAdmin = action(UpdateGreyCloudAdminRequestModelSchema, async (myAdmin) => {
  const endpoint = `${apiUrl}${GREYCLOUD.PUT.UPDATE_USER}`;

  try {
    const response = await serverFetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(myAdmin),
      headers: {
        "Content-Type": "application/json",
      },
    } as any);

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();
    const admin = data;

    revalidateTag("greycloud-admins");

    return admin;
  } catch (error) {
    console.error("Failed to update admin:", error);
    throw error;
  }
});

export const deleteGreyCloudAdmin = action(IdSchemaString, async ({ id }) => {
  const endpoint = `${apiUrl}${GREYCLOUD.DELETE.DELETE_USER}/${id}`;

  try {
    const response = await serverFetch(endpoint, {
      method: "DELETE",
    } as any);

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const admin = data;

    revalidateTag("greycloud-admins");

    return admin;
  } catch (error) {
    console.error("Failed to delete admin:", error);
    throw error;
  }
});

export const updateGreyCloudAdminPassword = action(UpdateGreyCloudAdminPasswordSchema, async ({ passwordConfirmation, email, ...rest }) => {
  // Convert password to base64
  rest.newPassword = toBase64(rest.newPassword);

  const endpoint = `${apiUrl}${GREYCLOUD.PUT.UPDATE_USER_PASSWORD}?email=${email}&newPassword=${rest.newPassword}`;

  try {
    const response = await serverFetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    } as any);

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const admin = data;

    revalidateTag("greycloud-admins");

    return admin;
  } catch (error) {
    console.error("Failed to update admin:", error);
    throw error;
  }
});

export const loginGreyCloudAdmin = action(LoginGreyCloudAdminSchema, async ({ rememberMe, ...loginCredentials }) => {
  const endpoint = `${apiUrl}${GREYCLOUD.POST.LOGIN_USER}`;

  // Convert password to base64
  loginCredentials.password = toBase64(loginCredentials.password);

  try {
    const response = await serverFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(loginCredentials),
      headers: {
        "Content-Type": "application/json",
      },
    } as any);

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const admin: LoginGreyCloudAdminResponseType = data;

    // Save session:
    const session = await getIronSessionData();
    session.name = admin.name;
    session.surname = admin.surname;
    session.email = admin.email;
    session.role = admin.role;
    session.id = admin.id;
    session.dateCreated = admin.dateCreated;
    session.dateModified = admin.dateModified;
    session.isLoggedIn = true;
    session.companyId = null;
    await session.save();

    return admin;
  } catch (error) {
    console.error("Failed to login admin:", error);
    throw error;
  }
});

export const logoutGreyCloudAdmin = action(EmptySchema, async () => {
  try {
    return await logout();
  } catch (error) {
    console.error("Failed to logout admin:", error);
    throw error;
  }
});

export const createGreyCloudCompany = action(CreateSageCompanyRequestModelSchema, async (company) => {
  const endpoint = `${apiUrl}${GREYCLOUD.POST.CREATE_SAGE_COMPANY}`;

  try {
    const response = await serverFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(company),
      headers: {
        "Content-Type": "application/json",
      },
    } as any);

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const admin = data;

    revalidateTag("all-sage-companies");

    return admin;
  } catch (error) {
    console.error("Failed to create sage company:", error);
    throw error;
  }
});

export const updateGreyCloudCompany = action(UpdateSageCompanyRequestModelSchema, async (company) => {
  const endpoint = `${apiUrl}${GREYCLOUD.PUT.UPDATE_SAGE_COMPANY}`;

  try {
    const response = await serverFetch(endpoint, {
      method: "PUT",
      body: JSON.stringify(company),
      headers: {
        "Content-Type": "application/json",
      },
    } as any);

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const admin = data;

    revalidateTag("all-sage-companies");

    return admin;
  } catch (error) {
    console.error("Failed to update sage company:", error);
    throw error;
  }
});

export const getGreyCloudCompany = action(IdSchemaString, async ({ id }) => {
  const endpoint = `${apiUrl}${GREYCLOUD.GET.GET_COMPANY}/${id}`;

  try {
  const response = await serverFetch(endpoint, { next: { tags: ["all-sage-companies"] } as any });
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const company: SageCompanyResponseType = data;

    return company;
  } catch (error) {
    console.error("Failed to fetch company:", error);
    throw error;
  }
});

export const getAllGreyCloudCompanies = action(EmptySchema, async () => {
  const endpoint = `${apiUrl}${GREYCLOUD.GET.GET_ALL_COMPANY}`;

  try {
  const response = await serverFetch(endpoint, { next: { tags: ["all-sage-companies"] } as any });
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const companies: SageCompanyResponseType[] = data;

    return companies;
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    throw error;
  }
});

export const deleteGreyCloudCompany = action(IdSchemaString, async ({ id }) => {
  const endpoint = `${apiUrl}${GREYCLOUD.DELETE.DELETE_COMPANY}/${id}`;

  try {
    const response = await serverFetch(endpoint, {
      method: "DELETE",
    } as any);

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const company = data;

    revalidateTag("all-sage-companies");

    return company;
  } catch (error) {
    console.error("Failed to delete company:", error);
    throw error;
  }
});

export const resetGreyCloudAdminAccountPassword = action(EmailOnlySchema, async ({ email }) => {
  const endpoint = `${apiUrl}${GREYCLOUD.POST.USER_RESET_ACCOUNT_PASSWORD}?email=${encodeURIComponent(email)}`;

  try {
    const response = await serverFetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    } as any);

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    revalidateTag("all-sage-companies");

    return data;
  } catch (error) {
    console.error("Failed to reset admin account password:", error);
    throw error;
  }
});

export const verifyGreyCloudAdminOTP = action(OTPGreyCloudSchema, async ({ email, code }) => {
  const endpoint = `${apiUrl}${GREYCLOUD.PUT.VERIFY_USER_OTP}?email=${encodeURIComponent(email)}&code=${code}`;

  try {
    const response = await serverFetch(endpoint, {
      method: "PUT",
    } as any);

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to verify admin OTP:", error);
    throw error;
  }
});
