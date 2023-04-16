import * as yup from "yup";

export const DeviceStreamSchema = new yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(5, "Name must at least 5 characters"),
  type: yup.string().required("Type is required"),
  min_value: yup
    .number("Min value must be a number")
    .required("Min value is required"),
  max_value: yup
    .number("Max value must be a number")
    .required("Max value is required"),
  sensor_type: yup.string().required("Sensor type is required"),
  vpin: yup.string().required("Virtual pin is required"),
});
