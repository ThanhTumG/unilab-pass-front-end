// Core
import { TypeOf, z } from "zod";

// Form schemas
// Login form
const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, {
      message: "Password must be at least 8 characters",
    })
    .regex(/^\S*$/, { message: "No white space in password" }),
});

// Signup form
const SignupFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z
    .object({
      default: z
        .string()
        .min(1, {
          message: "Password is required",
        })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^\S*$/, { message: "No white space in password" }),
      confirm: z.string().min(1, {
        message: "Confirm Password is required",
      }),
    })
    .refine((value) => value.confirm === value.default, {
      message: "Password & Confirm Password do not match",
      path: ["confirm"],
    }),
  fullName: z
    .string()
    .trim()
    .min(1, {
      message: "Name is required",
    })
    .regex(/^[\p{L}]+(?:\s[\p{L}]+)*$/u, {
      message: "Name must not contain special character",
    }),
  // .refine(
  //   (fullName) => {
  //     return fullName.split(" ").length >= 2;
  //   },
  //   {
  //     message: 'Vui lòng nhập đầy đủ "Họ" và "Tên" (VD: Nguyễn A)',
  //   }
  // ),
});

// Default form values
const DEFAULT_LOGIN_FORM_VALUES: z.infer<typeof LoginFormSchema> = {
  email: "",
  password: "",
} as const;

const DEFAULT_SIGNUP_FORM_VALUES: z.infer<typeof SignupFormSchema> = {
  email: "",
  fullName: "",
  password: { default: "", confirm: "" },
};

const OTP_EXPIRED_DURATION_MILLISECONDS = 1000 * 60; // 1 min

export {
  LoginFormSchema,
  SignupFormSchema,
  DEFAULT_LOGIN_FORM_VALUES,
  DEFAULT_SIGNUP_FORM_VALUES,
  OTP_EXPIRED_DURATION_MILLISECONDS,
};
