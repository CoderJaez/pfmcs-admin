import * as yup from "yup";

export const UserSchema = yup.object({
  firstname: yup.string().required("Firstname is required"),
  lastname: yup.string().required("Lastname is required"),
  email: yup.string().required("Email is required").email("Invalid email"),
  farm: yup.string().optional("Farm is optional"),
  roles: yup.string().required("Roles is required"),
});
