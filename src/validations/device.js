import * as yup from "yup";

export const DeviceSchema = new yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(5, "The name must be at least 5 characters"),
});
