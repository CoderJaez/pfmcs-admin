import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Dashboard,
  Device,
  Readings,
  Remarks,
  ParamsThreshold,
  ReadingsRealtimeData,
  Login,
  User,
  Recommendation,
  CriteriaAssessment,
  Recommendations,
  Farm,
} from "../pages";
import AdminLayout from "../shared/components/layouts/AdminLayout";
import { DeviceCard } from "../components/settings/devices";
import ParamsThresholdLayout from "../components/layouts/ParamsThreholdLayout";
import { ParamsThresholdCard } from "../components/settings/thresholds";
import UserCard from "../components/settings/users/UserCard";
import Error404 from "../pages/Error404";
import CriteriaAssessmentCard from "../components/settings/criteria_assessments/CriteriaAssessmentCard";
const Routers = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/mcda-recommendations" element={<Recommendations />} />
          <Route path="/settings">
            <Route path="devices">
              <Route path="" element={<Device />} />
              <Route path=":id/data-streams" element={<DeviceCard />} />
            </Route>

            <Route path="remarks" element={<Remarks />} />
            <Route
              path="parameter-thresholds"
              element={<ParamsThresholdLayout />}
            >
              <Route path="" element={<ParamsThreshold />} />
              <Route path="new" element={<ParamsThresholdCard />} />
              <Route path=":id" element={<ParamsThresholdCard />} />
            </Route>
            <Route path="users">
              <Route path="" element={<User />} />
              <Route path="new" element={<UserCard />} />
              <Route path=":id" element={<UserCard />} />
            </Route>

            <Route path="multi-criteria-assessments">
              <Route path="" element={<CriteriaAssessment />} />
              <Route path=":id" element={<CriteriaAssessmentCard />} />

              <Route path="details" element={<CriteriaAssessmentCard />} />
            </Route>

            <Route
              path="recommendation-intervals"
              element={<Recommendation />}
            />

            <Route path="farms">
              <Route path="" element={<Farm />} />
              <Route path=":id" element={<Farm />} />
              <Route path="new" element={<Farm />} />
            </Route>
          </Route>

          <Route path="/readings" element={<Readings />} />
          <Route path="/rawdata-readings" element={<ReadingsRealtimeData />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Routers;
