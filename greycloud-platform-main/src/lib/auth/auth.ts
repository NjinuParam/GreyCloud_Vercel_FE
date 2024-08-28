"use server";

import { cookies } from "next/headers";

import { getIronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { PlatformUserType } from "../schemas/common-schemas";
import { redirect } from "next/navigation";

export async function getIronSessionData() {
  
  const session = await getIronSession<PlatformUserType>(cookies(), { password: process.env.SESSION_PASSWORD as string, cookieName: "userSession" });
  if (!session) redirect("/login");
  return session;
}

export async function logout() {
  const session = await getIronSessionData();
  session.isLoggedIn = false;
  session.destroy();
  revalidatePath("/");
}
