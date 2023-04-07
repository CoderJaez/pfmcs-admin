import React from "react";

const Footer = React.memo(() => {
  const date = new Date();
  return (
    <div>
      <footer className="main-footer">
        <strong>
          Copyright © {date.getFullYear()} <a href="#">Smart Poultry Farm</a>.
        </strong>
        All rights reserved.
        <div className="float-right d-none d-sm-inline-block">
          <b>Version</b> 1.2.0
        </div>
      </footer>
    </div>
  );
});

export default Footer;
