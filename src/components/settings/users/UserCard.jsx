import React, { useState, useEffect, useRef, useContext } from "react";
import { ContentLayout, FormLayout } from "../../../shared/components/layouts";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { UserAuthContext } from "../../../context/UserAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { UserService } from "../../../service/userService";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { useFormik } from "formik";
import { UserSchema } from "../../../validations/user";
const UserCard = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { logout, config, toggleToken } = useContext(UserAuthContext);
  const { id } = useParams();
  const toast = useRef(null);

  const fetchUser = async () => {
    if (id) {
      await UserService.FindUser(id, config.current)
        .then((data) => {
          setUser(data);
          setFieldValue("firstname", data.firstname);
          setFieldValue("lastname", data.lastname);
          setFieldValue("email", data.email);
          setFieldValue("roles", data.roles);
        })
        .catch((err) => {
          if (!valid_token) {
            toast.current.show({
              severity: "warn",
              summary: "Unauthorized",
              detail: err.message,
            });
            setTimeout(() => logout(), 500);
          }
        });
    }
  };

  useEffect(() => {
    toggleToken();
    fetchUser();
  }, []);
  const onSubmit = async (values, actions) => {
    if (user._id) {
      const updateUser = { ...user, ...values };
      await UserService.UpdateUser(updateUser, config.current)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
          }
        })
        .catch((err) => {
          if (!err.valid_token) {
            toast.current.show({
              severity: "warn",
              summary: "Unauthorized",
              detail: err.message,
            });
            setTimeout(() => {
              logout();
            }, 500);
          } else {
            toast.current.show({
              severity: "warn",
              summary: "Error",
              detail: err.message,
            });
          }
        });
    } else {
      await UserService.NewUser(values, config.current)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });

            actions.resetForm();
          } else {
            res.ErrorMessage.forEach((err) => {
              setFieldError(err.field, err.message);
            });
          }
        })
        .catch((err) => {
          if (!err.valid_token) {
            toast.current.show({
              severity: "warn",
              summary: "Unauthorized",
              detail: err.message,
            });
            setTimeout(() => {
              logout();
            }, 500);
          }
        });
    }
  };

  const {
    touched,
    values,
    errors,
    handleChange,
    isSubmitting,
    handleSubmit,
    setFieldValue,
    setFieldError,
    handleBlur,
  } = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      roles: "",
    },
    validationSchema: UserSchema,
    onSubmit,
  });

  const routeBack = () => {
    navigate("/settings/users");
  };
  const roles = [
    { label: "Admin", value: "ADMIN" },
    { label: "Encoder", value: "ENCODER" },
  ];
  return (
    <ContentLayout>
      <Toast ref={toast} />
      <div className="d-flex justify-content-center">
        <FormLayout
          size="50rem"
          title="Account Details"
          header_style="card-primary"
          onHide={routeBack}
          handleSubmit={handleSubmit}
        >
          <div className="d-flex justify-content-center">
            <div className="d-flex flex-column ">
              <label htmlFor="firsname">Firstname</label>
              <InputText
                id="firstname"
                name="firstname"
                value={values.firstname}
                onChange={handleChange}
                style={{ width: "30rem" }}
                onBlur={handleBlur}
                className={
                  errors.firstname && touched.firstname
                    ? "p-inputtext-sm  p-invalid"
                    : "p-inputtext-sm"
                }
              />
              {errors.firstname && touched.firstname ? (
                <small className="text-danger">{errors.firstname}</small>
              ) : null}
              <label htmlFor="lastname">Lastname</label>
              <InputText
                name="lastname"
                id="lastname"
                style={{ width: "30rem" }}
                value={values.lastname}
                onChange={handleChange}
                className={
                  errors.lastname && touched.lastname
                    ? "p-inputtext-sm  p-invalid"
                    : "p-inputtext-sm"
                }
              />
              {errors.lastname && touched.lastname ? (
                <small className="text-danger">{errors.lastname}</small>
              ) : null}
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                name="email"
                style={{ width: "30rem" }}
                value={values.email}
                onChange={handleChange}
                className={
                  errors.email && touched.email
                    ? "p-inputtext-sm  p-invalid"
                    : "p-inputtext-sm"
                }
              />
              {errors.email && touched.email ? (
                <small className="text-danger">{errors.email}</small>
              ) : null}

              <label htmlFor="roles">Roles</label>
              <Dropdown
                name="roles"
                options={roles}
                placeholder="Select role"
                style={{ width: "30rem" }}
                value={values.roles}
                onChange={handleChange}
                className={
                  errors.roles && touched.roles
                    ? "p-inputtext-sm  p-invalid"
                    : "p-inputtext-sm"
                }
              />
              {errors.roles && touched.roles ? (
                <small className="text-danger">{errors.roles}</small>
              ) : null}
            </div>
          </div>

          <Divider />
          <div className="d-flex justify-content-center">
            <Button
              label="Save"
              size="small"
              loading={isSubmitting}
              style={{ width: "25rem" }}
              type="submit"
            />
          </div>
        </FormLayout>
      </div>
    </ContentLayout>
  );
};

export default UserCard;
