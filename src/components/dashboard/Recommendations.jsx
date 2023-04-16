import React, { useRef, useEffect, useContext, useState } from "react";
import moment from "moment-timezone";
import { CardLayout } from "../../shared/components/layouts";
import { UserAuthContext } from "../../context/UserAuthContext";
import { ThresholdContext } from "../../context/thresholdContext";
import { SummaryReadings } from "../../service/summaryService";

import "../../assets/css/style.css";
const Recommendations = () => {
  const date = moment(new Date()).format(`MMMM DD, YYYY`);
  // const [recommendations, setRecommendations] = useState([]);
  const [readings, setReadings] = useState([]);
  const { config } = useContext(UserAuthContext);
  const { getThreshold, intervalRef } = useContext(ThresholdContext);
  const recommendations = useRef();
  const fetchRecommendation = async () => {
    await SummaryReadings.getCurrentDayAvgReadings().then((_readings) => {
      setReadings(_readings);
      let temp = "";
      _readings.forEach((reading) => {
        const threshold = getThreshold(reading.name, reading.value);
        temp += threshold.recommendation;
      });
      const containeRef = recommendations.current;
      if (containeRef) containeRef.innerHTML = temp;
    });
  };
  let intervalId2;

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     console.log(intervalRef.current);
  //   }, 1000);

  //   setTimeout(() => {
  //     if (intervalRef.current) {
  //       // console.log("Clearing interval");
  //       clearInterval(intervalId);
  //       intervalId2 = setInterval(() => {
  //         // console.log("Interval:", intervalRef.current);
  //         fetchRecommendation();
  //       }, intervalRef.current);
  //     }
  //   }, 3000);

  //   return () => {
  //     clearInterval(intervalId2);
  //   };
  // }, []);

  return (
    <CardLayout
      title={`Recommendations for ${date}`}
      header_style="card-warning"
    >
      <h5>Average Temperature and humidity</h5>
      {readings.map((reading, index) => (
        <div key={index}>
          <span>{reading.name}</span>{" "}
          <span>
            {reading.value.toFixed(2)}
            {reading.name === "Temperature" ? "℃" : "%"}
          </span>
        </div>
      ))}
      <div ref={recommendations} className="recommendation"></div>
    </CardLayout>
  );
};

export default Recommendations;
