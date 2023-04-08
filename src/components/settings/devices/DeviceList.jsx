import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CardLayout, FormLayout } from "../../../shared/components/layouts";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Toolbar } from "primereact/toolbar";
import { DeviceSchema } from "../../../validations/device";
import { Toast } from "primereact/toast";
import { DeviceService } from "../../../service/deviceService";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

const DeviceList = () => {
  const toast = useRef(null);
  const [_device, _setDevice] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceDialog, setDeviceDialog] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    await DeviceService.getData(null, search)
      .then((data) => setData(data))
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const onSubmit = async (values, actions) => {
    if (_device._id) {
      const updateDevice = { ..._device, ...values };
      await DeviceService.updateData(updateDevice)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            actions.resetForm();

            setData((prevData) =>
              prevData.map((device) =>
                device._id === updateDevice._id
                  ? { ...device, ...updateDevice }
                  : device,
              ),
            );
          } else {
            console.log("Validation Error:", res);
            res.ErrorMessage.forEach((e) => {
              errors[e.name] = e.message;
            });
          }
        })
        .catch((err) => {
          const status = err.status;
          if (status >= 201) {
            const errResponse = err.data;
            console.error("Error Code 400:  ", errResponse);
          }
        });
    } else {
      await DeviceService.postData(values).then((res) => {
        if (res.success) {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          actions.resetForm();
          setData([...data, res.data]);
        } else {
          res.ErrorMessage.forEach((e) => {
            const field = e.field;
            const message = e.message;
            setFieldError(field, message);
          });
        }
      });
    }
  };

  const {
    values,
    handleBlur,
    touched,
    isSubmitting,
    handleChange,
    errors,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  } = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: DeviceSchema,
    onSubmit,
  });

  const hideDialog = () => {
    _setDevice({});
    resetForm();
    setDeviceDialog(false);
  };

  const routeDevice = (rowData) => {
    console.log(rowData);
    navigate(`${rowData.data._id}/data-streams`);
  };
  const openNew = () => {
    setDeviceDialog(true);
  };

  const editDevice = (rowData) => {
    _setDevice(rowData);
    setFieldValue("name", rowData.name);
    setDeviceDialog(true);
  };

  const confirmDeleteDevice = (rowData) => {
    const accept = async () => {
      await DeviceService.deleteData(rowData._id)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            const newDevices = data.filter(
              (device) => device._id !== rowData._id,
            );
            setData(newDevices);
          }
        })
        .catch((err) => {
          console.log(err.response.status);
          const status = err.response.status;
          if (status >= 400) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: err.message,
            });
          }
        });
    };
    confirmDialog({
      message: "Do you want to delete this record?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept,
    });
  };
  //Components

  const leftToolbarTemplate = () => {
    return (
      <div>
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
          size="small"
          style={{ marginRight: "1rem" }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          outlined
          label="edit"
          className="mr-2"
          size="small"
          onClick={() => editDevice(rowData)}
        />
        <Button
          icon="pi pi-trash"
          label="delete"
          outlined
          severity="danger"
          className="mr-2"
          size="small"
          onClick={() => confirmDeleteDevice(rowData)}
        />
      </React.Fragment>
    );
  };

  const dataStreams = (rowData) => {
    return (
      <>
        <Badge value={rowData.datastreams ? rowData.datastreams.length : 0} />
      </>
    );
  };

  const DeviceDialogFooter = () => {
    return (
      <>
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
          onClick={hideDialog}
          icon="pi pi-times"
          severity="danger"
          outlined
          size="small"
          style={{ width: "100px" }}
        />
      </>
    );
  };

  const searchName = () => {
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
  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="row">
        <div className="col-md-4">
          {deviceDialog ? (
            <FormLayout
              onHide={hideDialog}
              footer={<DeviceDialogFooter />}
              handleSubmit={handleSubmit}
              title="Device details"
            >
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
                  placeholder="Enter Device name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.name && touched.name && (
                  <p className="text-danger">{errors.name}</p>
                )}
              </div>
            </FormLayout>
          ) : null}
        </div>
        <div className={deviceDialog ? "col-md-8" : "col-md-12"}>
          <CardLayout title={`${data.length} Devices`} header_style="primary">
            <Toolbar
              className="mb-4"
              left={searchName}
              right={leftToolbarTemplate}
            />

            <DataTable
              value={data}
              selectionMode="single"
              onRowSelect={routeDevice}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column field="name" header="Name"></Column>
              <Column field="deviceId" header="Device Id"></Column>
              <Column field="dateCreated" header="Created At"></Column>
              <Column body={dataStreams} header="Datastreams"></Column>
              <Column
                body={actionBodyTemplate}
                exportable={false}
                style={{ minWidth: "12rem" }}
              ></Column>
            </DataTable>
          </CardLayout>
        </div>
      </div>
    </>
  );
};

export default DeviceList;
