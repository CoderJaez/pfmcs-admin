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
import { useFormik } from "formik";
import PoultryStatSchema from "../validations/poultryStatSchema";
import jwtDecode from "jwt-decode";

const PoultryStatEncoding = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const { logout, config, toggleToken, user } = useContext(UserAuthContext);
  const toast = useRef(null);
  const { id } = useParams();
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    const data = sessionStorage.getItem("farms");
    const token = sessionStorage.getItem("token");
    const decode = jwtDecode(token);
    toggleToken();

    const farms = JSON.parse(data);
    const farmOptions = farms.map((farm) => {
      if (decode.data.farm && farm._id === decode.data.farm._id)
        return {
          label: farm.name,
          value: farm._id,
        };

      return {
        label: farm.name,
        value: farm._id,
      };
    });
    setFarms(farmOptions);
    if (id) {
      // Fetch existing poultry stat data if id is present
      PoultryStatService.getPoultryStatById(id, config.current)
        .then((res) => {
          console.log("Fetched data:", res);
          setData(res);
          setFieldValue("farm", res.farm);
          setFieldValue("type", res.type);
          setFieldValue("value", res.value);
          setFieldValue("createdAt", res.createdAt.split("T")[0]);
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
  }, []);

  const routeBack = () => {
    navigate("/poultry-stat");
  };
  const onSubmit = (values, actions) => {
    toggleToken();
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
            setTimeout(() => {
              navigate("/poultry-stat");
            }, 500);
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
          actions.resetForm();
        })
        .catch((err) => {
          if (!err.valid_token) {
            toast.current.show({
              severity: "warn",
              summary: "Failed to save",
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
      createdAt: "",
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
          onHide={routeBack}
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
                value={values.value}
                type="number"
                onBlur={handleBlur}
                onChange={handleChange}
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
                id="createdAt"
                name="createdAt"
                placeholder="YYYY-MM-DD"
                value={values.createdAt}
                type="date"
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.createdAt && touched.createdAt
                    ? "p-inputtext-sm  p-invalid"
                    : "p-inputtext-sm"
                }
              />
              {errors.createdAt && touched.createdAt ? (
                <small className="text-danger">{errors.createdAt}</small>
              ) : null}
            </div>
          </div>

          <Button type="submit" size="small" label="Save" />
        </FormLayout>
      </div>
    </ContentLayout>
  );
};

export default PoultryStatEncoding;
