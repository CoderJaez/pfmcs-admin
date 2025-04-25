import React, { useState, useEffect, useRef, useContext } from "react";
import { FormLayout, ContentLayout } from "../../../shared/components/layouts";
import { CriteriaAssessmentService } from "../../../service/criteriaAssessmentService";
import { CriteriaAssessmentSchema } from "../../../validations/criteriaAssessments";
import { UserAuthContext } from "../../../context/UserAuthContext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Divider } from "primereact/divider";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
const CriteriaAssessmentCard = () => {
  const { config, logout } = useContext(UserAuthContext);
  const [assesment, setAssessment] = useState(null);
  const { id } = useParams();
  const toast = useRef(null);
  const navigate = useNavigate();

  const onSubmit = async (values, actions) => {
    if (assesment) {
      const updateAssessment = { ...assesment, ...values };
      await CriteriaAssessmentService.UpdateAssesment(
        updateAssessment,
        config.current
      )
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            setAssessment(null);
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
              summary: err.err_type,
              detail: err.message,
            });
          }
          setTimeout(() => {
            logout();
          }, 1000);
        });
    } else {
      await CriteriaAssessmentService.NewAssessment(values, config.current)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            setAssessment(null);
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
              summary: err.err_type,
              detail: err.message,
            });
          }
          setTimeout(() => {
            logout();
          }, 1000);
        });
    }
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
    setFieldValue,
    isSubmitting,
  } = useFormik({
    initialValues: {
      humidity: "",
      temperature: "",
      ammonia: "",
      assessment: "",
      recommendations: "",
    },
    validationSchema: CriteriaAssessmentSchema,
    onSubmit,
  });

  const fetchData = async () => {
    if (id) {
      await CriteriaAssessmentService.FindAssesment(id, config.current)
        .then((res) => {
          setAssessment(res);
          setFieldValue("temperature", res.temperature);
          setFieldValue("humidity", res.humidity);
          setFieldValue("ammonia", res.ammonia);
          setFieldValue("assessment", res.assessment);
          setFieldValue("recommendations", res.recommendations);
        })
        .catch((err) => {
          if (!err.valid_token) {
            toast.current.show({
              severity: "warn",
              summary: err.err_type,
              detail: err.message,
            });
          }
          setTimeout(() => {
            logout();
          }, 1000);
        });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const criteria = [
    { name: "Low", value: "LOW" },
    { name: "Normal", value: "NORMAL" },
    { name: "High", value: "HIGH" },
    { name: "Critical", value: "CRITICAL" },
  ];
  return (
    <ContentLayout>
      <FormLayout
        header_style="card-primary"
        title="Criteria Assessment Details"
        handleSubmit={handleSubmit}
        onHide={() => navigate("/settings/multi-criteria-assessments/")}
      >
        <Toast ref={toast} />
        <div className="d-flex justify-content-end">
          <Button
            label="Save"
            severity="success"
            type="submit"
            size="small"
            loading={isSubmitting}
            style={{ marginRight: "1rem" }}
          />
          <Button
            label="Cancel"
            outlined
            type="submit"
            size="small"
            onClick={() => navigate("/settings/multi-criteria-assesments/")}
          />
        </div>
        <Divider />
        <div className="row">
          <div className="col-md-3 col-sm-4">
            <div className="d-flex flex-column">
              <label htmlFor="temperature">Temperature</label>
              <Dropdown
                name="temperature"
                id="temperature"
                value={values.temperature}
                onChange={handleChange}
                onBlur={handleBlur}
                options={criteria}
                optionLabel="name"
                className={
                  errors.temperature && touched.temperature ? "p-invalid" : ""
                }
              />
              {errors.temperature && touched.temperature ? (
                <p className="text-danger">{errors.temperature}</p>
              ) : null}
            </div>
          </div>
          <div className="col-md-3 col-sm-4">
            <div className="d-flex flex-column">
              <label htmlFor="humidity">Humidity</label>
              <Dropdown
                name="humidity"
                id="humidity"
                value={values.humidity}
                onChange={handleChange}
                onBlur={handleBlur}
                options={criteria}
                optionLabel="name"
                className={
                  errors.humidity && touched.humidity ? "p-invalid" : ""
                }
              />
              {errors.humidity && touched.humidity ? (
                <p className="text-danger">{errors.humidity}</p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 col-sm-4">
            <div className="d-flex flex-column">
              <label htmlFor="ammonia">Ammonia</label>
              <Dropdown
                name="ammonia"
                id="ammonia"
                value={values.ammonia}
                onChange={handleChange}
                onBlur={handleBlur}
                options={criteria}
                optionLabel="name"
                className={errors.ammonia && touched.ammonia ? "p-invalid" : ""}
              />
              {errors.ammonia && touched.ammonia ? (
                <p className="text-danger">{errors.ammonia}</p>
              ) : null}
            </div>
          </div>
          <div className="col-md-3 col-sm-4">
            <div className="d-flex flex-column">
              <label htmlFor="assessment">Assessment</label>
              <Dropdown
                name="assessment"
                id="assessment"
                value={values.assessment}
                onChange={handleChange}
                onBlur={handleBlur}
                options={criteria}
                optionLabel="name"
                className={
                  errors.assessment && touched.assessment ? "p-invalid" : ""
                }
              />
              {errors.assessment && touched.assessment ? (
                <p className="text-danger">{errors.assessment}</p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="d-flex flex-column">
              <label htmlFor="recommendations">Recommendations</label>
              <InputTextarea
                name="recommendations"
                id="recommendations"
                autoResize
                value={values.recommendations}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={5}
                cols={30}
                className={
                  errors.recommendations && touched.recommendations
                    ? "p-invalid"
                    : ""
                }
              />
              {errors.recommendations && touched.recommendations ? (
                <p className="text-danger">{errors.recommendations}</p>
              ) : null}
            </div>
          </div>
        </div>
      </FormLayout>
    </ContentLayout>
  );
};

export default CriteriaAssessmentCard;
