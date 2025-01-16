// Core
import { z } from "zod";

// Form schemas
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

// Default form values
const DEFAULT_LOGIN_FORM_VALUES: z.infer<typeof LoginFormSchema> = {
  email: "",
  password: "",
} as const;

export { LoginFormSchema, DEFAULT_LOGIN_FORM_VALUES };
