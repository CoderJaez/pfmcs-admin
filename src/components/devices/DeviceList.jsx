import axios from "axios";
import { Knob } from "primereact/knob";
import React, { useState, useEffect, useContext } from "react";
import { CardLayout } from "../../shared/components/layouts";
import { url } from "../../constants/env";
import Device from "./Device";
import { UserAuthContext } from "../../context/UserAuthContext";
import jwtDecode from "jwt-decode";
const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const { config } = useContext(UserAuthContext);
  const fetchData = async () => {
    const token = sessionStorage.getItem("token");
    const decode = jwtDecode(token);
    const response = await axios(
      `${url}summaries/devices/${decode.data.farm ? decode.data.farm._id : ""}`,
      config.current
    );
    if (response.data) {
      const tempDevices = response.data;
      if (tempDevices) {
        setDevices(tempDevices);
      } else console.log("Somethins is wrong.");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="row">
        {devices.map((device) => (
          <Device
            key={device._id}
            device={device}
            dataStreams={device.datastreams}
          />
        ))}
      </div>
    </>
  );
};

export default DeviceList;
