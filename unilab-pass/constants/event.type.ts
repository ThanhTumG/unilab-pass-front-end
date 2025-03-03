// Core
import { z } from "zod";

// App
import { EventFormSchema } from "./event.constant";

// Types
type EventFormType = z.infer<typeof EventFormSchema>;

export type { EventFormType };
