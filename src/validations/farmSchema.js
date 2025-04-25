import * as yup from "yup";

const FarmSchema = yup.object({
  name: yup.string().required("Farm name is required"),
  owner: yup.string().required("Owner is required"),
  address: yup.string().required("Address is required"),
});

export default FarmSchema;
