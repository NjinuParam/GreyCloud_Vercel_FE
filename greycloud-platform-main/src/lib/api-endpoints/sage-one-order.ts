const BASE = "SageOneOrder";

export const SAGE_ONE_ORDER = {
  GET: {
    SALES_ORDER_GET: `${BASE}/SalesOrder/Get`,
    SALES_ORDER_EXPORT: `${BASE}/SalesOrder/Export`,
  },
  POST: {
    SALES_ORDER_SAVE: `${BASE}/SalesOrder/Save`,
    SALES_ORDER_EMAIL: `${BASE}/SalesOrder/Email`,
  },
  DELETE: {
    SALES_ORDER_DELETE: `${BASE}/SalesOrder/Delete`,
  },
};
