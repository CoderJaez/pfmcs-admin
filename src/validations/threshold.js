import * as yup from "yup";

export const ParamsThresholdSchema = yup.object({
  name: yup.string().required("Name is required"),
  color: yup
    .string()
    .required("Color is required")
    .max(6, "Color hex must not exceed to 6 characters"),
  category: yup.string().required(),
  label: yup.string().required(),
  min_value: yup
    .number("Min value must be a numbers")
    .required("Min value is required")
    .min(0, "Min value must not be lower than 0"),
  max_value: yup
    .number("Max value must be a number")
    .required("Max value is required")
    .min(0, "Max value must not be lower than 0"),
});
