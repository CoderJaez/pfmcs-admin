import * as yup from "yup";

export const LoginAuthSchema = new yup.object({
  email: yup.string().required("Email is required").email("Invalid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must at least 8 characters"),
});
