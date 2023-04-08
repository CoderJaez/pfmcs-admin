import React from "react";
import { ContentLayout } from "../../shared/components/layouts";
import { ParamsThresholdList } from "../../components/settings/thresholds";
import { Outlet } from "react-router-dom";
const ParamsThreshold = () => {
  return (
    <div>
      <ParamsThresholdList />
    </div>
  );
};

export default ParamsThreshold;
