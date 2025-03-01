// // Core
// import dayjs from "dayjs";
// import { z } from "zod";

// // Methods

// // Form schemas
// // Event
// const EventFormSchema = z.object({
//   name: z
//     .string()
//     .trim()
//     .min(1, {
//       message: "Name is required",
//     })
//     .max(100, { message: "Name is too long" })
//     .regex(/^[\p{L}]+(?:\s[\p{L}]+)*$/u, {
//       message: "Name must not contain special character",
//     }),
//   timeRange: z
//   .object({
//     startTime: z
//       .string()
//       .min(1, {
//         message: "Password is required",
//       })
//       .min(8, { message: "Password must be at least 8 characters" })
//       .regex(/^\S*$/, { message: "No white space in password" }),
//     EndTime: z.string().min(1, {
//       message: "Confirm Password is required",
//     }),
//   })
//   .refine((value) => value.confirm === value.default, {
//     message: "Password & Confirm Password do not match",
//     path: ["confirm"],
//   }),
// });

// // Lab information
// const LabInformationFormSchema = z.object({
//   labName: z
//     .string()
//     .trim()
//     .min(1, {
//       message: "Lab name is required",
//     })
//     .max(100, { message: "Name is too long" }),
//   location: z.string(),
// });

// // Default form values
// const DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES: z.infer<
//   typeof DetailUserInformationFormSchema
// > = {
//   fullName: "",
//   email: "",
//   id: "",
//   gender: "",
//   birth: "",
//   permission: true,
// };

// const DEFAULT_LAB_INFORMATION_FORM_VALUES: z.infer<
//   typeof LabInformationFormSchema
// > = {
//   labName: "",
//   location: "",
// };

// export {
//   DetailUserInformationFormSchema,
//   LabInformationFormSchema,
//   DEFAULT_DETAIL_USER_INFORMATION_FORM_VALUES,
//   DEFAULT_LAB_INFORMATION_FORM_VALUES,
// };
