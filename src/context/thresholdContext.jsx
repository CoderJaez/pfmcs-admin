import React, { createContext, useState, useEffect, useContext } from "react";
import { ParamsThresholdService } from "../service/thresholdService";
import { UserAuthContext } from "./UserAuthContext";
export const ThresholdContext = createContext();
import { useNavigate } from "react-router-dom";

export const ThresholdProvider = ({ children }) => {
  const { config, toggleToken } = useContext(UserAuthContext);
  const navigate = useNavigate();
  let thresholds;
  useEffect(() => {
    toggleToken();
    ParamsThresholdService.getThreshold(null, "", config.current)
      .then((data) => {
        thresholds = data;
      })
      .catch((err) => {
        // navigate("/login");
      });
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
