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

            <DataTable value={stats} loading={loading}>
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
            </DataTable>
          </CardLayout>
        </div>
      </ContentLayout>
    </>
  );
};

export default PoultryStatList;
