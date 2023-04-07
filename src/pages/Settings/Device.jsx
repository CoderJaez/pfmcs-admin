import axios from "axios";
import React, { useEffect, useState } from "react";
import { ContentLayout, CardLayout } from "../../shared/components/layouts";
import { DeviceList } from "../../components/settings/devices";
const Device = () => {
  return (
    <>
      <ContentLayout contentTitle="Devices">
        <DeviceList />
      </ContentLayout>
    </>
  );
};

export default Device;
