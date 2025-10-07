import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";

const LineChart = ({ chartData, type = "line" }) => {
  return (
    <div className="card">
      <Chart type={type} data={chartData} />
    </div>
  );
};

export default LineChart;
