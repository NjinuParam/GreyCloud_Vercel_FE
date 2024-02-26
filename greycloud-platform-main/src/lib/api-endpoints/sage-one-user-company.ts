const BASE = "UserCompany";

export const SAGE_ONE_USER_COMPANY = {
  GET: {
    GET_ALL_COMPANY_USERS: `${BASE}/Get-All-Company-User`,
    GET_COMPANY_USER: `${BASE}/Get-User`,
  },
  POST: {
    CREATE_COMPANY_USER: `${BASE}/Create-User`,
    LOGIN_COMPANY_USER: `${BASE}/Login-User`,
    RESET_COMPANY_USER_PASSWORD: `${BASE}/User-Reset-Account-Password`,
  },
  PUT: {
    UPDATE_COMPANY_USER: `${BASE}/Update-User`,
    UPDATE_COMPANY_USER_PASSWORD: `${BASE}/Update-User-Password`,
    VERIFY_COMPANY_USER_OTP: `${BASE}/Verify-User-Otp`,
  },
  DELETE: {
    DELETE_COMPANY_USER: `${BASE}/Delete-User`,
  },
};
