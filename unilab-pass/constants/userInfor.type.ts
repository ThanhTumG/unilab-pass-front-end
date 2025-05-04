// Core
import { z } from "zod";

// App
import {
  DetailUserInformationFormSchema,
  LabInformationFormSchema,
  PersonalInformationFormSchema,
} from "./userInfor.constant";

// Types
type DetailUserInformationFormType = z.infer<
  typeof DetailUserInformationFormSchema
>;

type PersonalInformationFormType = z.infer<
  typeof PersonalInformationFormSchema
>;

type LabInformationFormType = z.infer<typeof LabInformationFormSchema>;

export type {
  DetailUserInformationFormType,
  PersonalInformationFormType,
  LabInformationFormType,
};
