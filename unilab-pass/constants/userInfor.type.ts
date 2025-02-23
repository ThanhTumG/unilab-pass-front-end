// Core
import { z } from "zod";

// App
import {
  DetailUserInformationFormSchema,
  LabInformationFormSchema,
} from "./userInfor.constant";

// Types
type DetailUserInformationFormType = z.infer<
  typeof DetailUserInformationFormSchema
>;

type LabInformationFormType = z.infer<typeof LabInformationFormSchema>;

export type { DetailUserInformationFormType, LabInformationFormType };
