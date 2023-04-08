import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Dashboard,
  Device,
  Readings,
  Remarks,
  ParamsThreshold,
} from "../pages";
import AdminLayout from "../shared/components/layouts/AdminLayout";
import { DeviceCard } from "../components/settings/devices";
import ParamsThresholdLayout from "../components/layouts/ParamsThreholdLayout";
import { ParamsThresholdCard } from "../components/settings/thresholds";
import Error404 from "../pages/Error404";
const Routers = () => {
  return (
    <>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings/devices" element={<Device />} />
          <Route path="/settings/remarks" element={<Remarks />} />
          <Route element={<ParamsThresholdLayout />}>
            <Route
              path="/settings/parameter-thresholds"
              element={<ParamsThreshold />}
            />
            <Route
              path="/settings/parameter-thresholds-new"
              element={<ParamsThresholdCard />}
            />
            <Route
              path="/settings/parameter-thresholds/:id"
              element={<ParamsThresholdCard />}
            />
          </Route>

          <Route
            path="/settings/devices/:id/data-streams"
            element={<DeviceCard />}
          />

          <Route path="/readings" element={<Readings />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Routers;
