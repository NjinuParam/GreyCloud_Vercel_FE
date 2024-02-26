import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseCookies } from "nookies";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to format role name to display name
export const formatRoleDisplayName = (role: string): string => {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Function to convert string to base64
export function toBase64(str: string): string {
  return Buffer.from(str).toString("base64");
}

// Function to build FormData from form values
export function buildFormData(values: { [key: string]: any }): FormData {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

export const useUserDetails = () => {
  if (typeof window !== "undefined") {
    const cookies = parseCookies();
    const userDetails = cookies.currentUser ? JSON.parse(cookies.currentUser) : null;
    return userDetails;
  }
  return null;
};

export const formatDate = (dateToFormat: string) => {
  return dayjs(dateToFormat).format("MMMM D, YYYY h:mm A");
};

export const formatToRand = (value: number) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatToPercentage = (value: number) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value / 100);
};
