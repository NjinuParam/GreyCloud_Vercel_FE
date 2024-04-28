const BASE = "SageOneCustomer";

export const SAGE_ONE_CUSTOMER = {
  GET: {
    CUSTOMER_GET_FOR_COMPANY: `${BASE}/Customer/Get`,
    CUSTOMER_NOTE_GET: `${BASE}/CustomerNote/Get`,
    CUSTOMER_RECEIPT_GET: `${BASE}/CustomerReceipt/Get`,
    CUSTOMER_RECEIPT_EXPORT: `${BASE}/CustomerReceipt/Export`,
  },
  POST: {
    CUSTOMER_SAVE: `${BASE}/Customer/Save`,
    CUSTOMER_NOTE_SAVE: `${BASE}/CustomerNote/Save`,
    CUSTOMER_RECEIPT_SAVE: `${BASE}/CustomerReceipt/Save`,
  },
  DELETE: {
    CUSTOMER_NOTE_DELETE: `${BASE}/CustomerNote/Delete`,
    CUSTOMER_RECEIPT_DELETE: `${BASE}/CustomerReceipt/Delete`,
  },
};

export const SAGE_ONE_CUSTOMER_NEW = {
  GET: {
    CUSTOMER_GET_ALL: `${BASE}/CustomerNew/GetAll`,
    CUSTOMER_NOTE_GET: `${BASE}/CustomerNote/Get`,
    CUSTOMER_RECEIPT_GET: `${BASE}/CustomerReceipt/Get`,
    CUSTOMER_RECEIPT_EXPORT: `${BASE}/CustomerReceipt/Export`,
  },
  POST: {
    CUSTOMER_SAVE: `${BASE}/CustomerNew/Save`,
    CUSTOMER_NOTE_SAVE: `${BASE}/CustomerNote/Save`,
    CUSTOMER_RECEIPT_SAVE: `${BASE}/CustomerReceipt/Save`,
  },
  DELETE: {
    CUSTOMER_NOTE_DELETE: `${BASE}/CustomerNote/Delete`,
    CUSTOMER_RECEIPT_DELETE: `${BASE}/CustomerReceipt/Delete`,
  },
};
