import React, { useState, useEffect, useRef, useContext } from "react";
import { ContentLayout, CardLayout } from "../shared/components/layouts";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ReadingService } from "../service/readingService";
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

const Readings = () => {
  const date = moment(new Date()).format(`YYYY-MM-DD`);
  const navigate = useNavigate();
  const [readings, setReadings] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalRecords, setTotalrecord] = useState(0);
  const [_dateFrom, setDatefrom] = useState(`${date} 00:00:00`);
  const [_dateTo, setDateto] = useState(`${date} 23:00:00`);
  const [loading, setLoading] = useState(false);
  let networkTimeout = null;
  const toast = useRef(null);
  const { config } = useContext(UserAuthContext);

  const fetchData = () => {
    setLoading(true);
    if (networkTimeout) clearTimeout(networkTimeout);
    networkTimeout = setTimeout(() => {
      ReadingService.getReadings(
        search,
        page,
        limit,
        _dateFrom,
        _dateTo,
        config.current,
      )
        .then((res) => {
          setTotalrecord(res.totalCount);
          setReadings(res.data);
        })
        .catch((err) => {
          console.log("Readings:", err);
          if (!err.valid_token) {
            toast.current.show({
              severity: "error",
              summary: "Invalid/Expired token",
              detail: err.message,
            });
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          }
        });
      setLoading(false);
    }, Math.random() * 1000 + 250);
  };

  useEffect(() => {
    fetchData();
  }, [search, page]);

  const formatDate = (rowData) => {
    return moment(new Date(rowData.createdAt)).format("MMMM DD, YYYY hh:mm a");
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

  const exportCSV = () => {
    try {
      setLoading(true);
      ReadingService.getReadings(
        search,
        0,
        totalRecords,
        _dateFrom,
        _dateTo,
        config.current,
      )
        .then((res) => {
          const blob = new Blob([Papa.unparse(res.data)], {
            type: "text/csv;charset=utf-8",
          });
          saveAs(blob, `readings-${new Date()}.csv`);
          setLoading(false);
        })
        .catch((err) => {
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

  return (
    <>
      <ContentLayout contentTitle="Readings">
        <CardLayout>
          <Toast ref={toast} />
          <Toolbar left={searchName} right={filterDate} />
          <DataTable
            value={readings}
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
            <Column
              field="name"
              header="Name"
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="value"
              header="value"
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="createdAt"
              body={formatDate}
              header="Created At"
              style={{ width: "25%" }}
            ></Column>
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
    </>
  );
};

export default Readings;
