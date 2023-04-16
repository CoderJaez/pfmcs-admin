import React, { useState, useEffect, useRef, useContext } from "react";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { RemmarkService } from "../../service/remarksService";
import { RemarkSchema } from "../../validations/remarks";
import { Dropdown } from "primereact/dropdown";
import { useFormik } from "formik";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { ContentLayout, CardLayout } from "../../shared/components/layouts";
import { Toast } from "primereact/toast";
import { UserAuthContext } from "../../context/UserAuthContext";
const Remarks = () => {
  const [remark, setRemark] = useState({});
  const [remarks, setRemarks] = useState([]);
  const [search, setSearch] = useState("");
  const toast = useRef(null);
  const { config, toggleToken } = useContext(UserAuthContext);

  const fetchData = async () => {
    await RemmarkService.getRemarks(search, config.current)
      .then((data) => {
        setRemarks(data);
      })
      .catch((err) => console.error("Remarks:", err));
  };

  useEffect(() => {
    toggleToken();
    fetchData();
  }, [search]);

  const searchAction = () => {
    return (
      <>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
      </>
    );
  };

  const categories = [
    { name: "Deceased", value: "deceased" },
    { name: "Infected", value: "infected" },
  ];

  const deleteRemark = (rowData) => {
    const accept = async () => {
      await RemmarkService.deleteRemark(rowData._id, config.current)
        .then((res) => {
          toast.current.show({
            severity: "success",
            summary: "Sucess",
            detail: res.message,
          });

          setRemarks(remarks.filter((remark) => remark._id !== rowData._id));
        })
        .catch((err) => console.error("Error:", err));
    };

    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept,
    });
  };

  const actionBody = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          outlined
          label="edit"
          className="mr-2"
          size="small"
          onClick={() => {
            setRemark(rowData);
            setFieldValue("name", rowData.name);
            setFieldValue("category", rowData.category);
          }}
        />
        <Button
          icon="pi pi-trash"
          label="delete"
          outlined
          severity="danger"
          className="mr-2"
          size="small"
          onClick={() => {
            deleteRemark(rowData);
          }}
        />
      </>
    );
  };

  //Event

  const onSubmit = async (values, actions) => {
    if (remark._id) {
      const updateRemark = { ...remark, ...values };
      await RemmarkService.putRemark(updateRemark, config.current)
        .then((res) => {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          actions.resetForm();
          setRemarks((prevRemarks) =>
            prevRemarks.map((remark) =>
              remark._id === updateRemark._id
                ? { ...remark, ...updateRemark }
                : remark,
            ),
          );
        })
        .catch((err) => console.error("Error:", err));
    } else {
      await RemmarkService.insertRemark(values, config.current).then((res) => {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        actions.resetForm();
        setRemarks([...remarks, res.data]);
      });
    }
  };
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
  } = useFormik({
    initialValues: {
      name: "",
      category: "",
    },
    validationSchema: RemarkSchema,
    onSubmit,
  });

  return (
    <>
      <ContentLayout contentTitle="Remarks">
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className="row">
          <div className="col-md-4">
            <CardLayout title="Remark Details" header_style="card card-primary">
              <form onSubmit={handleSubmit}>
                <span
                  className="p-float-label"
                  style={{ marginBottom: "1.2rem" }}
                >
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
                  <label htmlFor="name">Name</label>

                  {errors.name && touched.name && (
                    <p className="text-danger">{errors.name}</p>
                  )}
                </span>

                <Dropdown
                  id="category"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={categories}
                  optionLabel="name"
                  placeholder="Select a Category"
                  // className="w-full md:w-14rem"
                  style={{ marginBottom: "1.5rem", width: "100%" }}
                  className={
                    errors.category && touched.category ? `p-invalid` : ""
                  }
                />
                {errors.category && touched.category && (
                  <p className="text-danger">{errors.category}</p>
                )}

                <div className="d-flex justify-content-end">
                  <Button
                    label="Save"
                    icon="pi pi-check"
                    size="small"
                    type="submit"
                    style={{ width: "100px", marginRight: "10px" }}
                  />
                  <Button
                    label="Cancel"
                    onClick={() => {
                      resetForm();
                    }}
                    type="button"
                    icon="pi pi-times"
                    severity="danger"
                    outlined
                    size="small"
                    style={{ width: "100px" }}
                  />
                </div>
              </form>
            </CardLayout>
          </div>
          <div className="col-md-8">
            <CardLayout title="Remark List" header_style="card card-primary">
              <Toolbar left={searchAction} />
              <DataTable
                value={remarks}
                resizableColumns
                tableStyle={{ minWidth: "50rem" }}
              >
                <Column field="name" header="Name" />
                <Column field="category" header="Category" />
                <Column
                  body={actionBody}
                  headerStyle={{ width: "5rem", textAlign: "center" }}
                />
              </DataTable>
            </CardLayout>
          </div>
        </div>
      </ContentLayout>
    </>
  );
};

export default Remarks;
