import React, { useState, useRef, useEffect, useContext } from "react";
import { ContentLayout, CardLayout } from "../../shared/components/layouts";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { UserAuthContext } from "../../context/UserAuthContext";
import { ThresholdContext } from "../../context/thresholdContext";
import { IntervalSchema } from "../../validations/Interval";
import { RecommendationInterval } from "../../service/recommendationInterval";
import { useFormik } from "formik";
const Recommendation = () => {
  const [edit, setEdit] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const { config, toggleToken } = useContext(UserAuthContext);
  const { intervalRef } = useContext(ThresholdContext);
  const toast = useRef(null);

  const fetchData = async () => {
    await RecommendationInterval.FindRecommendation(config.current)
      .then((data) => {
        setRecommendation(data);
      })
      .catch((err) => console.error(err.message));
  };

  useEffect(() => {
    toggleToken();
    fetchData();
  }, []);

  const onSubmit = async (values, actions) => {
    if (recommendation) {
      const updateRecommendation = { ...recommendation, ...values };
      await RecommendationInterval.UpdateRecommendation(
        updateRecommendation,
        config.current,
      )
        .then((data) => {
          setRecommendation(updateRecommendation);
          intervalRef.current = data.millis_value;

          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
          });
          setEdit(false);
        })
        .then((err) => {
          if (!err.valid_token) {
            toast.current.show({
              severity: "warn",
              summary: "Unauthorized",
              detail: err.message,
            });
          }
        });
    } else {
      await RecommendationInterval.NewRecommendation(values, config.current)
        .then((data) => {
          setRecommendation(data.data);
          intervalRef.current = data.data.millis_value;

          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: data.message,
          });
        })
        .then((err) => {
          if (!err.valid_token) {
            toast.current.show({
              severity: "warn",
              summary: "Unauthorized",
              detail: err.message,
            });
          }
        });
    }
  };

  const {
    touched,
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
  } = useFormik({
    initialValues: {
      interval: "",
      value: "",
    },
    validationSchema: IntervalSchema,
    onSubmit,
  });

  const intervals = [
    { name: "Hours", value: "hour" },
    { name: "Minutes", value: "minute" },
    { name: "Seconds", value: "second" },
  ];

  return (
    <ContentLayout contentTitle="Recommendation Intervals">
      <CardLayout title="Interval details" header_style="card-primary">
        <Toast ref={toast} />
        {edit ? (
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-end">
              <Button
                icon="pi pi-file"
                label="Save"
                severity="success"
                size="small"
                className="mr-2"
                type="submit"
              />
              <Button
                label="Cancel"
                severity="warning"
                size="small"
                outlined
                onClick={() => setEdit(false)}
              />
            </div>
            <Divider />
            <div className="d-flex flex-column">
              <label htmlFor="interval">Interval</label>
              <Dropdown
                id="interval"
                name="interval"
                value={values.interval}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Select Interval"
                options={intervals}
                optionLabel="name"
                style={{ width: "15rem" }}
                className={
                  errors.interval && touched.interval ? "p-invalid" : ""
                }
              />
              {errors.interval && touched.interval ? (
                <p className="text-danger">{errors.interval}</p>
              ) : null}

              <label htmlFor="value">Value</label>
              <InputText
                name="value"
                id="value"
                keyfilter="num"
                value={values.value}
                placeholder="Enter value"
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.value && touched.value ? "p-invalid" : ""}
                style={{ width: "15rem" }}
              />
              {errors.value && touched.value ? (
                <p className="text-danger">{errors.value}</p>
              ) : null}
            </div>
          </form>
        ) : (
          <>
            <div className="d-flex justify-content-end">
              <Button
                label="Edit"
                severity="success"
                size="small"
                onClick={() => setEdit(true)}
              />
            </div>
            <Divider />
            <div style={{ padding: "1.5rem", fontSize: "1.5rem" }}>
              <p>
                The "Recommendation Interval" module is designed to help you set
                appropriate intervals for your recommendations based on the
                values provided.
              </p>
              {recommendation ? (
                <p>
                  In every{" "}
                  <strong>
                    {recommendation.value} {recommendation.interval}/s
                  </strong>{" "}
                  the system will prompt in the dashboard the appropiate
                  recommendations
                </p>
              ) : (
                <p>Setup intervals</p>
              )}
            </div>
          </>
        )}
      </CardLayout>
    </ContentLayout>
  );
};

export default Recommendation;
