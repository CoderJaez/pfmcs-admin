import React from "react";

const ContentLayout = ({ contentTitle, children }) => {
  return (
    <div>
      {/* Content Wrapper. Contains page content */}
      <div className="content-wrapper">
        {/* Content Header (Page header) */}
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>{contentTitle}</h1>
              </div>
            </div>
          </div>
          {children}
          {/* /.container-fluid */}
        </section>
      </div>
      {/* /.content-wrapper */}
    </div>
  );
};

export default ContentLayout;
