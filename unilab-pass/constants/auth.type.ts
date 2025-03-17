// Core
import { z } from "zod";

// App
import {
  LoginFormSchema,
  SignupFormSchema,
  ForgotPasswordFormSchema,
  ChangePasswordFormSchema,
  VerifyPasswordFormSchema,
} from "./auth.constant";

// Types
type LoginFormType = z.infer<typeof LoginFormSchema>;
type SignupFormType = z.infer<typeof SignupFormSchema>;
type ForgotPasswordFormType = z.infer<typeof ForgotPasswordFormSchema>;
type ChangePasswordFormType = z.infer<typeof ChangePasswordFormSchema>;
type VerifyPasswordFormType = z.infer<typeof VerifyPasswordFormSchema>;

export type {
  LoginFormType,
  SignupFormType,
  ForgotPasswordFormType,
  ChangePasswordFormType,
  VerifyPasswordFormType,
};
