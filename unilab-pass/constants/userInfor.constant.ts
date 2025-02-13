// Core
import dayjs from "dayjs";
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
    .regex(/^[\p{L}]+(?:\s[\p{L}]+)*$/u, {
      message: "Name must not contain special character",
    }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  gender: z.enum(["Male", "Female"]),
  birth: z.coerce.date().optional(),
  phone: z
    .string()
    .min(1, {
      message: "Phone is required",
    })
    .length(10, {
      message: "Invalid phone number",
    })
    .regex(/^\d{10}$/, { message: "Invalid phone number" }),
  permission: z.boolean(),
});

// Default form values
const DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES: z.infer<
  typeof DetailUserInformationFormSchema
> = {
  fullName: "",
  email: "",
  gender: "Male",
  phone: "",
  birth: dayjs().toDate(),
  permission: true,
};

export {
  DetailUserInformationFormSchema,
  DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES,
};
