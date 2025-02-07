// Core
import { z } from "zod";

// App
import { LoginFormSchema, SignupFormSchema } from "./auth.constant";

// Types
type LoginFormType = z.infer<typeof LoginFormSchema>;
type SignupFormType = z.infer<typeof SignupFormSchema>;

export type { LoginFormType, SignupFormType };
