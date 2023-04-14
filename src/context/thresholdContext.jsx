import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { ParamsThresholdService } from "../service/thresholdService";
import { UserAuthContext } from "./UserAuthContext";
export const ThresholdContext = createContext();
import { useNavigate } from "react-router-dom";

export const ThresholdProvider = ({ children }) => {
  const { config, toggleToken } = useContext(UserAuthContext);
  const navigate = useNavigate();
  let thresholds = useRef(null);
  useEffect(() => {
    ParamsThresholdService._getThreshold()
      .then((data) => {
        thresholds.current = data;
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }, []);

  function getThreshold(category, value) {
    const threshold = thresholds.current.find(
      (threshold) =>
        threshold.category === category &&
        value >= threshold.min_value &&
        value <= threshold.max_value,
    );
    return threshold;
  }

  return (
    <ThresholdContext.Provider value={{ getThreshold, thresholds }}>
      {children}
    </ThresholdContext.Provider>
  );
};
