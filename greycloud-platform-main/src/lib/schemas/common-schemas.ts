import * as z from "zod";
import { formatRoleDisplayName } from "../utils";

export const SageCompanyIdSchema = z.object({
  SageCompanyId: z.coerce.number(),
});

export type SageCompanyIdType = z.infer<typeof SageCompanyIdSchema>;

export const RolesAllSchema = z.union([z.literal("GreyCloud_Admin"), z.literal("Company_Admin"), z.literal("Company_User")]);
export const RolesCompanySchema = z.union([z.literal("Company_Admin"), z.literal("Company_User")]);
export const RolesGreyCloudSchema = z.literal("GreyCloud_Admin");

export type RolesAllType = z.infer<typeof RolesAllSchema>;
export type RolesCompanyType = z.infer<typeof RolesCompanySchema>;
export type RolesGreyCloudType = z.infer<typeof RolesGreyCloudSchema>;

export const RolesAllOptions = RolesAllSchema.options.map((option) => ({
  value: option.value,
  displayName: formatRoleDisplayName(option.value),
}));

export const RolesCompanyOptions = RolesCompanySchema.options.map((option) => ({
  value: option.value,
  displayName: formatRoleDisplayName(option.value),
}));

export const CompanyResponseSchemaForUser = z.object({
  nm: z.string(),
  id: z.string(),
  email: z.string(),
  apiKey: z.string(),
  password: z.string(),
  status: z.string(),
  si: z.coerce.number(),
  success: z.coerce.boolean(),
});

export type CompanyResponseTypeForUser = z.infer<typeof CompanyResponseSchemaForUser>;

export const PlatformUserSchema = z.object({
  id: z.string().nullable().default(null),
  dateCreated: z.date().nullable().default(null),
  dateModified: z.date().nullable().default(null),
  email: z.string().email().nullable().default(null),
  name: z.string().nullable().default(null),
  surname: z.string().nullable().default(null),
  role: RolesAllSchema.default("Company_User"),
  companyId: z.string().nullable().default(null),
  companyProfile: z
    .object({
      loggedInCompanyId: z.string().nullable().default(null),
      companiesList: z.array(CompanyResponseSchemaForUser).nullable().default([]),
    })
    .default({ loggedInCompanyId: null, companiesList: [] }),
  isLoggedIn: z.boolean().default(false),
});

export type PlatformUserType = z.infer<typeof PlatformUserSchema>;

export const SelectedCompanyIdSchema = z.object({
  companyId: z.string(),
});

export type SelectedCompanyIdType = z.infer<typeof SelectedCompanyIdSchema>;

export const isCompanyUser = (role: string | undefined): boolean => {
  if (!role) return false;
  const result = RolesCompanySchema.safeParse(role);
  return result.success;
};

export const EmptySchema = z.object({});

export type EmptySchemaType = z.infer<typeof EmptySchema>;

export const CookieUserSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  name: z.string(),
  surname: z.string(),
  role: RolesAllSchema,
});

export type CookieUserType = z.infer<typeof CookieUserSchema>;

export const IdSchemaString = z.object({
  id: z.string(),
});

export const IdSchemaNumber = z.object({
  id: z.coerce.number(),
});

export type IdType = z.infer<typeof IdSchemaString>;

export const PasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
    "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
  );

export const EmailOnlySchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
});

export type EmailOnlyType = z.infer<typeof EmailOnlySchema>;

export const IdForCompanySchemaString = z.object({
  companyId: z.string(),
});
