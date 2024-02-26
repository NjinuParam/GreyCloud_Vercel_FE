import * as z from "zod";

import { zfd } from "zod-form-data";
import { PasswordSchema, RolesCompanySchema } from "./common-schemas";

export const CreateCompanyUserRequestModelSchema = zfd
  .formData({
    companyId: z.string().min(1, { message: "Company ID is required." }),
    name: z.string().min(2, { message: "Name must be at least 2 characters long." }).max(50),
    surname: z.string().min(2, { message: "Surname must be at least 2 characters long." }).max(50),
    email: z.string().email({ message: "Please enter a valid email address." }),
    role: RolesCompanySchema,
    password: PasswordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export type CreateCompanyUserType = z.infer<typeof CreateCompanyUserRequestModelSchema>;

export const UpdateCompanyUserRequestModelSchema = zfd.formData({
  id: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }).max(50),
  surname: z.string().min(2, { message: "Surname must be at least 2 characters long." }).max(50),
  email: z.string().email({ message: "Please enter a valid email address." }),
  isPasswordUpdated: z.coerce.boolean().default(false).optional(),
  role: RolesCompanySchema,
});

export type UpdateCompanyUserType = z.infer<typeof UpdateCompanyUserRequestModelSchema>;

export const ChangeCompanyUserPasswordSchema = zfd
  .formData({
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters long.",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export type ChangeCompanyUserPasswordType = z.infer<typeof ChangeCompanyUserPasswordSchema>;

export const AllCompanyUserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  company: z.string(),
  role: RolesCompanySchema,
});

export type AllCompanyUserResponseType = z.infer<typeof AllCompanyUserResponseSchema>;

export const CompanyUserResponseWithoutCompanySchema = AllCompanyUserResponseSchema.omit({
  company: true,
});

export type CompanyUserResponseWithoutCompanyType = z.infer<typeof CompanyUserResponseWithoutCompanySchema>;

export const CompanyUserOfSpecificCompanyResponse = AllCompanyUserResponseSchema.extend({
  companyId: z.string(),
  dateCreated: z.coerce.date(),
  dateModified: z.coerce.date(),
  isPasswordUpdated: z.coerce.boolean(),
}).omit({
  company: true,
});

export type CompanyUserOfSpecificCompanyResponseSchema = z.infer<typeof CompanyUserOfSpecificCompanyResponse>;

// Forgot password:
export const ForgotPasswordCompanyUserSchema = zfd.formData({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export type ForgotPasswordCompanyUserType = z.infer<typeof ForgotPasswordCompanyUserSchema>;

// Reset Password:
export const ResetPasswordCompanyUserSchema = zfd.formData({
  digit1: z.string().length(1, "X"),
  digit2: z.string().length(1, "X"),
  digit3: z.string().length(1, "X"),
  digit4: z.string().length(1, "X"),
});

export type ResetPasswordCompanyUserType = z.infer<typeof ResetPasswordCompanyUserSchema>;

export const UpdateCompanyUserPasswordSchema = z
  .object({
    email: z.string().email({ message: "Invalid email format." }),
    newPassword: PasswordSchema,
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export type UpdateCompanyUserPasswordType = z.infer<typeof UpdateCompanyUserPasswordSchema>;

export const LoginCompanyUserSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: PasswordSchema,
  rememberMe: z.coerce.boolean().default(false).optional(),
});

export type LoginCompanyUserType = z.infer<typeof LoginCompanyUserSchema>;

export const LoginCompanyUserResponseSchema = z.object({
  id: z.string(),
  dateCreated: z.coerce.date(),
  dateModified: z.coerce.date(),
  companyId: z.string(),
  email: z.string().email(),
  name: z.string(),
  surname: z.string(),
  isPasswordUpdated: z.coerce.boolean(),
  role: RolesCompanySchema,
});

export type LoginCompanyUserResponseType = z.infer<typeof LoginCompanyUserResponseSchema>;

export const OTPCompanyUserSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  code: z.string().min(4, { message: "OTP code must be a minimum of 4 characters." }).regex(/^\d+$/, "Code must be numeric"),
});

export type OTPCompanyUserType = z.infer<typeof OTPCompanyUserSchema>;
