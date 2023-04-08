import React from "react";
import { ContentLayout } from "../../shared/components/layouts";

import { Outlet } from "react-router-dom";
const ParamsThresholdLayout = () => {
  return (
    <div>
      <ContentLayout contentTitle="Environmental parameter thresholds">
        <Outlet />
      </ContentLayout>
    </div>
  );
};

export default ParamsThresholdLayout;
