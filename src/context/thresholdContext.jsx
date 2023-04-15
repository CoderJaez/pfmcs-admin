import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { ParamsThresholdService } from "../service/thresholdService";
import { UserAuthContext } from "./UserAuthContext";
import { RecommendationInterval } from "../service/recommendationInterval";
export const ThresholdContext = createContext();
import { useNavigate } from "react-router-dom";

export const ThresholdProvider = ({ children }) => {
  const { config, toggleToken } = useContext(UserAuthContext);
  const navigate = useNavigate();
  let thresholds = useRef(null);
  let intervalRef = useRef(null);

  const fetchInterval = async () => {
    await RecommendationInterval.FindRecommendation()
      .then((data) => {
        if (data) intervalRef.current = data.millis_value;
      })
      .catch((err) => console.error(err.message));
  };
  useEffect(() => {
    ParamsThresholdService._getThreshold()
      .then((data) => {
        thresholds.current = data;
      })
      .catch((err) => {
        console.log("Error", err);
      });
    fetchInterval();
  }, []);

  function getThreshold(category, value) {
    const threshold = thresholds.current.find(
      (threshold) =>
        threshold.category === category &&
        parseInt(value) >= threshold.min_value &&
        parseInt(value) <= threshold.max_value,
    );
    return threshold;
  }

  return (
    <ThresholdContext.Provider
      value={{ getThreshold, fetchInterval, thresholds, intervalRef }}
    >
      {children}
    </ThresholdContext.Provider>
  );
};
