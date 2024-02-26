import * as z from "zod";

import { zfd } from "zod-form-data";
import { PasswordSchema, RolesGreyCloudSchema } from "./common-schemas";

export const RegisterGreyCloudAdminRequestModelSchema = zfd
  .formData({
    name: z.string().min(2, { message: "Name must be at least 2 characters long." }).max(50),
    surname: z.string().min(2, { message: "Surname must be at least 2 characters long." }).max(50),
    email: z.string().email({ message: "Please enter a valid email address." }),
    role: RolesGreyCloudSchema,
    password: PasswordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export type RegisterGreyCloudAdminType = z.infer<typeof RegisterGreyCloudAdminRequestModelSchema>;

export const UpdateGreyCloudAdminRequestModelSchema = zfd.formData({
  id: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }).max(50),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters long." }).max(50),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export type UpdateGreyCloudAdminType = z.infer<typeof UpdateGreyCloudAdminRequestModelSchema>;

export const GreyCloudAllAdminsResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  role: RolesGreyCloudSchema,
});

export type GreyCloudAllAdminsResponseType = z.infer<typeof GreyCloudAllAdminsResponseSchema>;

export const GreyCloudSpecificAdminResponseSchema = GreyCloudAllAdminsResponseSchema.extend({
  dateCreated: z.string(),
  dateModified: z.string(),
  password: z.string().optional().nullable(),
});

export type GreyCloudSpecificAdminResponseType = z.infer<typeof GreyCloudSpecificAdminResponseSchema>;

export const GreyCloudAdminResponseForCompanySchema = GreyCloudAllAdminsResponseSchema.extend({
  companyName: z.string(),
});

export type GreyCloudAdminResponseForCompanyType = z.infer<typeof GreyCloudAdminResponseForCompanySchema>;

export const ForgotPasswordGreyCloudAdminSchema = zfd.formData({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export type ForgotPasswordGreyCloudAdminType = z.infer<typeof ForgotPasswordGreyCloudAdminSchema>;

export const ResetPasswordGreyCloudAdminSchema = zfd.formData({
  digit1: z.string().length(1, "X"),
  digit2: z.string().length(1, "X"),
  digit3: z.string().length(1, "X"),
  digit4: z.string().length(1, "X"),
});

export type ResetPasswordGreyCloudAdminType = z.infer<typeof ResetPasswordGreyCloudAdminSchema>;

export const UpdateGreyCloudAdminPasswordSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format." }),
    newPassword: PasswordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export type UpdateGreyCloudAdminPasswordType = z.infer<typeof UpdateGreyCloudAdminPasswordSchema>;

export const LoginGreyCloudAdminSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: PasswordSchema,
  rememberMe: z.coerce.boolean().default(false).optional(),
});

export type LoginGreyCloudAdminType = z.infer<typeof LoginGreyCloudAdminSchema>;

export const LoginGreyCloudAdminResponseSchema = z.object({
  id: z.string(),
  dateCreated: z.coerce.date(),
  dateModified: z.coerce.date(),
  email: z.string().email(),
  name: z.string(),
  surname: z.string(),
  role: RolesGreyCloudSchema,
});

export type LoginGreyCloudAdminResponseType = z.infer<typeof LoginGreyCloudAdminResponseSchema>;

export const CreateSageCompanyRequestModelSchema = zfd.formData({
  companyName: z.string().min(1, { message: "Company name is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: PasswordSchema,
  apiKey: z.string(),
  sageCompanyId: z.coerce.number(),
  contactName: z.string().min(1, { message: "Contact name is required." }),
  contactEmail: z.string().email({ message: "Invalid contact email format." }),
  contactNumber: z.string().min(1, { message: "Contact number is required." }),
});

export type CreateSageCompanyRequestModelType = z.infer<typeof CreateSageCompanyRequestModelSchema>;

export const UpdateSageCompanyRequestModelSchema = zfd.formData({
  id: z.string(),
  companyName: z.string().min(1, { message: "Company name is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  apiKey: z.string(),
  sageCompanyId: z.coerce.number(),
  contactName: z.string().min(1, { message: "Contact name is required." }),
  contactEmail: z.string().email({ message: "Invalid contact email format." }),
  contactNumber: z.string().min(1, { message: "Contact number is required." }),
});

export type UpdateCompanyRequestModelType = z.infer<typeof UpdateSageCompanyRequestModelSchema>;

export const OTPGreyCloudSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  code: z.string().min(4, { message: "OTP code must be a minimum of 4 characters." }).regex(/^\d+$/, "Code must be numeric"),
});

export type OTPGreyCloudType = z.infer<typeof OTPGreyCloudSchema>;
