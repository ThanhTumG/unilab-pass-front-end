// Core
import { z } from "zod";

// App
import { LoginFormSchema } from "./auth.constant";

// Types
type LoginFormType = z.infer<typeof LoginFormSchema>;

export type { LoginFormType };
