import React, { useState } from "react";
import { ContentLayout, CardLayout } from "../shared/components/layouts";

import DeviceList from "../components/devices/DeviceList";
import {
  HumSummary,
  TempSummary,
  Nh3Summary,
  ReadingsSummary,
} from "../components/dashboard";

import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");

const Dashboard = () => {
  const date = moment(new Date()).format(`MMMM YYYY`);
  return (
    <>
      <ContentLayout contentTitle="Dashboard">
        <DeviceList />
        <CardLayout title={`Daily readings for ${date}`}>
          <div className="row">
            <div className="col-md-6">
              <TempSummary />
            </div>
            <div className="col-md-6">
              <HumSummary />
            </div>
            <div className="col-md-6">
              <Nh3Summary />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <CardLayout title="Readings">
                <ReadingsSummary />
              </CardLayout>
            </div>
          </div>
        </CardLayout>
      </ContentLayout>
    </>
  );
};

export default Dashboard;
