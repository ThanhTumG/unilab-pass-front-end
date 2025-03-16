// Core
import { z } from "zod";

// Form schemas
// Login form
const LoginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }),
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
    .max(100, { message: "Name is too long" })
    .regex(/^[\p{L}]+(?:\s[\p{L}]+)*$/u, {
      message: "Name must not contain special character",
    }),
});

// Forgot password form
const ForgotPasswordFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your registered email" })
    .email({ message: "Invalid email" }),
});

// Change password form
const ChangePasswordFormSchema = z.object({
  password: z
    .object({
      oldPassword: z

        .string()
        .min(1, {
          message: "Password is required",
        })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^\S*$/, { message: "No white space in password" }),
      newPassword: z
        .string()
        .min(1, {
          message: "Password is required",
        })
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/^\S*$/, { message: "No white space in password" }),
    })
    .refine((value) => value.oldPassword !== value.newPassword, {
      message: "New password cannot be same as old password",
      path: ["newPassword"],
    }),
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

const DEFAULT_FORGOT_PASSWORD_FORM_VALUES: z.infer<
  typeof ForgotPasswordFormSchema
> = {
  email: "",
};

const DEFAULT_CHANGE_PASSWORD_FORM_VALUES: z.infer<
  typeof ChangePasswordFormSchema
> = {
  password: {
    oldPassword: "",
    newPassword: "",
  },
};
const OTP_EXPIRED_DURATION_MILLISECONDS = 5000 * 60; // 5 mins

export {
  LoginFormSchema,
  SignupFormSchema,
  ForgotPasswordFormSchema,
  ChangePasswordFormSchema,
  DEFAULT_LOGIN_FORM_VALUES,
  DEFAULT_SIGNUP_FORM_VALUES,
  OTP_EXPIRED_DURATION_MILLISECONDS,
  DEFAULT_FORGOT_PASSWORD_FORM_VALUES,
  DEFAULT_CHANGE_PASSWORD_FORM_VALUES,
};
