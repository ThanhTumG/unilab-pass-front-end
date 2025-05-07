// Core
import { z } from "zod";

// Form schemas
// Detail user information
const DetailUserInformationFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, {
      message: "Name is required",
    })
    .max(100, { message: "Name is too long" })
    .regex(/^[\p{L}]+(?:\s[\p{L}]+)*$/u, {
      message: "Name must not contain special character",
    }),
  id: z
    .string()
    .min(7, { message: "ID must be at least 7 characters long" })
    .max(10, { message: "ID cannot exceed 10 characters" })
    .regex(/^[a-zA-Z0-9]+$/, "ID must not contain special character"),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  birth: z.string().min(1, { message: "Birth is required" }),
});

// Personal information
const PersonalInformationFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, {
      message: "Name is required",
    })
    .max(100, { message: "Name is too long" })
    .regex(/^[\p{L}]+(?:\s[\p{L}]+)*$/u, {
      message: "Name must not contain special character",
    }),
});

// Lab information
const LabInformationFormSchema = z.object({
  labName: z
    .string()
    .trim()
    .min(1, {
      message: "Lab name is required",
    })
    .max(100, { message: "Name is too long" }),
  location: z.string(),
});

// Default form values
const DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES: z.infer<
  typeof DetailUserInformationFormSchema
> = {
  fullName: "",
  email: "",
  id: "",
  gender: "",
  birth: "",
};

const DEFAULT_PERSONAL_INFORMATION_FORM_VALUE: z.infer<
  typeof PersonalInformationFormSchema
> = {
  fullName: "",
};

const DEFAULT_LAB_INFORMATION_FORM_VALUES: z.infer<
  typeof LabInformationFormSchema
> = {
  labName: "",
  location: "",
};

export {
  DetailUserInformationFormSchema,
  PersonalInformationFormSchema,
  LabInformationFormSchema,
  DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES,
  DEFAULT_PERSONAL_INFORMATION_FORM_VALUE,
  DEFAULT_LAB_INFORMATION_FORM_VALUES,
};
