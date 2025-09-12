import { getIronSessionData } from "../../lib/auth/auth";

export async function apiFetch(url: string) {
var session = await getIronSessionData();
var token=session.token;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  console.log("API Response:", response);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response;
}

export async function apiPost(url: string, payload: any) {
var session = await getIronSessionData();
var token=session.token;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  console.log("API Response:", response);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response;
}
