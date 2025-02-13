// Core
import { z } from "zod";

// App
import { DetailUserInformationFormSchema } from "./userInfor.constant";

// Types
type DetailUserInformationFormType = z.infer<
  typeof DetailUserInformationFormSchema
>;

export type { DetailUserInformationFormType };
