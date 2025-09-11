import { getIronSessionData } from "../../lib/auth/auth";

export async function apiFetch(url: string) {
  console.log("API Request:", { url, token });
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
