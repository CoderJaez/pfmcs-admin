import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";

const LineChart = ({ chartData }) => {
  return (
    <div className="card">
      <Chart type="line" data={chartData} />
    </div>
  );
};

export default LineChart;
