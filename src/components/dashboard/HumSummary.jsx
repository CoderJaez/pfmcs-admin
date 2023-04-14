import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import LineChart from "../charts/LineChart";
import { url } from "../../constants/env";
import { UserAuthContext } from "../../context/UserAuthContext";

const HumSummary = () => {
  const [chartData, setChartData] = useState({});

  const fetchReadings = async () => {
    const res = await axios(`${url}summaries/readings?sensor=humidity`);
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
            label: "Humidity",
            data: temp_data,
            fill: true,
            borderColor: documentStyle.getPropertyValue("--orange-500"),
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
      <LineChart chartData={chartData} />
    </div>
  );
};

export default HumSummary;
