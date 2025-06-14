import React, { useState, useEffect, useRef, useContext } from "react";
import { ContentLayout, CardLayout } from "../shared/components/layouts";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import PoultryStatService from "../service/poultryStatService";
import moment from "moment-timezone";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthContext";

const PoultryStatList = () => {
  const toast = useRef(null);
  const date = moment(new Date()).format(`YYYY-MM-DD`);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [farms, setFarms] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalRecords, setTotalrecord] = useState(0);
  const [_dateFrom, setDatefrom] = useState(`${date} 00:00:00`);
  const [_dateTo, setDateto] = useState(`${date} 23:00:00`);
  const navigate = useNavigate();
  const { config, logout, toggleToken } = useContext(UserAuthContext);

  useEffect(() => {
    const fetchStats = () => {
      try {
        setLoading(true);
        toggleToken();
        PoultryStatService.getPoultryStat(search, 1, 10, config.current)
          .then((response) => {
            setStats(response.data);
            setTotalrecord(response.totalRecords);
          })
          .catch((error) => {
            if (error.status === 401) {
              logout();
              toggleToken();
            } else {
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: error.message,
              });
            }
          });
      } catch (error) {
        if (error.status === 401) {
          logout();
          toggleToken();
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error.message,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [search]);

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

  const onPageChange = (event) => {
    setPage(event.first);
    setLimit(event.rows);
  };

  const template = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: 120, value: 120 },
      ];

      return (
        <React.Fragment>
          <span
            className="mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Items per page:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };

  const addNewToolbar = () => {
    return (
      <>
        <Button
          label="New"
          severity="success"
          size="small"
          icon="pi pi-plus"
          onClick={() => navigate("/poultry-stat/new")}
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

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          label="Edit"
          icon="pi pi-pencil"
          outlined
          severity="warning"
          className="mr-2"
          onClick={() => navigate(`/poultry-stat/${rowData._id}`)}
          size="small"
        />
        <Button
          icon="pi pi-trash"
          label="Delete"
          outlined
          severity="danger"
          className="mr-2"
          onClick={() => deleteData(rowData)}
          size="small"
        />
      </>
    );
  };

  return (
    <>
      <ContentLayout contentTitle="Poultry Statistics">
        <Toast ref={toast} />
        <div className="col-md-12">
          <CardLayout
            title="Poultry Data"
            className="mb-3"
            header_style="primary"
          >
            <Toolbar left={searchToolbar} right={addNewToolbar} />

            <DataTable
              value={stats}
              loading={loading}
              rows={limit}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
            >
              <Column field="farm" header="Farm" />
              <Column field="type" header="Type" />
              <Column field="value" header="Value" />
              <Column
                field="createdAt"
                header="Encoding Date"
                body={(rowData) =>
                  moment(new Date(rowData.createdAt)).format(
                    "MMMM DD, YYYY hh:mm a"
                  )
                }
              />

              <Column
                field="action"
                header="Action"
                body={actionBodyTemplate}
              />
            </DataTable>
            <Paginator
              template={template}
              first={page}
              rows={limit}
              totalRecords={totalRecords}
              rowsPerPageOptions={[10, 20, 30, 50, 100]}
              onPageChange={onPageChange}
              className="justify-content-end"
            />
          </CardLayout>
        </div>
      </ContentLayout>
    </>
  );
};

export default PoultryStatList;
