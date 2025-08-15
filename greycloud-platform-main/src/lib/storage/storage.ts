// lib/storage.ts

export function saveCompanyInfoToSessionStorage(companyInfo: any[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem("companyInfo", JSON.stringify(companyInfo));
  } catch (err) {
    console.error("Failed to save company info to sessionStorage", err);
  }
}

export function getCompanyInfoFromSession(): any[] {
//   if (typeof window === "undefined") return [];
  try {
    const data = sessionStorage.getItem("companyInfo");
    console.log("getCompanyInfoFromSession data", data);
    const result =  data ? JSON.parse(data) : [];
    console.log("getCompanyInfoFromSession result", result);
    return result;
  } catch (err) {
    console.error("Failed to parse company info from sessionStorage", err);
    return [];
  }
}

