import React, { useContext, useEffect, useRef, useState } from "react";
import moment from "moment-timezone";
import { saveAs } from "file-saver";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Navigate, useNavigate } from "react-router-dom";

import { UserAuthContext } from "../context/UserAuthContext";
import SmsLogService from "../service/smsLogService";
import { CardLayout, ContentLayout } from "../shared/components/layouts";

const SmsLogs = () => {
  const navigate = useNavigate();
  const toast = useRef(null);
  const { config, user } = useContext(UserAuthContext);
  const todayStart = moment().startOf("day").toDate();
  const todayEnd = moment().endOf("day").toDate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState({
    recipient: "",
    status: "",
    sensorId: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  });

  const formatDateParam = (value) =>
    value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : "";

  const buildQuery = (
    currentPage = page,
    currentLimit = limit,
    activeFilters = filters,
  ) => ({
    recipient: activeFilters.recipient,
    status: activeFilters.status,
    sensorId: activeFilters.sensorId,
    date_from: formatDateParam(activeFilters.dateFrom),
    date_to: formatDateParam(activeFilters.dateTo),
    search: activeFilters.search,
    page: currentPage,
    limit: currentLimit,
  });

  const extractRows = (response) => {
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.rows)) return response.rows;
    if (Array.isArray(response?.results)) return response.results;
    return [];
  };

  const extractTotal = (response, fallbackLength = 0) =>
    response?.totalCount ??
    response?.totalRecords ??
    response?.count ??
    response?.pagination?.total ??
    fallbackLength;

  const handleUnauthorized = (error) => {
    toast.current.show({
      severity: "warn",
      summary: "Unauthorized",
      detail: error?.message || "Session expired, redirecting to login.",
    });
    setTimeout(() => navigate("/login"), 1000);
  };

  const fetchLogs = async (
    currentPage = page,
    currentLimit = limit,
    activeFilters = filters,
  ) => {
    if (!config?.current) return;

    setLoading(true);
    try {
      const response = await SmsLogService.getSmsLogs(
        buildQuery(currentPage, currentLimit, activeFilters),
        config.current,
      );
      const rows = extractRows(response);
      setLogs(rows);
      setTotalRecords(extractTotal(response, rows.length));
    } catch (error) {
      if (error?.valid_token === false || error?.statusCode === 401) {
        handleUnauthorized(error);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error?.message || "Unable to load SMS logs.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!config?.current || !user?.data) return;
    fetchLogs(page, limit);
  }, [page, limit, user]);

  const onFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyFilters = () => {
    setPage(1);
    fetchLogs(1, limit);
  };

  const clearFilters = () => {
    const reset = {
      recipient: "",
      status: "",
      sensorId: "",
      search: "",
      dateFrom: todayStart,
      dateTo: todayEnd,
    };
    setFilters(reset);
    setPage(1);
    fetchLogs(1, limit, reset);
  };

  const escapeCell = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const getRecipient = (row) =>
    row.recipient || row.phoneNumber || row.mobileNumber || "";

  const getSensorId = (row) =>
    row.sensorId || row.sensor?._id || row.sensor?.id || row.sensor || "";

  const getStatus = (row) => row.status || row.deliveryStatus || "";

  const getMessage = (row) => row.message || row.content || row.body || "";

  const formatRowDate = (value) =>
    value ? moment(new Date(value)).format("MMMM DD, YYYY hh:mm:ss a") : "";

  const exportExcel = async () => {
    if (!config?.current) return;

    setLoading(true);
    try {
      const response = await SmsLogService.getSmsLogs(
        buildQuery(1, totalRecords || 1000),
        config.current,
      );
      const rows = extractRows(response);
      const html = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta charset="UTF-8" />
          </head>
          <body>
            <table border="1">
              <tr>
                <th>Recipient</th>
                <th>Status</th>
                <th>Sensor ID</th>
                <th>Message</th>
                <th>Created At</th>
              </tr>
              ${rows
                .map(
                  (row) => `
                    <tr>
                      <td>${escapeCell(getRecipient(row))}</td>
                      <td>${escapeCell(getStatus(row))}</td>
                      <td>${escapeCell(getSensorId(row))}</td>
                      <td>${escapeCell(getMessage(row))}</td>
                      <td>${escapeCell(formatRowDate(row.createdAt))}</td>
                    </tr>
                  `,
                )
                .join("")}
            </table>
          </body>
        </html>
      `;

      const blob = new Blob([html], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });
      saveAs(blob, `sms-alert-logs-${moment().format("YYYYMMDD-HHmmss")}.xls`);
    } catch (error) {
      if (error?.valid_token === false || error?.statusCode === 401) {
        handleUnauthorized(error);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Export failed",
          detail: error?.message || "Unable to export SMS logs.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (event) => {
    setPage(Math.floor(event.first / event.rows) + 1);
    setLimit(event.rows);
  };

  const template = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: 100, value: 100 },
      ];

      return (
        <>
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
        </>
      );
    },
    CurrentPageReport: (options) => (
      <span
        style={{
          color: "var(--text-color)",
          userSelect: "none",
          width: "140px",
          textAlign: "center",
        }}
      >
        {options.first} - {options.last} of {options.totalRecords}
      </span>
    ),
  };

  const filterToolbar = () => (
    <div className="d-flex flex-wrap justify-content-end align-items-center gap-2">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          placeholder="Search"
        />
      </span>
      <InputText
        value={filters.recipient}
        onChange={(e) => onFilterChange("recipient", e.target.value)}
        placeholder="Recipient"
      />
      <InputText
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        placeholder="Status"
      />
      <InputText
        value={filters.sensorId}
        onChange={(e) => onFilterChange("sensorId", e.target.value)}
        placeholder="Sensor ID"
      />
      <Calendar
        value={filters.dateFrom}
        onChange={(e) => onFilterChange("dateFrom", e.value)}
        showTime
        hourFormat="12"
        placeholder="Date from"
      />
      <Calendar
        value={filters.dateTo}
        onChange={(e) => onFilterChange("dateTo", e.value)}
        showTime
        hourFormat="12"
        placeholder="Date to"
      />
      <Button
        label="Filter"
        icon="pi pi-filter"
        size="small"
        loading={loading}
        onClick={applyFilters}
      />
      <Button
        label="Clear"
        icon="pi pi-times"
        size="small"
        severity="secondary"
        outlined
        onClick={clearFilters}
      />
      <Button
        label="Export Excel"
        icon="pi pi-file-excel"
        size="small"
        severity="success"
        loading={loading}
        onClick={exportExcel}
      />
    </div>
  );

  const dateBodyTemplate = (rowData) => formatRowDate(rowData.createdAt);

  if (user?.data && user.data.roles !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return (
    <ContentLayout contentTitle="SMS Alert Logs">
      <CardLayout>
        <Toast ref={toast} />
        <Toolbar right={filterToolbar} className="mb-3" />
        <DataTable
          value={logs}
          tableStyle={{ minWidth: "75rem" }}
          lazy
          loading={loading}
          scrollable
          scrollHeight="600px"
          rows={limit}
          emptyMessage="No SMS logs found."
        >
          <Column
            header="Recipient"
            body={(rowData) => getRecipient(rowData)}
            style={{ width: "16%" }}
          />
          <Column
            header="Status"
            body={(rowData) => getStatus(rowData)}
            style={{ width: "12%" }}
          />
          <Column
            header="Sensor ID"
            body={(rowData) => getSensorId(rowData)}
            style={{ width: "16%" }}
          />
          <Column
            header="Message"
            body={(rowData) => getMessage(rowData)}
            style={{ width: "34%" }}
          />
          <Column
            field="createdAt"
            header="Created At"
            body={dateBodyTemplate}
            style={{ width: "22%" }}
          />
        </DataTable>
        <Paginator
          template={template}
          first={(page - 1) * limit}
          rows={limit}
          totalRecords={totalRecords}
          rowsPerPageOptions={[10, 20, 50, 100]}
          onPageChange={onPageChange}
          className="justify-content-end"
        />
      </CardLayout>
    </ContentLayout>
  );
};

export default SmsLogs;
