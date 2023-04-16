import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { Knob } from "primereact/knob";
import { url } from "../../constants/env";
import moment from "moment-timezone";
import { ThresholdContext } from "../../context/thresholdContext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { UserAuthContext } from "../../context/UserAuthContext";
moment.tz.setDefault("Asia/Manila");

const MyKnob = ({
  name,
  deviceId,
  vpin,
  min_value,
  max_value,
  sensor_type,
  forDemo,
  dataStreams,
}) => {
  const [sensor, setSensor] = useState(0);
  const { getThreshold, thresholds } = useContext(ThresholdContext);
  const [color, setColor] = useState("#19A7CE");
  const [threshold, setThreshold] = useState(null);
  const { config } = useContext(UserAuthContext);

  const op = useRef(null);
  const containerRef = useRef(null);

  const parseString = (str) => {
    const div = document.getElementsByClassName("p-overlaypanel-content");
    div.innerHTML = str;
  };
  const setVentilation = (value) => {
    const _url = forDemo
      ? `${url}temp-readings/demo?device_id=${deviceId}&vpin=${vpin}`
      : `${url}temp-readings/?device_id=${deviceId}&vpin=${vpin}`;

    try {
      axios.post(_url, value);
    } catch (error) {
      console.error("Switch:", error.message);
    }
  };

  const fetchData = async () => {
    try {
      const _url = forDemo
        ? `${url}temp-readings/demo?device_id=${deviceId}&vpin=${vpin}`
        : `${url}temp-readings/?device_id=${deviceId}&vpin=${vpin}`;
      axios.get(_url).then(function (response) {
        const data = response.data;
        if (data !== undefined) {
          const createdAt = moment(data.createdAt);
          const currentDate = moment(new Date());
          const value = data.value;

          if (currentDate >= createdAt) setSensor(value);
          const _threshold = getThreshold(sensor_type, value);
          if (_threshold) {
            setThreshold(_threshold);
            const container = containerRef.current;
            if (container) container.innerHTML = _threshold.recommendation;
            if (sensor_type === "Temperature") {
              const _switch = dataStreams.find((d) => d.type === "switch");
              if (_switch) {
                if (
                  _threshold.label === "HIGH" ||
                  _threshold.label === "CRITICAL"
                ) {
                  setVentilation({
                    device_id: deviceId,
                    vpin: _switch.vpin,
                    value: 1,
                  });
                } else {
                  setVentilation({
                    device_id: deviceId,
                    vpin: _switch.vpin,
                    value: 0,
                  });
                }
              }
            }
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
        min={min_value}
        max={max_value}
      />
      <p>{name}</p>
      {threshold ? (
        <>
          <Avatar
            label={threshold.label}
            onClick={(e) => op.current.toggle(e)}
            className="p-overlay-badge"
            style={{
              backgroundColor: `#${threshold.color}`,
              color: "#fff",
              minWidth: "5rem",
            }}
          ></Avatar>
          <OverlayPanel ref={op}>
            <div ref={containerRef}></div>
          </OverlayPanel>
        </>
      ) : null}
    </div>
  );
};

export default MyKnob;
