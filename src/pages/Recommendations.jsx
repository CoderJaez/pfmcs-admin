import React, { useState, useContext, useEffect, useRef } from "react";
import { ContentLayout, CardLayout } from "../shared/components/layouts";
import { RecommendationService } from "../service/recommendationService";
import { UserAuthContext } from "../context/UserAuthContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";
import { Toolbar } from "primereact/toolbar";
import { Calendar } from "primereact/calendar";
import moment from "moment-timezone";
import Papa from "papaparse";

const Recommendations = () => {
  const date = moment(new Date()).format(`YYYY-MM-DD`);
  const [recommendations, setRecommendations] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(20);
  const [totalRecords, setTotalrecord] = useState(0);
  const [_dateFrom, setDatefrom] = useState(`${date} 00:00:00`);
  const [_dateTo, setDateto] = useState(`${date} 23:00:00`);
  const [loading, setLoading] = useState(false);
  let networkTimeout = null;
  const toast = useRef(null);
  const { config, toggleToken, logout } = useContext(UserAuthContext);

  const fetchData = async () => {
    setLoading(true);
    await RecommendationService.GetRecommendations(
      search,
      page,
      limit,
      _dateFrom,
      _dateTo,
      config.current,
    )
      .then((data) => {
        setTotalrecord(data.totalRecords);
        setRecommendations(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        if (err.err_type) {
          toast.current.show({
            severity: "warn",
            summary: err.err_type,
            detail: err.message,
          });
          setTimeout(() => {
            logout();
          }, 1000);
        } else {
          toast.current.show({
            severity: "warn",
            summary: "Error",
            detail: err.message,
          });
        }
      });
  };

  useEffect(() => {
    toggleToken();
  }, []);
  useEffect(() => {
    fetchData();
  }, [search, page]);
  const formatDate = (rowData) => {
    return moment(rowData.createdAt).format("MMMM DD, YYYY");
  };

  const formatTime = (rowData) => {
    return `${moment(rowData.dateFrom).format("hh:mm a")} - ${moment(
      rowData.dateTo,
    ).format("hh:mm a")}`;
  };
  const recommendaionBody = (rowData) => {
    return rowData.recommendations.recommendations;
  };
  const exportCSV = () => {
    try {
      setLoading(true);
      RecommendationService.GetRecommendations(
        search,
        0,
        totalRecords,
        _dateFrom,
        _dateTo,
        config.current,
      )
        .then((res) => {
          let reports = [];
          res.data.forEach((d) => {
            reports.push({
              temperature: d.temperature,
              humidity: d.humidity,
              ammonia: d.ammonia,
              assesemnent: d.assessment,
              recommendation: d.recommendations.recommendations,
              createdAt: d.createdAt,
            });
          });
          const blob = new Blob([Papa.unparse(reports)], {
            type: "text/csv;charset=utf-8",
          });
          saveAs(blob, `recommendations.csv`);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);

          if (!err.valid_token) {
            toast.current.show({
              severity: "warn",
              summary: "Unauthorized",
              detail: err.message,
            });
            setTimeout(() => navigate("/login"), 1000);
          }
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.message,
          });
        });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
      });
      setLoading(false);
    }
  };

  const printHeader = (
    <div className="flex align-items-center justify-content-end gap-2">
      <Button
        type="button"
        icon="pi pi-file"
        onClick={() => exportCSV()}
        size="small"
        label="Export"
        loading={loading}
        data-pr-tooltip="CSV"
      />
    </div>
  );
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

  const onPageChange = (event) => {
    setPage(event.first);
    setLimit(event.rows);
  };

  const filterDate = () => {
    return (
      <div className="flex align-items-center justify-content-end ">
        <Calendar
          value={_dateFrom}
          onChange={(e) => {
            setDatefrom(e.value);
          }}
          showTime
          hourFormat="12"
          placeholder="Datetime From:"
          className="mr-2"
        />
        <Calendar
          value={_dateTo}
          onChange={(e) => {
            setDateto(e.value);
          }}
          showTime
          hourFormat="12"
          className="mr-2"
          placeholder="Datetime To:"
        />

        <Button
          label="Filter"
          loading={loading}
          size="small"
          onClick={() => fetchData()}
        />

        <Button
          type="button"
          icon="pi pi-file"
          severity="warning"
          onClick={() => exportCSV()}
          size="small"
          label="Export"
          loading={loading}
          data-pr-tooltip="CSV"
          style={{ marginLeft: ".8rem" }}
        />
      </div>
    );
  };

  const headers = [
    { label: "Name", key: "name" },
    { label: "Value", key: "value" },
    { label: "Created At", key: "createdAt" },
  ];

  const template = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
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

  return (
    <ContentLayout contentTitle="Suggested actions to maintain normal health environmental condition">
      <Toast ref={toast} />
      <CardLayout header_style="card-primary">
        <Toolbar left={searchName} right={filterDate} />
        <Divider />
        <DataTable
          value={recommendations}
          tableStyle={{ minWidth: "50rem" }}
          lazy
          loading={loading}
          sortField="createdAt"
          sortOrder={-1}
          sortMode="multiple"
          scrollable
          scrollHeight="600px"
          rows={limit}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        >
          <Column field="temperature" header="Temperature"></Column>
          <Column field="humidity" header="Humidity"></Column>
          <Column field="ammonia" header="Ammonia"></Column>
          <Column field="assessment" header="Assessment" />
          <Column body={recommendaionBody} header="Recommendations" />
          <Column
            field="createdAt"
            body={formatDate}
            header="Recorded At"
          ></Column>
          <Column body={formatTime} />
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
    </ContentLayout>
  );
};

export default Recommendations;
