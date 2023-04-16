import React, { useState, useEffect, useRef, useContext } from "react";
import { CardLayout } from "../../../shared/components/layouts";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { ParamsThresholdService } from "../../../service/thresholdService";
import { Toast } from "primereact/toast";
import { UserAuthContext } from "../../../context/UserAuthContext";

const ParamsThresholdList = () => {
  const navigate = useNavigate();
  const [thresholds, setThresholds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { config, toggleToken } = useContext(UserAuthContext);
  const toast = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    await ParamsThresholdService.getThreshold(null, search, config.current)
      .then((res) => {
        setThresholds(res);
      })
      .catch((err) => {
        if (err.valid_token) {
          toast.current.show({
            severity: "error",
            summary: "Error!",
            detail: err.message,
          });
          setTimeout(() => {
            navigate("/login");
          }, 500);
        }
      });
  };

  useEffect(() => {
    toggleToken();
    fetchData();
  }, [search]);
  const actionToolbar = () => {
    return (
      <>
        <Button
          label="New"
          icon="pi pi-plus"
          size="small"
          onClick={() => navigate("/settings/parameter-thresholds-new")}
          severity="success"
          style={{ width: "100px", marginRight: "10px" }}
        />
      </>
    );
  };

  const searchToolbar = () => {
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
  const color = (rowData) => {
    return (
      <>
        <span
          style={{
            minWidth: "5rem",
            minHeight: "2.3rem",
            backgroundColor: `#${rowData.color}`,
            color: "#ffff",
            padding: ".5rem",
            borderRadius: ".3rem",
          }}
        >
          #{rowData.color}
        </span>
      </>
    );
  };

  const routeThreshold = (rowData) => {
    navigate(`/settings/parameter-thresholds/${rowData.value._id}`);
  };

  const thresholdValue = (rowData) => {
    let value;
    switch (rowData.category) {
      case "Temperature":
        value = `${rowData.min_value}℃ - ${rowData.max_value}℃`;
        break;
      case "Humidity":
        value = `${rowData.min_value} % - ${rowData.max_value} %`;
        break;
      case "Ammonia":
        value = `${rowData.min_value} PPM - ${rowData.max_value}PPM`;
        break;
      default:
        value = "";
        break;
    }
    return (
      <>
        <span>{value}</span>
      </>
    );
  };

  const deleteThreshold = (rowData) => {
    const accept = async () => {
      await ParamsThresholdService.deleteThreshold(rowData._id, config.current)
        .then((res) => {
          if (res.success) {
            toast.current.show({
              severity: "success",
              summary: "Success",
              detail: res.message,
            });
            const filteredThreshold = thresholds.filter(
              (threshold) => threshold._id !== rowData._id,
            );
            setThresholds(filteredThreshold);
          }
        })
        .catch((err) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.message,
          });
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
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-trash"
          label="delete"
          outlined
          severity="danger"
          className="mr-2"
          size="small"
          onClick={() => deleteThreshold(rowData)}
        />
      </>
    );
  };

  return (
    <div>
      <CardLayout>
        <Toast ref={toast} />
        <ConfirmDialog />
        <Toolbar
          left={searchToolbar}
          style={{ marginBottom: "1rem" }}
          right={actionToolbar}
        />
        <DataTable
          value={thresholds}
          selectionMode="single"
          onSelectionChange={routeThreshold}
        >
          <Column field="name" header="Name" />
          <Column field="label" header="Analysis" />
          <Column body={color} header="Color" />
          <Column body={thresholdValue} header="Threshold" />
          <Column body={actionBodyTemplate} />
        </DataTable>
      </CardLayout>
    </div>
  );
};

export default ParamsThresholdList;
