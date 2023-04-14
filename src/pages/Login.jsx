import React, { useState, useContext, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { UserAuthContext } from "../context/UserAuthContext";
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { LoginAuthSchema } from "../validations/loginAuth";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login, user } = useContext(UserAuthContext);
  const nav = useNavigate();
  const toast = useRef(null);
  const onSubmit = async (values, actions) => {
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: result.message,
        });
        actions.resetForm();
        setTimeout(() => nav("/"), 500);
      } else {
        toast.current.show({
          severity: "warn",
          summary: "Login Error",
          detail: result.message,
        });
      }
    } catch (error) {}
  };

  const { touched, values, errors, handleChange, handleSubmit } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginAuthSchema,
    onSubmit,
  });

  return (
    <>
      <Toast ref={toast} />
      <div className="d-flex justify-content-center">
        <div className="card" style={{ width: "30%", marginTop: "10rem" }}>
          <Card title="Smart Poultry Farm" style={{ textAlign: "center" }}>
            <form onSubmit={handleSubmit}>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div className="mb-4" style={{ width: "90%" }}>
                  <span className="p-float-label">
                    <InputText
                      id="email"
                      value={values.email}
                      onChange={handleChange}
                      style={{ width: "100%" }}
                      className={errors.email && touched.email && "pi-invalid"}
                    />
                    <label htmlFor="email">Email</label>
                  </span>
                  {errors.email && touched.email && (
                    <p className="text-danger">{errors.email}</p>
                  )}
                </div>
                <div className="mb-4" style={{ width: "90%" }}>
                  <span className="p-float-label">
                    <InputText
                      id="password"
                      type="password"
                      value={values.passwword}
                      onChange={handleChange}
                      style={{ width: "100%" }}
                      className={
                        errors.password && touched.password && "pi-invalid"
                      }
                    />
                    <label htmlFor="password">Password</label>
                  </span>
                  {errors.password && touched.password && (
                    <p className="text-danger">{errors.password}</p>
                  )}
                </div>
                <Divider />
                <Button
                  label="Sign in"
                  size="small"
                  type="submit"
                  style={{ minWidth: "45%" }}
                />
              </div>
            </form>
          </Card>
          {/* /.login-card-body */}
        </div>
      </div>
    </>
  );
};

export default Login;
