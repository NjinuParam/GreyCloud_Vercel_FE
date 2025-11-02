import { getIronSessionData } from "../../lib/auth/auth";
import { API_LOGGING } from "../../lib/config";

export async function apiFetch(url: string) {
var session = await getIronSessionData();
var token=session.token;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (API_LOGGING) {
    const masked = token ? `Bearer ${String(token).slice(0, 8)}...` : "(no-token)";
    console.log(`[apiFetch] GET ${url} - headers:`, { ...headers, Authorization: masked });
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (API_LOGGING) console.log(`[apiFetch] ${url} -> ${response.status} ${response.statusText}`);

    if (!response.ok) {
      // Try to read response body for debugging
      let bodyText = "";
      try {
        bodyText = await response.text();
      } catch (e) {
        bodyText = `<unable to read body: ${String(e)}>`;
      }

      if (API_LOGGING) {
        console.error(`[apiFetch] ERROR ${url} - status: ${response.status} - body:`, bodyText);
      }

      throw new Error(`API error: ${response.status}`);
    }

    return response;
  } catch (err) {
    if (API_LOGGING) console.error(`[apiFetch] Network/Fetch error for ${url}:`, err);
    throw err;
  }
}

export async function apiPost(url: string, payload: any) {
var session = await getIronSessionData();
var token=session.token;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (API_LOGGING) {
    const masked = token ? `Bearer ${String(token).slice(0, 8)}...` : "(no-token)";
    console.log(`[apiPost] POST ${url} - headers:`, { ...headers, Authorization: masked }, "payload:", payload);
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (API_LOGGING) console.log(`[apiPost] ${url} -> ${response.status} ${response.statusText}`);

    if (!response.ok) {
      let bodyText = "";
      try {
        bodyText = await response.text();
      } catch (e) {
        bodyText = `<unable to read body: ${String(e)}>`;
      }

      if (API_LOGGING) {
        console.error(`[apiPost] ERROR ${url} - status: ${response.status} - body:`, bodyText);
      }

      throw new Error(`API error: ${response.status}`);
    }

    return response;
  } catch (err) {
    if (API_LOGGING) console.error(`[apiPost] Network/Fetch error for ${url}:`, err);
    throw err;
  }
}

// Generic server-side fetch wrapper for actions: logs request/response when API_LOGGING is enabled
export async function serverFetch(url: string, init?: RequestInit) {
  if (API_LOGGING) {
    const method = init?.method ?? "GET";
    let auth = "(no-auth)";
    try {
      const hdrs = init?.headers as Record<string, any> | undefined;
      if (hdrs && hdrs.Authorization) {
        auth = String(hdrs.Authorization).slice(0, 12) + "...";
      }
    } catch (e) {
      auth = "(unable-to-inspect-headers)";
    }
    console.log(`[serverFetch] ${method} ${url} - auth: ${auth}`);
  }

  try {
    const response = await fetch(url, init as any);

    if (API_LOGGING) console.log(`[serverFetch] ${url} -> ${response.status} ${response.statusText}`);

    if (!response.ok && API_LOGGING) {
      let bodyText = "";
      try {
        bodyText = await response.text();
      } catch (e) {
        bodyText = `<unable to read body: ${String(e)}>`;
      }
      console.error(`[serverFetch] ERROR ${url} - status: ${response.status} - body:`, bodyText);
    }

    return response;
  } catch (err) {
    if (API_LOGGING) console.error(`[serverFetch] Network/Fetch error for ${url}:`, err);
    throw err;
  }
}
