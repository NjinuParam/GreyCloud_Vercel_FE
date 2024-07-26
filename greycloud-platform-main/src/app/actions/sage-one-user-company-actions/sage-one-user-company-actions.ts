"use server";

import { SAGE_ONE_USER_COMPANY } from "@/lib/api-endpoints/sage-one-user-company";
import { getIronSessionData, logout } from "@/lib/auth/auth";
import { ActionError, action } from "@/lib/safe-action";
import {
  CompanyResponseSchemaForUser,
  EmailOnlySchema,
  EmptySchema,
  IdForCompanySchemaString,
  IdSchemaString,
  SelectedCompanyIdSchema,
} from "@/lib/schemas/common-schemas";
// import { CompanyResponseSchemaForUser } from "@/lib/schemas/company";
import {
  AllCompanyUserResponseType,
  CompanyUserOfSpecificCompanyResponseSchema,
  CreateCompanyUserRequestModelSchema,
  LoginCompanyUserResponseType,
  LoginCompanyUserSchema,
  OTPCompanyUserSchema,
  UpdateCompanyUserPasswordSchema,
  UpdateCompanyUserRequestModelSchema,
} from "@/lib/schemas/company-user";

import { toBase64 } from "@/lib/utils";
import { revalidateTag } from "next/cache";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getAllCompanyUsers = action(
  IdForCompanySchemaString,
  async ({ companyId }) => {
    const endpoint = `${apiUrl}${SAGE_ONE_USER_COMPANY.GET.GET_ALL_COMPANY_USERS}?companyId=${companyId}`;

    try {
      const response = await fetch(endpoint, {
        next: { tags: ["all-company-users"] },
      });
      if (!response.ok) {
        throw new ActionError(`Error: ${response.status}`);
      }

      const data = await response.json();

      const users: AllCompanyUserResponseType[] = data;

      revalidateTag("all-company-users");

      return users;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  }
);

export const getSpecificCompanyUser = action(IdSchemaString, async ({ id }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_USER_COMPANY.GET.GET_COMPANY_USER}/${id}`;

  try {
    const response = await fetch(endpoint, {
      next: { tags: ["company-user"] },
    });
    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const user: CompanyUserOfSpecificCompanyResponseSchema = data;

    revalidateTag("company-user");

    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
});

export const createCompanyUser = action(
  CreateCompanyUserRequestModelSchema,
  async (userCredentials) => {
    const endpoint = `${apiUrl}${SAGE_ONE_USER_COMPANY.POST.CREATE_COMPANY_USER}`;

    // Convert password to base64
    userCredentials.password = toBase64(userCredentials.password);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(userCredentials),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new ActionError(`Error: ${response.status}`);
      }

      const data = await response.json();

      const user = data;

      revalidateTag("all-company-users");
      revalidateTag("company-user");

      return user;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  }
);

export const updateCompanyUser = action(
  UpdateCompanyUserRequestModelSchema,
  async (user) => {
    const endpoint = `${apiUrl}${SAGE_ONE_USER_COMPANY.PUT.UPDATE_COMPANY_USER}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new ActionError(`Error: ${response.status}`);
      }

      const data = await response.json();

      const updatedUser = data;

      revalidateTag("all-company-users");

      return updatedUser;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  }
);

export const deleteCompanyUser = action(IdSchemaString, async ({ id }) => {
  const endpoint = `${apiUrl}${SAGE_ONE_USER_COMPANY.DELETE.DELETE_COMPANY_USER}/${id}`;

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new ActionError(`Error: ${response.status}`);
    }

    const data = await response.json();

    const deletedUser = data;

    revalidateTag("all-company-users");

    return deletedUser;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
});

export const loginCompanyUser = action(
  LoginCompanyUserSchema,
  async ({ rememberMe, ...loginCredentials }) => {
    const endpoint = `${apiUrl}${SAGE_ONE_USER_COMPANY.POST.LOGIN_COMPANY_USER}`;

    // Convert password to base64
    loginCredentials.password = toBase64(loginCredentials.password);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(loginCredentials),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new ActionError(`Error: ${response.status}`);
      }

      const data = await response.json();

      const user: LoginCompanyUserResponseType = data;

      // Save session:
      const session = await getIronSessionData();
      session.name = user.name;
      session.surname = user.surname;
      session.email = user.email;
      session.role = user.role;
      session.id = user.id;
      session.dateCreated = user.dateCreated;
      session.dateModified = user.dateModified;
      session.companyProfile = {
        loggedInCompanyId: null,
        companiesList: user.companyInfo,
      };
      session.isLoggedIn = true;
      session.companyId = user.companyId;
      await session.save();

      return user;
    } catch (error) {
      console.error("Failed to login user:", error);
      throw error;
    }
  }
);

export const assignCompanyProfileToCompanyUser = action(
  SelectedCompanyIdSchema,
  async ({ companyId }) => {
    const session = await getIronSessionData();
    session.companyProfile = {
      loggedInCompanyId: companyId,
      companiesList: session.companyProfile?.companiesList,
    };

    await session.save();
    const selectedCompany = session.companyProfile?.companiesList?.find(
      (company) => company.companyId === companyId
    );

    return selectedCompany;
  }
);

export const logoutCompanyUser = action(EmptySchema, async () => {
  try {
    return await logout();
  } catch (error) {
    console.error("Failed to logout Company user:", error);
    throw error;
  }
});

export const updateCompanyUserPassword = action(
  UpdateCompanyUserPasswordSchema,
  async ({ passwordConfirmation, email, ...rest }) => {
    // Convert password to base64
    rest.newPassword = toBase64(rest.newPassword);

    const endpoint = `${apiUrl}${
      SAGE_ONE_USER_COMPANY.PUT.UPDATE_COMPANY_USER_PASSWORD
    }?email=${encodeURIComponent(email)}&newPassword=${rest.newPassword}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new ActionError(`Error: ${response.status}`);
      }

      const data = await response.json();

      const user = data;
      revalidateTag("all-company-users");

      return user;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  }
);

export const resetCompanyUserAccountPassword = action(
  EmailOnlySchema,
  async ({ email }) => {
    const endpoint = `${apiUrl}${
      SAGE_ONE_USER_COMPANY.POST.RESET_COMPANY_USER_PASSWORD
    }?email=${encodeURIComponent(email)}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new ActionError(`Error: ${response.status}`);
      }

      const data = await response.json();
      revalidateTag("all-company-users");

      return data;
    } catch (error) {
      console.error("Failed to reset user account password:", error);
      throw error;
    }
  }
);

export const verifyCompanyUserOTP = action(
  OTPCompanyUserSchema,
  async ({ email, code }) => {
    const endpoint = `${apiUrl}${
      SAGE_ONE_USER_COMPANY.PUT.VERIFY_COMPANY_USER_OTP
    }?email=${encodeURIComponent(email)}&code=${code}`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new ActionError(`Error: ${response.status}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Failed to verify user OTP:", error);
      throw error;
    }
  }
);
