import React, { useEffect, useContext } from "react";
import { ContentLayout, CardLayout } from "../shared/components/layouts";
import { UserService } from "../service/userService";
import DeviceList from "../components/devices/DeviceList";
import { UserAuthContext } from "../context/UserAuthContext";
import FarmService from "../service/farmService";
import {
  HumSummary,
  TempSummary,
  Nh3Summary,
  ReadingsSummary,
  Recommendations,
} from "../components/dashboard";

import moment from "moment-timezone";
moment.tz.setDefault("Asia/Manila");

const Dashboard = () => {
  const date = moment(new Date()).format(`MMMM YYYY`);
  const { config, toggleToken } = useContext(UserAuthContext);

  const fetchData = async () => {
    await FarmService.getFarm("", 0, 20, config.current)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    toggleToken();
    fetchData();
    // checkAccessToken();
  }, []);

  return (
    <>
      <ContentLayout contentTitle="Dashboard">
        <Recommendations />
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
