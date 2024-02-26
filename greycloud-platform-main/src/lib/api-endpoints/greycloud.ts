const BASE = "GreyCloud";

export const GREYCLOUD = {
  GET: {
    GET_ALL_USERS: `${BASE}/Get-AllUser`,
    GET_USER: `${BASE}/Get-User`,
    GET_COMPANY: `${BASE}/Get-Company`,
    GET_ALL_COMPANY: `${BASE}/Get-Company-All`,
  },
  POST: {
    CREATE_USER: `${BASE}/Create-User`,
    LOGIN_USER: `${BASE}/Login-User`,
    CREATE_SAGE_COMPANY: `${BASE}/Create-Sage-Company`,
    USER_RESET_ACCOUNT_PASSWORD: `${BASE}/User-Reset-Account-Password`,
  },
  PUT: {
    UPDATE_USER: `${BASE}/Update-User`,
    UPDATE_USER_PASSWORD: `${BASE}/Update-User-Password`,
    UPDATE_SAGE_COMPANY: `${BASE}/Update-Sage-Company`,
    VERIFY_USER_OTP: `${BASE}/Verify-User-Otp`,
  },
  DELETE: {
    DELETE_USER: `${BASE}/Delete-User`,
    DELETE_COMPANY: `${BASE}/Delete-Company`,
  },
};
