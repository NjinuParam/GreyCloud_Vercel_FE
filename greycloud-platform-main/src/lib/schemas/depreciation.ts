import * as z from "zod";

import { zfd } from "zod-form-data";

export const GetAssetGroupResponseSchema = z.object({
  assetDepId: z.string(),
  createdDate: z.coerce.date(),
  assetId: z.string(),
  depGroupId: z.string(),
  active: z.coerce.boolean(),
  creatingUser: z.string(),
});

export type GetAssetGroupResponseType = z.infer<typeof GetAssetGroupResponseSchema>;

export const GetSpecificAssetGroupSchema = zfd.formData({
  Id: z.string().min(1, { message: "Id is required." }),
});

export type GetSpecificAssetGroupType = z.infer<typeof GetSpecificAssetGroupSchema>;

export const UpdateAssetGroupSchema = zfd.formData({
  assetDepId: z.string().min(1, { message: "Asset Depreciation Id is required." }),
  active: z.coerce.boolean(),
});

export type UpdateAssetGroupType = z.infer<typeof UpdateAssetGroupSchema>;

export const AddAssetGroupSchema = z.object({
  assetId: z.number().default(0),
  depGroupId: z.string().min(1, { message: "Depreciation Group Id is required." }),
  active: z.coerce.boolean(),
  creatingUser: z.string().min(1, { message: "Creating User is required." }),
});

export type AddAssetGroupType = z.infer<typeof AddAssetGroupSchema>;

export const GetCompanyDepreciationGroupResponseSchema = z.object({
  depGroupId: z.string(),
  createdDate: z.coerce.date(),
  dateModified: z.coerce.date(),
  depName: z.string(),
  depAmount: z.coerce.number(),
  totalDepreciation:z.coerce.number(),
  depreciationThisYear:z.coerce.number(),
  depreciationThisMonth:z.coerce.number(),
  period: z.coerce.number(),
  companyId: z.string(),
  active: z.coerce.boolean(),
  isMoney: z.coerce.boolean(),
  creatingUser: z.string(),
});

export type GetCompanyDepreciationGroupResponseType = z.infer<typeof GetCompanyDepreciationGroupResponseSchema>;

export const GetSpecificCompanyDepreciationGroupSchema = zfd.formData({
  id: z.string().min(1, { message: "Id is required." }),
});

export type GetSpecificCompanyDepreciationGroupType = z.infer<typeof GetSpecificCompanyDepreciationGroupSchema>;

export const AddCompanyDepreciationGroupSchema = z.object({
  depName: z.string().min(1, { message: "Depreciation Name is required." }),
  depAmount: z.coerce.number().default(0),
  period: z.coerce.number().default(0),
  companyId: z.string().min(1, { message: "Company Id is required." }),
  active: z.coerce.boolean().default(true),
  isMoney: z.coerce.boolean().default(true),
  creatingUser: z.string().min(1, { message: "Creating User is required." }),
});

export type AddCompanyDepreciationGroupType = z.infer<typeof AddCompanyDepreciationGroupSchema>;

export const DeleteCompanyDepreciationGroupSchema = zfd.formData({
  depGroupId: z.string().min(1, { message: "Depreciation Group Id is required." }),
  depAmount: z.coerce.number(),
  period: z.coerce.number(),
  companyId: z.string().min(1, { message: "Company Id is required." }),
  active: z.coerce.boolean(),
  isMoney: z.coerce.boolean(),
  creatingUser: z.string().min(1, { message: "Creating User is required." }),
});

export type DeleteCompanyDepreciationGroupType = z.infer<typeof DeleteCompanyDepreciationGroupSchema>;

export const AddAssetDepreciationHistorySchema = zfd.formData({
  depGroupId: z.string().min(1, { message: "Depreciation Group Id is required." }),
  assetId: z.coerce.number(),
  sageCompanyId: z.coerce.number(),
  lastValue: z.coerce.number(),
  newValue: z.coerce.number(),
});

export type AddAssetDepreciationHistoryType = z.infer<typeof AddAssetDepreciationHistorySchema>;

export const AddAssetDepreciationHistoryResponseSchema = z.object({
  assetDepHId: z.string(),
  createdDate: z.coerce.date(),
  depGroupId: z.string(),
  assetId: z.coerce.number(),
  sageCompanyId: z.coerce.number(),
  lastValue: z.coerce.number(),
  newValue: z.coerce.number(),
});

export type AssetDepreciationHistoryResponseType = z.infer<typeof AddAssetDepreciationHistoryResponseSchema>;

export const GetSpecificAssetDepreciationHistorySchema = z.object({
  assetid: z.coerce.string(),
});

export type GetSpecificAssetDepreciationHistoryType = z.infer<typeof GetSpecificAssetDepreciationHistorySchema>;

export const GetAllAssetDepreciationHistorySchema = z.object({
  sageCompanyId: z.coerce.number(),
});

export type GetAllAssetDepreciationHistoryType = z.infer<typeof GetAllAssetDepreciationHistorySchema>;
