import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import profilePic from "../../../assets/ferlyn_calanda.png";
const SideNav = React.memo(() => {
  const [urlPath, setUrlPath] = useState("");

  useEffect(() => {
    const paths = window.location.pathname.split("/");
    const currentPath =
      paths.length > 0 ? paths[paths.length - 1] : "dashboard";
    setUrlPath(currentPath);
  }, []);

  return (
    <>
      {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <a href="index3.html" className="brand-link">
          <img
            src="./adminlte/img/AdminLTELogo.png"
            alt="AdminLTE Logo"
            className="brand-image img-circle elevation-3"
            style={{ opacity: ".8" }}
          />
          <span className="brand-text font-weight-light">PFMCS</span>
        </a>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img src={profilePic} className="img-circle" alt="User Image" />
            </div>
            {/* <Avatar label="P" size="xlarge" shape="circle" /> */}
            <div className="info">
              <a href="#" className="d-block">
                Ferlyn P. Calanda
              </a>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
              <li className="nav-item ">
                <Link
                  to="/"
                  className={`nav-link ${
                    urlPath === "dashboard" ? "active" : ""
                  }`}
                  onClick={() => setUrlPath("dashboard")}
                >
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>Dashboard</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="readings"
                  className={`nav-link ${
                    urlPath === "readings" ? "active" : ""
                  }`}
                  onClick={() => setUrlPath("readings")}
                >
                  <i className="nav-icon fas  fa-book" />
                  <p>Readings</p>
                </Link>
              </li>

              <li className="nav-header">Settings</li>
              <li className="nav-item">
                <Link
                  to="settings/devices"
                  className={`nav-link ${
                    urlPath === "devices" ? "active" : ""
                  }`}
                  onClick={() => setUrlPath("devices")}
                >
                  <i className="nav-icon fas fa-device" />
                  <p>Devices</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="settings/remarks"
                  className={`nav-link ${
                    urlPath === "remarks" ? "active" : ""
                  }`}
                  onClick={() => setUrlPath("remarks")}
                >
                  <i className="nav-icon fas fa-device" />
                  <p>Remarks</p>
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="settings/parameter-thresholds"
                  className={`nav-link ${
                    urlPath === "parameter-thresholds" ? "active" : ""
                  }`}
                  onClick={() => setUrlPath("parameter-thresholds")}
                >
                  <i className="nav-icon fas fa-device" />
                  <p>Parameter threshold</p>
                </Link>
              </li>
            </ul>
          </nav>
          {/* /.sidebar-menu */}
        </div>
        {/* /.sidebar */}
      </aside>
    </>
  );
});

export default SideNav;
