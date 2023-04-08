import React, { createContext, useState, useEffect } from "react";
import { ParamsThresholdService } from "../service/thresholdService";

export const ThresholdContext = createContext();

export const ThresholdProvider = ({ children }) => {
  const [thresholds, setThresholds] = useState([]);

  useEffect(() => {
    ParamsThresholdService.getThreshold(null, "")
      .then((data) => {
        setThresholds(data);
      })
      .catch((err) => console.error("Error: ", err.message));
  }, []);

  function getThreshold(category, value) {
    const threshold = thresholds.find(
      (threshold) =>
        threshold.category === category &&
        value >= threshold.min_value &&
        value <= threshold.max_value,
    );
    return threshold;
  }

  return (
    <ThresholdContext.Provider value={getThreshold}>
      {children}
    </ThresholdContext.Provider>
  );
};
