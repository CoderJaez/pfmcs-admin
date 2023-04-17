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
          <Route path="/settings/devices" element={<Device />} />
          <Route path="/settings/remarks" element={<Remarks />} />
          <Route path="/mcda-recommendations" element={<Recommendations />} />
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

          <Route path="/settings/users" element={<User />} />
          <Route path="/settings/users-new" element={<UserCard />} />
          <Route path="/settings/users-update/:id" element={<UserCard />} />
          <Route
            path="/settings/multi-criteria-assesments"
            element={<CriteriaAssessment />}
          />
          <Route
            path="/settings/multi-criteria-assesments-details/:id"
            element={<CriteriaAssessmentCard />}
          />

          <Route
            path="/settings/multi-criteria-assesments-details/"
            element={<CriteriaAssessmentCard />}
          />
          <Route
            path="/settings/recommendation-intervals"
            element={<Recommendation />}
          />
          <Route
            path="/settings/devices/:id/data-streams"
            element={<DeviceCard />}
          />

          <Route path="/readings" element={<Readings />} />
          <Route path="/rawdata-readings" element={<ReadingsRealtimeData />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default Routers;
