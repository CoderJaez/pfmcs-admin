import React from "react";

const CardLayout = ({ title, footer, header_style, children }) => {
  return (
    <div>
      {/* Main content */}
      <section className="content">
        {/* Default box */}
        <div className={`card ${header_style}`}>
          <div className="card-header">
            <h3 className="card-title">{title}</h3>
          </div>
          <div className="card-body">{children}</div>
          {/* /.card-body */}
          <div className="card-footer">{footer}</div>
          {/* /.card-footer*/}
        </div>
        {/* /.card */}
      </section>
      {/* /.content */}
    </div>
  );
};

export default CardLayout;
