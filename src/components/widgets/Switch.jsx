import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { url } from "../../constants/env";
import moment from "moment-timezone";
import { ThresholdContext } from "../../context/thresholdContext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { UserAuthContext } from "../../context/UserAuthContext";
import { InputSwitch } from "primereact/inputswitch";
moment.tz.setDefault("Asia/Manila");

const Switch = ({ name, deviceId, vpin, sensor_type, forDemo }) => {
  const [sensor, setSensor] = useState(false);
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

  const fetchData = async () => {
    try {
      const _url = forDemo
        ? `${url}temp-readings/demo/?device_id=${deviceId}&vpin=${vpin}`
        : `${url}temp-readings/?device_id=${deviceId}&vpin=${vpin}`;
      axios.get(_url).then(function (response) {
        const data = response.data;
        if (data !== undefined) {
          const createdAt = moment(data.createdAt);
          const currentDate = moment(new Date());
          const value = data.value === 1 ? true : false;
          if (currentDate >= createdAt) setSensor(value);
          const container = containerRef.current;
          if (container) container.innerHTML = _threshold.recommendation;
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
      <InputSwitch checked={sensor} name={vpin} size="xlarge" />
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

export default Switch;
