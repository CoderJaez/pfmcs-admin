import React, { useState, useEffect, useRef, useContext } from "react";
import { ContentLayout, FormLayout } from "../../../shared/components/layouts";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import FarmSchema from "../../../validations/farmSchema";
import { useFormik } from "formik";
import FarmService from "../../../service/farmService";
import { UserAuthContext } from "../../../context/UserAuthContext";
const FarmCard = () => {
  const [farm, setFarm] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useRef(null);
  const { logout, config, toggleToken } = useContext(UserAuthContext);

  const fetchFarm = async () => {
    if (id) {
      // Fetch farm details from the server using the farm ID
      // Example: await FarmService.FindFarm(id, config.current)
      // setFarm(data);
      await FarmService.getFarmById(id, config.current)
        .then((data) => {
          setFarm(data);
          setFieldValue("name", data.name);
          setFieldValue("owner", data.owner);
          setFieldValue("address", data.address);
          setFieldValue("phone", data.phone);
        })
        .catch((err) => {
          if (!err.valid_token) {
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

  const onSubmit = async (value, actions) => {
    if (farm._id) {
      // Update existing farm
      // Example: await FarmService.UpdateFarm(farm._id, value, config.current)
      // Show success message
      await FarmService.putFarm(farm._id, value, config.current)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            setFarm(null);
            actions.resetForm();

            setTimeout(() => {
              window.history.back();
            }, 500);
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
            // setTimeout(() => logout(), 500);
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.message,
            });
          }
        });
    } else {
      await FarmService.postFarm(value, config.current)
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

            console.error(err);
          } else {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.message,
            });
          }
        });
    }
  };

  useEffect(() => {
    toggleToken();
    fetchFarm();
  }, []);

  const {
    touched,
    values,
    errors,
    handleChange,
    isSubmitting,
    handleSubmit,
    setFieldValue,
    setFieldError,
  } = useFormik({
    initialValues: {
      name: "",
      owner: "",
      address: "",
      phone: "",
    },
    validationSchema: FarmSchema,
    onSubmit,
  });

  return (
    <ContentLayout title="Farm" subtitle="Farm details" className="p-3">
      <FormLayout
        className="p-3"
        onSubmit={onSubmit}
        title="Farm Details"
        handleSubmit={handleSubmit}
        onHide={() => window.history.back()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className=" mt-2">
            <InputText
              id="name"
              name="name"
              style={{ width: "50%" }}
              value={values.name}
              placeholder="Farm Name"
              onChange={handleChange}
            />
            {errors.name && touched.name ? (
              <div>
                <small className="text-danger">{errors.name}</small>
              </div>
            ) : null}
          </div>
          <div className="md:col-6 mt-2">
            <InputText
              id="owner"
              style={{ width: "50%" }}
              name="owner"
              onChange={handleChange}
              value={values.owner}
              placeholder="Owner Name"
            />
            {errors.owner && touched.owner ? (
              <div>
                <small className="text-danger">{errors.owner}</small>
              </div>
            ) : null}
          </div>

          <div className=" md:col-6 mt-2">
            <InputText
              id="address"
              style={{ width: "50%" }}
              name="address"
              value={values.address}
              onChange={handleChange}
              placeholder="Address"
            />
            {errors.address && touched.address ? (
              <div>
                <small className="text-danger">{errors.address}</small>
              </div>
            ) : null}
          </div>
          <div className=" md:col-6 mt-2">
            <InputText
              id="phone"
              style={{ width: "50%" }}
              name="phone"
              value={values.phone}
              onChange={handleChange}
              placeholder="Phone number"
            />
            {errors.phone && touched.phone ? (
              <div>
                <small className="text-danger ">{errors.phone}</small>
              </div>
            ) : null}
          </div>
        </div>
        <Button
          label="Save"
          type="submit"
          className="mt-3"
          style={{ width: "50%" }}
        />
      </FormLayout>
      <Toast ref={toast} position="top-right" />
    </ContentLayout>
  );
};

export default FarmCard;
