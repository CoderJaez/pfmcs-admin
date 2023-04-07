import React, { useState, useEffect } from "react";
import axios from "axios";
import { Knob } from "primereact/knob";
import { url } from "../../constants/env";
import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");

const MyKnob = ({ name, deviceId, vpin }) => {
  const [sensor, setSensor] = useState(0);

  const fetchData = async () => {
    try {
      axios({
        method: "get",
        url: `${url}temp-readings/?device_id=${deviceId}&limit=1&vpin=${vpin}`,
      }).then(function (response) {
        const data = response.data;
        const createdAt = moment(data.createdAt);
        const currentDate = moment(new Date());

        if (data[0] !== undefined && currentDate >= createdAt)
          setSensor(data[0].value);
        else setSensor(0);
      });
    } catch (error) {}
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
        valueColor="#19A7CE"
        rangeColor="#708090"
      />
      <p>{name}</p>
    </div>
  );
};

export default MyKnob;
