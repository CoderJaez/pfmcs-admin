import React from "react";
import { Routes, Route } from "react-router-dom";
import { Dashboard, Device, Readings, Remarks } from "../pages";
import AdminLayout from "../shared/components/layouts/AdminLayout";
import { DeviceCard } from "../components/settings/devices";
import Error404 from "../pages/Error404";
const Routers = () => {
  return (
    <>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/settings/devices" element={<Device />} />
          <Route exact path="/settings/remarks" element={<Remarks />} />
          <Route
            exact
            path="/settings/devices/:id/data-streams"
            element={<DeviceCard />}
          />

          <Route exact path="/readings" element={<Readings />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Routers;
