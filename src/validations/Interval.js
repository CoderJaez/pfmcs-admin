import * as yup from "yup";

export const IntervalSchema = new yup.object({
  interval: yup.string().required("Interval is required"),
  value: yup.number().required("Value is required"),
});
