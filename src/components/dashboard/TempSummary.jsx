  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import LineChart from "../charts/LineChart";
  import { url } from "../../constants/env";
  const TempSummary = () => {
    const [chartData, setChartData] = useState({});

    const fetchReadings = async () => {
      const res = await axios(`${url}summaries/readings?sensor=temperature`);
      if (res.data) {
        let date_labels = [];
        let temp_data = [];
        res.data.map((d) => {
          temp_data.push(d.value);
          date_labels.push(d.date);
        });
        const documentStyle = getComputedStyle(document.documentElement);
        const data = {
          labels: date_labels,
          datasets: [
            {
              label: "Temperature",
              data: temp_data,
              fill: true,
              borderColor: documentStyle.getPropertyValue("--green-500"),
              tension: 0.4,
            },
          ],
        };
        setChartData(data);
      }
    };

    useEffect(() => {
      fetchReadings();
    }, []);
    return (
      <div>
        <LineChart chartData={chartData} name="Humidity" />
      </div>
    );
  };

  export default TempSummary;
