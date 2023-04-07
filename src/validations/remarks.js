import * as yup from "yup";

export const RemarkSchema = new yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(5, "Name must at least 5 characters"),
  category: yup.string().required("Category is required"),
});
