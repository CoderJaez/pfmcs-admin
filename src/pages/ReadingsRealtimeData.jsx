import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Toolbar } from "primereact/toolbar";
import { ContentLayout, CardLayout } from "../shared/components/layouts";
import { ReadingService } from "../service/readingService";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Paginator } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import { saveAs } from "file-saver";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import moment from "moment-timezone";

const ReadingsRealtimeData = () => {
  const date = moment(new Date()).format("YYYY-MM-DD");
  const [totalRecords, setTotalrecord] = useState(0);
  const [dateFrom, setDatefrom] = useState(`${date} 00:00:00`);
  const [dateTo, setDateto] = useState(`${date} 23:00:00`);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [csvRecords, setCsvRecords] = useState([]);
  const toast = useRef(null);
  const dt = useRef(null);
  let networkTimeout = null;

  const fetchData = () => {
    setLoading(true);
    if (networkTimeout) clearTimeout(networkTimeout);
    networkTimeout = setTimeout(() => {
      ReadingService.getRealtimeReadings(search, page, limit, dateFrom, dateTo)
        .then((res) => {
          setLoading(false);
          setTotalrecord(res.totalCount);
          setReadings(res.data);
        })
        .catch((err) =>
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.message,
          }),
        );
    }, Math.random() * 1000 + 250);
  };
  const onPageChange = (event) => {
    setPage(event.first);
    setLimit(event.rows);
  };

  useEffect(() => {
    fetchData();
  }, [page]);
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

  const dateFormat = (rowData) => {
    const date = new Date(rowData.createdAt);
    return date.toLocaleString("en-US");
  };
  const filterDateToolbar = () => {
    return (
      <>
        <Calendar
          value={dateFrom}
          onChange={(e) => {
            setDatefrom(e.value);
          }}
          showTime
          hourFormat="12"
          placeholder="Datetime From:"
          className="mr-2"
        />
        <Calendar
          value={dateTo}
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
      </>
    );
  };

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
      ReadingService.getRealtimeReadings(
        search,
        0,
        totalRecords,
        dateFrom,
        dateTo,
      )
        .then((res) => {
          setCsvRecords(res.data);
          const blob = new Blob([Papa.unparse(res.data)], {
            type: "text/csv;charset=utf-8",
          });
          saveAs(blob, `rawdata-readings-${new Date().toLocaleString()}.csv`);
          setLoading(false);
        })
        .catch((err) => {
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
  const headers = [
    { label: "Name", key: "name" },
    { label: "Value", key: "value" },
    { label: "Created At", key: "createdAt" },
  ];
  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION,
        );
      }
    });
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
    <ContentLayout contentTitle="Raw data readings">
      <Toast ref={toast} />
      {/* <CSVLink
        data={csvRecords}
        headers={headers}
        filename={"rawdata-list.csv"}
      >
        Hidden Download Link
      </CSVLink> */}
      <Toolbar left={printHeader} right={filterDateToolbar} className="mb-1" />
      <Paginator
        template={template}
        first={page}
        rows={limit}
        totalRecords={totalRecords}
        rowsPerPageOptions={[10, 20, 30, 50]}
        onPageChange={onPageChange}
        className="justify-content-end"
      />
      <DataTable
        value={readings}
        lazy
        loading={loading}
        sortField="createdAt"
        sortOrder={-1}
        sortMode="multiple"
        scrollable
        scrollHeight="500px"
      >
        <Column field="name" header="Name" />
        <Column field="value" header="Value" />
        <Column field="createdAt" body={dateFormat} header="CreatedAt" />
      </DataTable>
      <Paginator
        template={template}
        first={page}
        rows={limit}
        totalRecords={totalRecords}
        rowsPerPageOptions={[10, 20, 30, 50]}
        onPageChange={onPageChange}
        className="justify-content-end"
      />
    </ContentLayout>
  );
};

export default ReadingsRealtimeData;
