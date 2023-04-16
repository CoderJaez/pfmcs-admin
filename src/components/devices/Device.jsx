import React from "react";
import { CardLayout } from "../../shared/components/layouts";
import { MyKnob, Switch } from "../widgets";
const Device = ({ device, dataStreams }) => {
  console.log(dataStreams);
  return (
    <>
      <div className="col-md-4 col-sm-6 col-xs-12">
        <CardLayout title={device.name}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
              flexWrap: "wrap",
            }}
          >
            {dataStreams.map((stream) => {
              if (stream.type === "sensor") {
                return (
                  <MyKnob
                    key={stream._id}
                    name={stream.name}
                    vpin={stream.vpin}
                    min_value={stream.min_value}
                    max_value={stream.max_value}
                    sensor_type={stream.sensor_type}
                    deviceId={device.deviceId}
                    forDemo={device.forDemo}
                    dataStreams={dataStreams}
                  />
                );
              } else {
                return (
                  <Switch
                    key={stream._id}
                    name={stream.name}
                    vpin={stream.vpin}
                    sensor_type={stream.sensor_type}
                    deviceId={device.deviceId}
                    forDemo={device.forDemo}
                  />
                );
              }
            })}
          </div>
        </CardLayout>
      </div>
    </>
  );
};

export default Device;
