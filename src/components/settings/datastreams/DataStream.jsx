import React, { useState, useEffect, useRef, useContext } from "react";
import { useFormik } from "formik";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DeviceStreamSchema } from "../../../validations/dataStream";
import { DataStreamService } from "../../../service/dataStreamService";
import { Toast } from "primereact/toast";
import { UserAuthContext } from "../../../context/UserAuthContext";
const DataStream = ({
  dataStream,
  showDialog,
  setShowDialog,
  deviceId,
  setDatastreams,
}) => {
  const { config } = useContext(UserAuthContext);
  useEffect(() => {
    if (dataStream.name) {
      setFieldValue("name", dataStream.name);
      setFieldValue("vpin", dataStream.vpin);
      setFieldValue("type", dataStream.type);
      setFieldValue("sensor_type", dataStream.sensor_type);
      setFieldValue("min_value", dataStream.min_value);
      setFieldValue("max_value", dataStream.max_value);
    }
  }, [dataStream.name]);
  let vpins = [];
  for (let index = 0; index < 50; index++) {
    vpins.push(`V${index}`);
  }
  const sensor_types = [
    "Temperature",
    "Humidity",
    "Ammonia",
    "Water Level",
    "None",
  ];
  const toast = useRef(null);

  const onSubmit = async (values, actions) => {
    if (dataStream._id) {
      await DataStreamService.putData(values, dataStream._id, config.current)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            actions.resetForm();
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      values["device"] = deviceId;
      await DataStreamService.postData(values, config.current)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            setDatastreams();
            actions.resetForm();
          } else {
            res.ErrorMessage.forEach((err) => {
              setFieldError(err.field, err.message);
            });
          }
        })
        .catch((err) => console.error(err.message));
    }
  };
  const {
    values,
    errors,
    handleBlur,
    isSubmitting,
    handleChange,
    touched,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  } = useFormik({
    initialValues: {
      name: "",
      vpin: "",
      type: "",
      sensor_type: "",
      min_value: "",
      max_value: "",
    },
    validationSchema: DeviceStreamSchema,
    onSubmit,
  });

  const DialogFooter = () => {
    return (
      <div className="d-flex justify-content-end">
        <Button
          label="Save"
          icon="pi pi-check"
          size="small"
          type="Submit"
          loading={isSubmitting}
          style={{ width: "100px", marginRight: "10px" }}
        />
        <Button
          label="Cancel"
          onClick={() => {
            resetForm();
            setShowDialog(false);
          }}
          icon="pi pi-times"
          severity="danger"
          outlined
          size="small"
          style={{ width: "100px" }}
        />
      </div>
    );
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Datastream details"
        visible={showDialog}
        onHide={() => {
          resetForm();
          setShowDialog(false);
        }}
        style={{ width: "50vw" }}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className={
                errors.name && touched.name
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="name"
              value={values.name}
              placeholder="Enter datastream name"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name && (
              <p className="text-danger">{errors.name}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="vpin">Virtual Pin:</label>
            <select
              type="text"
              className={
                errors.vpin && touched.vpin
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="vpin"
              value={values.vpin}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Virtual Pin</option>
              {vpins.map((vpin) => (
                <option key={vpin} value={vpin}>
                  {vpin}
                </option>
              ))}
            </select>
            {errors.vpin && touched.vpin && (
              <p className="text-danger">{errors.vpin}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="name">Type:</label>
            <select
              type="text"
              className={
                errors.type && touched.type
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="type"
              value={values.type}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select type</option>
              <option value="sensor">sensor</option>
              <option value="switch">switch</option>
            </select>
            {errors.type && touched.type && (
              <p className="text-danger">{errors.type}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="sensor_type">Sensor type</label>
            <select
              className={
                errors.sensor_type && touched.sensor_type
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="sensor_type"
              value={values.sensor_type}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select Sensor type</option>
              {sensor_types.map((sensor) => (
                <option key={sensor} value={sensor}>
                  {sensor}
                </option>
              ))}
            </select>

            {errors.sensor_type && touched.sensor_type && (
              <p className="text-danger">{errors.sensor_type}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="default_value">Min value:</label>
            <input
              type="number"
              className={
                errors.min_value && touched.min_value
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="min_value"
              name="min_value"
              value={values.min_value}
              placeholder="Enter min value"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.min_value && touched.min_value && (
              <p className="text-danger">{errors.min_value}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="default_value">Max value:</label>
            <input
              type="number"
              className={
                errors.max_value && touched.max_value
                  ? "form-control is-invalid"
                  : "form-control"
              }
              id="max_value"
              name="max_value"
              value={values.max_value}
              placeholder="Enter Max value"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.max_value && touched.max_value && (
              <p className="text-danger">{errors.max_value}</p>
            )}
          </div>
          <DialogFooter />
        </form>
      </Dialog>
    </>
  );
};

export default DataStream;
