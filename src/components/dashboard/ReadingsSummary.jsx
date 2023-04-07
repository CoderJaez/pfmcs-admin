import React, { useEffect, useState } from "react";
import LineChart from "../charts/LineChart";
import { SummaryReadings } from "../../service/summaryService";
import { Calendar } from "primereact/calendar";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");

const ReadingsSummary = () => {
  const date = moment(new Date()).format(`YYYY-MM-DD`);
  const [datetime12h, setDateTime12h] = useState("");
  const [chartData, setChartData] = useState({});
  const [_params, setParams] = useState(["Humidity", "Temperature", "Ammonia"]);
  const [_dateFrom, setDatefrom] = useState(`${date} 00:00:00`);
  const [_dateTo, setDateto] = useState(`${date} 23:00:00`);
  const documentStyle = getComputedStyle(document.documentElement);

  const fetchData = async () => {
    const colors = ["orange", "blue", "green", "pink", "yellow"];
    const assignedColors = [];
    const values = {
      params: _params,
      dateFrom: _dateFrom,
      dateTo: _dateTo,
    };

    await SummaryReadings.getAllSummaries(values)
      .then((res) => {
        let _labels = [];
        let _datasets = [];
        if (res) {
          res.forEach((e) => {
            if (_labels.length <= 0) {
              e.labels.forEach((i) =>
                _labels.push(moment(i).format("MMM-DD, hha")),
              );
            }
            const values = [];
            let randomColor = colors[Math.floor(Math.random() * colors.length)];
            while (true) {
              if (!assignedColors.includes(randomColor)) {
                assignedColors.push(randomColor);
                break;
              }
              randomColor = colors[Math.floor(Math.random() * colors.length)];
            }

            e.values.forEach((v) => values.push(v));
            _datasets.push({
              label: e.name,
              data: values,
              fill: true,
              borderColor: documentStyle.getPropertyValue(
                `--${randomColor}-500`,
              ),
              tension: 0.4,
            });
          });
        }

        const data = {
          labels: _labels,
          datasets: _datasets,
        };

        setChartData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filterActions = () => {
    return (
      <>
        <Calendar
          value={datetime12h}
          onChange={(e) => {
            setDatefrom(e.value);
            console.log(e.value);
          }}
          showTime
          hourFormat="12"
          placeholder="Datetime From:"
          className="mr-2"
        />
        <Calendar
          value={datetime12h}
          onChange={(e) => {
            setDateto(e.value);
            console.log(e.value);
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
    <div>
      <Toolbar right={filterActions} />

      <LineChart chartData={chartData} />
    </div>
  );
};

export default ReadingsSummary;
