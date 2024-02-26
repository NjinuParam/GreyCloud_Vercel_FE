const BASE = "SageOneAccount";

export const SAGE_ONE_ACCOUNT = {
  GET: {
    GET_ALL_ACCOUNTS: `${BASE}/Get-All-Accounts`,
    GET_ACCOUNT: `${BASE}/Get-Account`,
    GET_ALL_PAYROLL_TYPE_OF_ACCOUNTS: `${BASE}/Get-All-Payroll-Type-Of-Accounts`,
    GET_ALL_SERVICE_ACCOUNTS: `${BASE}/Get-All-Service-Accounts`,
    DELETE_ACCOUNT: `${BASE}/Delete-Account`, // TODO: Remove this when the API is fixed.
    GET_ALL_SYSTEM_DOCUMENTS: `${BASE}/Get-All-System-Documents`,
    GET_ALL_ACCOUNTS_BY_CATEGORY: `${BASE}/Get-All-Accounts-By-Category`,
    GET_ALL_CHART_OF_ACCOUNTS: `${BASE}/Get-All-Chart-Of-Accounts`,
  },
  POST: {
    ACCOUNT_SAVE: `${BASE}/Account-Save`,
  },
  DELETE: {
    DELETE_ACCOUNT: `${BASE}/Delete-Account`,
  },
};
