import React from "react";
import { CardLayout } from "../../shared/components/layouts";
import { MyKnob } from "../widgets";
const Device = ({ device, dataStreams }) => {
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
                    sensor_type={stream.sensor_type}
                    deviceId={device.deviceId}
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