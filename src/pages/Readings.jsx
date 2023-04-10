import React, { useState, useEffect } from "react";
import { ContentLayout, CardLayout } from "../shared/components/layouts";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ReadingService } from "../service/readingService";
import moment from "moment-timezone";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";

const Readings = () => {
  const date = moment(new Date()).format(`YYYY-MM-DD`);
  const [readings, setReadings] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(0);
  const [_dateFrom, setDatefrom] = useState(`${date} 00:00:00`);
  const [_dateTo, setDateto] = useState(`${date} 23:00:00`);

  const fetchData = async () => {
    console.log("Fetching");
    await ReadingService.getReadings(search, page, limit, _dateFrom, _dateTo)
      .then((data) => {
        setReadings(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, [search]);

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

  const filterDate = () => {
    return (
      <>
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

        <Button label="Filter" size="small" onClick={() => fetchData()} />
      </>
    );
  };

  return (
    <>
      <ContentLayout contentTitle="Readings">
        <CardLayout>
          <Toolbar left={searchName} right={filterDate} />
          <DataTable
            value={readings}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableStyle={{ minWidth: "50rem" }}
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
              body={formatDate}
              header="Created At"
              style={{ width: "25%" }}
            ></Column>
          </DataTable>
        </CardLayout>
      </ContentLayout>
    </>
  );
};

export default Readings;
