import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Knob } from "primereact/knob";
import { url } from "../../constants/env";
import moment from "moment-timezone";
import { ThresholdContext } from "../../context/thresholdContext";

moment.tz.setDefault("Asia/Manila");

const MyKnob = ({ name, deviceId, vpin, sensor_type }) => {
  const [sensor, setSensor] = useState(0);
  const getThreshold = useContext(ThresholdContext);
  const [color, setColor] = useState("#19A7CE");
  const [threshold, setThreshold] = useState(null);

  const fetchData = async () => {
    try {
      axios({
        method: "get",
        url: `${url}temp-readings/?device_id=${deviceId}&limit=1&vpin=${vpin}`,
      }).then(function (response) {
        const data = response.data;
        if (data[0] !== undefined) {
          const createdAt = moment(data.createdAt);
          const currentDate = moment(new Date());
          const value = data[0].value;

          if (currentDate >= createdAt) setSensor(value);
          const threshold = getThreshold(sensor_type, value);
          if (threshold) {
            setThreshold(threshold);
          }
        }
      });
    } catch (error) {
      console.error("Error Knob:", error.message);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div>
      <Knob
        value={sensor}
        valueTemplate={"{value}"}
        valueColor={threshold ? `#${threshold.color} ` : color}
        rangeColor="#708090"
      />
      <p>{name}</p>
      {threshold ? (
        <p
          style={{
            color: `#${threshold.color}`,
            fontWeight: "bold",
            padding: "0.1rem",
            margin: "0",
          }}
        >
          {threshold.label}
        </p>
      ) : null}
    </div>
  );
};

export default MyKnob;