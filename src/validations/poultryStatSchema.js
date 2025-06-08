import * as yup from "yup";

const PoultryStatSchema = yup.object({
  createdAt: yup.date().required("Date is required"),
  farm: yup.string().required("Farm is required"),
  type: yup.string().required("Type is required"),
  value: yup
    .number()
    .required("Quantity is required")
    .positive("Quantity must be a positive number"),
});

export default PoultryStatSchema;
