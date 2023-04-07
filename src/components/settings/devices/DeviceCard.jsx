import React, { useEffect, useRef, useState } from "react";
import { CardLayout, ContentLayout } from "../../../shared/components/layouts";
import { DataTable } from "primereact/datatable";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import DataStream from "../datastreams/DataStream";
import { Dialog } from "primereact/dialog";
import { DataStreamService } from "../../../service/dataStreamService";
import { DeviceService } from "../../../service/deviceService";
import { useParams, useNavigate } from "react-router-dom";

const DeviceCard = () => {
  const [showDSDialog, setShowDSDialog] = useState(false);
  const [datastream, setDatastream] = useState({});
  const [device, setDevice] = useState({});
  const toast = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  /////////////////////
  //  EVENT HANDLER //
  ///////////////////
  const fetchData = async () => {
    DeviceService.getData(id)
      .then((data) => {
        setDevice(data[0]);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const routeBack = () => navigate("/settings/devices");

  const editDatastream = (rowData) => {
    setDatastream(rowData);
    setShowDSDialog(true);
  };

  const setDatastreams = () => {
    fetchData();
  };

  const deleteDatastream = (rowData) => {
    const accept = async () => {
      await DataStreamService.deleteData(rowData._id)
        .then((res) => {
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: res.message,
          });
          fetchData();
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

  ////////////////////
  // MINI COMPONENTS//
  ///////////////////
  const leftToolbarTemplate = () => {
    return (
      <div>
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={() => {
            // setDatastream(datastream);
            setShowDSDialog(true);
          }}
          size="small"
          style={{ marginRight: "1rem" }}
        />
      </div>
    );
  };
  const actionTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          severity="warning"
          className="mr-2"
          onClick={() => editDatastream(rowData)}
          size="small"
        />

        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          className="mr-2"
          onClick={() => deleteDatastream(rowData)}
          size="small"
        />
      </>
    );
  };

  return (
    <ContentLayout>
      <div style={{ padding: "10px 0" }}>
        <Button icon="pi pi-arrow-left" onClick={routeBack} outlined />
      </div>
      <div className="row">
        <Toast ref={toast} />
        <ConfirmDialog />
        <div className="col-sm-4">
          <DataStream
            dataStream={datastream}
            setShowDialog={setShowDSDialog}
            showDialog={showDSDialog}
            deviceId={device._id}
            setDatastreams={setDatastreams}
          />

          <CardLayout header_style="card card-primary" title={device.name}>
            <div className="form-group">
              <div className="title">Name</div>
              <div className="decription">{device.name}</div>
            </div>
            <div className="form-group">
              <div className="title">Device Id</div>
              <div className="decription">{device.deviceId}</div>
            </div>
          </CardLayout>
        </div>
        <div className="col-sm-8">
          <CardLayout title="Datastreams" header_style="card-primary">
            <Toolbar className="mb-4" left={leftToolbarTemplate} />
            <DataTable
              value={device.datastreams}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column field="name" header="Name" />
              <Column field="vpin" header="Virtual Pin" />
              <Column field="type" header="Type" />
              <Column field="sensor_type" header="Sensor Type" />
              <Column field="default_value" header="Default Value" />
              <Column
                body={actionTemplate}
                exportable={false}
                style={{ minWidth: "12rem" }}
              />
            </DataTable>
          </CardLayout>
        </div>
      </div>
    </ContentLayout>
  );
};

export default DeviceCard;
