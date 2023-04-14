import React, { useState, useEffect, useRef, useContext } from "react";
import { Button } from "primereact/button";
import { ColorPicker } from "primereact/colorpicker";
import { useFormik } from "formik";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { FormLayout } from "../../../shared/components/layouts";
import { InputNumber } from "primereact/inputnumber";
import { ParamsThresholdSchema } from "../../../validations/threshold";
import { Editor } from "primereact/editor";
import { ParamsThresholdService } from "../../../service/thresholdService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "../../../context/UserAuthContext";

const ParamsThresholdCard = () => {
  const [threshold, setThreshold] = useState(null);
  const [edit, setEdit] = useState(false);
  const { id } = useParams();
  const toast = useRef(null);
  const navigate = useNavigate();
  const [suffix, setSuffix] = useState("");
  const { config, toggleToken } = useContext(UserAuthContext);

  const onSubmit = (values, actions) => {
    if (threshold && threshold._id !== undefined) {
      const updatedThreshold = { ...threshold, ...values };
      try {
        ParamsThresholdService.updateThreshold(updatedThreshold, config.current)
          .then((res) => {
            if (res.success) {
              toast.current.show({
                severity: "success",
                summarry: "Success",
                detail: res.message,
              });
              actions.resetForm();
            } else {
              const ErrorMessage = res.ErrorMessage;
              ErrorMessage.forEach((err) => {
                setFieldError(err.field, err.message);
              });
            }
          })
          .catch((err) => {
            if (err.type === "TypeError") {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: err.message,
              });
            } else {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: err.message,
              });
            }
          });
      } catch (error) {
        toast.current.show({
          severity: "danger",
          summarry: "Error",
          detail: error.message,
        });
      }
    } else {
      try {
        ParamsThresholdService.insertThreshold(values, config.current)
          .then((res) => {
            if (res.success) {
              toast.current.show({
                severity: "success",
                summarry: "Success",
                detail: res.message,
              });
              actions.resetForm();
            } else {
              console.log("Error:", res);
              const ErrorMessage = res.ErrorMessage;
              ErrorMessage.forEach((err) => {
                setFieldError(err.field, err.message);
              });
            }
          })
          .catch((err) => {
            if (err.type === "TypeError") {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: err.message,
              });
            } else {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: err.message,
              });
            }
          });
      } catch (error) {
        toast.current.show({
          severity: "danger",
          summarry: "Error",
          detail: error.message,
        });
      }
    }
  };

  const {
    errors,
    values,
    actions,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  } = useFormik({
    initialValues: {
      name: "",
      color: "",
      category: "",
      label: "",
      min_value: "",
      max_value: "",
      recommendation: "",
      effects: "",
    },
    validationSchema: ParamsThresholdSchema,
    onSubmit,
  });

  useEffect(() => {
    switch (values.category) {
      case "Temperature":
        setSuffix("℃");
        break;
      case "Humidity":
        setSuffix("%");
        break;
      case "Ammonia":
        setSuffix("PPM");
        break;
      default:
        setSuffix("");
        break;
    }
  }, [values.category]);

  useEffect(() => {
    toggleToken();
    if (id) {
      ParamsThresholdService.getThreshold(id, "", config.current)
        .then((data) => {
          setThreshold(data);
          const _threshold = data;
          setFieldValue("name", _threshold.name);
          setFieldValue("color", _threshold.color);
          setFieldValue("category", _threshold.category);
          setFieldValue("label", _threshold.label.toLowerCase());
          setFieldValue("min_value", _threshold.min_value);
          setFieldValue("max_value", _threshold.max_value);
          setFieldValue("recommendation", _threshold.recommendation);
          setFieldValue("effects", _threshold.effects);
        })
        .catch((err) =>
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.message,
          }),
        );
    }
  }, []);

  const categories = [
    { name: "Temperature", value: "Temperature" },
    { name: "Humidity", value: "Humidity" },
    { name: "Ammonia", value: "Ammonia" },
  ];

  const labels = [
    { name: "Low", value: "low" },
    { name: "Normal", value: "normal" },
    { name: "High", value: "high" },
    { name: "Critical", value: "critical" },
  ];
  return (
    <>
      <FormLayout
        title="Parameter Threshold Details"
        handleSubmit={handleSubmit}
      >
        <Toast ref={toast} />
        <div className="d-flex justify-content-end">
          <Button
            label="Save"
            type="submit"
            loading={isSubmitting}
            severity="success"
            style={{ marginRight: "1.2rem" }}
          />
          <Button
            label="Cancel"
            type="button"
            severity="secondary"
            outlined
            onClick={() => {
              resetForm();
              navigate("/settings/parameter-thresholds");
            }}
          />
        </div>
        <div className="row">
          <div className="col-md-4">
            <div>
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ width: "100%" }}
                className={
                  errors.name && touched.name ? `p-invalid  w-full` : ""
                }
              />

              {errors.name && touched.name && (
                <p className="text-danger">{errors.name}</p>
              )}
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <label htmlFor="category">Category</label>
              <Dropdown
                id="category"
                value={values.category}
                onChange={handleChange}
                onBlur={handleBlur}
                options={categories}
                optionLabel="name"
                placeholder="Select a Category"
                // className="w-full md:w-14rem"
                style={{ width: "100%" }}
                className={
                  errors.category && touched.category ? `p-invalid` : ""
                }
              />
              {errors.category && touched.category && (
                <p className="text-danger">{errors.category}</p>
              )}
            </div>

            <div style={{ marginTop: "1.2rem" }}>
              <label htmlFor="label">Label</label>
              <Dropdown
                id="label"
                value={values.label}
                onChange={handleChange}
                onBlur={handleBlur}
                options={labels}
                optionLabel="name"
                placeholder="Select a label"
                // className="w-full md:w-14rem"
                style={{ width: "100%" }}
                className={errors.label && touched.label ? `p-invalid` : ""}
              />
              {errors.label && touched.label && (
                <p className="text-danger">{errors.label}</p>
              )}
            </div>
            <div
              className="d-flex flex-column"
              style={{
                marginTop: "1.2rem",
              }}
            >
              <label htmlFor="cp-hex">HEX</label>

              <ColorPicker
                inputId="color"
                id="color"
                name="color"
                format="hex"
                value={values.color}
                onChange={handleChange}
                className="mb-3"
                inline
              />
              <span style={{ color: `#${values.color}` }}>
                Hex: #{values.color}
              </span>

              <InputText
                id="color"
                name="color"
                value={values.color}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.color && touched.color ? `p-invalid` : ""}
              />
              {errors.color && touched.color && (
                <p className="text-danger">{errors.color}</p>
              )}
            </div>

            <div style={{ marginTop: "1.2rem" }}>
              <label htmlFor="min_value">Min Value</label>
              <InputNumber
                id="min_value"
                name="min_value"
                useGrouping={false}
                value={values.min_value}
                onValueChange={handleChange}
                onBlur={handleBlur}
                suffix={suffix}
                style={{ width: "100%" }}
                className={
                  errors.min_value && touched.min_value
                    ? `p-invalid  w-full`
                    : ""
                }
              />

              {errors.min_value && touched.min_value && (
                <p className="text-danger">{errors.min_value}</p>
              )}
            </div>
            <div style={{ marginTop: "1.2rem" }}>
              <label htmlFor="max_value">Max Value</label>
              <InputNumber
                id="max_value"
                name="max_value"
                onBlur={handleBlur}
                useGrouping={false}
                value={values.max_value}
                onValueChange={handleChange}
                style={{ width: "100%" }}
                suffix={suffix}
                className={
                  errors.max_value && touched.max_value
                    ? `p-invalid  w-full`
                    : ""
                }
              />

              {errors.max_value && touched.max_value && (
                <p className="text-danger">{errors.max_value}</p>
              )}
            </div>
          </div>
          <div className="col-md-8">
            <label htmlFor="recommendation">Recommendation</label>
            <Editor
              name="recommendation"
              id="recommendation"
              type=""
              value={values.recommendation}
              onTextChange={(e) => setFieldValue("recommendation", e.htmlValue)}
              style={{ height: "320px" }}
            />
            {errors.recommendation && touched.recommendation && (
              <p className="text-danger">{errors.recommendation}</p>
            )}

            <label htmlFor="recommendation">Effects</label>
            <Editor
              id="effects"
              name="effects"
              value={values.effects}
              onTextChange={(e) => setFieldValue("effects", e.htmlValue)}
              style={{ height: "320px" }}
            />
            {errors.effects && touched.effects && (
              <p className="text-danger">{errors.effects}</p>
            )}
          </div>
        </div>
      </FormLayout>
    </>
  );
};

export default ParamsThresholdCard;
