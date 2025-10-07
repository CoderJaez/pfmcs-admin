import React, { useState, useEffect } from "react";
import axios from "axios";
import LineChart from "../charts/LineChart";
import { url } from "../../constants/env";

const PoultryStatSummary = () => {
  const [chartData, setChartData] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const fetchSummary = async () => {
    const result = await axios(`${url}poultry-stats/summary?year=${year}`);

    if (result.data) {
      const summary = result.data;
      const months = Array.from({ length: 12 }, (_, i) =>
        new Intl.DateTimeFormat("en-US", { month: "long" }).format(
          new Date(new Date().getFullYear(), i)
        )
      );

      const documentStyle = getComputedStyle(document.documentElement);

      const dataset = [
        {
          label: "Egg Harvest",
          data: summary.data.map((d) => d.EGG_HARVEST),
          fill: true,
          backgroundColor: documentStyle.getPropertyValue("--green-500"),
          borderColor: documentStyle.getPropertyValue("--green-500"),
        },
        {
          label: "Deceased",
          data: summary.data.map((d) => d.DECEASED),
          fill: true,
          backgroundColor: documentStyle.getPropertyValue("--red-500"),
          borderColor: documentStyle.getPropertyValue("--red-500"),
        },
        {
          label: "Infected",
          data: summary.data.map((d) => d.INFECTED),
          fill: true,
          backgroundColor: documentStyle.getPropertyValue("--yellow-500"),
          borderColor: documentStyle.getPropertyValue("--yellow-500"),
        },
      ];

      const data = {
        labels: months,
        datasets: dataset,
      };

      setChartData(data);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) fetchSummary();

    return () => (isMounted = false);
  }, []);
  return <LineChart chartData={chartData} type="bar" />;
};

export default PoultryStatSummary;
