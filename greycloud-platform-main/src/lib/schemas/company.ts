import * as z from "zod";
import { zfd } from "zod-form-data";
import { RolesCompanySchema, SageCompanyIdSchema } from "./common-schemas";
import { AddAssetGroupSchema } from "./depreciation";

export const CreateCompanyRequestModelSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
      message:
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
    }),
  apiKey: z.string().min(1, { message: "API key is required." }),
  sageCompanyId: z.string().min(1, { message: "Sage Company ID is required." }),
  contactName: z.string().min(1, { message: "Contact name is required." }),
  contactEmail: z.string().email({ message: "Invalid contact email format." }),
  contactNumber: z.string().min(1, { message: "Contact number is required." }),
});

export const CreateCompanyRequestModelSchemaForForm = zfd.formData(
  CreateCompanyRequestModelSchema
);

export type CreateCompanyRequestModelType = z.infer<
  typeof CreateCompanyRequestModelSchema
>;

export const CompanyResponseSchema = CreateCompanyRequestModelSchema.omit({
  password: true,
}).extend({
  id: z.string(),
  dateCreated: z.coerce.date(),
  dateModified: z.coerce.date(),
});

export type CompanyResponseType = z.infer<typeof CompanyResponseSchema>;

export const SageCompanyAccountResponseSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  currencySymbol: z.string(),
  currencyDecimalDigits: z.coerce.number(),
  numberDecimalDigits: z.coerce.number(),
  decimalSeparator: z.string(),
  hoursDecimalDigits: z.coerce.number(),
  itemCostPriceDecimalDigits: z.coerce.number(),
  itemSellingPriceDecimalDigits: z.coerce.number(),
  postalAddress1: z.string(),
  postalAddress2: z.string(),
  postalAddress3: z.string(),
  postalAddress4: z.string(),
  postalAddress5: z.string(),
  groupSeparator: z.string(),
  roundingValue: z.coerce.number(),
  taxSystem: z.coerce.number(),
  roundingType: z.coerce.number(),
  ageMonthly: z.coerce.boolean(),
  displayInactiveItems: z.coerce.boolean(),
  warnWhenItemCostIsZero: z.coerce.boolean(),
  doNotAllowProcessingIntoNegativeQuantities: z.coerce.boolean(),
  warnWhenItemQuantityIsZero: z.coerce.boolean(),
  warnWhenItemSellingBelowCost: z.coerce.boolean(),
  countryId: z.coerce.number(),
  enableCustomerZone: z.coerce.boolean(),
  enableAutomaticBankFeedRefresh: z.coerce.boolean(),
  telephone: z.string(),
  email: z.string(),
  isPrimarySendingEmail: z.coerce.boolean(),
  postalAddress01: z.string(),
  postalAddress02: z.string(),
  postalAddress03: z.string(),
  postalAddress04: z.string(),
  postalAddress05: z.string(),
  companyInfo01: z.string(),
  companyInfo02: z.string(),
  companyInfo03: z.string(),
  companyInfo04: z.string(),
  companyInfo05: z.string(),
  isOwner: z.coerce.boolean(),
  dateFormatId: z.coerce.number(),
  checkForDuplicateCustomerReferences: z.coerce.boolean(),
  checkForDuplicateSupplierReferences: z.coerce.boolean(),
  displayName: z.string(),
  displayInactiveCustomers: z.coerce.boolean(),
  displayInactiveSuppliers: z.coerce.boolean(),
  displayInactiveTimeProjects: z.coerce.boolean(),
  useInclusiveProcessingByDefault: z.coerce.boolean(),
  lockProcessing: z.coerce.boolean(),
  lockTimesheetProcessing: z.coerce.boolean(),
  useNoreplyEmail: z.coerce.boolean(),
  ageingBasedOnDueDate: z.coerce.boolean(),
  useLogoOnEmails: z.coerce.boolean(),
  useLogoOnCustomerZone: z.coerce.boolean(),
  created: z.coerce.date(),
  modified: z.coerce.date(),
  active: z.coerce.boolean(),
  taxNumber: z.string(),
  isPracticeAccount: z.coerce.boolean(),
  logoPositionID: z.coerce.number(),
  customerZoneGuid: z.string(),
  clientTypeId: z.coerce.number(),
  displayTotalTypeId: z.coerce.number(),
  displayInCompanyConsole: z.coerce.boolean(),
  lastLoginDate: z.coerce.date(),
  taxReportingTypeId: z.coerce.number(),
  salesOrdersReserveItemQuantities: z.coerce.boolean(),
  prescribedGoodsTrader: z.coerce.boolean(),
  displayInactiveItemBundles: z.coerce.boolean(),
  companyTransferStatus: z.coerce.number(),
  inventoryTypeId: z.coerce.number(),
});

export type SageCompanyAccountResponseType = z.infer<
  typeof SageCompanyAccountResponseSchema
>;

export const IdGetCompanyAssetByCompanyIdSchema = z.object({
  SageCompanyId: z.coerce.number(),
});

export type IdGetCompanyAssetType = z.infer<
  typeof IdGetCompanyAssetByCompanyIdSchema
>;

export const SageOneAssetTypeSchema = z.object({
  description: z.string(),
  category: z.object({
    description: z.string(),
    id: z.coerce.number(),
    modified: z.coerce.date(),
    created: z.coerce.date(),
  }),
  location: z
    .object({
      id: z.coerce.number(),
      description: z.string(),
      physicalLocation:z.string().nullable()
    })
    .nullable(),
  datePurchased: z.coerce.date(),
  depreciationStart: z.coerce.date(),
  serialNumber: z.string(),
  boughtFrom: z.string(),
  purchasePrice: z.coerce.number(),
  currentValue: z.coerce.number(),
  replacementValue: z.coerce.number(),
  textField1: z.string(),
  textField2: z.string(),
  textField3: z.string(),
  locName:z.string().nullable(),  
  numericField1: z.coerce.number(),
  numericField2: z.coerce.number(),
  numericField3: z.coerce.number(),
  yesNoField1: z.coerce.boolean(),
  yesNoField2: z.coerce.boolean(),
  yesNoField3: z.coerce.boolean(),
  dateField1: z.coerce.date(),
  dateField2: z.coerce.date(),
  dateField3: z.coerce.date(),
  billingType: z.object({
    type:  z.coerce.number(),
    amount:  z.coerce.number(),
    usageType:  z.string(),
    usageRate:  z.coerce.number(),
    
  }).nullable(),
  id: z.coerce.string(),
  code:z.string(),
  usage: z.coerce.number(),
  recoverableAmount: z.coerce.number(),
  // catDescription:z.string().nullable(),
  residual: z.coerce.number().default(0)
  // locName: z.string().nullable(),
});


export type SageOneAssetTypeType = z.infer<typeof SageOneAssetTypeSchema>;

export const SaveSageOneAssetSchema = SageCompanyIdSchema.extend({
  asset: SageOneAssetTypeSchema.extend({
    assetDepreciationGroupRequestModel: AddAssetGroupSchema.nullable(),
  }),
});

export type SaveSageOneAssetType = z.infer<typeof SaveSageOneAssetSchema>;

export const CompanyIdAndIdSchema = SageCompanyIdSchema.extend({
  id: z.coerce.number(),
});

export type CompanyIdAndIdType = z.infer<typeof CompanyIdAndIdSchema>;

export const SageOneAssetCategorySchema = z.object({
  description: z.string(),
  id: z.coerce.number(),
  modified: z.coerce.date(),
  created: z.coerce.date(),
});

export type SageOneAssetCategoryType = z.infer<
  typeof SageOneAssetCategorySchema
>;

export const SaveSageOneAssetCategorySchema = SageCompanyIdSchema.extend({
  assetCategory: SageOneAssetCategorySchema,
});

export type SaveSageOneAssetCategoryType = z.infer<
  typeof SaveSageOneAssetCategorySchema
>;

export const SageOneAssetLocationSchema = SageCompanyIdSchema.extend({
  id: z.coerce.number(),
  description: z.string(),
  physicalLocation:z.string().nullable()
});

export type SageOneAssetLocationType = z.infer<
  typeof SageOneAssetLocationSchema
>;

export const SageOneAssetNoteSchema = z.object({
  assetId: z.coerce.number(),
  id: z.coerce.number(),
  subject: z.string(),
  entryDate: z.coerce.date(),
  actionDate: z.coerce.date(),
  status: z.coerce.boolean(),
  note: z.string(),
  hasAttachments: z.coerce.boolean(),
});

export type SageOneAssetNoteType = z.infer<typeof SageOneAssetNoteSchema>;

export const SaveSageOneAssetNoteSchema = SageCompanyIdSchema.extend({
  assetNote: SageOneAssetNoteSchema,
});

export type SaveSageOneAssetNoteType = z.infer<
  typeof SaveSageOneAssetNoteSchema
>;

export const SageOneCompanySchemaWithStatus = z.object({
  includeStatus: z.coerce.boolean(),
});

export const SageOneCompanyCompanyIdStringSchema = z.object({
  companyId: z.string(),
});

export type SageOneCompanyCompanyIdStringType = z.infer<
  typeof SageOneCompanyCompanyIdStringSchema
>;

export const SageCompanyUserSchema = z.object({
  id: z.string(),
  dateCreated: z.coerce.date(),
  dateModified: z.coerce.date(),
  companyId: z.string(),
  email: z.string().email(),
  name: z.string(),
  surname: z.string(),
  password: z.string(),
  isPasswordUpdated: z.coerce.boolean(),
  role: RolesCompanySchema,
});

export type SageCompanyUserType = z.infer<typeof SageCompanyUserSchema>;

export const CreateSageCompanyUserSchema = SageCompanyUserSchema.omit({
  id: true,
  dateCreated: true,
  dateModified: true,
});

export type CreateSageCompanyUserType = z.infer<
  typeof CreateSageCompanyUserSchema
>;

export const UpdateSageCompanyUserSchema = CreateSageCompanyUserSchema.extend({
  id: z.string(),
});

export type UpdateSageCompanyUserType = z.infer<
  typeof UpdateSageCompanyUserSchema
>;

export const UpdateSageCompanyUserPassswordSchema = z.object({
  id: z.string(),
  newPassword: z.string(),
});

export const SageCompanyResponseSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  email: z.string().email(),
  apiKey: z.string(),
  contactName: z.string(),
  contactEmail: z.string().email(),
  sageCompanyId: z.coerce.number(),
  contactNumber: z.string(),
  password: z.string(),
  dateCreated: z.coerce.date(),
  dateModified: z.coerce.date(),
});

export type SageCompanyResponseType = z.infer<typeof SageCompanyResponseSchema>;
