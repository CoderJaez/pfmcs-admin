import React, { useState, useEffect, useRef, useContext } from "react";
import { ContentLayout, CardLayout } from "../shared/components/layouts";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import jwtDecode from "jwt-decode";

import { UserAuthContext } from "../context/UserAuthContext";
import FarmService from "../service/farmService";
import { WaterConsumptionService } from "../service/waterConsumptionService";

const WaterConsumption = () => {
  const todayStart = moment().startOf("day").toDate();
  const todayEnd = moment().endOf("day").toDate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const [farmOptions, setFarmOptions] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [dateFrom, setDateFrom] = useState(todayStart);
  const [dateTo, setDateTo] = useState(todayEnd);
  const { config } = useContext(UserAuthContext);
  const navigate = useNavigate();
  const toast = useRef(null);

  const decodeTokenFarm = () => {
    const token = sessionStorage.getItem("token");
    if (!token) return null;
    try {
      const decode = jwtDecode(token);
      return decode.data?.farm?._id || null;
    } catch (err) {
      return null;
    }
  };

  const loadFarms = async () => {
    const cached = sessionStorage.getItem("farms");
    if (cached) {
      const mapped = JSON.parse(cached).map((farm) => ({
        label: farm.name,
        value: farm._id,
      }));
      setFarmOptions(mapped);
      if (!selectedFarm) {
        const farmId = decodeTokenFarm();
        if (farmId) setSelectedFarm(farmId);
      }
      return;
    }

    if (!config?.current) return;

    try {
      const res = await FarmService.getFarm("", 0, 100, config.current);
      const mapped = res.data.map((farm) => ({
        label: farm.name,
        value: farm._id,
      }));
      sessionStorage.setItem(
        "farms",
        JSON.stringify(
          res.data.map((farm) => ({
            _id: farm._id,
            name: farm.name,
          }))
        )
      );
      setFarmOptions(mapped);
      if (!selectedFarm) {
        const farmId = decodeTokenFarm();
        if (farmId) setSelectedFarm(farmId);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error loading farms",
        detail: error.message || "Unable to load farm list",
      });
    }
  };

  const formatDateParam = (value) =>
    value ? moment(value).format("YYYY-MM-DD HH:mm:ss") : "";

  const fetchData = (currentPage = page, currentLimit = limit) => {
    if (!config?.current) return;
    setLoading(true);
    const farmId = selectedFarm || decodeTokenFarm();
    WaterConsumptionService.getWaterConsumption(
      farmId,
      currentPage,
      currentLimit,
      formatDateParam(dateFrom),
      formatDateParam(dateTo),
      config.current
    )
      .then((res) => {
        setRecords(res.data || []);
        setTotalRecords(res.totalCount || res.totalRecords || 0);
      })
      .catch((err) => {
        if (!err?.valid_token) {
          toast.current.show({
            severity: "warn",
            summary: "Unauthorized",
            detail: err.message || "Session expired, redirecting to login.",
          });
          setTimeout(() => navigate("/login"), 1000);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: err.message || "Unable to load water consumption data.",
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFarms();
  }, []);

  useEffect(() => {
    fetchData(page, limit);
  }, [page, limit]);

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

  const filterToolbar = () => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Dropdown
          value={selectedFarm}
          options={farmOptions}
          placeholder="Select farm"
          onChange={(e) => setSelectedFarm(e.value)}
          className="w-14rem"
          showClear
        />
        <Calendar
          value={dateFrom}
          onChange={(e) => setDateFrom(e.value)}
          showTime
          hourFormat="12"
          placeholder="Date from"
          className="mr-2"
        />
        <Calendar
          value={dateTo}
          onChange={(e) => setDateTo(e.value)}
          showTime
          hourFormat="12"
          placeholder="Date to"
          className="mr-2"
        />
        <Button
          label="Filter"
          icon="pi pi-filter"
          size="small"
          loading={loading}
          onClick={() => {
            setPage(1);
            fetchData(1, limit);
          }}
        />
        <Button
          type="button"
          icon="pi pi-file-excel"
          severity="success"
          size="small"
          label="Export"
          loading={loading}
          onClick={() => exportExcel()}
        />
      </div>
    );
  };

  const exportExcel = () => {
    const farmId = selectedFarm || decodeTokenFarm();
    setLoading(true);
    WaterConsumptionService.getWaterConsumption(
      farmId,
      1,
      totalRecords || 1000,
      formatDateParam(dateFrom),
      formatDateParam(dateTo),
      config.current
    )
      .then((res) => {
        const data = res.data || [];
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        saveAs(blob, `water-consumption-${new Date().toISOString()}.csv`);
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Export failed",
          detail: err.message || "Could not export data.",
        });
      })
      .finally(() => setLoading(false));
  };

  const formatDate = (rowData) =>
    moment(new Date(rowData.createdAt)).format("MMMM DD, YYYY hh:mm a");

  return (
    <ContentLayout contentTitle="Water Consumption">
      <CardLayout>
        <Toast ref={toast} />
        <Toolbar right={filterToolbar} className="mb-2" />
        <DataTable
          value={records}
          tableStyle={{ minWidth: "60rem" }}
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
          <Column field="farm" header="Farm" style={{ width: "18%" }} />
          <Column field="name" header="Name" style={{ width: "18%" }} />
          <Column field="value" header="Value" style={{ width: "14%" }} />
          <Column
            field="remaining"
            header="Remaining"
            style={{ width: "14%" }}
          />
          <Column
            field="capacity"
            header="Capacity"
            style={{ width: "14%" }}
          />
          <Column
            field="createdAt"
            header="Recorded At"
            body={formatDate}
            style={{ width: "22%" }}
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
    </ContentLayout>
  );
};

export default WaterConsumption;
