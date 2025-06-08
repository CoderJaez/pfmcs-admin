import { useState, useEffect, useRef, useContext } from "react";
import { ContentLayout, FormLayout } from "../shared/components/layouts";
import { useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { UserAuthContext } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import PoultryStatService from "../service/poultryStatService";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import { useFormik } from "formik";
import PoultryStatSchema from "../validations/poultryStatSchema";

const PoultryStatEncoding = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const { logout, config, toggleToken } = useContext(UserAuthContext);
  const toast = useRef(null);
  const { id } = useParams();
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const data = sessionStorage.getItem("farms");
    if (data) {
      const farms = JSON.parse(data);
      const farmOptions = farms.map((farm) => ({
        label: farm.name,
        value: farm._id,
      }));
      setFarms(farmOptions);
    }
  }, []);

  const onSubmit = (values, actions) => {
    toggleToken();
    console.log("values", values);
    if (id) {
      const updateData = { ...data, ...values };
      PoultryStatService.updatePoultryStat(id, updateData, config.current)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            navigate("/poultry-stat");
          }
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
    } else {
      PoultryStatService.postPoultryStat(values, config.current)
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
            setTimeout(() => logout(), 500);
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
      farm: "",
      type: "",
      value: "",
      date: "",
    },
    validationSchema: PoultryStatSchema,
    onSubmit,
  });

  return (
    <ContentLayout contentTitle="Poultry Stat Encoding">
      <Toast ref={toast} />
      <div className="p-4">
        <FormLayout
          size="50rem"
          title={id ? "Edit Poultry data" : "New Poultry Data"}
          header_style="card-primary"
          handleSubmit={handleSubmit}
        >
          <div className="p-fluid">
            <div className="field mb-3">
              <label htmlFor="farm">Farm</label>
              <Dropdown
                id="farm"
                name="farm"
                placeholder="Select a farm"
                options={farms}
                value={values.farm}
                onBlur={handleBlur}
                onChange={handleChange}
                className={
                  errors.farm && touched.farm
                    ? "p-inputtext-sm  p-invalid"
                    : "p-inputtext-sm"
                }
              />
              {errors.farm && touched.farm ? (
                <small className="text-danger">{errors.farm}</small>
              ) : null}
            </div>

            <div className="field mb-3">
              <label htmlFor="type">Type</label>
              <Dropdown
                id="type"
                name="type"
                placeholder="Select a type"
                value={values.type}
                onBlur={handleBlur}
                onChange={handleChange}
                options={[
                  { label: "Egg Harvest", value: "EGG_HARVEST" },
                  { label: "Deceased Chicken", value: "DECEASED" },
                  { label: "Infected", value: "INFECTED" },
                ]}
                className={
                  errors.type && touched.type
                    ? "p-inputtext-sm  p-invalid"
                    : "p-inputtext-sm"
                }
              />
              {errors.type && touched.type ? (
                <small className="text-danger">{errors.type}</small>
              ) : null}
            </div>

            <div className="field mb-3">
              <label htmlFor="value">Value</label>
              <InputText
                id="value"
                name="value"
                placeholder="Enter a value"
                onBlur={handleBlur}
                onChange={handleChange}
                type="number"
                className={
                  errors.value && touched.value
                    ? "p-inputtext-sm  p-invalid"
                    : "p-inputtext-sm"
                }
              />

              {errors.value && touched.value ? (
                <small className="text-danger">{errors.value}</small>
              ) : null}
            </div>
            <div className="field mb-3">
              <label htmlFor="date">Encoding Date</label>
              <InputText
                id="date"
                name="date"
                placeholder="YYYY-MM-DD"
                type="date"
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.date && touched.date
                    ? "p-inputtext-sm  p-invalid"
                    : "p-inputtext-sm"
                }
              />
              {errors.date && touched.date ? (
                <small className="text-danger">{errors.date}</small>
              ) : null}
            </div>
          </div>

          <Button
            type="submit"
            size="small"
            label="Save"
            loading={isSubmitting}
          />
        </FormLayout>
      </div>
    </ContentLayout>
  );
};

export default PoultryStatEncoding;
