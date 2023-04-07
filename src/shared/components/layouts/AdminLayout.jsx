import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header, SideNav } from "../partials";

const AdminLayout = (props) => {
  return (
    <>
      <Header />
      <SideNav />
      <Outlet />
      <Footer />
    </>
  );
};

export default AdminLayout;
