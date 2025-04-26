// Core
import dayjs from "dayjs";
import { z } from "zod";

// Methods

// Form schemas
// Event
const EventFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, {
      message: "Name is required",
    })
    .max(100, { message: "Name is too long" }),
  timeRange: z.object({
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    startHour: z.string().optional(),
    endHour: z.string().optional(),
  }),
});

// Default form values
const DEFAULT_EVENT_FORM_VALUES: z.infer<typeof EventFormSchema> = {
  name: "",
  timeRange: {
    startDate: undefined,
    endDate: undefined,
    startHour: undefined,
    endHour: undefined,
  },
};

export { EventFormSchema, DEFAULT_EVENT_FORM_VALUES };
